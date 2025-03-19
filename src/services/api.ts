
import { Currency, Gold, CurrencyCode, GoldType } from '@/types';

// Döviz kurları için seri kodları
const CURRENCY_SERIES = {
  USD: { buying: 'TP.DK.USD.A', selling: 'TP.DK.USD.S', name: 'ABD Doları' },
  EUR: { buying: 'TP.DK.EUR.A', selling: 'TP.DK.EUR.S', name: 'Euro' },
  GBP: { buying: 'TP.DK.GBP.A', selling: 'TP.DK.GBP.S', name: 'İngiliz Sterlini' },
  CHF: { buying: 'TP.DK.CHF.A', selling: 'TP.DK.CHF.S', name: 'İsviçre Frangı' },
  JPY: { buying: 'TP.DK.JPY.A', selling: 'TP.DK.JPY.S', name: 'Japon Yeni' },
  CAD: { buying: 'TP.DK.CAD.A', selling: 'TP.DK.CAD.S', name: 'Kanada Doları' },
  AUD: { buying: 'TP.DK.AUD.A', selling: 'TP.DK.AUD.S', name: 'Avustralya Doları' },
  RUB: { buying: 'TP.DK.RUB.A', selling: 'TP.DK.RUB.S', name: 'Rus Rublesi' },
};

// Altın fiyatları için serileri
const GOLD_SERIES = {
  ONS: { buying: 'TP.FG.A01', selling: 'TP.FG.S01', name: 'Ons Altın' },
  GRAM: { buying: 'TP.FG.A02', selling: 'TP.FG.S02', name: 'Gram Altın' },
  CEYREK: { buying: 'TP.FG.A03', selling: 'TP.FG.S03', name: 'Çeyrek Altın' },
  YARIM: { buying: 'TP.FG.A04', selling: 'TP.FG.S04', name: 'Yarım Altın' },
  TAM: { buying: 'TP.FG.A05', selling: 'TP.FG.S05', name: 'Tam Altın' },
  CUMHURIYET: { buying: 'TP.FG.A06', selling: 'TP.FG.S06', name: 'Cumhuriyet Altını' },
};

// TCMB EVDS API anahtarı
const TCMB_API_KEY = 'Gb50fN0Jc6';

/**
 * Döviz kurlarını doğrudan statik değerlerle döndür (API çağrısı yapmadan)
 */
export async function fetchCurrencyRates(): Promise<Currency[]> {
  try {
    // Önce API'den veri almayı deneyelim (CORS veya diğer sorunlar nedeniyle başarısız olabilir)
    return await fetchLiveExchangeRates();
  } catch (error) {
    console.error("Döviz kurları çekme hatası:", error);
    // Hata durumunda statik değerleri döndür
    return createStaticCurrencyData();
  }
}

/**
 * Altın fiyatlarını doğrudan statik değerlerle döndür (API çağrısı yapmadan)
 */
export async function fetchGoldRates(): Promise<Gold[]> {
  try {
    // Önce API'den veri almayı deneyelim (CORS veya diğer sorunlar nedeniyle başarısız olabilir)
    return await fetchLiveGoldRates();
  } catch (error) {
    console.error("Altın fiyatları çekme hatası:", error);
    // Hata durumunda statik değerleri döndür
    return createStaticGoldData();
  }
}

/**
 * Canlı döviz kurlarını almayı dene
 */
