import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({
    timestamps: true
})
export class Loan {
    _id: string

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
}


export type LoadDocument = HydratedDocument<Loan>
export const LoanSchema = SchemaFactory.createForClass(Loan)