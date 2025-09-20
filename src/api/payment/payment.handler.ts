import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../infra/prisma/prisma.service";
import type { PaymentWebhookResult } from "./interfaces/payment-webhook.interface";
import {
  BillingPeriod,
  SubscriptionStatus,
  TransactionStatus,
} from "@prisma/client";

@Injectable()
export class PaymentHandler {
  private readonly logger = new Logger(PaymentHandler.name);

  constructor(private readonly prismaService: PrismaService) {}

  async processResult(result: PaymentWebhookResult) {
    const { transactionId, paymentId, planId, raw, status } = result;

    const transaction = await this.prismaService.transaction.findUnique({
      where: {
        id: transactionId,
      },
      include: {
        subscription: {
          include: {
            user: true,
            plan: true,
          },
        },
      },
    });
    if (!transaction) throw new NotFoundException("Transaction not found");

    await this.prismaService.transaction.update({
      where: {
        id: transactionId,
      },
      data: {
        status,
        externelId: paymentId,
        providerMeta: raw,
      },
    });
    const subscription = transaction.subscription;

    if (status === TransactionStatus.SUCCEEDED && transaction.subscription) {
      const now = new Date();
      const isPlanChanged = subscription.plan.id !== planId;
      let baseDate: Date;
      if (
        !subscription.endDate ||
        subscription.endDate < now ||
        isPlanChanged
      ) {
        baseDate = new Date(now);
      } else {
        baseDate = new Date(subscription.endDate);
      }

      let newEndDate = new Date(baseDate);

      if (transaction.billingPeriod === BillingPeriod.YEARLY)
        newEndDate.setFullYear(newEndDate.getFullYear() + 1);
      else {
        const currentDay = newEndDate.getDate();
        newEndDate.setMonth(newEndDate.getMonth() + 1);
        if (newEndDate.getDate() !== currentDay) newEndDate.setDate(0);
      }

      await this.prismaService.userSubscription.update({
        where: {
          id: subscription.id,
        },
        data: {
          status: SubscriptionStatus.ACTIVE,
          startDate: now,
          endDate: newEndDate,
          plan: {
            connect: {
              id: planId,
            },
          },
        },
      });

      this.logger.log(`Payment succeeded: ${subscription.user.email}`);
    } else if (status === TransactionStatus.FAILED) {
      await this.prismaService.userSubscription.update({
        where: {
          id: subscription.id,
        },
        data: {
          status: SubscriptionStatus.EXPIRED,
        },
      });

      this.logger.error(`Payment failed for ${subscription.user.email}`);
    }
    return { ok: true };
  }
}
