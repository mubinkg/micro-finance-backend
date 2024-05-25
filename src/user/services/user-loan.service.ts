import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "../entities/user.entity";

@Injectable()
export class UserLoanServie{
    
    constructor(
        @InjectModel(User.name) private readonly userModel:Model<UserDocument>
    ){}

    async updateUserActiveLoan(userId:string){
        try{
            await this.userModel.findByIdAndUpdate(userId, {
                $inc:{
                    totalApprovedLoan:1
                }
            })
        }
        catch(err){
            throw err;
        }
    }
}