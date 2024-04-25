import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
const generator = require('generate-password');


@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private readonly userModel:Model<UserDocument>
  ){}

  async create(createUserDto: CreateUserDto) {
    try{
      const password = generator.generate({
        length: 10,
        numbers: true
      });
      
      const user = await this.userModel.create({...createUserDto, password: password})
      user.password = ''
      return user
    }
    catch(err){
      throw err;
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
