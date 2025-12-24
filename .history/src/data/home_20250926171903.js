import { 
  Gem, 
  ShieldCheck, 
  Truck, 
  Heart, 
  Star, 
  Users, 
  Clock,
  Award,
  Sparkles,
  Zap
} from 'lucide-react';

export const mostWantedProducts = [
  { 
    id: '1', 
    name: 'Pashmina Silk Premium', 
    price: 75000, 
    imageUrl: '/img/product-1.png',
    rating: 4.9,
    sold: 1200
  },
  { 
    id: '2', 
    name: 'Bergo Maryam Diamond', 
    price: 55000, 
    imageUrl: '/img/product-2.png',
    rating: 4.8,
    sold: 980
  },
  { 
    id: '3', 
    name: 'Square Voal Motif', 
    price: 60000, 
    imageUrl: '/img/product-3.png',
    rating: 4.7,
    sold: 850
  },
  { 
    id: '4', 
    name: 'Instant Jersey Hijab', 
    price: 85000, 
    imageUrl: '/img/product-4.png',
    rating: 4.9,
    sold: 1500
  },
];

export const categories = [
  { 
    name: 'Pashmina', 
    imageUrl: '/img/pashmina-cat.png', 
    href: '/collections/pashmina',
    description: 'Elegant & Luxurious',
    productCount: 45
  },
  { 
    name: 'Bergo', 
    imageUrl: '/img/bergo-cat.png', 
    href: '/collections/bergo',
    description: 'Comfortable & Stylish',
    productCount: 32
  },
  { 
    name: 'Square', 
    imageUrl: '/img/product-1.png', 
    href: '/collections/square',
    description: 'Versatile & Modern',
    productCount: 28
  },
];

export const features = [
  { 
    icon: <Gem size={32} />, 
    title: 'Bahan Premium', 
    description: 'Kain berkualitas tinggi yang nyaman, ringan, dan tidak menerawang untuk kenyamanan maksimal sepanjang hari.' 
  },
  { 
    icon: <ShieldCheck size={32} />, 
    title: 'Kualitas Terjamin', 
    description: 'Melewati quality control yang ketat untuk memastikan jahitan rapi, sempurna, dan tahan lama.' 
  },
  { 
    icon: <Truck size={32} />, 
    title: 'Pengiriman Cepat', 
    description: 'Pesanan Anda kami proses dan kirimkan secepat mungkin ke seluruh Indonesia dengan tracking real-time.' 
  },
  { 
    icon: <Heart size={32} />, 
    title: 'Customer Care', 
    description: 'Tim customer service kami siap membantu Anda 24/7 untuk memberikan pengalaman berbelanja terbaik.' 
  },
  { 
    icon: <Award size={32} />, 
    title: 'Garansi Kepuasan', 
    description: '100% garansi kepuasan atau uang kembali. Kami percaya pada kualitas produk kami.' 
  },
  { 
    icon: <Sparkles size={32} />, 
    title: 'Desain Eksklusif', 
    description: 'Koleksi terbaru dengan desain eksklusif yang mengikuti tren fashion terkini.' 
  },
];

export const storeLocations = [
  { 
    city: 'Karawang', 
    mall: 'Dhinda Hijab Store (Cabang 1)', 
    address: 'Sukaharja, Telukjambe Timur, Karawang, Jawa Barat 41361',
    phone: '+62 812-3456-7890',
    hours: '09:00 - 21:00'
  },
  { 
    city: 'Cikampek', 
    mall: 'Dhinda Hijab Store (Cabang 2)', 
    address: 'Jl. Sukamanah No.40, Cikampek Bar., Kec. Cikampek, Karawang, Jawa Barat 41373',
    phone: '+62 812-3456-7891',
    hours: '09:00 - 21:00'
  },
  { 
    city: 'Salatiga', 
    mall: 'Dhinda Hijab Store (Cabang 3)', 
    address: 'JHJ9+Q39, Pandean, Suruh, Kec. Suruh, Kabupaten Semarang, Jawa Tengah 50776',
    phone: '+62 812-3456-7892',
    hours: '09:00 - 21:00'
  },
];

export const testimonials = [
  {
    id: 1,
    name: 'Sarah Putri',
    location: 'Jakarta',
    rating: 5,
    comment: 'Kualitas hijab Dhinda sangat memuaskan! Bahan lembut dan tidak mudah kusut. Pelayanan customer service juga sangat responsif.',
    image: '/img/testimonial-1.jpg'
  },
  {
    id: 2,
    name: 'Aisyah Rahman',
    location: 'Bandung',
    rating: 5,
    comment: 'Desainnya sangat trendy dan nyaman dipakai. Sudah belanja beberapa kali dan selalu puas dengan hasilnya.',
    image: '/img/testimonial-2.jpg'
  },
  {
    id: 3,
    name: 'Fatimah Zahra',
    location: 'Surabaya',
    rating: 5,
    comment: 'Pengiriman cepat dan packaging rapi. Produk sesuai dengan yang di foto. Highly recommended!',
    image: '/img/testimonial-3.jpg'
  }
];

export const stats = [
  { number: '50K+', label: 'Pelanggan Setia' },
  { number: '100K+', label: 'Produk Terjual' },
  { number: '4.9', label: 'Rating Pelanggan' },
  { number: '99%', label: 'Kepuasan Pelanggan' }
];