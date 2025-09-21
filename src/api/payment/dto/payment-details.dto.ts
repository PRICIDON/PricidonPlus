import { ApiProperty } from "@nestjs/swagger";
import { BillingPeriod } from "@prisma/client";

class PlanInfo {
  @ApiProperty({
    description: "Unique identifier of the subscription plan",
    example: "plan_01ABC",
  })
  public id: string;

  @ApiProperty({
    description: "Subscription plan name",
    example: "Premium",
  })
  public title: string;

  @ApiProperty({
    description: "Monthly price",
    example: 2499,
  })
  public monthlyPrice: number;

  @ApiProperty({
    description: "Yearly price",
    example: 23990,
  })
  public yearlyPrice: number;
}

class SubscriptionInfo {
  @ApiProperty({
    description: "Detailed information about the selected plan",
    type: PlanInfo,
  })
  public plan: PlanInfo;
}

export class PaymentDetailsResponse {
  @ApiProperty({
    description: "Unique identifier of the transaction",
    example: "txn_01ABCDEF",
  })
  public id: string;

  @ApiProperty({
    description: "Billing period selected for the subscription",
    example: BillingPeriod.MONTHLY,
    enum: BillingPeriod,
  })
  public billingPeriod: BillingPeriod;

  @ApiProperty({
    description: "Subscription information including selected plan details",
    type: SubscriptionInfo,
  })
  public subscription: SubscriptionInfo;
}
