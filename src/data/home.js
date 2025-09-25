import { Gem, ShieldCheck, Truck } from 'lucide-react';

export const mostWantedProducts = [
  { id: '1', name: 'Pashmina Silk Premium', price: '75.000', imageUrl: '/img/product-1.png' },
  { id: '2', name: 'Bergo Maryam Diamond', price: '55.000', imageUrl: '/img/product-2.png' },
  { id: '3', name: 'Square Voal Motif', price: '60.000', imageUrl: '/img/product-3.png' },
  { id: '4', name: 'Instant Jersey Hijab', price: '85.000', imageUrl: '/img/product-4.png' },
];

export const categories = [
  { name: 'Pashmina', imageUrl: '/img/pashmina-cat.png', href: '/collections/pashmina' },
  { name: 'Bergo', imageUrl: '/img/bergo-cat.png', href: '/collections/bergo' },
  { name: 'Square', imageUrl: '/img/square-cat.png', href: '/collections/square' },
];

export const features = [
  { icon: <Gem size={32} />, title: 'Bahan Premium', description: 'Kain berkualitas tinggi yang nyaman, ringan, dan tidak menerawang.' },
  { icon: <ShieldCheck size={32} />, title: 'Kualitas Terjamin', description: 'Melewati quality control yang ketat untuk memastikan jahitan rapi dan sempurna.' },
  { icon: <Truck size={32} />, title: 'Pengiriman Cepat', description: 'Pesanan Anda kami proses dan kirimkan secepat mungkin ke seluruh Indonesia.' },
];

export const storeLocations = [
  { city: 'Karawang', mall: 'Dhinda Hijab Store (Cabang 1)', address: 'Sukaharja, Telukjambe Timur, Karawang, Jawa Barat 41361' },
  { city: 'Cikampek', mall: 'Dhinda Hijab Store (Cabang 2)', address: 'Jl. Sukamanah No.40, Cikampek Bar., Kec. Cikampek, Karawang, Jawa Barat 41373' },
  { city: 'Salatiga', mall: 'Dhinda Hijab Store (Cabang 3)', address: 'JHJ9+Q39, Pandean, Suruh, Kec. Suruh, Kabupaten Semarang, Jawa Tengah 50776' },
];