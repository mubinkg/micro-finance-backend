import { Prop, Schema } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Loan } from "src/loan/entities/loan.entity";
import { User } from "src/user/entities/user.entity";

@Schema({
    timestamps: true
})
export class Payment {
    _id: string

    @Prop({type:mongoose.Schema.Types.ObjectId, ref:'User'})
    user: User

    @Prop({type: mongoose.Schema.Types.ObjectId, ref:'Loan'})
    loan: Loan

    @Prop({type: Number})
    paidAmount: number

    @Prop({type: Number})
    unpaidAmount: number

    createdAt: Date
    updatedAt: Date
}
