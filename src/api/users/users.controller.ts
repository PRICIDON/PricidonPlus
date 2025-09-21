import { Body, Controller, Get, Patch } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Protected } from "../../common/decorators/protected.decorator";
import { Authorized } from "../../common/decorators/authrorized.decorator";
import { User } from "@prisma/client";
import {
  UpdateAutoRenewalRequest,
  UpdateAutoRenewalResponse,
} from "./dto/update-auto-renewal.dto";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { GetMeResponse } from "./dto/get-me.dto";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: "Get current user profile",
  })
  @ApiOkResponse({
    type: GetMeResponse,
  })
  @Protected()
  @Get("@me")
  async getMe(@Authorized("id") id: string) {
    return await this.usersService.getMe(id);
  }

  @ApiOperation({
    summary: "Toggle auto-renewal setting",
  })
  @ApiOkResponse({
    type: UpdateAutoRenewalResponse,
  })
  @Protected()
  @Patch("@me/auto-renewal")
  async updateAutoRenewal(
    @Authorized() user: User,
    @Body() dto: UpdateAutoRenewalRequest,
  ) {
    return await this.usersService.updateAutoRenewal(user, dto);
  }
}
