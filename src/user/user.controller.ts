import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSigninDto } from './dto/user-singin.dto';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('registration')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Post('signin')
  async findOne(
    @Body() userSigninDto: UserSigninDto,
    @Res({ passthrough: true }) response: Response
  ) {
    try{
      const userData = await this.userService.findOne(userSigninDto)
      response.cookie('token', userData.token)
      return userData
    }catch(err){
      throw err
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
