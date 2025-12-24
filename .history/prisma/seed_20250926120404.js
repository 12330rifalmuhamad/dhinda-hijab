// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Hapus data lama
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  
  // Buat Kategori
  const pashmina = await prisma.category.create({ data: { name: 'Pashmina' } });
  const bergo = await prisma.category.create({ data: { name: 'Bergo' } });
  const square = await prisma.category.create({ data: { name: 'Square' } });
  console.log('Categories created.');

  // Buat Produk dengan gambar-gambarnya
  await prisma.product.create({
    data: {
      name: 'Pashmina Silk Premium',
      description: 'Pashmina dengan bahan silk premium yang mewah.',
      price: 75000,
      category: { connect: { id: pashmina.id } },
      images: {
        create: [
          { url: '/img/product-1.png' },
          { url: '/img/product-1b.png' },
        ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: 'Bergo Maryam Diamond',
      description: 'Bergo praktis dengan bahan diamond crepe.',
      price: 55000,
      category: { connect: { id: bergo.id } },
      images: {
        create: [{ url: '/img/product-2.png' }],
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