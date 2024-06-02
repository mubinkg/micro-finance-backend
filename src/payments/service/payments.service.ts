import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from '../entities/payment.entity';
import { Model } from 'mongoose';
import { Loan } from 'src/loan/entities/loan.entity';
import { PaymentEnum } from '../enum/payment.enum';
import { getDaysDiff } from 'src/utils/date';
import { LoanLateFeeService } from 'src/loan/services/loan-late-fee.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private readonly paymentModel: Model<PaymentDocument>,
    private readonly loanLateFeeServie:LoanLateFeeService
  ) { }
  async create(createPaymentDto: CreatePaymentDto, loanDetails:Loan): Promise<Payment> {
    try {
      const dueDate = loanDetails.amountDueDate
      const totalAmount = loanDetails.amountDue
      const {totalInterest, totalLateFee} = this.loanLateFeeServie.getLateFee(loanDetails)
      console.log(totalInterest, totalLateFee)
      if(createPaymentDto.paymentType === PaymentEnum.INTEREST_PAY){

      }
      // return await this.paymentModel.create(createPaymentDto)
      return null
    }
    catch (err) {
      throw err;
    }
  }

  findAll() {
    return `This action returns all payments`;
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
