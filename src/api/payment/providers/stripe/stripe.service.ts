import { BadRequestException, Injectable } from "@nestjs/common";
import Stripe from "stripe";
import { ConfigService } from "@nestjs/config";
import {
  BillingPeriod,
  type Plan,
  type Transaction,
  User,
} from "@prisma/client";

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;
  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.getOrThrow<string>("STRIPE_SECRET_KEY"),
      { apiVersion: "2025-08-27.basil" },
    );
  }

  async create(
    plan: Plan,
    transaction: Transaction,
    user: User,
    billingPeriod: BillingPeriod,
  ) {
    const priceId =
      billingPeriod === BillingPeriod.MONTHLY
        ? plan.stripeMonthlyPriceId
        : plan.stripeYearlyPriceId;
    if (!priceId)
      throw new BadRequestException("Stripe priceId is missing for this plan");
    const successUrl = "http://localhost:3000";
    const cancelUrl = this.configService.getOrThrow<string>("APP_URL");

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    return session;
  }
}
