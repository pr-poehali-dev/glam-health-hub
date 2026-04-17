import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/sections/HeroSection';
import ShopSection from '@/components/sections/ShopSection';
import ConsultationsSection from '@/components/sections/ConsultationsSection';
import ProgramsSection from '@/components/sections/ProgramsSection';
import OptimizerSection from '@/components/sections/OptimizerSection';
import CommunitySection from '@/components/sections/CommunitySection';
import AboutSection from '@/components/sections/AboutSection';

const sections = ['home', 'shop', 'consultations', 'programs', 'optimizer', 'community', 'about'];

export default function Index() {
  const [activeSection, setActiveSection] = useState('home');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const navigateTo = (sectionId: string) => {
    const el = sectionRefs.current[sectionId];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-64px 0px 0px 0px' }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        sectionRefs.current[id] = el;
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar activeSection={activeSection} onNavigate={navigateTo} />

      <main>
        <div id="home">
          <HeroSection onNavigate={navigateTo} />
        </div>

        <div id="shop">
          <ShopSection />
        </div>

        <div id="consultations">
          <ConsultationsSection />
        </div>

        <div id="programs">
          <ProgramsSection />
        </div>

        <div id="optimizer">
          <OptimizerSection />
        </div>

        <div id="community">
          <CommunitySection />
        </div>

        <div id="about">
          <AboutSection />
        </div>
      </main>

      <Footer onNavigate={navigateTo} />
    </div>
  );
}
