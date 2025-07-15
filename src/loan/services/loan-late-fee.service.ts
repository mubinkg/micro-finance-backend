import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Loan, LoanDocument } from '../entities/loan.entity';
import { Model } from 'mongoose';
import { getDaysDiff } from 'src/utils/date';

@Injectable()
export class LoanLateFeeService {
  constructor(
    @InjectModel(Loan.name) private readonly loanModel: Model<LoanDocument>,
  ) {}

  getLateFee(loanDetails: Loan): {
    totalLateFee: number;
    totalInterest: number;
  } {
    const date2 = new Date(loanDetails.amountDueDate);
    const date1 = new Date();
    const totalDays = getDaysDiff(date1, date2);
    const lateDays = totalDays - 14;

    if (lateDays <= 0)
      return {
        totalInterest: loanDetails.amountDue - loanDetails.amountRequested,
        totalLateFee: 0,
      };
    const interestPays = loanDetails?.interestPays || 0;
    const interestCount = Math.floor(lateDays / 14);
    const extraLateDays = lateDays - 14 * interestCount;
    const baseInterest = loanDetails.amountDue - loanDetails.amountRequested;
    const totalInterest =
      baseInterest + baseInterest * interestCount - interestPays;
    let totalLateFee = 20 * interestCount;

    if (extraLateDays) totalLateFee = totalLateFee + 20;

    return {
      totalLateFee,
      totalInterest,
    };
  }
}
