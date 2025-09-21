import {
  Body,
  Controller,
  HttpCode,
  Post,
  Headers,
  Req,
  type RawBodyRequest,
  UnauthorizedException,
  Ip,
} from "@nestjs/common";
import { WebhookService } from "./webhook.service";
import type { Request } from "express";
import { YookassaWebhookDto } from "./dto/yookassa-webhook.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Webhook")
@Controller("webhook")
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}
  @ApiOperation({
    summary: "Handle Yookassa webhook",
  })
  @Post("yookassa")
  @HttpCode(200)
  async handleYookassa(@Body() dto: YookassaWebhookDto, @Ip() ip: string) {
    return await this.webhookService.handleYookassa(dto, ip);
  }
  @ApiOperation({
    summary: "Handle Stripe webhook",
  })
  @Post("stripe")
  @HttpCode(200)
  async handleStripe(
    @Req() req: RawBodyRequest<Request>,
    @Headers("stripe-signature") sig: string,
  ) {
    if (!sig) throw new UnauthorizedException("Missing signature");
    return await this.webhookService.handleStripe(req.rawBody, sig);
  }
  @ApiOperation({
    summary: "Handle CryptoPay webhook",
  })
  @Post("crypto")
  @HttpCode(200)
  async handleCrypto(
    @Req() req: RawBodyRequest<Request>,
    @Headers("crypto-pay-api-signature") sig: string,
  ) {
    if (!sig) throw new UnauthorizedException("Missing signature");
    return await this.webhookService.handleCrypto(req.rawBody, sig);
  }
}
