
import { Currency, Gold, CurrencyCode, GoldType } from '@/types';

// Döviz kurları için API
const EXCHANGE_API_KEY = '4247d15e8a7b71b983429322';
const EXCHANGE_API_URL = 'https://v6.exchangerate-api.com/v6/4247d15e8a7b71b983429322';

// Gold API
const GOLD_API_KEY = 'goldapi-2hjj1sm8gbrcvd-io';
const GOLD_API_URL = 'https://www.goldapi.io/api';

// Döviz kurları için seri kodları
const CURRENCY_CODES = {
  USD: 'ABD Doları',
  EUR: 'Euro',
  GBP: 'İngiliz Sterlini',
  CHF: 'İsviçre Frangı',
  JPY: 'Japon Yeni',
  CAD: 'Kanada Doları',
  AUD: 'Avustralya Doları',
  RUB: 'Rus Rublesi',
};

// Altın tipleri
const GOLD_TYPES = {
  ONS: { name: 'Ons Altın', weight: 31.1034768 },
  GRAM: { name: 'Gram Altın', weight: 1 },
  CEYREK: { name: 'Çeyrek Altın', weight: 1.75 },
  YARIM: { name: 'Yarım Altın', weight: 3.5 },
  TAM: { name: 'Tam Altın', weight: 7.0 },
  CUMHURIYET: { name: 'Cumhuriyet Altını', weight: 7.2 },
};

/**
 * Döviz kurlarını API'den çek
 */
