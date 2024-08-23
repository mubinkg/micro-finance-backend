import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, UseGuards, UnauthorizedException, NotAcceptableException, Put } from '@nestjs/common';
import { LoanService } from '../services/loan.service';
import { CreateLoanDto } from '../dto/create-loan.dto';
import { UpdateLoanDto } from '../dto/update-loan.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/decorators/currentuser.decorator';
import { UpdateLoanDetailsDto } from '../dto/update-loan-details';
import { JwtAuthGuard } from 'src/user/jwt/jwt.guard';
import { UserLoanServie } from 'src/user/services/user-loan.service';

@Controller('loan')
export class LoanController {
  constructor(
    private readonly loanService: LoanService,
    private readonly userLoanService:UserLoanServie
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'driverLicenseImage', maxCount: 1 },
    { name: 'checkFront', maxCount: 1 },
    { name: 'checkBack', maxCount: 1 },
    { name: 'paystubs', maxCount: 1 },
  ]))

  async create(
    @User('user') user: any,
    @Body() createLoanDto: CreateLoanDto,
    @UploadedFiles() files: {
      driverLicenseImage?: Express.Multer.File[],
      checkFront?: Express.Multer.File[],
      checkBack?: Express.Multer.File[],
      paystubs?: Express.Multer.File[],
    }
  ) {
    try {
      createLoanDto.user = user.userId

      let checkBack = files?.checkBack ? files?.checkBack[0]?.originalname : null
      if (checkBack) {
        checkBack = uuidv4() + files?.checkBack[0]?.originalname
        checkBack = await this.loanService.uploadImage(files.checkBack[0].buffer, checkBack) as string
      } else {
        throw new NotAcceptableException('Give check back image')
      }

      let checkFront = files?.checkFront ? files?.checkFront[0]?.originalname : null
      if (checkFront) {
        checkFront = uuidv4() + checkFront
        checkFront = await this.loanService.uploadImage(files.checkFront[0].buffer, checkFront) as string
      } else {
        throw new NotAcceptableException('Give check front image')
      }

      let driverLicenseImage = files?.driverLicenseImage ? files?.driverLicenseImage[0]?.originalname : null
      if (driverLicenseImage) {
        driverLicenseImage = uuidv4() + driverLicenseImage
        driverLicenseImage = await this.loanService.uploadImage(files.driverLicenseImage[0].buffer, driverLicenseImage) as string
      } else {
        throw new NotAcceptableException('Give driver license image')
      }

      let paystubs = files?.paystubs ? files?.paystubs[0]?.originalname : null;
      if (paystubs) {
        paystubs = uuidv4() + paystubs
        paystubs = await this.loanService.uploadImage(files.paystubs[0].buffer, paystubs) as string
      } else {
        throw new NotAcceptableException('Give paystubs image')
      }

      createLoanDto.checkBack = checkBack
      createLoanDto.checkFront = checkFront
      createLoanDto.driverLicenseImage = driverLicenseImage
      createLoanDto.paystubs = paystubs
      return await this.loanService.create(createLoanDto);

    } catch (err) {
      throw err
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user-loan')
  getUerLoan(
    @User('user') user: any
  ) {
    return this.loanService.getUserLoan(user.userId, user.role)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateLoanDto: UpdateLoanDto,
    @User('user') user: any
  ) {
    if (user.role !== 'admin') {
      throw new UnauthorizedException('Only admin can update loan status')
    }
    try {
      const data = await this.loanService.update(id, updateLoanDto);
      const user = data.user._id.toString()
      await this.userLoanService.updateUserActiveLoan(user)
      return data;
    } catch (err) {
      throw err;
    }
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'driverLicenseImage', maxCount: 1 },
    { name: 'checkFront', maxCount: 1 },
    { name: 'checkBack', maxCount: 1 },
    { name: 'paystubs', maxCount: 1 },
  ]))
  async updateLoan(
    @UploadedFiles() files: {
      driverLicenseImage?: Express.Multer.File[],
      checkFront?: Express.Multer.File[],
      checkBack?: Express.Multer.File[],
      paystubs?: Express.Multer.File[],
    },
    @Body() updateLoanDetails: UpdateLoanDetailsDto,
  ) {
    try {
      let checkBack = files?.checkBack ? files?.checkBack[0]?.originalname : null
      if (checkBack) {
        checkBack = uuidv4() + files?.checkBack[0]?.originalname
        checkBack = await this.loanService.uploadImage(files.checkBack[0].buffer, checkBack) as string
        updateLoanDetails['checkBack'] = checkBack
      }

      let checkFront = files?.checkFront ? files?.checkFront[0]?.originalname : null
      if (checkFront) {
        checkFront = uuidv4() + checkFront
        checkFront = await this.loanService.uploadImage(files.checkFront[0].buffer, checkFront) as string
        updateLoanDetails['checkFront'] = checkFront
      }

      let driverLicenseImage = files?.driverLicenseImage ? files?.driverLicenseImage[0]?.originalname : null
      if (driverLicenseImage) {
        driverLicenseImage = uuidv4() + driverLicenseImage
        driverLicenseImage = await this.loanService.uploadImage(files.driverLicenseImage[0].buffer, driverLicenseImage) as string
        updateLoanDetails['driverLicenseImage'] = driverLicenseImage
      }

      let paystubs = files?.paystubs ? files?.paystubs[0]?.originalname : null;
      if (paystubs) {
        paystubs = uuidv4() + paystubs
        paystubs = await this.loanService.uploadImage(files.paystubs[0].buffer, paystubs) as string
        updateLoanDetails['paystubs'] = paystubs
      }
      const id = updateLoanDetails.id
      delete updateLoanDetails.id
      await this.loanService.updateLoanDetails(id, updateLoanDetails)
      return 'Loan resubmitted successfully.'
    }
    catch (err) {
      throw err;
    }
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.loanService.remove(+id);
  // }

  @Get('/total-approved-loan')
  @UseGuards(JwtAuthGuard)
  totalApprovedLoan(
    @User('user') user:any
  ){
    const userId = user?.userId
    return this.loanService.getTotalApprovedLoan(userId)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loanService.findOne(id);
  }

  @Get()
  findAll() {
    return this.loanService.findAll();
  }

}
