import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { LoanService } from './loan.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'driverLicenseImage', maxCount: 1},
    { name: 'checkFront', maxCount: 1 },
    { name: 'checkBack', maxCount: 1 },
    { name: 'paystubs', maxCount: 1 },
  ]))
  create(
    @Body() createLoanDto: CreateLoanDto,
    @UploadedFiles() files: { 
      driverLicenseImage?: Express.Multer.File[],
      checkFront?: Express.Multer.File[],
      checkBack?: Express.Multer.File[],
      paystubs?: Express.Multer.File[],
    }
  ) {
    const checkBack = files.checkBack[0].path
    const checkFront = files.checkFront[0].path
    const driverLicenseImage = files.driverLicenseImage[0].path
    const paystubs = files.paystubs[0].path
    createLoanDto.checkBack = checkBack
    createLoanDto.checkFront = checkFront
    createLoanDto.driverLicenseImage = driverLicenseImage
    createLoanDto.paystubs = paystubs
    return this.loanService.create(createLoanDto);
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
  update(@Param('id') id: string, @Body() updateLoanDto: UpdateLoanDto) {
    return this.loanService.update(+id, updateLoanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loanService.remove(+id);
  }
}
