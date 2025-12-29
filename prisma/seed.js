const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');
  
  // 1. Membersihkan database dengan urutan yang benar
  console.log('Cleaning old data...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // 2. Membuat Kategori
  console.log('Creating categories...');
  const pashmina = await prisma.category.create({ data: { name: 'Pashmina' } });
  const bergo = await prisma.category.create({ data: { name: 'Bergo' } });
  const square = await prisma.category.create({ data: { name: 'Square' } });
  const instant = await prisma.category.create({ data: { name: 'Instant' } });
  console.log('Categories created.');

  // 3. Menyiapkan data produk
  const productsToCreate = [
    // Pashmina (5)
    {
      name: 'Pashmina Silk Premium',
      description: 'Pashmina mewah dengan bahan silk yang lembut, jatuh, dan mudah diatur.',
      price: 75000,
      stock: 120,
      categoryId: pashmina.id,
      images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg']
    },
    {
      name: 'Pashmina Crinkle Airflow',
      description: 'Pashmina anti kusut dengan bahan airflow crinkle yang ringan dan adem.',
      price: 58000,
      stock: 200,
      categoryId: pashmina.id,
      images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg']
    },
    {
      name: 'Pashmina Plisket Full',
      description: 'Pashmina dengan detail plisket penuh yang memberikan volume dan tekstur unik.',
      price: 65000,
      stock: 150,
      categoryId: pashmina.id,
      images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg']
    },
    {
      name: 'Pashmina Inner 2-in-1',
      description: 'Solusi praktis pashmina yang sudah menyatu dengan inner, anti ribet.',
      price: 89000,
      stock: 80,
      categoryId: pashmina.id,
      images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg']
    },
    {
      name: 'Pashmina Ceruty Baby Doll',
      description: 'Bahan ceruty baby doll klasik yang flowy dan elegan untuk acara formal.',
      price: 49000,
      stock: 300,
      categoryId: pashmina.id,
      images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg']
    },
    // Bergo (5)
    {
      name: 'Bergo Maryam Diamond',
      description: 'Bergo non-pad praktis dengan tali, bahan diamond crepe yang nyaman.',
      price: 55000,
      stock: 180,
      categoryId: bergo.id,
      images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg']
    },
    {
      name: 'Bergo Hamidah Jersey',
      description: 'Bergo daily favorit dengan bahan jersey premium yang adem dan stretch.',
      price: 62000,
      stock: 250,
      categoryId: bergo.id,
      images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg']
    },
    {
      name: 'Bergo Plisket Tali',
      description: 'Bergo plisket dengan tali yang membuat tampilan lebih manis dan rapi.',
      price: 68000,
      stock: 110,
      categoryId: bergo.id,
      images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg']
    },
    {
      name: 'Bergo Sporty Pendek',
      description: 'Cocok untuk olahraga atau aktivitas outdoor, bahan menyerap keringat.',
      price: 45000,
      stock: 130,
      categoryId: bergo.id,
      images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg']
    },
    {
      name: 'Bergo Syar\'i Jumbo',
      description: 'Bergo panjang dan lebar menutupi dada dengan bahan wolfis yang tidak menerawang.',
      price: 95000,
      stock: 70,
      categoryId: bergo.id,
      images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg']
    },
    // Square (5)
    {
      name: 'Square Voal Motif',
      description: 'Hijab segiempat dengan motif eksklusif dan bahan voal premium yang mudah dibentuk.',
      price: 60000,
      stock: 160,
      categoryId: square.id,
      images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg']
    },
    {
      name: 'Paris Premium Jahit Tepi',
      description: 'Paris jadul versi premium, lebih tegak di dahi dengan jahitan tepi rapi.',
      price: 35000,
      stock: 400,
      categoryId: square.id,
      images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg']
    },
    {
      name: 'Bella Square Polycotton',
      description: 'Hijab segiempat basic yang wajib punya, bahan polycotton ringan dan nyaman.',
      price: 25000,
      stock: 500,
      categoryId: square.id,
      images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg']
    },
    {
      name: 'Corn Skin Square',
      description: 'Hijab dengan tekstur unik seperti kulit jagung, anti letoy dan mudah diatur.',
      price: 40000,
      stock: 180,
      categoryId: square.id,
      images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg']
    },
    {
      name: 'Satin Silk Square',
      description: 'Memberikan kesan mewah dan glowing, cocok untuk pesta atau acara formal.',
      price: 55000,
      stock: 90,
      categoryId: square.id,
      images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg']
    },
    // Instant (5)
    {
      name: 'Instant Jersey Hijab',
      description: 'Hijab instan sporty bahan jersey yang adem dan menyerap keringat.',
      price: 85000,
      stock: 100,
      categoryId: instant.id,
      images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg']
    },
    {
      name: 'Turban Instan Spandex',
      description: 'Turban stylish yang langsung pakai, bahan spandek yang pas di kepala.',
      price: 50000,
      stock: 75,
      categoryId: instant.id,
      images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg']
    },
    {
      name: 'Khimar Instan Ceruty',
      description: 'Khimar syar\'i 2 layer dengan bahan ceruty yang flowy dan tidak berat.',
      price: 110000,
      stock: 60,
      categoryId: instant.id,
      images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg']
    },
    {
      name: 'Hijab Instan Hoodie',
      description: 'Gaya unik hijab instan seperti hoodie, cocok untuk tampilan kasual modern.',
      price: 78000,
      stock: 85,
      categoryId: instant.id,
      images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg']
    },
    {
      name: 'Inner Ninja Resleting',
      description: 'Ciput ninja dengan resleting di belakang, memudahkan pemakaian dan lebih rapi.',
      price: 30000,
      stock: 200,
      categoryId: instant.id,
      images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg']
    },
  ];

  // 4. Membuat produk dan gambar-gambarnya dalam satu transaksi
  console.log('Creating products...');
  for (const productData of productsToCreate) {
    const { images, ...restOfData } = productData;
    await prisma.product.create({
      data: {
        ...restOfData,
        images: {
          create: images.map(url => ({ url })),
        },
      },
    });
  }
  console.log('Products created.');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });