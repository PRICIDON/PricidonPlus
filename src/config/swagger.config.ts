import { DocumentBuilder } from "@nestjs/swagger";

export function getSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle("Payment API")
    .setVersion("1.4.8.8")
    .build();
}
