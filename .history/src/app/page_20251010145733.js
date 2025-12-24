// src/app/page.js
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';

// Data Sampel untuk Tampilan
const featuredProducts = [
  { id: '1', name: 'VISCOSE PRINTED MODAL CLAY MARBLE', price: 189000, originalPrice: 229000, imageUrl: '/img/product-1.png', status: 'SOLD OUT' },
  { id: '2', name: 'VISCOSE PRINTED MODAL BROWN KEFFIYEH', price: 189000, originalPrice: 229000, imageUrl: '/img/product-2.png', status: 'ON SALE' },
  { id: '3', name: 'VISCOSE PRINTED MODAL SUNSET', price: 189000, originalPrice: 229000, imageUrl: '/img/product-3.png', status: 'SOLD OUT' },
  { id: '4', name: 'VISCOSE PRINTED MODAL SUMMER FLORAL', price: 189000, originalPrice: 229000, imageUrl: '/img/product-4.png', status: 'ON SALE' },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />

        {/* Featured Collection Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-center text-2xl font-semibold tracking-widest mb-10">PRINTED PERFECTION</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-12">
              <button className="bg-accent hover:bg-accent-hover text-white font-semibold py-3 px-12 rounded-md transition-colors">
                VIEW ALL PRODUCTS
              </button>
            </div>
          </div>
        </section>
        
        {/* Anda bisa menambahkan section "Shop The Look" di sini nanti */}

      </main>
      <Footer />
    </>
  );
}