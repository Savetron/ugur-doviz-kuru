
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          <Button variant="ghost" size="sm">Anasayfa</Button>
          <Button variant="ghost" size="sm">Döviz Kurları</Button>
          <Button variant="ghost" size="sm">Altın Fiyatları</Button>
          <Button variant="ghost" size="sm">Hakkında</Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
