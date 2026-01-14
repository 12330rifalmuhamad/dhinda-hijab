const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Vouchers...');

    const vouchers = [
        {
            code: 'WELCOME10',
            discount: 10,
            type: 'PERCENTAGE',
            minPurchase: 100000,
            maxDiscount: 20000,
            stock: 100,
            endDate: new Date('2025-12-31'),
            isActive: true,
        },
        {
            code: 'FREESHIP',
            discount: 20000,
            type: 'FLAT',
            minPurchase: 150000,
            stock: 50,
            endDate: new Date('2025-06-30'),
            isActive: true,
        },
        {
            code: 'RAMADHAN',
            discount: 50000,
            type: 'FLAT',
            minPurchase: 500000,
            stock: 10,
            endDate: new Date('2025-04-30'), // Assuming past date for testing expiration or future
            isActive: true,
        }
    ];

    for (const v of vouchers) {
        const exists = await prisma.voucher.findUnique({
            where: { code: v.code }
        });

        if (!exists) {
            await prisma.voucher.create({ data: v });
            console.log(`Created voucher: ${v.code}`);
        } else {
            console.log(`Voucher ${v.code} already exists`);
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
