import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { StripeModule } from "../payment/providers/stripe/stripe.module";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [StripeModule],
})
export class UsersModule {}
