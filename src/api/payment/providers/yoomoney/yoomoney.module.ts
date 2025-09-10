import { Module } from "@nestjs/common";
import { YoomoneyService } from "./yoomoney.service";
import { YookassaModule } from "nestjs-yookassa";
import { getYookassaConfig } from "../../../../config/yookassa.config";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  providers: [YoomoneyService],
  imports: [
    YookassaModule.forRootAsync({
      useFactory: getYookassaConfig,
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  exports: [YoomoneyService],
})
export class YoomoneyModule {}
