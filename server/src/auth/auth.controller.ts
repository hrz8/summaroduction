import { Controller, Request, Post, UseGuards, Put, Res, Param, Body, NotFoundException, BadRequestException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { ValidateObjectId } from 'src/shared/pipes/validate-object-id.pipe';
import { ActionResponse } from 'src/shared/base.response';
import { User } from 'src/user/user.model';
import { UserService } from 'src/user/user.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(@Request() req)
  {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Put('change-password/:id')
  public async changePassword(@Res() res, @Param('id', new ValidateObjectId()) id, @Body() message: any): Promise<ActionResponse<User>>
  {
    if (!id || !message.id) {
      throw new NotFoundException("id required");
    }

    if (id !== message.id) {
      throw new BadRequestException("invalid id match");
    }

    let editData: any;

    if (message.admin) {
      editData = await this.userService.updateAsync({
        id: message.id,
        firstName: message.firstName,
        lastName: message.lastName,
        username: message.username,
        password: bcrypt.hashSync(message.password, 10),
        role: message.role
      });

      if (!editData) {
        throw new NotFoundException('unknown id');
      }
    }
    else {
      const { username, oldPassword, newPassword } = message;
      const user: any = await this.authService.validateUser(username, oldPassword);
      if (!user) {
        throw new UnauthorizedException('invalid old password');
      }

      const encryptedPassword = bcrypt.hashSync(newPassword, 10);

      editData = await this.userService.updateAsync({
        id: user._doc._id,
        firstName: user._doc.firstName,
        lastName: user._doc.lastName,
        username: user._doc.username,
        password: encryptedPassword,
        role: user._doc.role
      });

      if (!editData) {
        throw new NotFoundException('unknown id');
      }
    }
    

    let response: ActionResponse<User> = new ActionResponse<User>();

    

    response.message = "successfully change password";
    response.action = "update";
    response.id = editData.id;
    response.data = editData;

    return res.status(HttpStatus.OK).json(response);
  }
}
