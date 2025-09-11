import { Module } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { YoomoneyModule } from "./providers/yoomoney/yoomoney.module";
import { StripeModule } from "./providers/stripe/stripe.module";
import { WebhookModule } from './webhook/webhook.module';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [YoomoneyModule, StripeModule, WebhookModule],
})
export class PaymentModule {}
