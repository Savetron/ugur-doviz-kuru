
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Info, ArrowRight } from 'lucide-react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to section functions
  const scrollToHome = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const scrollToExchangeRates = () => {
    const exchangeSection = document.querySelector('.exchange-table-section');
    if (exchangeSection) {
      exchangeSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToGoldPrices = () => {
    const goldSection = document.querySelector('.gold-prices-section');
    if (goldSection) {
      goldSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToAbout = () => {
    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-primary font-semibold text-xl tracking-tight">
            Canlı Döviz Kuru
          </div>
        </div>

        <nav className="flex items-center space-x-1">
          <Button onClick={scrollToHome} variant="ghost" size="sm">Anasayfa</Button>
          <Button onClick={scrollToExchangeRates} variant="ghost" size="sm">Döviz Kurları</Button>
          <Button onClick={scrollToGoldPrices} variant="ghost" size="sm">Altın Fiyatları</Button>
          <Button onClick={scrollToAbout} variant="ghost" size="sm" className="flex items-center gap-1">
            <Info className="h-4 w-4" />
            Hakkında
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
