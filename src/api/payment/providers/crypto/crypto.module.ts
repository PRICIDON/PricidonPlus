import { Module } from "@nestjs/common";
import { CryptoService } from "./crypto.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  providers: [CryptoService],
  imports: [HttpModule.register({})],
  exports: [CryptoService],
})
export class CryptoModule {}
