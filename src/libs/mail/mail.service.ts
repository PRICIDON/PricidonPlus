import { Injectable, Logger } from "@nestjs/common";
import { type ISendMailOptions, MailerService } from "@nestjs-modules/mailer";
import { Transaction, User } from "@prisma/client";
import { render } from "@react-email/components";
import PaymentSuccessTemplate from "./templates/payment-success.template";

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(private readonly mailerService: MailerService) {}

  async sendPaymentSuccessEmail(user: User, transaction: Transaction) {
    const html = await render(PaymentSuccessTemplate({ transaction }));

    await this.sendMail({
      to: user.email,
      subject: "Платеж успешно обработан",
      html,
    });
  }

  private async sendMail(options: ISendMailOptions) {
    try {
      await this.mailerService.sendMail(options);
    } catch (error) {
      this.logger.error(`Failed to sending email: ${error}`);
      throw error;
    }
  }
}
