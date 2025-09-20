import * as React from "react";
import { Transaction } from "@prisma/client";
import { Head, Html, Body, Preview, Text } from "@react-email/components";

interface PaymentSuccessTemplateProps {
  transaction: Transaction;
}

export default function PaymentSuccessTemplate({
  transaction,
}: PaymentSuccessTemplateProps) {
  return (
    <Html>
      <Head />
      <Body>
        <Preview>Платеж успешно обработан</Preview>
        <Text>ID: {transaction.id}</Text>
      </Body>
    </Html>
  );
}
