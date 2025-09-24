// components/ProductCard.js

import Image from 'next/image';

export default function ProductCard({ product }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden group transition-shadow hover:shadow-xl">
      <div className="relative w-full h-72">
        <Image
          src={product.imageUrl}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        <p className="text-gray-600 mt-2">Rp {product.price.toLocaleString('id-ID')}</p>
        <button className="mt-4 w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transition-colors">
          Lihat Detail
        </button>
      </div>
    </div>
  );
}