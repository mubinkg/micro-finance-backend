import { Injectable, InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { InjectModel } from '@nestjs/mongoose';
import { LoadDocument, Loan } from './entities/loan.entity';
import mongoose, { Model } from 'mongoose';
import { LoanStatus } from './enum/loanStatus.enum';
import { PaidStatus } from './enum/paidStatus.enum';
const AWS = require('aws-sdk');
const fs = require('fs');


@Injectable()
export class LoanService {
  s3 = null
  constructor(
    @InjectModel(Loan.name) private readonly loanModel:Model<LoadDocument>
  ){
    AWS.config.update({
      accessKeyId: 'AKIA6ODU6YMG3NX32WE2',
      secretAccessKey: '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',
      region: 'us-east-1'
    });
    this.s3 = new AWS.S3();
  }

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
        loans: await this.loanModel.find({}).sort('-_id')
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

  async update(id: string, updateLoanDto: UpdateLoanDto) {
    try{
      const updatedData = {
        status: updateLoanDto.status
      }
      if(updateLoanDto?.comments){
        updatedData['comments'] = updateLoanDto.comments
      }
      await this.loanModel.findByIdAndUpdate(id,updatedData)
      return await this.loanModel.findById(id)
    }
    catch(err){
      throw err;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} loan`;
  }

  async getUserLoan(userId:string){
    try{
      return await this.loanModel.find({user: userId}).sort('-_id')
    }catch(err){
      throw err
    }
  }


  async updateLoanDetails(id:string, data:any){
    try{
      await this.loanModel.findByIdAndUpdate(id, {...data, status:'pending'})
      return true
    }
    catch(err){
      throw err;
    }
  }

  async uploadImage(imageStream:any, objectKey:any){
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
      
    let maxLoanAmount=400
    try {

      const numberOfUnPaidApprovedLoan = await this.loanModel.countDocuments({
        "user": userId,
        status: "approved",
        loanPaidStatus: "UnPaid",
      });

      console.log("numberOfUnPaidApprovedLoan",numberOfUnPaidApprovedLoan)

      if(numberOfUnPaidApprovedLoan>0){
        throw new NotAcceptableException('Your previous loans must be in PAID status to qualify for next loan')
      }
      const numberOfRejectedLoan = await this.loanModel.countDocuments({"user._id":new mongoose.Schema.Types.ObjectId(userId),status:LoanStatus.REJECTED})

      if(numberOfRejectedLoan>=5){
        maxLoanAmount = 400
      }
      else{
        const numberOfApprovedLoan = await this.loanModel.countDocuments({
          "user._id": new mongoose.Schema.Types.ObjectId(userId),
          status: LoanStatus.APPROVED,
        });
      
        if (numberOfApprovedLoan == 0) {
          maxLoanAmount= 400;
        } else if (numberOfApprovedLoan>0 && numberOfApprovedLoan<3){
          maxLoanAmount=800
        } else if (numberOfApprovedLoan>2 && numberOfApprovedLoan<10){
          maxLoanAmount=1000
        }
        else if(numberOfApprovedLoan>9){
          maxLoanAmount= 2000
        }

      }
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }

    return maxLoanAmount
  }
}
