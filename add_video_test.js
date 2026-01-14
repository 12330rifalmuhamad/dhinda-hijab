const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addVideoToProduct() {
    try {
        const product = await prisma.product.findFirst();
        if (product) {
            console.log(`Updating product: ${product.name} (${product.id})`);
            // Use a sample video (e.g., from Cloudinary or a public stock video)
            // Using a reliable sample MP4
            const sampleVideo = "https://res.cloudinary.com/demo/video/upload/v1642805293/samples/elephants.mp4";

            await prisma.product.update({
                where: { id: product.id },
                data: { videoUrl: sampleVideo }
            });
            console.log('Successfully added video URL to product.');
        } else {
            console.log('No products found to update.');
        }
    } catch (error) {
        console.error('Error updating product:', error);
    } finally {
        await prisma.$disconnect();
    }
}

addVideoToProduct();
