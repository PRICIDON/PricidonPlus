import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { CRYPTOPAY_API_URL } from "../../constants/payment.constant";
import { Plan, Transaction } from "@prisma/client";
import { CryptoResponse, FiatCurrency } from "./interfaces/common.interface";
import {
  CreateInvoiceRequest,
  PaidButtonName,
} from "./interfaces/create-invoice.interface";
import { createHash, createHmac } from "crypto";

@Injectable()
export class CryptoService {
  private readonly TOKEN: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.TOKEN = this.configService.getOrThrow<string>("CRYPTO_PAY_TOKEN");
  }

  async create(plan: Plan, transaction: Transaction) {
    const payload: CreateInvoiceRequest = {
      amount: transaction.amount,
      currency_type: "fiat",
      fiat: FiatCurrency.RUB,
      description: `Оплата подписки на тарифный план: ${plan.title}`,
      hidden_message: "Спасибо за оплату! Подписка активирована",
      // paid_btn_name: PaidButtonName.CALLBACK,
      // paid_btn_url: "https://pricidon.ru",
    };

    const response = await this.makeRequest("POST", "/createInvoice", payload);

    return response.result;
  }

  verifyWebhook(rawBody: Buffer, sig: string) {
    const secret = createHash("sha256").update(this.TOKEN).digest();

    const hmac = createHmac("sha256", secret).update(rawBody).digest("hex");

    if (hmac !== sig) throw new UnauthorizedException("Invalid signature");

    return true;
  }

  isFreshRequest(body: any, maxAgeSeconds: number = 300) {
    const requestDate = new Date(body.request_date).getTime();

    const now = Date.now();

    return now - requestDate <= maxAgeSeconds * 1000;
  }

  private async makeRequest<T>(
    method: "GET" | "POST",
    endpoint: string,
    data?: any,
  ) {
    const headers = {
      "Crypto-Pay-API-Token": this.TOKEN,
      "Content-Type": "application/json",
    };

    const observable = this.httpService.request<CryptoResponse<T>>({
      baseURL: CRYPTOPAY_API_URL,
      url: endpoint,
      method,
      data,
      headers,
    });

    const { data: response } = await firstValueFrom(observable);

    return response;
  }
}
