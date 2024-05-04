import { IsNotEmpty, IsString, MAX, MaxLength } from "class-validator"

export class CreateLoanDto {

    checkFront?:string
    
    driverLicenseImage?:string

    paystubs?: string

    @IsString()
    @IsNotEmpty()
    firstName?: string

    @IsString()
    @IsNotEmpty()
    lastName?: string

    @IsString()
    @IsNotEmpty()
    currentAddress?: string

    @IsString()
    @IsNotEmpty()
    currentAddress2?: string

    @IsString()
    @IsNotEmpty()
    city?: string

    @IsString()
    @IsNotEmpty()
    state?: string

    @IsString()
    @IsNotEmpty()
    zipCode?: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(10)
    cellPhone?: string

    @IsString()
    @IsNotEmpty()
    email?: string

    checkBack?:string

    @IsString()
    @IsNotEmpty()
    driverLicense?: string

    @IsString()
    @IsNotEmpty()
    ssn?: string

    @IsString()
    @IsNotEmpty()
    referenceOneFirstName?: string

    @IsString()
    @IsNotEmpty()
    referenceOneLastName?: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(10)
    referenceOnePhone?: string

    @IsString()
    @IsNotEmpty()
    referenceTwoFirstName?: string

    @IsString()
    @IsNotEmpty()
    referenceTwoLastName?: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(10)
    referenceTwoPhone?: string

    @IsString()
    @IsNotEmpty()
    amountRequested?: number

    @IsString()
    @IsNotEmpty()
    amountDue?: number

    @IsString()
    @IsNotEmpty()
    paymentMethod?: string

    @IsString()
    @IsNotEmpty()
    paymentDetails?: string
}
