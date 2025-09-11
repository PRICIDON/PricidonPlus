import type { Plan } from "@prisma/client";

export const plans: Omit<Plan, "id" | "createdAt" | "updatedAt">[] = [
  {
    title: "Базовый",
    description:
      "Идеально подходит для малых проектов и индивидуальных предпринимателей.",
    features: [
      "5 проектов",
      "10ГБ хранилища",
      "Базовая поддержка",
      "Доступ к основным функциям",
    ],
    isFeatured: false,
    monthlyPrice: 850,
    yearlyPrice: 8160,
    // starsMonthlyPrice: 475,
    // starsYearlyPrice: 4650,
    stripeMonthlyPriceId: "price_1S69foEFOxois3DjiWisknV3",
    stripeYearlyPriceId: "price_1S69foEFOxois3DjurLe2E4C",
  },
  {
    title: "Профессиональный",
    description: "Отлично подходит для развивающихся компаний и команд.",
    features: [
      "Неограниченное количество проектов",
      "100ГБ хранилища",
      "Приоритетная поддержка",
      "Продвинутая аналитика",
      "Функции для команд",
    ],
    isFeatured: true,
    monthlyPrice: 2499,
    yearlyPrice: 23990,
    // starsMonthlyPrice: 1395,
    // starsYearlyPrice: 13390,
    stripeMonthlyPriceId: "price_1S6ARgEFOxois3Dj6HoxPwxy",
    stripeYearlyPriceId: "price_1S6ARgEFOxois3DjeXckZrzK",
  },
  {
    title: "Бизнес",
    description: "Для крупных предприятий с высокими требованиями.",
    features: [
      "Неограниченное количество проектов",
      "1ТБ хранилища",
      "Круглосуточная премиум поддержка",
      "Продвинутая безопасность",
      "Пользовательские интеграции",
      "Выделенный менеджер аккаунта",
    ],
    isFeatured: false,
    monthlyPrice: 4999,
    yearlyPrice: 47990,
    // starsMonthlyPrice: 2789,
    // starsYearlyPrice: 26820,
    stripeMonthlyPriceId: "price_1S6ATwEFOxois3DjRenkuxVu",
    stripeYearlyPriceId: "price_1S6ATwEFOxois3DjuxFJs7qC",
  },
];