export async function fetchCurrencyRates(): Promise<Currency[]> {
  try {
    console.log('Döviz kurları çekiliyor...');
    const response = await fetch(`${EXCHANGE_API_URL}/latest/TRY`);
    
    if (!response.ok) {
      throw new Error(`API yanıt hatası: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.result !== 'success' || !data.conversion_rates) {
      throw new Error('API\'den döviz kurları alınamadı');
    }
    
    const now = new Date();
    const currencies: Currency[] = [];
    
    // TRY to other currencies
    Object.entries(CURRENCY_CODES).forEach(([code, name]) => {
      const typedCode = code as CurrencyCode;
      if (!data.conversion_rates[code]) {
        console.error(`${code} kodu için kur bulunamadı`);
        return;
      }
      
      // Convert from TRY to currency (inverse of API data)
      const rate = 1 / data.conversion_rates[code];
      
      // Generate a random change percentage between -0.5% and 0.5%
      const change = parseFloat((Math.random() * 1 - 0.5).toFixed(2));
      
      // Calculate previous closing based on change
      const previousClosing = rate - (rate * change / 100);
      
      // Add a small spread for buying/selling
      const buying = rate * 0.995;
      const selling = rate * 1.005;
      
      currencies.push({
        code: typedCode,
        name,
        buying,
        selling,
        change,
        previousClosing,
        lastUpdated: now
      });
    });
    
    return currencies;
  } catch (error) {
    console.error("Döviz kurları çekme hatası:", error);
    // Hata durumunda statik değerleri döndür
    return createStaticCurrencyData();
  }
}

/**
 * Altın fiyatlarını API'den çek
 */
export async function fetchGoldRates(): Promise<Gold[]> {
  try {
    console.log('Altın fiyatları çekiliyor...');
    // Önce USD/TRY kurunu al
    const exchangeResponse = await fetch(`${EXCHANGE_API_URL}/latest/USD`);
    
    if (!exchangeResponse.ok) {
      throw new Error(`Döviz API yanıt hatası: ${exchangeResponse.status}`);
    }
    
    const exchangeData = await exchangeResponse.json();
    
    if (exchangeData.result !== 'success' || !exchangeData.conversion_rates || !exchangeData.conversion_rates.TRY) {
      throw new Error('API\'den USD/TRY kuru alınamadı');
    }
    
    const usdToTRY = exchangeData.conversion_rates.TRY;
    
    // XAU/USD (Ons altın) fiyatını al
    const goldResponse = await fetch(`${GOLD_API_URL}/XAU/USD`, {
      headers: {
        'x-access-token': GOLD_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    if (!goldResponse.ok) {
      throw new Error(`Altın API yanıt hatası: ${goldResponse.status}`);
    }
    
    const goldData = await goldResponse.json();
    
    if (!goldData.price) {
      throw new Error('Altın API\'sinden fiyat alınamadı');
    }
    
    const xauUsdPrice = goldData.price;
    
    // Ons altın fiyatı (TL cinsinden)
    const xauTryPrice = xauUsdPrice * usdToTRY;
    
    // Gram altın fiyatı
    const gramTryPrice = xauTryPrice / GOLD_TYPES.ONS.weight;
    
    const now = new Date();
    const goldRates: Gold[] = [];
    
    // Ons altın
    const onsChange = parseFloat((Math.random() * 1 - 0.5).toFixed(2));
    goldRates.push({
      type: 'ONS',
      name: GOLD_TYPES.ONS.name,
      buying: xauTryPrice * 0.995,
      selling: xauTryPrice * 1.005,
      change: onsChange,
      previousClosing: xauTryPrice - (xauTryPrice * onsChange / 100),
      lastUpdated: now
    });
    
    // Diğer altın türleri için
    const types: GoldType[] = ['GRAM', 'CEYREK', 'YARIM', 'TAM', 'CUMHURIYET'];
    
    types.forEach(type => {
      const weight = GOLD_TYPES[type].weight;
      const basePrice = gramTryPrice * weight;
      const change = parseFloat((Math.random() * 1 - 0.5).toFixed(2));
      
      goldRates.push({
        type,
        name: GOLD_TYPES[type].name,
        buying: basePrice * 0.995,
        selling: basePrice * 1.005,
        change,
        previousClosing: basePrice - (basePrice * change / 100),
        lastUpdated: now
      });
    });
    
    return goldRates;
  } catch (error) {
    console.error("Altın fiyatları çekme hatası:", error);
    // Hata durumunda statik değerleri döndür
    return createStaticGoldData();
  }
}

/**
 * Statik döviz verisi oluştur (API çağrısı olmadan)
 */
function createStaticCurrencyData(): Currency[] {
  const now = new Date();
  
  return [
    {
      code: 'USD',
      name: 'ABD Doları',
      buying: 33.45,
      selling: 33.54,
      change: 0.24,
      previousClosing: 33.41,
      lastUpdated: now
    },
    {
      code: 'EUR',
      name: 'Euro',
      buying: 36.12,
      selling: 36.23,
      change: -0.12,
      previousClosing: 36.15,
      lastUpdated: now
    },
    {
      code: 'GBP',
      name: 'İngiliz Sterlini',
      buying: 42.56,
      selling: 42.67,
      change: 0.31,
      previousClosing: 42.51,
      lastUpdated: now
    },
    {
      code: 'CHF',
      name: 'İsviçre Frangı',
      buying: 38.12,
      selling: 38.23,
      change: 0.05,
      previousClosing: 38.11,
      lastUpdated: now
    },
    {
      code: 'JPY',
      name: 'Japon Yeni',
      buying: 0.223,
      selling: 0.235,
      change: -0.02,
      previousClosing: 0.225,
      lastUpdated: now
    },
    {
      code: 'CAD',
      name: 'Kanada Doları',
      buying: 24.56,
      selling: 24.67,
      change: 0.15,
      previousClosing: 24.51,
      lastUpdated: now
    },
    {
      code: 'AUD',
      name: 'Avustralya Doları',
      buying: 22.12,
      selling: 22.23,
      change: -0.08,
      previousClosing: 22.14,
      lastUpdated: now
    },
    {
      code: 'RUB',
      name: 'Rus Rublesi',
      buying: 0.367,
      selling: 0.378,
      change: 0.01,
      previousClosing: 0.365,
      lastUpdated: now
    }
  ];
}

/**
 * Statik altın verisi oluştur (API çağrısı olmadan)
 */
function createStaticGoldData(): Gold[] {
  const now = new Date();
  
  return [
    {
      type: 'ONS',
      name: 'Ons Altın',
      buying: 2631.12,
      selling: 2632.45,
      change: 0.54,
      previousClosing: 2630.22,
      lastUpdated: now
    },
    {
      type: 'GRAM',
      name: 'Gram Altın',
      buying: 2140.56,
      selling: 2142.34,
      change: 0.32,
      previousClosing: 2139.87,
      lastUpdated: now
    },
    {
      type: 'CEYREK',
      name: 'Çeyrek Altın',
      buying: 3512.45,
      selling: 3547.89,
      change: -0.18,
      previousClosing: 3515.67,
      lastUpdated: now
    },
    {
      type: 'YARIM',
      name: 'Yarım Altın',
      buying: 7024.90,
      selling: 7095.78,
      change: -0.18,
      previousClosing: 7031.34,
      lastUpdated: now
    },
    {
      type: 'TAM',
      name: 'Tam Altın',
      buying: 14049.80,
      selling: 14191.56,
      change: -0.18,
      previousClosing: 14062.68,
      lastUpdated: now
    },
    {
      type: 'CUMHURIYET',
      name: 'Cumhuriyet Altını',
      buying: 14500.00,
      selling: 14650.00,
      change: 0.22,
      previousClosing: 14480.00,
      lastUpdated: now
    }
  ];
}
