import { Currency, Gold, CurrencyCode, GoldType } from '@/types';

const API_KEY = 'Gb50fN0Jc6'; // TCMB API anahtarı
const EVDS_BASE_URL = 'https://evds2.tcmb.gov.tr/service/evds';

// Döviz kurları için EVDS serisi kodları
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

// Altın fiyatları için EVDS serisi kodları
const GOLD_SERIES = {
  ONS: { buying: 'TP.FG.A01', selling: 'TP.FG.S01', name: 'Ons Altın' },
  GRAM: { buying: 'TP.FG.A02', selling: 'TP.FG.S02', name: 'Gram Altın' },
  CEYREK: { buying: 'TP.FG.A03', selling: 'TP.FG.S03', name: 'Çeyrek Altın' },
  YARIM: { buying: 'TP.FG.A04', selling: 'TP.FG.S04', name: 'Yarım Altın' },
  TAM: { buying: 'TP.FG.A05', selling: 'TP.FG.S05', name: 'Tam Altın' },
  CUMHURIYET: { buying: 'TP.FG.A06', selling: 'TP.FG.S06', name: 'Cumhuriyet Altını' },
};

// Örnek veriler (API bağlantısı kurulana kadar test için)
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
 * Belirtilen tarihteki verileri EVDS API'sinden çeker
 */
async function fetchEvdsData(seriesCodes: string[], startDate: string, endDate: string = startDate): Promise<any> {
  try {
    const seriesParam = seriesCodes.join('-');
    const url = `${EVDS_BASE_URL}/series=${seriesParam}&startDate=${startDate}&endDate=${endDate}&type=json&key=${API_KEY}`;
    
    console.log('TCMB EVDS API çağrısı:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`EVDS API yanıt hatası: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.totalCount === 0 || !data.items || data.items.length === 0) {
      throw new Error('EVDS API\'den veri alınamadı veya boş veri döndü');
    }
    
    return data;
  } catch (error) {
    console.error("EVDS veri çekme hatası:", error);
    throw error;
  }
}

/**
 * TCMB API'den döviz verilerini çeker
 */
export async function fetchCurrencyRates(): Promise<Currency[]> {
  try {
    // Son 3 günü kontrol et (hafta sonu veya tatil olabilir)
    const today = new Date();
    const dates = [
      formatDateForEvds(today),
      formatDateForEvds(new Date(today.setDate(today.getDate() - 1))),
      formatDateForEvds(new Date(today.setDate(today.getDate() - 1)))
    ];
    
    // Her para birimi için alış ve satış serilerini birleştir
    const allSeries: string[] = [];
    Object.values(CURRENCY_SERIES).forEach(series => {
      allSeries.push(series.buying, series.selling);
    });
    
    // En son tarihten başlayarak veri çekmeyi dene
    let evdsData = null;
    let usedDate = '';
    
    for (const date of dates) {
      try {
        evdsData = await fetchEvdsData(allSeries, date);
        usedDate = date;
        break; // Başarılı olduysa döngüden çık
      } catch (err) {
        console.log(`${date} için veri yok, önceki tarihi deniyorum...`);
        // Hata aldıysak bir önceki günü deneyelim
      }
    }
    
    if (!evdsData) {
      console.error("Son 3 günün verileri çekilemedi, örnek verilere dönülüyor");
      return SAMPLE_CURRENCIES;
    }
    
    const currencies: Currency[] = [];
    const latestData = evdsData.items[0]; // En son gün verisi
    
    // Bir önceki günü bul
    let prevData = null;
    if (evdsData.items.length > 1) {
      prevData = evdsData.items[1];
    }
    
    // Her döviz için veri çıkar
    Object.entries(CURRENCY_SERIES).forEach(([code, series]) => {
      const buyingKey = series.buying.replace('TP.', '');
      const sellingKey = series.selling.replace('TP.', '');
      
      if (latestData[buyingKey] && latestData[sellingKey]) {
        const buying = parseFloat(latestData[buyingKey]);
        const selling = parseFloat(latestData[sellingKey]);
        let change = 0;
        let previousClosing = undefined;
        
        // Değişim yüzdesini hesapla
        if (prevData && prevData[buyingKey]) {
          const prevBuying = parseFloat(prevData[buyingKey]);
          previousClosing = prevBuying;
          change = ((buying - prevBuying) / prevBuying) * 100;
        }
        
        currencies.push({
          code: code as CurrencyCode,
          name: series.name,
          buying,
          selling, 
          change,
          previousClosing,
          lastUpdated: new Date()
        });
      }
    });
    
    return currencies.length > 0 ? currencies : SAMPLE_CURRENCIES;
  } catch (error) {
    console.error("Döviz kurları çekme hatası:", error);
    // Hata durumunda örnek verileri kullan
    return SAMPLE_CURRENCIES;
  }
}

