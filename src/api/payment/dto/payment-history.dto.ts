import { PaymentProvider, TransactionStatus } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class PaymentHistoryResponse {
  @ApiProperty({
    description: "Id transaction",
  })
  id: string;
  @ApiProperty({
    description: "Transaction created at",
  })
  createdAt: Date;
  @ApiProperty({
    description: "Subscription plan name",
  })
  plan: string;
  @ApiProperty({
    description: "Amount of the transaction",
  })
  amount: number;
  @ApiProperty({
    description: "Payment provider used for the transaction",
    example: PaymentProvider.STRIPE,
    enum: PaymentProvider,
  })
  provider: PaymentProvider;
  @ApiProperty({
    description: "Transaction status",
    example: TransactionStatus.SUCCEEDED,
    enum: TransactionStatus,
  })
  status: TransactionStatus;
}
