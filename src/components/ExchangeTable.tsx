
import { useState } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { Currency, Gold } from '@/types';
import { ArrowDown, ArrowUp, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CurrencyCard } from './CurrencyCard';
import { cn, formatNumber } from '@/lib/utils';

const ExchangeTable = () => {
  const { currencies, goldRates, loading, lastUpdated, refreshData } = useCurrency();
  const [activeTab, setActiveTab] = useState('currency');

  const handleRefresh = () => {
    refreshData();
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Güncelleniyor...';
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const renderTable = (items: Currency[] | Gold[], type: 'currency' | 'gold') => (
    <div className="overflow-hidden rounded-lg border bg-white/50 backdrop-blur-sm shadow-sm animate-fadeIn">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="table-header">
                {type === 'currency' ? 'Döviz Kodu' : 'Altın Türü'}
              </th>
              <th className="table-header">İsim</th>
              <th className="table-header">Alış</th>
              <th className="table-header">Satış</th>
              <th className="table-header">Değişim</th>
            </tr>
          </thead>
          <tbody className="divide-y staggered-fade-in">
            {items.map((item, index) => {
              const isPositive = item.change > 0;
              const isNegative = item.change < 0;
              const changeColorClass = isPositive
                ? 'text-currency-up'
                : isNegative
                ? 'text-currency-down'
                : 'text-currency-neutral';

              return (
                <tr 
                  key={type === 'currency' ? (item as Currency).code : (item as Gold).type}
                  className="bg-white hover:bg-muted/20 transition-colors"
                >
                  <td className="table-cell font-medium">
                    {type === 'currency' ? (item as Currency).code : (item as Gold).type}
                  </td>
                  <td className="table-cell">{item.name}</td>
                  <td className="table-cell">{formatNumber(item.buying)} ₺</td>
                  <td className="table-cell">{formatNumber(item.selling)} ₺</td>
                  <td className={cn("table-cell flex items-center", changeColorClass)}>
                    {isPositive && <ArrowUp className="mr-1 h-4 w-4" />}
                    {isNegative && <ArrowDown className="mr-1 h-4 w-4" />}
                    {isPositive && '+'}
                    {formatNumber(item.change, 2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCards = (items: Currency[] | Gold[], type: 'currency' | 'gold') => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 staggered-fade-in">
      {items.map((item) => (
        <CurrencyCard
          key={type === 'currency' ? (item as Currency).code : (item as Gold).type}
          item={item}
          type={type}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight mb-1">
            Güncel Piyasa Verileri
          </h2>
          <p className="text-sm text-muted-foreground">
            Son güncelleme: {formatDate(lastUpdated)}
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          size="sm"
          disabled={loading}
          className="min-w-[100px]"
        >
          {loading ? (
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Yenile
        </Button>
      </div>

      <Tabs defaultValue="currency" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:inline-flex mb-4">
          <TabsTrigger value="currency">Döviz Kurları</TabsTrigger>
          <TabsTrigger value="gold">Altın Fiyatları</TabsTrigger>
          <TabsTrigger value="table">Tablo Görünümü</TabsTrigger>
          <TabsTrigger value="cards">Kart Görünümü</TabsTrigger>
        </TabsList>

        <TabsContent value="currency" className="pt-2 animate-fadeIn">
          {activeTab === 'table' || activeTab === 'currency' 
            ? renderTable(currencies, 'currency') 
            : renderCards(currencies, 'currency')}
        </TabsContent>

        <TabsContent value="gold" className="pt-2 animate-fadeIn">
          {activeTab === 'table' || activeTab === 'gold' 
            ? renderTable(goldRates, 'gold') 
            : renderCards(goldRates, 'gold')}
        </TabsContent>

        <TabsContent value="table" className="pt-2 animate-fadeIn">
          {activeTab === 'currency' || activeTab === 'table' 
            ? renderTable(currencies, 'currency') 
            : renderTable(goldRates, 'gold')}
        </TabsContent>

        <TabsContent value="cards" className="pt-2 animate-fadeIn">
          {activeTab === 'currency' || activeTab === 'cards' 
            ? renderCards(currencies, 'currency') 
            : renderCards(goldRates, 'gold')}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExchangeTable;
