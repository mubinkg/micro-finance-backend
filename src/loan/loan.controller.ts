import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, UseGuards, UnauthorizedException, NotAcceptableException } from '@nestjs/common';
import { LoanService } from './loan.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from 'src/user/jwt.guard';
import { User } from 'src/decorators/currentuser.decorator';

@Controller('loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'driverLicenseImage', maxCount: 1},
    { name: 'checkFront', maxCount: 1 },
    { name: 'checkBack', maxCount: 1 },
    { name: 'paystubs', maxCount: 1 },
  ]))
  
  async create(
    @User('user') user:any,
    @Body() createLoanDto: CreateLoanDto,
    @UploadedFiles() files: { 
      driverLicenseImage?: Express.Multer.File[],
      checkFront?: Express.Multer.File[],
      checkBack?: Express.Multer.File[],
      paystubs?: Express.Multer.File[],
    }
  ) {
    try{
      createLoanDto.user = user.userId
      
      let checkBack = files?.checkBack ? files?.checkBack[0]?.originalname : null
      if(checkBack){
        checkBack = uuidv4()+files?.checkBack[0]?.originalname
        checkBack = await this.loanService.uploadImage(files.checkBack[0].buffer, checkBack) as string
      }else{
        throw new NotAcceptableException('Give check back image')
      }
      
      let checkFront = files?.checkFront ? files?.checkFront[0]?.originalname : null
      if(checkFront){
        checkFront = uuidv4() + checkFront
        checkFront = await this.loanService.uploadImage(files.checkFront[0].buffer, checkFront) as string
      }else{
        throw new NotAcceptableException('Give check front image')
      }
      
      let driverLicenseImage = files?.driverLicenseImage ? files?.driverLicenseImage[0]?.originalname : null
      if(driverLicenseImage){
        driverLicenseImage = uuidv4()+driverLicenseImage
        driverLicenseImage = await this.loanService.uploadImage(files.driverLicenseImage[0].buffer, driverLicenseImage) as string
      }else{
        throw new NotAcceptableException('Give driver license image')
      }
      
      let paystubs = files?.paystubs ? files?.paystubs[0]?.originalname : null;
      if(paystubs){
        paystubs =  uuidv4()+paystubs
        paystubs = await this.loanService.uploadImage(files.paystubs[0].buffer, paystubs) as string
      }else{
        throw new NotAcceptableException('Give paystubs image')
      }
      
      createLoanDto.checkBack = checkBack
      createLoanDto.checkFront = checkFront
      createLoanDto.driverLicenseImage = driverLicenseImage
      createLoanDto.paystubs = paystubs
      return await this.loanService.create(createLoanDto);
      
    }catch(err){
      throw err
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user-loan')
  getUerLoan(
    @User('user') user:any
  ){
    return this.loanService.getUserLoan(user.userId)
  }

  @Get()
  findAll() {
    return this.loanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loanService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string, @Body() updateLoanDto: UpdateLoanDto,
    @User('user') user:any
  ) {
    if(user.role !== 'admin'){
      throw new UnauthorizedException('Only admin can update loan status')
    }
    return this.loanService.update(id, updateLoanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loanService.remove(+id);
  }

}
