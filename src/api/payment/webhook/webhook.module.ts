import { Module } from "@nestjs/common";
import { WebhookService } from "./webhook.service";
import { WebhookController } from "./webhook.controller";
import { StripeModule } from "../providers/stripe/stripe.module";
import { CryptoModule } from "../providers/crypto/crypto.module";

@Module({
  controllers: [WebhookController],
  providers: [WebhookService],
  imports: [StripeModule, CryptoModule],
})
export class WebhookModule {}
