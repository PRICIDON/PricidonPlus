import { JwtModuleOptions } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

export function getJwtConfig(configService: ConfigService): JwtModuleOptions {
  return {
    secret: configService.getOrThrow<string>("JWT_SECRET"),
    signOptions: {
      algorithm: "HS256",
    },
    verifyOptions: {
      algorithms: ["HS256"],
      ignoreExpiration: false,
    },
  };
}
