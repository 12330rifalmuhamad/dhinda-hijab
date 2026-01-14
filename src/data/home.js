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
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1312461204/cld-sample.jpg',
    rating: 4.9,
    sold: 1200
  },
  {
    id: '2',
    name: 'Bergo Maryam Diamond',
    price: 55000,
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1312461204/cld-sample-2.jpg',
    rating: 4.8,
    sold: 980
  },
  {
    id: '3',
    name: 'Square Voal Motif',
    price: 60000,
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1312461204/cld-sample-3.jpg',
    rating: 4.7,
    sold: 850
  },
  {
    id: '4',
    name: 'Instant Jersey Hijab',
    price: 85000,
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1312461204/cld-sample-4.jpg',
    rating: 4.9,
    sold: 1500
  },
];

export const categories = [
  {
    name: 'Pashmina',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1312461204/cld-sample.jpg',
    href: '/collections/pashmina',
    description: 'Elegant & Luxurious',
    productCount: 45
  },
  {
    name: 'Bergo',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1312461204/cld-sample-2.jpg',
    href: '/collections/bergo',
    description: 'Comfortable & Stylish',
    productCount: 32
  },
  {
    name: 'Square',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1312461204/cld-sample-3.jpg',
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
    hours: '09:00 - 21:00',
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15863.665991807353!2d107.2917243!3d-6.2748742!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69775e7a9f7331%3A0x6295555c8230553!2sSukaharja%2C%20Telukjambe%20Timur%2C%20Karawang%20Regency%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1650000000000!5m2!1sen!2sid"
  },
  {
    city: 'Cikampek',
    mall: 'Dhinda Hijab Store (Cabang 2)',
    address: 'Jl. Sukamanah No.40, Cikampek Bar., Kec. Cikampek, Karawang, Jawa Barat 41373',
    phone: '+62 812-3456-7891',
    hours: '09:00 - 21:00',
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.341477755702!2d107.4528993!3d-6.4024546!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6973e32ef5b4b1%3A0x6001007996515549!2sCikampek%2C%20Karawang%20Regency%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1650000000000!5m2!1sen!2sid"
  },
  {
    city: 'Salatiga',
    mall: 'Dhinda Hijab Store (Cabang 3)',
    address: 'JHJ9+Q39, Pandean, Suruh, Kec. Suruh, Kabupaten Semarang, Jawa Tengah 50776',
    phone: '+62 812-3456-7892',
    hours: '09:00 - 21:00',
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.266205937815!2d110.5084366!3d-7.3238993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a7833116e0a57%3A0x2424422201991!2sSalatiga%2C%20Salatiga%20City%2C%20Central%20Java!5e0!3m2!1sen!2sid!4v1650000000000!5m2!1sen!2sid"
  },
  {
    city: 'Bandung',
    mall: 'Dhinda Hijab Store (Cabang 4)',
    address: 'Jl. Riau No. 123, Bandung Wetan, Kota Bandung, Jawa Barat 40115',
    phone: '+62 812-3456-7893',
    hours: '10:00 - 22:00',
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.56347617!2d107.573117!3d-6.9034443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6398252477f%3A0x146a1f93d3e815b2!2sBandung%2C%20Bandung%20City%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1650000000000!5m2!1sen!2sid"
  },
];

export const testimonials = [
  {
    id: 1,
    name: 'Sarah Putri',
    location: 'Jakarta',
    rating: 5,
    comment: 'Kualitas hijab Dhinda sangat memuaskan! Bahan lembut dan tidak mudah kusut. Pelayanan customer service juga sangat responsif.',
    image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/cld-sample-5.jpg'
  },
  {
    id: 2,
    name: 'Aisyah Rahman',
    location: 'Bandung',
    rating: 5,
    comment: 'Desainnya sangat trendy dan nyaman dipakai. Sudah belanja beberapa kali dan selalu puas dengan hasilnya.',
    image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/cld-sample-4.jpg'
  },
  {
    id: 3,
    name: 'Fatimah Zahra',
    location: 'Surabaya',
    rating: 5,
    comment: 'Pengiriman cepat dan packaging rapi. Produk sesuai dengan yang di foto. Highly recommended!',
    image: 'https://res.cloudinary.com/demo/image/upload/v1312461204/cld-sample.jpg'
  }
];

export const stats = [
  { number: '50K+', label: 'Pelanggan Setia' },
  { number: '100K+', label: 'Produk Terjual' },
  { number: '4.9', label: 'Rating Pelanggan' },
  { number: '99%', label: 'Kepuasan Pelanggan' }
];