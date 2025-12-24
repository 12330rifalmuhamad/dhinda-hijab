import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="container mx-auto px-4 sm:px-6 pt-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[60vh]">
        <Link href="/produk/[id]" className="col-span-2 row-span-2 block relative rounded-lg overflow-hidden group">
          <Image src="/img/hero-main.png" alt="Hero Main" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-black/20"></div>
        </Link>
        <Link href="/produk/[id]" className="block relative rounded-lg overflow-hidden group">
          <Image src="/img/hero-sub1.png" alt="Hero Sub 1" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-black/10"></div>
        </Link>
        <Link href="/produk/[id]" className="block relative rounded-lg overflow-hidden group">
          <Image src="/img/hero-sub2.png" alt="Hero Sub 2" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-black/10"></div>
        </Link>
        <Link href="/produk/[id]" className="col-span-2 block relative rounded-lg overflow-hidden group">
          <Image src="/img/hero-sub3.png" alt="Hero Sub 3" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-black/10"></div>
        </Link>
      </div>
    </section>
  );
}