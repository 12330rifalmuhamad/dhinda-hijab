import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export default function ProductGrid({ title, products }) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/collections" className="bg-gray-800 text-white font-semibold py-3 px-12 rounded-md hover:bg-gray-700 transition-colors">
            Lihat Semua Produk
          </Link>
        </div>
      </div>
    </section>
  );
}