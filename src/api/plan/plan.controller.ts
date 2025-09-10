import { Controller, Get, Param } from "@nestjs/common";
import { PlanService } from "./plan.service";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { PlanResponse } from "./dto/plan.dto";

@ApiTags("Plans")
@Controller("plans")
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @ApiOperation({
    summary: "Get all subscription plans",
  })
  @ApiOkResponse({
    type: [PlanResponse],
  })
  @Get()
  async getAll() {
    return this.planService.getAll();
  }

  @ApiOperation({
    summary: "Get subscription plan by ID",
  })
  @ApiOkResponse({
    type: PlanResponse,
  })
  @Get(":id")
  async getById(@Param("id") id: string) {
    return this.planService.getById(id);
  }
}
