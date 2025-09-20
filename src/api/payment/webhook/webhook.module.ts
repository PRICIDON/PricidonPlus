import { Module } from "@nestjs/common";
import { WebhookService } from "./webhook.service";
import { WebhookController } from "./webhook.controller";
import { StripeModule } from "../providers/stripe/stripe.module";
import { CryptoModule } from "../providers/crypto/crypto.module";
import { YoomoneyModule } from "../providers/yoomoney/yoomoney.module";
import { PaymentHandler } from "../payment.handler";

@Module({
  controllers: [WebhookController],
  providers: [WebhookService, PaymentHandler],
  imports: [StripeModule, CryptoModule, YoomoneyModule],
})
export class WebhookModule {}
