import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterRequest {
  @ApiProperty({
    example: "Andrey Pidoras",
    description: "Name of user",
  })
  @IsString()
  @IsNotEmpty()
  name: string;
  @ApiProperty({
    example: "Andrey@Pidoras.ru",
    description: "Email address of user",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @ApiProperty({
    example: "strongPassword",
    description: "Password for the account",
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
