import { Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { InjectModel } from '@nestjs/mongoose';
import { LoadDocument, Loan } from './entities/loan.entity';
import { Model } from 'mongoose';

@Injectable()
export class LoanService {

  constructor(
    @InjectModel(Loan.name) private readonly loanModel:Model<LoadDocument>
  ){}

  async create(createLoanDto: CreateLoanDto) {
    try{
      return await this.loanModel.create(createLoanDto)
    }
    catch(err){
      throw err;
    }
  }

  async findAll() {
    try{
      const data = {
        count: await this.loanModel.countDocuments({}),
        loans: await this.loanModel.find({})
      }
      return data
    }catch(err){
      throw err;
    }
  }

  async findOne(id: string) {
    try{
      if(!id){
        throw new NotAcceptableException('Give Valid Id')
      }
      return await this.loanModel.findById(id)
    }
    catch(err){
      throw err;
    }
  }

  update(id: number, updateLoanDto: UpdateLoanDto) {
    return `This action updates a #${id} loan`;
  }

  remove(id: number) {
    return `This action removes a #${id} loan`;
  }
}
