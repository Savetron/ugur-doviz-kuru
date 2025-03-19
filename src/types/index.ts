
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CHF' | 'JPY' | 'CAD' | 'AUD' | 'RUB';
export type GoldType = 'ONS' | 'GRAM' | 'CEYREK' | 'YARIM' | 'TAM' | 'CUMHURIYET';

export interface Currency {
  code: CurrencyCode;
  name: string;
  buying: number;
  selling: number;
  change: number;
  previousClosing?: number;
  lastUpdated: Date;
}

export interface Gold {
  type: GoldType;
  name: string;
  buying: number;
  selling: number;
  change: number;
  previousClosing?: number;
  lastUpdated: Date;
}

export type CurrencyContextType = {
  currencies: Currency[];
  goldRates: Gold[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refreshData: () => Promise<void>;
};
