import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { Authorized } from "../../common/decorators/authrorized.decorator";
import { User } from "@prisma/client";
import { Protected } from "../../common/decorators/protected.decorator";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { PaymentHistoryResponse } from "./dto/payment-history.dto";
import { InitPaymentRequest } from "./dto/init-payment.dto";

@ApiTags("Payment")
@Controller("payment")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({
    summary: "Get payment history",
  })
  @ApiOkResponse({
    type: [PaymentHistoryResponse],
  })
  @Protected()
  @Get()
  async getHistory(@Authorized() user: User) {
    return this.paymentService.getHistory(user);
  }

  @Protected()
  @Post("init")
  async init(@Body() dto: InitPaymentRequest, @Authorized() user: User) {
    return this.paymentService.init(dto, user);
  }
  @Post("webhook")
  @HttpCode(200)
  async webhook(@Body() dto: any) {
    console.log("PAYMENT WEBHOOK: ", dto);
    return dto
  }
}
