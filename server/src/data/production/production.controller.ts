import { Controller, UseGuards, Post, Res, Body, HttpStatus, Param, BadRequestException, Delete, Put, Query, Get } from '@nestjs/common';
import { BaseController } from '../../shared/base.controller';
import { ProductionService } from './production.service';
import { Production, ProdPlannedActivity, ProdUnplannedActivity } from './production.model';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ActionResponse, GetResponse } from '../../shared/base.response';
import { ValidateObjectId } from '../../shared/pipes/validate-object-id.pipe';
import { ValidateQueryInteger } from 'src/shared/pipes/validate-query-integer.pipe';
import { BasicQueryMessage, BasicFilterMessage } from 'src/shared/base.message';
import { mongoose } from '@typegoose/typegoose';

@UseGuards(JwtAuthGuard)
@Controller('production')
export class ProductionController extends BaseController<Production> {
  constructor(private readonly productionService: ProductionService) {
    super(productionService);
  }

  @Get()
  public async get(@Res() res, @Query(new ValidateQueryInteger()) queryString: BasicQueryMessage): Promise<GetResponse<Production>>
  {
    let response: GetResponse<Production> = new GetResponse<Production>();
    let data: Array<Production> = new Array<Production>();
    let filterMessage: BasicFilterMessage<any> = new BasicFilterMessage<Production>();
   
    if (Object.keys(queryString).length) {
      const regexColon: RegExp = /^(\w+):(\w+(?:\-\w+)?)$/;

      if (queryString.filter) {
        const filters = queryString.filter.split(";");
        filters.forEach(item => {
          const filter = item.match(regexColon);
          if (filter[1] === 'date') {
            const rangeDate = filter[2].split("-");
            const startDate = Number(rangeDate[0]);
            const endDate = Number(rangeDate[1]);
            filterMessage.filter.startAt = {
              $gte: new Date(startDate),
              $lte: new Date(endDate)
            }
          }
          else {
            const regexDecimal: RegExp = /^\d+$/;
            if (regexDecimal.test(filter[2])) {
              filterMessage.filter[filter[1]] = Number(filter[2]);
            }
            else {
              if (mongoose.Types.ObjectId.isValid(filter[2])) {
                if (filter[1] !== '_id') {
                  filterMessage.filter[filter[1]] = filter[2];
                }
              }
              else {
                filterMessage.filter[filter[1]] = new RegExp(filter[2], 'i');
              }
            }
          }
        });
      }

      if (queryString.sort) {
        const order = queryString.sort.match(regexColon);
        filterMessage.sort[order[1]] = order[2];
      }

      if (queryString.populate) {
        const regexComma: RegExp = /^([\w\.]+)(,[\w\.]+)*?$/;
        if (regexComma.test(queryString.populate)) {
          filterMessage.populate = queryString.populate.replace(/,/g, ' ');
        }
      }

      filterMessage.limit = queryString.limit;
      filterMessage.offset = queryString.offset;
    }

    try {
      data = await this.productionService.findAsync(filterMessage);
    }
    catch {
      data = await this.productionService.findAsync(new BasicFilterMessage<Production>());
    }

    response.message = data.length ? "successfully fetched" : "data is empty";
    response.total = data.length;
    response.data = data;

    return res.status(HttpStatus.OK).json(response);
  }

  @Post(':id/planned-activity')
  public async addPlannedActivity(
    @Res() res, 
    @Param('id', new ValidateObjectId()) id, 
    @Body() message: ProdPlannedActivity): Promise<ActionResponse<ProdPlannedActivity>>
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

  @Delete(':id/planned-activity/:activityId')
  public async removePlannedActivity(
    @Res() res, 
    @Param('id', new ValidateObjectId()) id, 
    @Param('activityId', new ValidateObjectId()) activityId): Promise<ActionResponse<ProdPlannedActivity>>
  {
    let response: ActionResponse<ProdPlannedActivity[]> = new ActionResponse<ProdPlannedActivity[]>();
    const deletedData: Production = await this.productionService.removePlannedActivity(id, activityId);

    if (!deletedData) {
      throw new BadRequestException("check your request parameters");
    }

    const newData: Production = await this.productionService.findByIdAsync(id, 'plannedActivities.activity');

    response.message = "successfully removed planned activity";
    response.action = "remove/pull";
    response.id = newData.id;
    response.data = newData.plannedActivities;

    return res.status(HttpStatus.OK).json(response);
  }

