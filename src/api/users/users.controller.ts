import { Body, Controller, Get, Patch } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Protected } from "../../common/decorators/protected.decorator";
import { Authorized } from "../../common/decorators/authrorized.decorator";
import { User } from "@prisma/client";
import { UpdateAutoRenewalRequest } from "./dto/update-auto-renewal.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Protected()
  @Get("@me")
  async getMe(@Authorized() user: User) {
    return user;
  }

  @Protected()
  @Patch("@me/auto-renewal")
  async updateAutoRenewal(
    @Authorized() user: User,
    @Body() dto: UpdateAutoRenewalRequest,
  ) {
    return this.usersService.updateAutoRenewal(user, dto);
  }
}
