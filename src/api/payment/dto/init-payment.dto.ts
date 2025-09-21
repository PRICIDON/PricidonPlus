import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { BillingPeriod, PaymentProvider } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class InitPaymentRequest {
  @ApiProperty({
    example: "plan_123",
    description: "ID of the selected subscription plan",
  })
  @IsString()
  @IsNotEmpty()
  public planId: string;

  @ApiProperty({
    example: BillingPeriod.MONTHLY,
    enum: BillingPeriod,
    description: "Subscription billing period (monthly or yearly)",
  })
  @IsEnum(BillingPeriod)
  public billingPeriod: BillingPeriod;

  @ApiProperty({
    example: PaymentProvider.YOOKASSA,
    enum: PaymentProvider,
    description: "Payment provider",
  })
  @IsEnum(PaymentProvider)
  public provider: PaymentProvider;
}

export class InitPaymentResponse {
  @ApiProperty({
    example: "trx_123456789",
    description: "Internal transaction ID",
  })
  public id: string;

  @ApiPropertyOptional({
    example: "https://checkout.stripe.com/xyz",
    description: "Redirect URL for external providers (Stripe, Crypto, Stars)",
  })
  public url?: string;

  @ApiPropertyOptional({
    example: "confirmation-token",
    description:
      "Confirmation token for YooKassa Embedded Widget. Used on the frontend to render the payment form directly on the site instead of redirecting.",
  })
  public token?: string;
}
