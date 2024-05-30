import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "src/user/entities/user.entity";
import { PaidStatus } from "../enum/paidStatus.enum";
import { LoanStatus } from "../enum/loanStatus.enum";

@Schema({
    timestamps: true
})
export class Loan {
    _id: string

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    user?: User

    @Prop({type:String})
    firstName?: string

    @Prop({type:String})
    lastName?: string

    @Prop({type:String})
    currentAddress?: string

    @Prop({type:String})
    currentAddress2?: string

    @Prop({type:String})
    city?: string

    @Prop({type:String})
    state?: string

    @Prop({type:String})
    zipCode?: string

    @Prop({type:String})
    cellPhone?: string

    @Prop({type:String})
    email?: string

    @Prop({type:String})
    driverLicense?: string

    @Prop({type:String})
    ssn?: string
    
    @Prop({type:String})
    signature?: string

    @Prop({type:String})
    driverLicenseImage?: string

    @Prop({type:String})
    checkFront?: string

    @Prop({type:String})
    checkBack?: string

    @Prop({type:String})
    paystubs?: string

    @Prop({type:String})
    referenceOneFirstName?: string

    @Prop({type:String})
    referenceOneLastName?: string

    @Prop({type:String})
    referenceOnePhone?: string

    @Prop({type:String})
    referenceTwoFirstName?: string

    @Prop({type:String})
    referenceTwoLastName?: string

    @Prop({type:String})
    referenceTwoPhone?: string

    @Prop({type:Number})
    amountRequested?: number

    @Prop({type:Number})
    amountDue?: number

    @Prop({type:String})
    paymentMethod?: string

    @Prop({type:String})
    paymentDetails?: string

    @Prop({type:String, default:LoanStatus.PENDING,enum:LoanStatus})
    status?: string

    @Prop({type:String, default:PaidStatus.UNPAID, enum:PaidStatus})
    loanPaidStatus?: string
    
    @Prop({type:String})
    amountDueDate?: string

    @Prop({type:String})
    amoundRequestedDate?: string
}


export type LoadDocument = HydratedDocument<Loan>
export const LoanSchema = SchemaFactory.createForClass(Loan)