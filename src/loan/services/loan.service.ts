import { Injectable, InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { CreateLoanDto } from '../dto/create-loan.dto';
import { UpdateLoanDto } from '../dto/update-loan.dto';
import { InjectModel } from '@nestjs/mongoose';
import { LoanDocument, Loan } from '../entities/loan.entity';
import mongoose, { Model } from 'mongoose';
import { LoanStatus } from '../enum/loanStatus.enum';
import { PaidStatus } from '../enum/paidStatus.enum';
import { LoanLateFeeService } from './loan-late-fee.service';
import { LoanType } from '../enum/loanType.enum';
const AWS = require('aws-sdk');
const fs = require('fs');


@Injectable()
export class LoanService {
  s3 = null
  constructor(
    @InjectModel(Loan.name) private readonly loanModel: Model<LoanDocument>,
    private readonly loanLateFeeService: LoanLateFeeService
  ) {
    AWS.config.update({
      accessKeyId: process.env.S3_ACCESS,
      secretAccessKey: process.env.S3_SECRET,
      region: 'us-east-1'
    });
    this.s3 = new AWS.S3();
  }

  async create(createLoanDto: CreateLoanDto) {
    try {

      const loanCount = await this.loanModel.countDocuments({loanType:LoanType.MAIN_LOAN})

      if (!createLoanDto.loanType) {
        createLoanDto.loanNumber = `${loanCount + 1 + 100}`
      }

      return await this.loanModel.create(createLoanDto)
    }
    catch (err) {
      throw err;
    }
  }

  async findAll() {
    try {
      let loans = await this.loanModel.find({}).sort('-_id')
      for (let i = 0; i < loans.length; i++) {
        const { totalInterest, totalLateFee } = this.loanLateFeeService.getLateFee(loans[i])
        loans[i]['lateFee'] = totalLateFee
      }
      const data = {
        count: await this.loanModel.countDocuments({}),
        loans: loans
      }
      return data
    } catch (err) {
      throw err;
    }
  }

  async findOne(id: string) {
    try {
      if (!id) {
        throw new NotAcceptableException('Give Valid Id')
      }
      return await this.loanModel.findById(id)
    }
    catch (err) {
      throw err;
    }
  }

  async update(id: string, updateLoanDto: UpdateLoanDto) {
    try {
      const updatedData = {
        status: updateLoanDto.status
      }
      if (updateLoanDto?.comments) {
        updatedData['comments'] = updateLoanDto.comments
      }
      await this.loanModel.findByIdAndUpdate(id, updatedData)
      return await this.loanModel.findById(id)
    }
    catch (err) {
      throw err;
    }
  }

  async updateLoanData(id: string, updateLoanDto: UpdateLoanDto) {
    try {
      return await this.loanModel.findByIdAndUpdate(id, updateLoanDto)
    }
    catch (err) {
      throw err;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} loan`;
  }

  async getUserLoan(userId: string, role:string) {
    try {
      const query = {}
      if(role !== 'admin'){
        query['user'] = userId
      }
      const loans = await this.loanModel.find(query).sort('-_id')
      for (let i = 0; i < loans.length; i++) {
        const { totalInterest, totalLateFee } = this.loanLateFeeService.getLateFee(loans[i])
        loans[i]['totalDue'] = loans[i].amountRequested + totalInterest + totalLateFee
        loans[i]['intersetDue'] = totalInterest
        loans[i]['lateFee'] = totalLateFee
      }
      return loans
    } catch (err) {
      throw err
    }
  }


  async updateLoanDetails(id: string, data: any) {
    try {
      await this.loanModel.findByIdAndUpdate(id, { ...data, status: 'pending' })
      return true
    }
    catch (err) {
      throw err;
    }
  }

  async uploadImage(imageStream: any, objectKey: any) {
    const params = {
      Bucket: "zimbacash-bucket",
      Key: objectKey,
      Body: imageStream
    };
    return new Promise((resolve, reject) => {
      this.s3.upload(params, (err, data) => {
        if (err) {
          console.error('Error uploading image:', err);
          reject(err);
        } else {
          console.log('Image uploaded successfully. Location:', data.Location);
          resolve(data.Location);
        }
      });
    })
  }

  async getTotalApprovedLoan(userId: string) {

    let maxLoanAmount = 400
    try {

      const numberOfUnPaidApprovedLoan = await this.loanModel.countDocuments({
        user: userId,
        status: {$in:[LoanStatus.APPROVED,LoanStatus.PROCESSING]},
      });

      console.log(numberOfUnPaidApprovedLoan)

      // if(numberOfUnPaidApprovedLoan>0){
      //   throw new NotAcceptableException('Your previous loans must be in PAID status to qualify for next loan')
      // }
      const numberOfRejectedLoan = await this.loanModel.countDocuments({ user: userId, status: LoanStatus.REJECTED })

      if (numberOfRejectedLoan >= 5 || numberOfUnPaidApprovedLoan > 0) {
        maxLoanAmount = 400
      }
      else {
        const numberOfPaidLoan = await this.loanModel.countDocuments({
          user: userId,
          loanType:'Main Loan',
          status: LoanStatus.PAID,
        });

        if (numberOfPaidLoan == 0) {
          maxLoanAmount = 400;
        } else if (numberOfPaidLoan > 0 && numberOfPaidLoan < 3) {
          maxLoanAmount = 800
        } else if (numberOfPaidLoan > 2 && numberOfPaidLoan < 10) {
          maxLoanAmount = 1000
        }
        else if (numberOfPaidLoan > 9) {
          maxLoanAmount = 2000
        }

      }
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }

    return maxLoanAmount
  }
}
