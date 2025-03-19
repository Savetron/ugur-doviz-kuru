
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchCurrencyRates, fetchGoldRates } from '@/services/api';
import { Currency, Gold, CurrencyContextType } from '@/types';
import { toast } from '@/components/ui/use-toast';

const CurrencyContext = createContext<CurrencyContextType>({
  currencies: [],
  goldRates: [],
  loading: false,
  error: null,
  lastUpdated: null,
  refreshData: async () => {},
});

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [goldRates, setGoldRates] = useState<Gold[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const refreshData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [currencyData, goldData] = await Promise.all([
        fetchCurrencyRates(),
        fetchGoldRates()
      ]);
      
      setCurrencies(currencyData);
      setGoldRates(goldData);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Veriler alınamadı';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Veri güncelleme hatası",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    
    // Her 5 dakikada bir otomatik güncelleme
    const intervalId = setInterval(refreshData, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <CurrencyContext.Provider value={{ currencies, goldRates, loading, error, lastUpdated, refreshData }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
