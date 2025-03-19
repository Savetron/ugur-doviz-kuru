
import { Currency, Gold } from '@/types';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatNumber } from '@/lib/utils';

interface CurrencyCardProps {
  item: Currency | Gold;
  type: 'currency' | 'gold';
}

export const CurrencyCard = ({ item, type }: CurrencyCardProps) => {
  const isPositive = item.change > 0;
  const isNegative = item.change < 0;
  const isNeutral = item.change === 0;
  
  const getColorClass = () => {
    if (isPositive) return 'text-currency-up';
    if (isNegative) return 'text-currency-down';
    return 'text-currency-neutral';
  };
  
  const getIcon = () => {
    if (isPositive) return <ArrowUp className="h-4 w-4 text-currency-up" />;
    if (isNegative) return <ArrowDown className="h-4 w-4 text-currency-down" />;
    return null;
  };
  
  const getBgClass = () => {
    if (type === 'gold') return 'bg-gradient-to-br from-gold-light/10 to-gold/5';
    return 'glass-card';
  };

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-md ${getBgClass()}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">
              {type === 'currency' ? (item as Currency).code : (item as Gold).type}
            </p>
            <h3 className="font-medium text-lg">{item.name}</h3>
          </div>
          
          <div className={`flex items-center ${getColorClass()}`}>
            {getIcon()}
            <span className="text-sm font-medium ml-1">
              {isPositive && '+'}
              {formatNumber(item.change, 2)}%
            </span>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-muted-foreground">Alış</p>
            <p className="font-semibold">{formatNumber(item.buying)} ₺</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Satış</p>
            <p className="font-semibold">{formatNumber(item.selling)} ₺</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
