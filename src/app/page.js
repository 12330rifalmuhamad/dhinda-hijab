
import prisma from '@/lib/prisma';
import HeroSection from '@/components/HeroSection';
import MostWantedSection from '@/components/homepage/MostWantedSection';
import CategoriesSection from '@/components/homepage/CategoriesSection';
import OfflineStoreSection from '@/components/homepage/OfflineStoreSection';
import ShopTheLookSection from '@/components/homepage/ShopTheLookSection';
import ArticlesSection from '@/components/homepage/ArticlesSection'; // Updated import
import FloatingButtons from '@/components/FloatingButtons';

// Helper functions for data fetching
async function getArticles() {
  try {
     return await prisma.article.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' }
     });
  } catch (error) {
     console.error("Gagal mengambil artikel:", error);
     return [];
  }
}
async function getSections() {
  try {
    return await prisma.homeSection.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
  } catch (error) {
    console.error("Gagal mengambil sections:", error);
    return [];
  }
}

async function getProducts() {
  try {
    // Basic product fetch - adjust 'take' based on requirements or user settings later
    return await prisma.product.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: { images: true }
    });
  } catch (error) {
    console.error("Gagal mengambil produk:", error);
    return [];
  }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error("Gagal mengambil kategori:", error);
    return [];
  }
}

export default async function HomePage() {
  const [products, categories, sections, articles] = await Promise.all([
    getProducts(),
    getCategories(),
    getSections(),
    getArticles()
  ]);

  // If no sections defined, fallback to default layout
  if (sections.length === 0) {
     return (
        <main className="relative">
           <HeroSection />
           <MostWantedSection products={products} />
           <CategoriesSection categories={categories} />
           <CategoriesSection categories={categories} />
           <OfflineStoreSection />
           <ArticlesSection articles={articles} />
           <FloatingButtons />
        </main>
     );
  }

  return (
    <main className="relative">
      {sections.map(section => {
        switch(section.type) {
           case 'HERO':
              return <HeroSection key={section.id} />;
           case 'PRODUCT_SLIDER':
              return <MostWantedSection key={section.id} products={products} limit={section.content?.limit} title={section.content?.title} />;
           case 'CATEGORY_GRID':
              return <CategoriesSection key={section.id} categories={categories} title={section.content?.title} />;
           case 'OFFLINE_STORE':
              return <OfflineStoreSection key={section.id} />;
           case 'BANNER':
              return (
                 <div key={section.id} className="w-full relative aspect-[21/9] mb-12">
                     {/* Basic banner implementation - improve as needed */}
                     <div 
                        className="w-full h-full bg-center bg-cover"
                        style={{ backgroundImage: `url(${section.content?.imageUrl})` }}
                     />
                 </div>
              );
            case 'SHOP_THE_LOOK':
              return <ShopTheLookSection key={section.id} section={section} />;
            case 'STORIES':
            case 'ARTICLES': // Support both types for future proofing
              return <ArticlesSection key={section.id} articles={articles} title={section.title} />;
           default:
              return null;
        }
      })}
      <FloatingButtons />
    </main>
  );
}