import { Module } from "@nestjs/common";
import { WebhookService } from "./webhook.service";
import { WebhookController } from "./webhook.controller";
import { StripeModule } from "../providers/stripe/stripe.module";
import { CryptoModule } from "../providers/crypto/crypto.module";
import { YoomoneyModule } from "../providers/yoomoney/yoomoney.module";

@Module({
  controllers: [WebhookController],
  providers: [WebhookService],
  imports: [StripeModule, CryptoModule, YoomoneyModule],
})
export class WebhookModule {}
