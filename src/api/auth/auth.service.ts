import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "../../infra/prisma/prisma.service";
import { hash, verify } from "argon2";
import { LoginRequest, RegisterRequest } from "./dto";
import { User } from "@prisma/client";
import { JwtPayload } from "./interfaces";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { ms, StringValue, isDev } from "../../common/utils";
import { Request, Response } from "express";

@Injectable()
export class AuthService {
  private readonly JWT_ACCESS_TOKEN_TTL: StringValue;
  private readonly JWT_REFRESH_TOKEN_TTL: StringValue;
  private readonly COOKIES_DOMAIN: string;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.JWT_ACCESS_TOKEN_TTL = configService.getOrThrow<StringValue>(
      "JWT_ACCESS_TOKEN_TTL",
    );
    this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow<StringValue>(
      "JWT_REFRESH_TOKEN_TTL",
    );
    this.COOKIES_DOMAIN = configService.getOrThrow<string>("COOKIES_DOMAIN");
  }

  async register(res: Response, dto: RegisterRequest) {
    const { name, email, password } = dto;

    const exists = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (exists)
      throw new ConflictException("Пользователь с такой почтой уже существует");

    const hashed = await hash(password);

    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        password: hashed,
      },
    });
    return this.auth(res, user);
  }

  async login(res: Response, dto: LoginRequest) {
    const { email, password } = dto;

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) throw new NotFoundException("Неверный логин или пароль");

    const isValidPassword = await verify(user.password, password);
    if (!isValidPassword)
      throw new NotFoundException("Неверный логин или пароль");

    return this.auth(res, user);
  }

  async logout(res: Response) {
    return this.setCookie(res, "", new Date(0));
  }

  private async generateTokens(user: User) {
    const payload: JwtPayload = {
      id: user.id,
    };

    const refreshTokenExpires = new Date(
      Date.now() + ms(this.JWT_REFRESH_TOKEN_TTL),
    );
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.JWT_ACCESS_TOKEN_TTL,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.JWT_REFRESH_TOKEN_TTL,
    });
    return {
      accessToken,
      refreshToken,
      refreshTokenExpires,
    };
  }

  private setCookie(res: Response, value: string, expires: Date) {
    res.cookie("refreshToken", value, {
      httpOnly: true,
      domain: this.COOKIES_DOMAIN,
      expires,
      secure: !isDev(this.configService),
      sameSite: "lax",
    });
  }
  private async auth(res: Response, user: User) {
    const { accessToken, refreshToken, refreshTokenExpires } =
      await this.generateTokens(user);
    this.setCookie(res, refreshToken, refreshTokenExpires);
    return { accessToken };
  }

  async refresh(req: Request, res: Response) {
    if (!req || !req.cookies)
      throw new UnauthorizedException("Не удалось получить куки авторизации");

    const refreshToken = req.cookies["refreshToken"];

    if (refreshToken) {
      const payload: JwtPayload =
        await this.jwtService.verifyAsync(refreshToken);
      if (payload) {
        const user = await this.prismaService.user.findUnique({
          where: { id: payload.id },
        });
        if (user) return this.auth(res, user);
      }
    }
  }
}
