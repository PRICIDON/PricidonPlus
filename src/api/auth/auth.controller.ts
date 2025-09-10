import { Body, Controller, Post, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginRequest, RegisterRequest } from "./dto";
import { Response, Request } from "express";
import { ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { AuthResponse } from "./dto/auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: "Register a new user",
  })
  @ApiOkResponse({
    type: AuthResponse,
  })
  @Post("register")
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: RegisterRequest,
  ) {
    return this.authService.register(res, dto);
  }

  @ApiOperation({
    summary: "Login an existing user",
  })
  @ApiOkResponse({
    type: AuthResponse,
  })
  @Post("login")
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginRequest,
  ) {
    return this.authService.login(res, dto);
  }

  @ApiOperation({
    summary: "Logout user",
  })
  @Post("logout")
  async logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @ApiOperation({
    summary: "Refresh access token",
  })
  @ApiOkResponse({
    type: AuthResponse,
  })
  @Post("refresh")
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refresh(req, res);
  }
}
