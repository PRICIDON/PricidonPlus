import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { PlanModule } from "./plan/plan.module";
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [AuthModule, UsersModule, PlanModule, PaymentModule],
})
export class ApiModule {}
