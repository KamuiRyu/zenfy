export type CardTypes = "credit/debit" | "credit" | "debit" | "other";


export interface CardType {
    uuid: string;
    last_four: string;
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