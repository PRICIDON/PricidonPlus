import { Body, Controller, Get, Post, Param } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { Authorized } from "../../common/decorators/authrorized.decorator";
import { User } from "@prisma/client";
import { Protected } from "../../common/decorators/protected.decorator";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { PaymentHistoryResponse } from "./dto/payment-history.dto";
import {
  InitPaymentRequest,
  InitPaymentResponse,
} from "./dto/init-payment.dto";
import { PaymentDetailsResponse } from "./dto/payment-details.dto";

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

  @ApiOperation({
    summary: "Get payment by ID",
  })
  @ApiOkResponse({
    type: PaymentDetailsResponse,
  })
  @Get(":id")
  async getById(@Param("id") id: string) {
    return await this.paymentService.getById(id);
  }

  @ApiOperation({
    summary: "Initiate a new payment",
  })
  @ApiOkResponse({
    type: InitPaymentResponse,
  })
  @Protected()
  @Post("init")
  async init(@Body() dto: InitPaymentRequest, @Authorized() user: User) {
    return this.paymentService.init(dto, user);
  }
}
