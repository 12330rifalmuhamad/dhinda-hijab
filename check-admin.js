const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const admin = await prisma.user.findUnique({
        where: { email: 'admin@dhinda.com' },
    });
    console.log('Admin user:', admin);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
