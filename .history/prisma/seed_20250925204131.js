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

await prisma.product.createMany({
    data: [
        {
            name: 'Pashmina Silk Premium',
            description: 'Pashmina dengan bahan silk premium yang memberikan kesan mewah dan elegan. Nyaman dipakai seharian.',
            price: 75000,
            categoryId: pashminaCategory.id,
            images: {
              create: [ 
                { url: '/img/product-1.png', order: 1 },
                { url: '/img/product-1b.png', order: 2 }, // Contoh gambar kedua
                { url: '/img/product-1c.png', order: 3 }, // Contoh gambar ketiga
              ]
            }
          },
          {
            name: 'Bergo Maryam Diamond',
            description: 'Bergo instan dengan aksen diamond yang cantik, praktis dan cocok untuk gaya kasual maupun formal.',
            price: 55000,
            categoryId: bergoCategory.id,
            images: {
              create: [ 
                { url: '/img/product-2.png', order: 1 },
                { url: '/img/product-2b.png', order: 2 },
              ]
            }
        },
      { name: 'Square Voal Motif', description: 'Hijab segiempat dengan motif eksklusif dan bahan voal premium yang mudah dibentuk.', price: 60000, imageUrl: '/img/product-3.png', stock: 120, categoryId: square.id },
      { name: 'Instant Jersey Hijab', description: 'Hijab instan sporty bahan jersey yang adem dan menyerap keringat.', price: 85000, imageUrl: '/img/product-4.png', stock: 80, categoryId: bergo.id },
    ],
    skipDuplicates: true, // Jika Anda menjalankan seed berulang kali

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