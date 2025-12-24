export type CardFormSchema = {
  lastFour: string;
  brand: string;
  holderName: string;
  bank: string;
  expiryDate: Date;
  cardType: string;
  billingDay: string;
  billingDayDate?: Date;
  nickname?: string;
  isDefault?: boolean;
};
