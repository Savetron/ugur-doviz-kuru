
import { Currency, Gold } from '@/types';

const API_KEY = 'Gb50fN0Jc6'; // TCMB API anahtarı

// Alternatif API kullanımı için hazırlık
const FALLBACK_API_URL = 'https://api.exchangerate.host/latest?base=TRY';

// Örnek veriler (API bağlantısı olmadan önce test için)
const SAMPLE_CURRENCIES: Currency[] = [
  {
    code: 'USD',
    name: 'ABD Doları',
    buying: 33.4567,
    selling: 33.5432,
    change: 0.24,
    previousClosing: 33.4123,
    lastUpdated: new Date()
  },
  {
    code: 'EUR',
    name: 'Euro',
    buying: 36.1234,
    selling: 36.2345,
    change: -0.12,
    previousClosing: 36.1512,
    lastUpdated: new Date()
  },
  {
    code: 'GBP',
    name: 'İngiliz Sterlini',
    buying: 42.5678,
    selling: 42.6789,
    change: 0.31,
    previousClosing: 42.5123,
    lastUpdated: new Date()
  },
  {
    code: 'CHF',
    name: 'İsviçre Frangı',
    buying: 38.1234,
    selling: 38.2345,
    change: 0.05,
    previousClosing: 38.1123,
    lastUpdated: new Date()
  },
  {
    code: 'JPY',
    name: 'Japon Yeni',
    buying: 0.2234,
    selling: 0.2345,
    change: -0.02,
    previousClosing: 0.2245,
    lastUpdated: new Date()
  },
  {
    code: 'CAD',
    name: 'Kanada Doları',
    buying: 24.5678,
    selling: 24.6789,
    change: 0.15,
    previousClosing: 24.5123,
    lastUpdated: new Date()
  },
  {
    code: 'AUD',
    name: 'Avustralya Doları',
    buying: 22.1234,
    selling: 22.2345,
    change: -0.08,
    previousClosing: 22.1412,
    lastUpdated: new Date()
  },
  {
    code: 'RUB',
    name: 'Rus Rublesi',
    buying: 0.3678,
    selling: 0.3789,
    change: 0.01,
    previousClosing: 0.3654,
    lastUpdated: new Date()
  }
];

const SAMPLE_GOLD: Gold[] = [
  {
    type: 'ONS',
    name: 'Ons Altın',
    buying: 2631.12,
    selling: 2632.45,
    change: 0.54,
    previousClosing: 2630.22,
    lastUpdated: new Date()
  },
  {
    type: 'GRAM',
    name: 'Gram Altın',
    buying: 2140.56,
    selling: 2142.34,
    change: 0.32,
    previousClosing: 2139.87,
    lastUpdated: new Date()
  },
  {
    type: 'CEYREK',
    name: 'Çeyrek Altın',
    buying: 3512.45,
    selling: 3547.89,
    change: -0.18,
    previousClosing: 3515.67,
    lastUpdated: new Date()
  },
  {
    type: 'YARIM',
    name: 'Yarım Altın',
    buying: 7024.90,
    selling: 7095.78,
    change: -0.18,
    previousClosing: 7031.34,
    lastUpdated: new Date()
  },
  {
    type: 'TAM',
    name: 'Tam Altın',
    buying: 14049.80,
    selling: 14191.56,
    change: -0.18,
    previousClosing: 14062.68,
    lastUpdated: new Date()
  },
  {
    type: 'CUMHURIYET',
    name: 'Cumhuriyet Altını',
    buying: 14500.00,
    selling: 14650.00,
    change: 0.22,
    previousClosing: 14480.00,
    lastUpdated: new Date()
  }
];

/**
 * TCMB API'den döviz verilerini çeker
 */
export async function fetchCurrencyRates(): Promise<Currency[]> {
  try {
    // TODO: TCMB API entegrasyonu burada yapılacak
    // Örnek:
    // const response = await fetch(`https://evds2.tcmb.gov.tr/service/evds/series=TP.DK.USD.A-TP.DK.USD.S&startDate=${startDate}&endDate=${endDate}&type=json&key=${API_KEY}`);
    // const data = await response.json();
    
    // Şu an için örnek verileri döndürüyoruz
    return SAMPLE_CURRENCIES;
  } catch (error) {
    console.error("Failed to fetch currency rates:", error);
    // Alternatif API kullanmayı deneyebiliriz
    return fetchAlternativeCurrencyRates();
  }
}

/**
 * Alternatif API'den döviz verilerini çeker
 */
async function fetchAlternativeCurrencyRates(): Promise<Currency[]> {
  try {
    // Bu fonksiyon API bağlantısı sağlandığında gerçek verilerle değiştirilecek
    return SAMPLE_CURRENCIES;
  } catch (error) {
    console.error("Failed to fetch from alternative API:", error);
    throw new Error("Döviz kurları alınamadı. Lütfen daha sonra tekrar deneyin.");
  }
}

/**
 * TCMB API'den altın verilerini çeker
 */
export async function fetchGoldRates(): Promise<Gold[]> {
  try {
    // TODO: TCMB API entegrasyonu burada yapılacak
    // Şu an için örnek verileri döndürüyoruz
    return SAMPLE_GOLD;
  } catch (error) {
    console.error("Failed to fetch gold rates:", error);
    throw new Error("Altın fiyatları alınamadı. Lütfen daha sonra tekrar deneyin.");
  }
}
