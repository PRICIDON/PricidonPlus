import { IsBoolean } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateAutoRenewalRequest {
  @ApiProperty({
    example: true,
    description: "Enable or disable auto-renewal",
  })
  @IsBoolean()
  isAutoRenewal: boolean;
}
