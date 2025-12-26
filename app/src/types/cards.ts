export type CardTypes = "credit/debit" | "credit" | "debit" | "other";


export interface CardType {
    id?: number;
    card_id?: string;
    uuid: string;
    last_four: string;
    lastFour: string;
    card_brand?: string;
    brand: string;
    bank: string;
    card_type: CardTypes;
    holder_name?: string;
    expiry_month?: number;
    expiry_year?: number;
    billing_day?: number;
    is_default?: boolean;
    nickname?: string;
    created_at: string;
}

export interface CardSimpleType {
    lastFour: string;
    brand: string;
    holderName: string;
    bank: string;
    expiryDate?: Date;
    cardType: CardTypes;
    billingDay: string;
    nickname?: string;
    isDefault?: boolean;
}