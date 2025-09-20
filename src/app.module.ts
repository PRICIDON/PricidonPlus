import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { InfraModule } from "./infra/infra.module";
import { ApiModule } from "./api/api.module";
import { LibsModule } from "./libs/libs.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    InfraModule,
    ApiModule,
    LibsModule,
  ],
})
export class AppModule {}
