// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Hapus data lama dengan urutan yang benar (dari anak ke induk)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany(); // Hapus gambar dulu
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  
  // Buat Kategori
  const pashmina = await prisma.category.create({ data: { name: 'Pashmina' } });
  const bergo = await prisma.category.create({ data: { name: 'Bergo' } });
  const square = await prisma.category.create({ data: { name: 'Square' } });

  console.log('Categories created.');

  // Gunakan 'create' satu per satu untuk setiap produk
  await prisma.product.create({
    data: {
      name: 'Pashmina Silk Premium',
      description: 'Pashmina dengan bahan silk premium yang memberikan kesan mewah dan elegan. Nyaman dipakai seharian.',
      price: 75000,
      stock: 100,
      categoryId: pashmina.id,
      images: {
        create: [
          { url: '/img/product-1.png' },
          { url: '/img/product-1b.png' },
          { url: '/img/product-1c.png' },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: 'Bergo Maryam Diamond',
      description: 'Bergo instan dengan aksen diamond yang cantik, praktis dan cocok untuk gaya kasual maupun formal.',
      price: 55000,
      stock: 150,
      categoryId: bergo.id,
      images: {
        create: [
          { url: '/img/product-2.png' },
          { url: '/img/product-2b.png' },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: 'Square Voal Motif',
      description: 'Hijab segiempat dengan motif eksklusif dan bahan voal premium yang mudah dibentuk.',
      price: 60000,
      stock: 120,
      categoryId: square.id,
      images: {
        create: [{ url: '/img/product-3.png' }], // Pastikan semua produk punya 'images'
      },
    },
  });

  await prisma.product.create({
    data: {
      name: 'Instant Jersey Hijab',
      description: 'Hijab instan sporty bahan jersey yang adem dan menyerap keringat.',
      price: 85000,
      stock: 80,
      categoryId: bergo.id,
      images: {
        create: [{ url: '/img/product-4.png' }], // Pastikan semua produk punya 'images'
      },
    },
  });

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