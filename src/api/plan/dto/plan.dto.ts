import { ApiProperty } from "@nestjs/swagger";

export class PlanResponse {
  @ApiProperty({
    description: "Unique id of the plan",
    example: "L8x48KLEMj-epu83d1P-0",
  })
  id: string;
  @ApiProperty({
    description: "Name of the subscription plan",
    example: "Premium",
  })
  title: string;
  @ApiProperty({
    description: "Description of the subscription plan",
    example: "Да иди нахуй",
  })
  description: string;
  @ApiProperty({
    description: "List of features included of the plan",
    example: ["Unlimited access to content", "Priority support"],
  })
  features: string[];
  @ApiProperty({
    description: "Monthly price",
    example: 999,
  })
  monthlyPrice: number;
  @ApiProperty({
    description: "Yearly price",
    example: 9999,
  })
  yearlyPrice: number;
  @ApiProperty({
    description: "Indicates whether the plan is featured or promoted",
    example: false,
  })
  isFeatured: boolean;
}
