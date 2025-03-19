
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import ExchangeTable from '@/components/ExchangeTable';
import { CurrencyProvider } from '@/context/CurrencyContext';
import SeoContent from '@/components/SeoContent';

const Index = () => {
  // Sayfa ilk açıldığında yumuşak kaydırma animasyonu
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  return (
    <CurrencyProvider>
      <Helmet>
        <title>Canlı Döviz ve Altın Kurları | Güncel Finansal Veriler</title>
        <meta name="description" content="Türkiye'nin en güncel döviz kurları ve altın fiyatları. USD, EUR, GBP ve diğer para birimlerinin canlı kurlarını takip edin." />
        <link rel="canonical" href="https://dovizkurucanli.com" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "FinancialProduct",
              "name": "Güncel Döviz ve Altın Kurları",
              "description": "Türkiye'nin en hızlı ve güncel döviz kuru ve altın fiyatları takip platformu",
              "provider": {
                "@type": "Organization",
                "name": "dovizkurucanli.com"
              }
            }
          `}
        </script>
      </Helmet>
      
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/50">
        <Header />
        
        {/* Hero Bölümü */}
        <section className="relative pt-32 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium animate-fadeIn">
              Günün En Güncel Verileri
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight animate-slideUp" style={{ animationDelay: "0.1s" }}>
              Güncel Döviz ve Altın Kurları
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-slideUp" style={{ animationDelay: "0.2s" }}>
              Türkiye'nin en hızlı ve güncel döviz kuru ve altın fiyatları takip platformu. 
              Son dakika verileri ile piyasaları izleyin.
            </p>
          </div>
        </section>

        {/* Ana İçerik Bölümü */}
        <main className="flex-1 pb-20 px-4">
          <div className="max-w-7xl mx-auto">
            <ExchangeTable />
            <SeoContent />
          </div>
        </main>

        {/* Altbilgi */}
        <footer className="py-8 px-4 bg-white/50 backdrop-blur-sm border-t">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} dovizkurucanli.com. Tüm hakları saklıdır.
            </p>
            <p className="text-xs mt-2 text-muted-foreground/80">
              Buradaki bilgiler bilgilendirme amaçlıdır, yatırım tavsiyesi değildir.
            </p>
          </div>
        </footer>
      </div>
    </CurrencyProvider>
  );
};

export default Index;
