import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../../infra/prisma/prisma.service";
import { Cron, CronExpression } from "@nestjs/schedule";
import {
  PaymentProvider,
  SubscriptionStatus,
  TransactionStatus,
} from "@prisma/client";
import { YoomoneyService } from "../providers/yoomoney/yoomoney.service";

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);
  constructor(
    private prismaService: PrismaService,
    private yoomoneyService: YoomoneyService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleAutoBilling() {
    const users = await this.prismaService.user.findMany({
      where: {
        subscription: {
          endDate: {
            lte: new Date(),
          },
          status: SubscriptionStatus.ACTIVE,
        },
        isAutoRenewal: true,
      },
      include: {
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });

    if (users.length === 0) {
      this.logger.log("No user found for auto-billing");
      return;
    }

    this.logger.log(`Found ${users.length} users for auto-billing`);

    for (const user of users) {
      const lastTransaction = await this.prismaService.transaction.findFirst({
        where: {
          userId: user.id,
          status: TransactionStatus.SUCCEEDED,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!lastTransaction) continue;

      if (lastTransaction.provider === PaymentProvider.YOOKASSA) {
        const transaction = await this.prismaService.transaction.create({
          data: {
            amount: lastTransaction.amount,
            provider: PaymentProvider.YOOKASSA,
            externelId: lastTransaction.externelId,
            billingPeriod: lastTransaction.billingPeriod,
            user: {
              connect: {
                id: user.id,
              },
            },
            subscription: {
              connect: {
                id: user.subscription?.id,
              },
            },
          },
        });
        try {
          await this.yoomoneyService.createBySavedCard(
            user.subscription.plan,
            user,
            transaction,
          );
        } catch (error) {
          await this.prismaService.transaction.update({
            where: {
              id: transaction.id,
            },
            data: {
              status: TransactionStatus.FAILED,
            },
          });
          this.logger.error(`Payment failed: ${user.email} - ${error.message}`);
        }
      }
    }
  }
}
