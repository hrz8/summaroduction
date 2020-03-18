import { Controller, UseGuards, Post, Res, Body, HttpStatus, Param } from '@nestjs/common';
import { BaseController } from '../../shared/base.controller';
import { ProductionService } from './production.service';
import { Production, ProdPlannedActivity } from './production.model';
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
  public async addPlannedActivity(@Res() res, @Param('id', new ValidateObjectId()) id, @Body() message: ProdPlannedActivity): Promise<ActionResponse<Production>>
  {
    let response: ActionResponse<Production> = new ActionResponse<Production>();
    const newData: Production = await this.productionService.addPlannedActivity(id, message);

    response.message = "successfully added";
    response.action = "add/push";
    response.id = newData.id;
    response.data = newData;

    return res.status(HttpStatus.OK).json(response);
  }
}