/**
 * TCMB API'den altın verilerini çeker
 */
export async function fetchGoldRates(): Promise<Gold[]> {
  try {
    // Son 3 günü kontrol et (hafta sonu veya tatil olabilir)
    const today = new Date();
    const dates = [
      formatDateForEvds(today),
      formatDateForEvds(new Date(today.setDate(today.getDate() - 1))),
      formatDateForEvds(new Date(today.setDate(today.getDate() - 1)))
    ];
    
    // Her altın türü için alış ve satış serilerini birleştir
    const allSeries: string[] = [];
    Object.values(GOLD_SERIES).forEach(series => {
      allSeries.push(series.buying, series.selling);
    });
    
    // En son tarihten başlayarak veri çekmeyi dene
    let evdsData = null;
    let usedDate = '';
    
    for (const date of dates) {
      try {
        evdsData = await fetchEvdsData(allSeries, date);
        usedDate = date;
        break; // Başarılı olduysa döngüden çık
      } catch (err) {
        console.log(`${date} için altın verisi yok, önceki tarihi deniyorum...`);
        // Hata aldıysak bir önceki günü deneyelim
      }
    }
    
    if (!evdsData) {
      console.error("Son 3 günün altın verileri çekilemedi, örnek verilere dönülüyor");
      return SAMPLE_GOLD;
    }
    
    const goldRates: Gold[] = [];
    const latestData = evdsData.items[0]; // En son gün verisi
    
    // Bir önceki günü bul
    let prevData = null;
    if (evdsData.items.length > 1) {
      prevData = evdsData.items[1];
    }
    
    // Her altın türü için veri çıkar
    Object.entries(GOLD_SERIES).forEach(([type, series]) => {
      const buyingKey = series.buying.replace('TP.', '');
      const sellingKey = series.selling.replace('TP.', '');
      
      if (latestData[buyingKey] && latestData[sellingKey]) {
        const buying = parseFloat(latestData[buyingKey]);
        const selling = parseFloat(latestData[sellingKey]);
        let change = 0;
        let previousClosing = undefined;
        
        // Değişim yüzdesini hesapla
        if (prevData && prevData[buyingKey]) {
          const prevBuying = parseFloat(prevData[buyingKey]);
          previousClosing = prevBuying;
          change = ((buying - prevBuying) / prevBuying) * 100;
        }
        
        goldRates.push({
          type: type as GoldType,
          name: series.name,
          buying,
          selling, 
          change,
          previousClosing,
          lastUpdated: new Date()
        });
      }
    });
    
    return goldRates.length > 0 ? goldRates : SAMPLE_GOLD;
  } catch (error) {
    console.error("Altın fiyatları çekme hatası:", error);
    // Hata durumunda örnek verileri kullan
    return SAMPLE_GOLD;
  }
}

/**
 * Tarihi EVDS API formatına dönüştürür (GG-AA-YYYY)
 */
function formatDateForEvds(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Alternatif API'den döviz verilerini çeker (yedek çözüm)
 */
async function fetchAlternativeCurrencyRates(): Promise<Currency[]> {
  try {
    // Alternatif API'den veri çekme (API bağlanamama durumunda)
    const response = await fetch('https://api.exchangerate.host/latest?base=TRY');
    const data = await response.json();
    
    if (!data.rates) {
      throw new Error('Alternatif API\'den veri alınamadı');
    }
    
    const currencies: Currency[] = [];
    const validCodes: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'CHF', 'JPY', 'CAD', 'AUD', 'RUB'];
    
    validCodes.forEach(code => {
      if (data.rates[code]) {
        // Döviz çevirisini TL bazına çevir
        const rate = 1 / data.rates[code];
        
        // Alış ve satış fiyatı için yaklaşık değerler
        const avgRate = rate;
        const buying = avgRate * 0.99; // %1 alış farkı
        const selling = avgRate * 1.01; // %1 satış farkı
        
        currencies.push({
          code,
          name: CURRENCY_SERIES[code].name,
          buying,
          selling,
          change: 0, // Alternatif API'de değişim verisi yok
          lastUpdated: new Date()
        });
      }
    });
    
    return currencies.length > 0 ? currencies : SAMPLE_CURRENCIES;
  } catch (error) {
    console.error("Alternatif API'den veri çekme hatası:", error);
    return SAMPLE_CURRENCIES;
  }
}
