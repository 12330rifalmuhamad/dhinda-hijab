import Image from 'next/image';
import Link from 'next/link';

// Terima 'products' sebagai prop dari page.js
export default function HeroSection({ products }) {
  // Pengecekan untuk memastikan data cukup untuk ditampilkan
  if (!products || products.length < 4) {
    // Tampilkan fallback atau jangan render apa-apa jika data tidak cukup
    return (
      <section className="container mx-auto px-4 sm:px-6 pt-8">
        <div className="h-[60vh] bg-gray-200 rounded-lg flex items-center justify-center">
          <p>Gagal memuat produk hero.</p>
        </div>
      </section>
    );
  }

  // Fungsi bantuan untuk mendapatkan URL gambar dengan aman
  const getImageUrl = (product) => (product.images && product.images.length > 0 ? product.images[0].url : '/img/placeholder.png');

  return (
    <section className="container mx-auto px-4 sm:px-6 pt-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[60vh]">
        
        {/* Link & Gambar dinamis ke produk pertama */}
        <Link href={`/produk/${products[0].id}`} className="col-span-2 row-span-2 block relative rounded-lg overflow-hidden group">
          <Image src={getImageUrl(products[0])} alt={products[0].name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" priority />
          <div className="absolute inset-0 bg-black/20"></div>
        </Link>
        
        {/* Link & Gambar dinamis ke produk kedua */}
        <Link href={`/produk/${products[1].id}`} className="block relative rounded-lg overflow-hidden group">
          <Image src={getImageUrl(products[1])} alt={products[1].name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-black/10"></div>
        </Link>
        
        {/* Link & Gambar dinamis ke produk ketiga */}
        <Link href={`/produk/${products[2].id}`} className="block relative rounded-lg overflow-hidden group">
          <Image src={getImageUrl(products[2])} alt={products[2].name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-black/10"></div>
        </Link>
        
        {/* Link & Gambar dinamis ke produk keempat */}
        <Link href={`/produk/${products[3].id}`} className="col-span-2 block relative rounded-lg overflow-hidden group">
          <Image src={getImageUrl(products[3])} alt={products[3].name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-black/10"></div>
        </Link>

      </div>
    </section>
  );
}