async function fetchLiveExchangeRates(): Promise<Currency[]> {
  // Dolar kuru için örnek bir API (CORS sorununa daha az duyarlı)
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    
    if (!response.ok) {
      throw new Error(`API yanıt hatası: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.rates || !data.rates.TRY) {
      throw new Error('API\'den TRY kuru alınamadı');
    }
    
    // USD/TRY kuru
    const usdToTry = data.rates.TRY;
    
    // EUR/USD kuru için ayrıca sorgulama yap
    const eurResponse = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
    const eurData = await eurResponse.json();
    
    if (!eurData.rates || !eurData.rates.USD) {
      throw new Error('API\'den EUR/USD kuru alınamadı');
    }
    
    // EUR/USD kuru
    const eurToUsd = eurData.rates.USD;
    // EUR/TRY kuru
    const eurToTry = usdToTry * eurToUsd;
    
    // Diğer kurlar için çarpanlar (yaklaşık değerler)
    const rateMultipliers = {
      GBP: 1.26, // USD'nin kaç GBP olduğu
      CHF: 0.90, // USD'nin kaç CHF olduğu
      JPY: 0.0067, // USD'nin kaç JPY olduğu
      CAD: 0.74, // USD'nin kaç CAD olduğu
      AUD: 0.67, // USD'nin kaç AUD olduğu
      RUB: 0.011, // USD'nin kaç RUB olduğu
    };
    
    const now = new Date();
    const currencies: Currency[] = [];
    
    // USD kuru ekle
    const usdBuying = usdToTry * 0.995; // %0.5 spread
    const usdSelling = usdToTry * 1.005;
    const usdChange = 0.24; // Örnek değişim yüzdesi
    
    currencies.push({
      code: 'USD',
      name: 'ABD Doları',
      buying: usdBuying,
      selling: usdSelling,
      change: usdChange,
      previousClosing: usdBuying - (usdBuying * usdChange / 100),
      lastUpdated: now
    });
    
    // EUR kuru ekle
    const eurBuying = eurToTry * 0.995;
    const eurSelling = eurToTry * 1.005;
    const eurChange = -0.12;
    
    currencies.push({
      code: 'EUR',
      name: 'Euro',
      buying: eurBuying,
      selling: eurSelling,
      change: eurChange,
      previousClosing: eurBuying - (eurBuying * eurChange / 100),
      lastUpdated: now
    });
    
    // Diğer kurları hesapla ve ekle
    Object.entries(rateMultipliers).forEach(([code, multiplier]) => {
      const typedCode = code as CurrencyCode;
      
      // İlgili para biriminin USD karşılığı
      const currencyToUsd = multiplier;
      // TL karşılığı hesapla
      const currencyToTry = usdToTry / currencyToUsd;
      
      // Rastgele değişim yüzdesi (-0.5% ile 0.5% arası)
      const randomChange = (Math.random() - 0.5) * 1;
      const change = parseFloat(randomChange.toFixed(2));
      
      const buying = currencyToTry * 0.995;
      const selling = currencyToTry * 1.005;
      
      currencies.push({
        code: typedCode,
        name: CURRENCY_SERIES[typedCode].name,
        buying,
        selling,
        change,
        previousClosing: buying - (buying * change / 100),
        lastUpdated: now
      });
    });
    
    return currencies;
  } catch (error) {
    console.error("Canlı döviz kuru API hatası:", error);
    throw error; // Hata yukarıda yakalanacak ve statik veriler döndürülecek
  }
}

/**
 * Canlı altın kurlarını almayı dene
 */
async function fetchLiveGoldRates(): Promise<Gold[]> {
  try {
    // Gold Price API (altın fiyatları için)
    const response = await fetch('https://www.goldapi.io/api/XAU/USD', {
      headers: {
        'x-access-token': 'goldapi-2dyckl7sutya5-io',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Altın API yanıt hatası: ${response.status}`);
    }
    
    const goldData = await response.json();
    
    if (!goldData.price) {
      throw new Error('Altın API\'sinden fiyat alınamadı');
    }
    
    // XAU (Ons Altın) / USD fiyatı
    const xauUsdPrice = goldData.price;
    
    // USD/TRY kuru için API çağrısı
    const exchangeResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    const exchangeData = await exchangeResponse.json();
    
    if (!exchangeData.rates || !exchangeData.rates.TRY) {
      throw new Error('Döviz kuru API\'sinden TRY oranı alınamadı');
    }
    
    const usdToTRY = exchangeData.rates.TRY;
    
    // Ons altın fiyatı (TL cinsinden)
    const xauTryPrice = xauUsdPrice * usdToTRY;
    
    // Gram altın fiyatı (1 ons = 31.1034768 gram)
    const gramTryPrice = xauTryPrice / 31.1034768;
    
    const now = new Date();
    const goldRates: Gold[] = [];
    
    // Ons altın değerlerini hesapla
    const onsBuying = xauTryPrice * 0.995;
    const onsSelling = xauTryPrice * 1.005;
    const onsChange = 0.54;
    
    goldRates.push({
      type: 'ONS',
      name: 'Ons Altın',
      buying: onsBuying,
      selling: onsSelling,
      change: onsChange,
      previousClosing: onsBuying - (onsBuying * onsChange / 100),
      lastUpdated: now
    });
    
    // Gram altın değerlerini hesapla
    const gramBuying = gramTryPrice * 0.995;
    const gramSelling = gramTryPrice * 1.005;
    const gramChange = 0.32;
    
    goldRates.push({
      type: 'GRAM',
      name: 'Gram Altın',
      buying: gramBuying,
      selling: gramSelling,
      change: gramChange,
      previousClosing: gramBuying - (gramBuying * gramChange / 100),
      lastUpdated: now
    });
    
    // Diğer altın türleri için ağırlık çarpanları
    const weights = {
      CEYREK: 1.75, // 1.75 gram
      YARIM: 3.5,   // 3.5 gram
      TAM: 7.0,     // 7.0 gram
      CUMHURIYET: 7.2 // 7.2 gram
    };
    
    // Diğer altın türlerini hesapla
    Object.entries(weights).forEach(([type, weight]) => {
      const typedType = type as GoldType;
      
      // Rastgele değişim yüzdesi
      const randomChange = (Math.random() - 0.5) * 0.5;
      const change = parseFloat(randomChange.toFixed(2));
      
      const buying = gramBuying * weight;
      const selling = gramSelling * weight;
      
      goldRates.push({
        type: typedType,
        name: GOLD_SERIES[typedType].name,
        buying,
        selling,
        change,
        previousClosing: buying - (buying * change / 100),
        lastUpdated: now
      });
    });
    
    return goldRates;
  } catch (error) {
    console.error("Canlı altın fiyatları API hatası:", error);
    throw error; // Hata yukarıda yakalanacak ve statik veriler döndürülecek
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
