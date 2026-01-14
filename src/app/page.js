
import prisma from '@/lib/prisma';
import HeroSection from '@/components/HeroSection';
import MostWantedSection from '@/components/homepage/MostWantedSection';
import CategoriesSection from '@/components/homepage/CategoriesSection';
import OfflineStoreSection from '@/components/homepage/OfflineStoreSection';
import ShopTheLookSection from '@/components/homepage/ShopTheLookSection';
import ArticlesSection from '@/components/homepage/ArticlesSection';
import TestimonySection from '@/components/homepage/TestimonySection';
import GallerySection from '@/components/homepage/GallerySection';
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

async function getBestSellerProducts() {
  try {
    return await prisma.product.findMany({
      where: { isBestSeller: true },
      take: 8,
      orderBy: { updatedAt: 'desc' },
      include: { images: true }
    });
  } catch (error) {
    console.error("Gagal mengambil produk best seller:", error);
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
  const [products, bestSellers, categories, sections, articles] = await Promise.all([
    getProducts(),
    getBestSellerProducts(),
    getCategories(),
    getSections(),
    getArticles()
  ]);

  // If no sections defined, fallback to default layout
  if (sections.length === 0) {
    return (
      <main className="relative bg-gradient-to-b from-soft-pink-100 to-white">
        <HeroSection />
        <MostWantedSection products={bestSellers} />
        <CategoriesSection categories={categories} />
        <CategoriesSection categories={categories} />
        <OfflineStoreSection />
        <GallerySection images={products.flatMap(p => p.images || [])} />
        <ArticlesSection articles={articles} />
        <FloatingButtons />
      </main>
    );
  }

  return (
    <main className="relative bg-gradient-to-b from-soft-pink-100 to-white">
      {sections.map(section => {
        const sectionContent = (() => {
          switch (section.type) {
            case 'HERO':
              return <HeroSection />;
            case 'PRODUCT_SLIDER':
              return <MostWantedSection products={bestSellers} limit={section.content?.limit} title={section.content?.title} />;
            case 'CATEGORY_GRID':
              return <CategoriesSection categories={categories} title={section.content?.title} />;
            case 'OFFLINE_STORE':
              return <OfflineStoreSection />;
            case 'BANNER':
              return (
                <div className="w-full relative aspect-[16/6] mb-12">
                  {/* Basic banner implementation - improve as needed */}
                  <div
                    className="w-full h-full bg-center bg-cover"
                    style={{ backgroundImage: `url(${section.content?.imageUrl})` }}
                  />
                </div>
              );
            case 'SHOP_THE_LOOK':
              return <ShopTheLookSection section={section} />;
            case 'STORIES':
            case 'ARTICLES': // Support both types for future proofing
              return <ArticlesSection articles={articles} title={section.title} />;
            case 'TESTIMONY':
              return <TestimonySection section={section} />;
            case 'GALLERY':
              const galleryImages = section.content?.source === 'MANUAL' && section.content?.images?.length > 0
                ? section.content.images
                : products.flatMap(p => p.images || []);
              return <GallerySection images={galleryImages} />;
            default:
              return null;
          }
        })();

        if (!sectionContent) return null;

        const sectionStyle = {};
        if (section.backgroundImage) {
          sectionStyle.backgroundImage = `url(${section.backgroundImage})`;
          sectionStyle.backgroundSize = 'cover';
          sectionStyle.backgroundPosition = 'center';
        } else if (section.gradientStart && section.gradientEnd) {
          sectionStyle.background = `linear-gradient(to bottom, ${section.gradientStart}, ${section.gradientEnd})`;
        } else if (section.backgroundColor) {
          sectionStyle.backgroundColor = section.backgroundColor;
        }

        return (
          <div key={section.id} style={sectionStyle}>
            {sectionContent}
          </div>
        );
      })}
      <FloatingButtons />
    </main>
  );
}