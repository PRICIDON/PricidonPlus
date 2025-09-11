import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { WebhookService } from "./webhook.service";

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
  async handleStripe(@Body() dto: any) {
    console.log("STRIPE WEBHOOK: ", dto);
  }
}
