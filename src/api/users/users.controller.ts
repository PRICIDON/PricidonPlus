import { Controller, Get } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Protected } from "../../common/decorators/protected.decorator";
import { Authorized } from "../../common/decorators/authrorized.decorator";
import { User } from "@prisma/client";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Protected()
  @Get("@me")
  async getMe(@Authorized() user: User) {
    return user;
  }
}
