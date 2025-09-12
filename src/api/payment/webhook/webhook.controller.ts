import {
  Body,
  Controller,
  HttpCode,
  Post,
  Headers,
  Req,
  type RawBodyRequest,
  UnauthorizedException,
} from "@nestjs/common";
import { WebhookService } from "./webhook.service";
import type { Request } from "express";

@Controller("webhook")
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post("yookassa")
  @HttpCode(200)
  async handleYookassa(@Body() dto: any) {
    console.log("YOOKASSA WEBHOOK: ", dto);
  }

  @Post("stripe")
  @HttpCode(200)
  async handleStripe(
    @Req() req: RawBodyRequest<Request>,
    @Headers("stripe-signature") sig: string,
  ) {
    if (!sig) throw new UnauthorizedException("Missing signature");
    return await this.webhookService.handleStripe(req.rawBody, sig);
  }

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
