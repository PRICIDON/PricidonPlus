import { ApiProperty } from "@nestjs/swagger";

export class AuthResponse {
  @ApiProperty({
    description: "Access token used for authorization",
  })
  accessToken: string;
}
