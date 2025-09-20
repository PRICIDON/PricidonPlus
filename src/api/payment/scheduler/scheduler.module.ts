import { Module } from "@nestjs/common";
import { SchedulerService } from "./scheduler.service";
import { ScheduleModule } from "@nestjs/schedule";
import { YoomoneyModule } from "../providers/yoomoney/yoomoney.module";

@Module({
  imports: [ScheduleModule.forRoot(), YoomoneyModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
