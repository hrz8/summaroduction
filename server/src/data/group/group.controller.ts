import { Controller, UseGuards } from '@nestjs/common';
import { BaseController } from '../../shared/base.controller';
import { GroupService } from './group.service';
import { Group } from './group.model';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('group')
export class GroupController extends BaseController<Group> {
  constructor(private readonly groupService: GroupService) {
    super(groupService);
  }
}