  @Put(':id/planned-activity/:prodActivityId')
  public async updatePlannedActivity(
    @Res() res,
    @Param('id', new ValidateObjectId()) id,
    @Param('prodActivityId', new ValidateObjectId()) prodActivityId,
    @Body() message: ProdPlannedActivity): Promise<ActionResponse<ProdPlannedActivity>>
  {
    let response: ActionResponse<ProdPlannedActivity[]> = new ActionResponse<ProdPlannedActivity[]>();
    const updatedData: Production = await this.productionService.updatePlannedActivity(id, prodActivityId, message);

    if (!updatedData) {
      throw new BadRequestException("check your request parameters");
    }

    const newData: Production = await this.productionService.findByIdAsync(id, 'plannedActivities.activity');

    response.message = "successfully updated planned activity";
    response.action = "update/set";
    response.id = newData.id;
    response.data = newData.plannedActivities;

    return res.status(HttpStatus.OK).json(response);
  }

  @Post(':id/unplanned-activity')
  public async addUnplannedActivity(
    @Res() res, 
    @Param('id', new ValidateObjectId()) id, 
    @Body() message: ProdUnplannedActivity): Promise<ActionResponse<ProdUnplannedActivity>>
  {
    let response: ActionResponse<ProdUnplannedActivity[]> = new ActionResponse<ProdUnplannedActivity[]>();
    const createdData: Production = await this.productionService.addUnplannedActivity(id, message);

    if (!createdData) {
      throw new BadRequestException("check your request parameters");
    }

    const newData: Production = await this.productionService.findByIdAsync(id, 'unplannedActivities.activity unplannedActivities.operationNumber');

    response.message = "successfully added unplanned activity";
    response.action = "add/push";
    response.id = newData.id;
    response.data = newData.unplannedActivities;

    return res.status(HttpStatus.OK).json(response);
  }

  @Delete(':id/unplanned-activity/:activityId')
  public async removeUnlannedActivity(@Res() res, @Param('id', new ValidateObjectId()) id, @Param('activityId', new ValidateObjectId()) activityId): Promise<ActionResponse<ProdPlannedActivity>>
  {
    let response: ActionResponse<ProdUnplannedActivity[]> = new ActionResponse<ProdUnplannedActivity[]>();
    const deletedData: Production = await this.productionService.removeUnplannedActivity(id, activityId);

    if (!deletedData) {
      throw new BadRequestException("check your request parameters");
    }

    const newData: Production = await this.productionService.findByIdAsync(id, 'unplannedActivities.activity unplannedActivities.operationNumber');

    response.message = "successfully removed unplanned activity";
    response.action = "remove/pull";
    response.id = newData.id;
    response.data = newData.unplannedActivities;

    return res.status(HttpStatus.OK).json(response);
  }

  @Put(':id/unplanned-activity/:prodActivityId')
  public async updateUnplannedActivity(
    @Res() res,
    @Param('id', new ValidateObjectId()) id,
    @Param('prodActivityId', new ValidateObjectId()) prodActivityId,
    @Body() message: ProdUnplannedActivity): Promise<ActionResponse<ProdUnplannedActivity>>
  {
    let response: ActionResponse<ProdUnplannedActivity[]> = new ActionResponse<ProdUnplannedActivity[]>();
    const updatedData: Production = await this.productionService.updateUnplannedActivity(id, prodActivityId, message);

    if (!updatedData) {
      throw new BadRequestException("check your request parameters");
    }

    const newData: Production = await this.productionService.findByIdAsync(id, 'unplannedActivities.activity unplannedActivities.operationNumber');

    response.message = "successfully updated unplanned activity";
    response.action = "update/set";
    response.id = newData.id;
    response.data = newData.unplannedActivities;

    return res.status(HttpStatus.OK).json(response);
  }
}
