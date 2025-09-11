import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../infra/prisma/prisma.service";
import { BillingPeriod, PaymentProvider, User } from "@prisma/client";
import { InitPaymentRequest } from "./dto/init-payment.dto";
import { YoomoneyService } from "./providers/yoomoney/yoomoney.service";
import { StripeService } from "./providers/stripe/stripe.service";

@Injectable()
export class PaymentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly yoomoneyService: YoomoneyService,
    private readonly stripeService: StripeService,
  ) {}

  async getHistory(user: User) {
    const payments = await this.prismaService.transaction.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });
    const formatted = payments.map((payment) => ({
      id: payment.id,
      createdAt: payment.createdAt,
      plan: payment.subscription.plan.title,
      amount: payment.amount,
      provider: payment.provider,
      status: payment.status,
    }));
    return formatted;
  }

  async init(dto: InitPaymentRequest, user: User) {
    const { planId, provider, billingPeriod } = dto;

    const plan = await this.prismaService.plan.findUnique({
      where: {
        id: planId,
      },
    });
    if (!plan) throw new NotFoundException("План не найден");

    const amount =
      billingPeriod === BillingPeriod.YEARLY
        ? plan.yearlyPrice
        : plan.monthlyPrice;

    const transaction = await this.prismaService.transaction.create({
      data: {
        amount,
        provider,
        billingPeriod,
        user: {
          connect: {
            id: user.id,
          },
        },
        subscription: {
          connectOrCreate: {
            where: {
              userId: user.id,
            },
            create: {
              user: {
                connect: {
                  id: user.id,
                },
              },
              plan: {
                connect: {
                  id: plan.id,
                },
              },
            },
          },
        },
      },
    });

    let payment;

    switch (provider) {
      case PaymentProvider.YOOKASSA:
        payment = await this.yoomoneyService.create(
          plan,
          transaction,
          billingPeriod,
        );
      case PaymentProvider.STRIPE:
        payment = await this.stripeService.create(
          plan,
          transaction,
          user,
          billingPeriod,
        );
    }

    await this.prismaService.transaction.update({
      where: {
        id: transaction.id,
      },
      data: {
        providerMeta: payment,
      },
    });

    return payment;
  }
}
