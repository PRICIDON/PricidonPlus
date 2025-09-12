import { Module } from "@nestjs/common";
import { WebhookService } from "./webhook.service";
import { WebhookController } from "./webhook.controller";
import { StripeModule } from "../providers/stripe/stripe.module";

@Module({
  controllers: [WebhookController],
  providers: [WebhookService],
  imports: [StripeModule],
})
export class WebhookModule {}
