import { InjectModel } from "@nestjs/mongoose";
import { Loan, LoanDocument } from "../entities/loan.entity";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class LoanPaymentService{
    constructor(
        @InjectModel(Loan.name) private readonly loanModel:Model<LoanDocument>
    ){}

    async getLoan(id:string){
        try{
            return await this.loanModel.findById(id)
        }
        catch(err){
            throw err;
        }
    }
}