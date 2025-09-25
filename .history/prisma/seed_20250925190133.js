// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Hapus data lama untuk menghindari duplikat saat seeding ulang
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Buat Kategori
  const pashmina = await prisma.category.create({
    data: { name: 'Pashmina' },
  });

  const bergo = await prisma.category.create({
    data: { name: 'Bergo' },
  });

  const square = await prisma.category.create({
    data: { name: 'Square' },
  });

  console.log('Categories created.');

  // Buat Produk
  await prisma.product.createMany({
    data: [
      { name: 'Pashmina Silk Premium', price: 75000, imageUrl: '/img/product-1.png', stock: 100, categoryId: pashmina.id },
      { name: 'Bergo Maryam Diamond', price: 55000, imageUrl: '/img/product-2.png', stock: 150, categoryId: bergo.id },
      { name: 'Square Voal Motif', price: 60000, imageUrl: '/img/product-3.png', stock: 120, categoryId: square.id },
      { name: 'Instant Jersey Hijab', price: 85000, imageUrl: '/img/product-4.png', stock: 80, categoryId: bergo.id },
    ]
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