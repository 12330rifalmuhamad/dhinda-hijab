const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPopup() {
    try {
        const popup = await prisma.popupBanner.findFirst({
            orderBy: { createdAt: 'desc' },
        });
        console.log('Current Popup in DB:', popup);
    } catch (error) {
        console.error('Error fetching popup:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkPopup();
