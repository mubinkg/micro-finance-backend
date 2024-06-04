import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PaymentsService } from '../service/payments.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';
import { JwtAuthGuard } from 'src/user/jwt/jwt.guard';
import { User } from 'src/decorators/currentuser.decorator';
import { LoanPaymentService } from 'src/loan/services/loan-payment.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly loanPaymentService: LoanPaymentService
  ) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createPaymentDto: CreatePaymentDto,
    @User('user') user: { userId: string }
  ) {
    try {
      const userId = user.userId
      createPaymentDto['userId'] = userId
      const loanDetails = await this.loanPaymentService.getLoan(createPaymentDto.loanId)
      return this.paymentsService.create(createPaymentDto, loanDetails);
    } catch (err) {
      throw err
    }
  }

  // @UseGuards(JwtAuthGuard)
  @Get('/findPaymentHistory')
  async findPaymentHistory() {
    return await this.paymentsService.findPaymentHistory();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(+id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(+id);
  }
}
