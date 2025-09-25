// src/app/page.js

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSlider from '@/components/HeroSlider';
import MostWantedSection from '@/components/homepage/MostWantedSection';
import CategoriesSection from '@/components/homepage/CategoriesSection';
import FeaturesSection from '@/components/homepage/FeaturesSection';
import OfflineStoreSection from '@/components/homepage/OfflineStoreSection';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSlider />
        <MostWantedSection />
        <FeaturesSection />
        <CategoriesSection />
        <OfflineStoreSection />
      </main>
      <Footer />
    </>
  );
}