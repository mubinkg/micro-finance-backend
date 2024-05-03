import { Injectable, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { MailService } from 'src/mail/mail.service';
import { UserSigninDto } from './dto/user-singin.dto';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
const generator = require('generate-password');


@Injectable()
export class UserService {

  constructor(
    @InjectModel(User.name) private readonly userModel:Model<UserDocument>,
    private readonly mailService:MailService,
    private readonly jwtService:JwtService
  ){}

  async create(createUserDto: CreateUserDto) {
    try{
      const isExist = this.userModel.findOne({email: createUserDto.email})
      if(isExist){
        throw new NotAcceptableException('User already exist')
      }
      let password = generator.generate({
        length: 10,
        numbers: true
      });
      const mailedPass = password
      password = await bcrypt.hash(password, 10)
      const user = await this.userModel.create({...createUserDto, password: password})
      user.password = ''
      this.mailService.sendMail(mailedPass, user.email)
      return user
    }
    catch(err){
      throw err;
    }
  }

  async findAll() {
    try{
      return await this.userModel.find({})
    }catch(err){
      throw err;
    }
  }

  async findOne(userSigninDto:UserSigninDto) {
    try{
      const user = await this.userModel.findOne({email: userSigninDto.email})
      if(!user){
        throw new UnauthorizedException('Already registered')
      }
      const isMatch = await bcrypt.compare(userSigninDto.password, user.password)
      if(!isMatch){
        throw new UnauthorizedException('Passeord is incorrect.')
      }
      const payload = {
        _id: user._id,
        email: user.email,
        role:user?.role ? user.role : "user"
      }

      const token = await this.jwtService.signAsync(payload)
      const resData = {
        user: user,
        token: token
      }
      return resData
    }
    catch(err){
      throw err;
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
