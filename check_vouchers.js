const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const vouchers = await prisma.voucher.findMany();
    console.log('Vouchers:', JSON.stringify(vouchers, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
