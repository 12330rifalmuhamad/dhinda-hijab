// src/components/ProductCard.js
import Link from 'next/link';
import Image from 'next/image';

export default function ProductCard({ product }) {
  const hasSale = product.originalPrice && product.originalPrice > product.price;

  return (
    <Link href={`/produk/${product.id}`} className="block group">
      <div className="relative w-full aspect-square bg-gray-100 rounded-md overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.status && (
          <span className="absolute top-3 left-3 bg-white text-text-primary text-xs font-semibold px-3 py-1 rounded-full">
            {product.status}
          </span>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-sm text-text-primary">{product.name}</h3>
        <div className="mt-1 flex items-center gap-x-2">
          <p className="text-sm font-semibold">Rp {product.price.toLocaleString('id-ID')}</p>
          {hasSale && (
            <p className="text-sm text-text-secondary line-through">Rp {product.originalPrice.toLocaleString('id-ID')}</p>
          )}
        </div>
      </div>
    </Link>
  );
}