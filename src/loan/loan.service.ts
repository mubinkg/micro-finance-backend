import { Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { InjectModel } from '@nestjs/mongoose';
import { LoadDocument, Loan } from './entities/loan.entity';
import { Model } from 'mongoose';
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
      await this.loanModel.findByIdAndUpdate(id, {status: updateLoanDto.status})
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
}
