import { Injectable, InternalServerErrorException, NotAcceptableException } from '@nestjs/common';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from '../entities/payment.entity';
import { Model } from 'mongoose';
import { Loan, LoanDocument } from 'src/loan/entities/loan.entity';
import { PaymentEnum } from '../enum/payment.enum';
import { LoanLateFeeService } from 'src/loan/services/loan-late-fee.service';
import { LoanService } from 'src/loan/services/loan.service';
import { LoanStatus } from 'src/loan/enum/loanStatus.enum';
import { LoanType } from 'src/loan/enum/loanType.enum';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private readonly paymentModel: Model<PaymentDocument>,
    
    private readonly loanLateFeeServie: LoanLateFeeService,
    private readonly loanService: LoanService,
    @InjectModel(Loan.name) private readonly loanModel: Model<LoanDocument>,
  ) { }
  async create(createPaymentDto: CreatePaymentDto, loanDetails: Loan): Promise<Payment> {
    try {

      if(loanDetails.status !== LoanStatus.APPROVED){
        throw new NotAcceptableException('Can not pay this loan.')
      }

      const { totalInterest, totalLateFee } = this.loanLateFeeServie.getLateFee(loanDetails)

      if (createPaymentDto.paymentType === PaymentEnum.INTEREST_PAY) {
        if (totalInterest+totalLateFee !== createPaymentDto.amount) {
          throw new NotAcceptableException('Invalid interest amount. Your interset amount is ' + totalInterest)
        }

        const numberofSubLoan = await this.loanModel.countDocuments({loanType:"Sub Loan",mainLoan:loanDetails.mainLoan})

        const subLoanNumber = `${loanDetails?.loanType==LoanType.MAIN_LOAN ? loanDetails.loanNumber : loanDetails.mainLoan.loanNumber}-${numberofSubLoan+1}`
        console.log(loanDetails.loanNumber)

        const historyData = {
          user: createPaymentDto.userId,
          loan: createPaymentDto.loanId,
          paidAmount: createPaymentDto.amount,
          unpaidAmount: loanDetails.amountDue
        }

        delete loanDetails._id
        loanDetails.isIntersetPays = true
        loanDetails.interestPays = loanDetails.interestPays + createPaymentDto.amount

        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
        let yyyy = today.getFullYear();

        const amoundRequestedDate = `${mm}/${dd}/${yyyy}`;

        const fourteenDaysInMilliseconds = 14 * 24 * 60 * 60 * 1000;
        today = new Date(today.getTime() + fourteenDaysInMilliseconds);
        dd = String(today.getDate()).padStart(2, '0');
        mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
        yyyy = today.getFullYear();

        const amountDueDate = `${mm}/${dd}/${yyyy}`;


console.log("dsfsdfsdf",loanDetails?.loanType==LoanType.MAIN_LOAN ? loanDetails._id : loanDetails.mainLoan)
        const newLoanData = {
          checkFront: loanDetails.checkFront,
          loanNumber:subLoanNumber,
          mainLoan:loanDetails?.loanType==LoanType.MAIN_LOAN ? loanDetails._id : loanDetails.mainLoan,
          driverLicenseImage: loanDetails.driverLicenseImage,
          paystubs: loanDetails.paystubs,
          firstName: loanDetails.firstName,
          lastName: loanDetails.lastName,
          currentAddress: loanDetails.currentAddress,
          currentAddress2: loanDetails.currentAddress2,
          city: loanDetails.city,
          state: loanDetails.state,
          zipCode: loanDetails.zipCode,
          cellPhone: loanDetails.cellPhone,
          email: loanDetails.email,
          checkBack: loanDetails.checkBack,
          driverLicense: loanDetails.driverLicense,
          ssn: loanDetails.ssn,
          referenceOneFirstName: loanDetails.referenceOneFirstName,
          referenceOneLastName: loanDetails.referenceOneLastName,
          referenceOnePhone: loanDetails.referenceOnePhone,
          referenceTwoFirstName: loanDetails.referenceTwoFirstName,
          referenceTwoLastName: loanDetails.referenceTwoLastName,
          referenceTwoPhone: loanDetails.referenceTwoPhone,
          amountRequested: loanDetails.amountRequested,
          amountDue: loanDetails.amountDue,
          paymentMethod: loanDetails.paymentMethod,
          paymentDetails: loanDetails.paymentDetails,
          signature: loanDetails.signature,
          amountDueDate: amountDueDate,
          amoundRequestedDate: amoundRequestedDate,
          user: loanDetails.user._id,
          loanType:LoanType.SUB_LOAN,
          isIntersetPays: false,
          status: LoanStatus.PENDING,
          interestPays: createPaymentDto.amount
        }

        await this.loanService.create(newLoanData)
        await this.loanService.updateLoanData(createPaymentDto.loanId, { isIntersetPays: true, status: LoanStatus.PROCESSING, paidlLateFee: totalLateFee, paidInterset: totalInterest})
        return await this.paymentModel.create(historyData)
      }

      if (createPaymentDto.amount !== loanDetails.amountRequested + totalInterest + totalLateFee) {
        throw new NotAcceptableException('Amount not matched')
      }
      const historyData = {
        user: createPaymentDto.userId,
        loan: createPaymentDto.loanId,
        paidAmount: createPaymentDto.amount,
        unpaidAmount: 0
      }
      await this.loanService.updateLoanData(createPaymentDto.loanId, { status: LoanStatus.PROCESSING , isLoanPays:true,paidlLateFee: totalLateFee, paidInterset: totalInterest})
      return await this.paymentModel.create(historyData)
    }
    catch (err) {
      throw err;
    }
  }

  async findPaymentHistory() {

    let paymentHistory,totalCount=0

    try {
      paymentHistory = await this.paymentModel.aggregate([
        {
          $lookup:{
            from: "loans",
          localField: "loan",
          foreignField: "_id",
          as: "loan"
        }
        },
        {
          $unwind:"$loan"
        },
        {
          $sort:{
            _id:-1
          }
        }
      ])
  
      totalCount = await this.paymentModel.countDocuments({})
      
    } catch (error) {
      throw new InternalServerErrorException("Failed to find payment history. ")
    }

    
    return {
      history: paymentHistory,
      count:totalCount
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
