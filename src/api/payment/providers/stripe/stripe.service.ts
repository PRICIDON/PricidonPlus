import { BadRequestException, Injectable } from "@nestjs/common";
import Stripe from "stripe";
import { ConfigService } from "@nestjs/config";
import {
  BillingPeriod,
  type Plan,
  type Transaction,
  TransactionStatus,
  User,
} from "@prisma/client";
import { PaymentWebhookResult } from "../../interfaces/payment-webhook.interface";

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;
  private readonly WEBHOOK_SECRET: string;
  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(
      this.configService.getOrThrow<string>("STRIPE_SECRET_KEY"),
      { apiVersion: "2025-08-27.basil" },
    );
    this.WEBHOOK_SECRET = this.configService.getOrThrow<string>(
      "STRIPE_WEBHOOK_SECRET",
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
      metadata: {
        transactionId: transaction.id,
        planId: plan.id,
      },
    });
    return session;
  }

  async handleWebhook(
    event: Stripe.Event,
  ): Promise<PaymentWebhookResult | null> {
    switch (event.type) {
      case "checkout.session.completed": {
        const payment = event.data.object as Stripe.Checkout.Session;

        const transactionId = payment.metadata.transactionId;
        const planId = payment.metadata.planId;
        const paymentId = payment.id;

        if (!transactionId || !planId) return null;

        return {
          transactionId,
          paymentId,
          planId,
          status: TransactionStatus.SUCCEEDED,
          raw: event,
        };
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;

        const transactionId = invoice.metadata.transactionId;
        const planId = invoice.metadata.planId;
        const paymentId = invoice.id;

        if (!transactionId || !planId || !paymentId) return null;

        return {
          transactionId,
          paymentId,
          planId,
          status: TransactionStatus.FAILED,
          raw: event,
        };
      }
      default:
        return null;
    }
  }

  async parseEvent(rawBody: Buffer, signature: string): Promise<Stripe.Event> {
    try {
      return await this.stripe.webhooks.constructEventAsync(
        rawBody,
        signature,
        this.WEBHOOK_SECRET,
      );
    } catch (e) {
      throw new BadRequestException(
        `Webhook signature verification failed: ${e.message}`,
      );
    }
  }
}
