import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../infra/prisma/prisma.service";
import { PaymentProvider, TransactionStatus, User } from "@prisma/client";
import { UpdateAutoRenewalRequest } from "./dto/update-auto-renewal.dto";
import { StripeService } from "../payment/providers/stripe/stripe.service";

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly stripeService: StripeService,
  ) {}
  async updateAutoRenewal(user: User, dto: UpdateAutoRenewalRequest) {
    const { isAutoRenewal } = dto;

    const subscription = await this.prismaService.userSubscription.findUnique({
      where: {
        userId: user.id,
      },
      include: {
        transactions: {
          where: {
            status: TransactionStatus.SUCCEEDED,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });
    if (!subscription) throw new NotFoundException("Подписка не найдена");

    const lastTransaction = subscription.transactions[0];

    if (!lastTransaction)
      throw new NotFoundException("У пользователя нету успешных транзакций");

    if (
      lastTransaction.provider === PaymentProvider.STRIPE &&
      subscription.stripeSubscriptionId
    ) {
      await this.stripeService.updateAutoRenewal(
        subscription.stripeSubscriptionId,
        isAutoRenewal,
      );
    }

    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        isAutoRenewal,
      },
    });
    return { isAutoRenewal };
  }
}
