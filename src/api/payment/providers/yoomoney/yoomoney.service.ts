import { Injectable } from "@nestjs/common";
import {
  ConfirmationEnum,
  CurrencyEnum,
  PaymentMethodsEnum,
  YookassaService,
} from "nestjs-yookassa";
import { BillingPeriod, type Plan, type Transaction } from "@prisma/client";

@Injectable()
export class YoomoneyService {
  constructor(private readonly yookassaService: YookassaService) {}

  async create(
    plan: Plan,
    transaction: Transaction,
    billingPeriod: BillingPeriod,
  ) {
    const amount =
      billingPeriod === BillingPeriod.MONTHLY
        ? plan.monthlyPrice
        : plan.yearlyPrice;
    const payment = await this.yookassaService.createPayment({
      amount: {
        value: amount,
        currency: CurrencyEnum.RUB,
      },
      description: `Оплата подписки на тарифный план: ${plan.title}`,
      payment_method_data: {
        type: PaymentMethodsEnum.bank_card,
      },
      confirmation: {
        type: ConfirmationEnum.redirect,
        return_url: "http://localhost:3000",
      },
      save_payment_method: true,
      // metadata: {
      //   provider: "yookassa",
      // },
    });
    return payment;
  }
}
