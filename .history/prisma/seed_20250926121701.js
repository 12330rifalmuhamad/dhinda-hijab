const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Hapus data lama dengan urutan yang benar
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  
  // Buat Kategori
  const pashmina = await prisma.category.create({ data: { name: 'Pashmina' } });
  const bergo = await prisma.category.create({ data: { name: 'Bergo' } });
  const square = await prisma.category.create({ data: { name: 'Square' } });
  console.log('Categories created.');

  // Buat Produk dengan gambar
  await prisma.product.create({
    data: {
      name: 'Pashmina Silk Premium',
      description: 'Pashmina dengan bahan silk premium yang mewah.',
      price: 75000,
      stock: 100,
      category: { connect: { id: pashmina.id } },
      images: {
        create: [ { url: '/img/product-1.png' }, { url: '/img/product-1b.png' } ],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: 'Bergo Maryam Diamond',
      description: 'Bergo praktis dengan bahan diamond crepe.',
      price: 55000,
      stock: 150,
      category: { connect: { id: bergo.id } },
      images: {
        create: [{ url: '/img/product-2.png' }],
      },
    },
  });

  await prisma.product.create({
    data: {
      name: 'Square Voal Motif',
      description: 'Hijab segiempat dengan motif eksklusif.',
      price: 60000,
      stock: 120,
      category: { connect: { id: square.id } },
      images: {
        create: [{ url: '/img/product-3.png' }],
      },
    },
  });

  console.log('Products created.');
  console.log('Seeding finished.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });