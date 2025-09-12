import { Injectable, UnauthorizedException } from "@nestjs/common";
import { StripeService } from "../providers/stripe/stripe.service";
import { CryptoService } from "../providers/crypto/crypto.service";
import { YoomoneyService } from "../providers/yoomoney/yoomoney.service";
import { YookassaWebhookDto } from "./dto/yookassa-webhook.dto";
import { CryptoWebhookDto } from "./dto/crypto-webhook.dto";

@Injectable()
export class WebhookService {
  constructor(
    private readonly stripeService: StripeService,
    private readonly cryptoService: CryptoService,
    private readonly yoomoneyService: YoomoneyService,
  ) {}

  async handleYookassa(dto: YookassaWebhookDto, ip: string) {
    await this.yoomoneyService.verifyWebhook(ip);
    console.log("YOOKASSA WEBHOOK: ", dto);
  }

  async handleStripe(rawBody: Buffer, sig: string) {
    const event = await this.stripeService.parseEvent(rawBody, sig);
  }

  async handleCrypto(rawBody: Buffer, sig: string) {
    this.cryptoService.verifyWebhook(rawBody, sig);

    const body: CryptoWebhookDto = JSON.parse(rawBody.toString());

    if (!this.cryptoService.isFreshRequest(body))
      throw new UnauthorizedException("Request to old");
  }
}
