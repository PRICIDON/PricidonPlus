import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export class UpdateAutoRenewalRequest {
  @ApiProperty({
    example: true,
    description: "Enable or disable auto-renewal",
  })
  @IsBoolean()
  public isAutoRenewal: boolean;
}

export class UpdateAutoRenewalResponse {
  @ApiProperty({
    example: true,
    description: "Enable or disable auto-renewal",
  })
  public isAutoRenewal: boolean;
}
