import { 
  Controller, 
  Get, 
  Patch, 
  Param, 
  Body, 
  UseGuards, 
  Req 
} from '@nestjs/common';
import { UserService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req) {
    return this.userService.findOne(req.user.userId);
  }
  
  @UseGuards(JwtAuthGuard)
  @Patch('update-profile')
  async update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.userId, updateUserDto);
  }

 
  @Patch(':id/set-admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN) 
  async makeAdmin(@Param('id') id: string) {
    return this.userService.updateRole(id, Role.ADMIN);
  }
}