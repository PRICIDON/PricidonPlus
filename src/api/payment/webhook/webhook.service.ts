import { Injectable, UnauthorizedException } from "@nestjs/common";
import { StripeService } from "../providers/stripe/stripe.service";
import { CryptoService } from "../providers/crypto/crypto.service";

@Injectable()
export class WebhookService {
  constructor(
    private readonly stripeService: StripeService,
    private readonly cryptoService: CryptoService,
  ) {}

  async handleStripe(rawBody: Buffer, sig: string) {
    const event = await this.stripeService.parseEvent(rawBody, sig);

    console.log("STRIPE WEBHOOK", event);
  }

  async handleCrypto(rawBody: Buffer, sig: string) {
    this.cryptoService.verifyWebhook(rawBody, sig);

    const body = JSON.parse(rawBody.toString());

    if (!this.cryptoService.isFreshRequest(body))
      throw new UnauthorizedException("Request to old");

    console.log("CRYPTO WEBHOOK: ", body);
  }
}
