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
