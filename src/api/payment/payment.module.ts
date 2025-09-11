import { Module } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { YoomoneyModule } from "./providers/yoomoney/yoomoney.module";
import { StripeModule } from "./providers/stripe/stripe.module";

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [YoomoneyModule, StripeModule],
})
export class PaymentModule {}
