// app/page.js

import ProductCard from "@/components/ProductCard";

// Data produk sementara. Nantinya ini bisa diambil dari database.
const featuredProducts = [
  { id: 1, name: 'Pashmina Silk Premium', price: 75000, imageUrl: 'https://placehold.co/400x600/E2E8F0/4A5568?text=Hijab+1' },
  { id: 2, name: 'Bergo Maryam Diamond', price: 55000, imageUrl: 'https://placehold.co/400x600/E2E8F0/4A5568?text=Hijab+2' },
  { id: 3, name: 'Square Voal Motif', price: 60000, imageUrl: 'https://placehold.co/400x600/E2E8F0/4A5568?text=Hijab+3' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gray-100 py-20 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Elegansi dalam Setiap Helaian</h1>
          <p className="text-lg text-gray-600 mb-8">Temukan hijab yang sempurna untuk melengkapi gayamu di Dhinda Hijab.</p>
          <a href="/produk" className="bg-gray-800 text-white py-3 px-8 rounded-md hover:bg-gray-700 transition-colors text-lg">
            Lihat Koleksi
          </a>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Koleksi Terbaru</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}