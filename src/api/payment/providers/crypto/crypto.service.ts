import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { CRYPTOPAY_API_URL } from "../../constants/payment.constant";
import { Plan, Transaction, TransactionStatus } from "@prisma/client";
import { CryptoResponse, FiatCurrency } from "./interfaces/common.interface";
import {
  CreateInvoiceRequest,
  Currency,
  InvoiceStatus,
} from "./interfaces/create-invoice.interface";
import { createHash, createHmac } from "crypto";
import type { PaymentWebhookResult } from "../../interfaces/payment-webhook.interface";
import { CryptoWebhookDto } from "../../webhook/dto/crypto-webhook.dto";

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
      currency_type: Currency.FIAT,
      fiat: FiatCurrency.RUB,
      description: `Оплата подписки на тарифный план: ${plan.title}`,
      hidden_message: "Спасибо за оплату! Подписка активирована",
      // paid_btn_name: PaidButtonName.CALLBACK,
      // paid_btn_url: "https://pricidon.ru",
      payload: Buffer.from(
        JSON.stringify({ transactionId: transaction.id, planId: plan.id }),
      ).toString("base64url"),
    };

    const response = await this.makeRequest("POST", "/createInvoice", payload);

    return response.result;
  }

  async handleWebhook(dto: CryptoWebhookDto): Promise<PaymentWebhookResult> {
    const payload = JSON.parse(
      Buffer.from(dto.payload.payload ?? "", "base64").toString("utf-8"),
    );

    const transactionId = payload.metadata.transactionId;
    const planId = payload.metadata.planId;
    const paymentId = dto.payload.invoice_id.toString();

    let status: TransactionStatus = TransactionStatus.PENDING;

    switch (dto.payload.status) {
      case InvoiceStatus.PAID:
        status = TransactionStatus.SUCCEEDED;
        break;
      case InvoiceStatus.EXPIRED:
        status = TransactionStatus.FAILED;
        break;
    }

    return {
      transactionId,
      planId,
      paymentId,
      status,
      raw: dto,
    };
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
