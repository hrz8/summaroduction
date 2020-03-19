import { Controller, UseGuards, Post, Res, Body, HttpStatus, Param, BadRequestException } from '@nestjs/common';
import { BaseController } from '../../shared/base.controller';
import { ProductionService } from './production.service';
import { Production, ProdPlannedActivity, ProdUnplannedActivity } from './production.model';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ActionResponse } from '../../shared/base.response';
import { ValidateObjectId } from '../../shared/pipes/validate-object-id.pipe';

@UseGuards(JwtAuthGuard)
@Controller('production')
export class ProductionController extends BaseController<Production> {
  constructor(private readonly productionService: ProductionService) {
    super(productionService);
  }

  @Post(':id/planned-activity')
  public async addPlannedActivity(@Res() res, @Param('id', new ValidateObjectId()) id, @Body() message: ProdPlannedActivity): Promise<ActionResponse<ProdPlannedActivity>>
  {
    let response: ActionResponse<ProdPlannedActivity[]> = new ActionResponse<ProdPlannedActivity[]>();
    const createdData: Production = await this.productionService.addPlannedActivity(id, message);

    if (!createdData) {
      throw new BadRequestException("check your request parameters");
    }

    const newData: Production = await this.productionService.findByIdAsync(id, 'plannedActivities.activity');

    response.message = "successfully added planned activity";
    response.action = "add/push";
    response.id = newData.id;
    response.data = newData.plannedActivities;

    return res.status(HttpStatus.OK).json(response);
  }

  @Post(':id/unplanned-activity')
  public async addUnplannedActivity(@Res() res, @Param('id', new ValidateObjectId()) id, @Body() message: ProdUnplannedActivity): Promise<ActionResponse<ProdUnplannedActivity>>
  {
    let response: ActionResponse<ProdUnplannedActivity[]> = new ActionResponse<ProdUnplannedActivity[]>();
    const createdData: Production = await this.productionService.addUnplannedActivity(id, message);

    if (!createdData) {
      throw new BadRequestException("check your request parameters");
    }

    const newData: Production = await this.productionService.findByIdAsync(id, 'unplannedActivities.activity');

    response.message = "successfully added unplanned activity";
    response.action = "add/push";
    response.id = newData.id;
    response.data = newData.unplannedActivities;

    return res.status(HttpStatus.OK).json(response);
  }
}
