import { Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../entities/user.entity';
import { Model } from 'mongoose';
import { MailService } from 'src/mail/mail.service';
import { UserSigninDto } from '../dto/user-singin.dto';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from '../dto/change-password.dto';
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
      createUserDto.email = createUserDto.email.toLowerCase()
      const isExist = await this.userModel.findOne({email: createUserDto.email})
      if(isExist){
        throw new NotAcceptableException('Already registered with this email.')
      }
      let password = generator.generate({
        length: 10,
        numbers: true
      });
      const mailedPass = password
      password = await bcrypt.hash(password, 10)
      const user = await this.userModel.create({...createUserDto, password: password})
      user.password = ''
      this.mailService.sendMail(mailedPass, user.email, user.firstName+user.lastName)
      return user
    }
    catch(err){
      throw err;
    }
  }

  async changePassword(createUserDto: ChangePasswordDto, user:any) {
    try{
      const userData = await this.userModel.findById(user.userId)
      if(!userData){
        throw new NotFoundException('User not found.')
      }
      const checkPassword = await bcrypt.compare(createUserDto.oldPassword,userData.password)
      if(!checkPassword){
        throw new NotAcceptableException('Password not matched')
      }
      const newPassword = await bcrypt.hash(createUserDto.newPassword, 10)
      await this.userModel.findByIdAndUpdate(userData._id, {password: newPassword})
      return 'User password updated successfully.'
    }
    catch(err){
      throw err;
    }
  }
  

  async resetPassword(email: string){
    try{
      const isExist = await this.userModel.findOne({email: email.toLowerCase()})
      if(!isExist){
        throw new NotAcceptableException('No user found')
      }
      let password = generator.generate({
        length: 10,
        numbers: true
      });
      const mailedPass = password 
      password = await bcrypt.hash(password, 10)
      await this.userModel.updateOne({email: email.toLowerCase()}, {$set: {password:password}})
      const user = await this.userModel.findOne({email: email})
      this.mailService.sendMail(mailedPass, email, user.firstName+user.lastName)
      return 'Password reset success'
    }catch(err){
      throw err;
    }
  }

  async findAll() {
    try{
      return {
        users: await this.userModel.find({}).sort('-_id'),
        count: await this.userModel.countDocuments({})
      }
    }catch(err){
      throw err;
    }
  }

  async findOne(userSigninDto:UserSigninDto) {
    try{
      userSigninDto.email = userSigninDto.email.toLowerCase()
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

  async findUser(user:any) {
    try{
      return await this.userModel.findById(user.userId)
    }
    catch(err){
      throw err;
    }
  }

  async getUserList(){
    try{
      const users = await this.userModel.find({}).sort('-_id')
      const count = await this.userModel.countDocuments({})
      return {users, count}
    }
    catch(err){
      throw err;
    }
  }
}
