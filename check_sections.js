const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const sections = await prisma.homeSection.findMany({
            orderBy: { order: 'asc' },
        });
        console.log('Total sections:', sections.length);
        sections.forEach(s => {
            console.log(`- Type: ${s.type}, IsActive: ${s.isActive}, Content:`, s.content);
        });

        const categories = await prisma.category.findMany();
        console.log('Total categories:', categories.length);
        categories.forEach(c => console.log(`- Category: ${c.name}, Image: ${c.imageUrl}`));

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
