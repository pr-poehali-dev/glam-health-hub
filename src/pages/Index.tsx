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
import AuthModal from '@/components/AuthModal';
import BrandCabinet from '@/components/BrandCabinet';
import SalonCabinet from '@/components/SalonCabinet';
import { getRole } from '@/lib/api';

const sections = ['home', 'shop', 'consultations', 'programs', 'optimizer', 'community', 'about'];

export default function Index() {
  const [activeSection, setActiveSection] = useState('home');
  const [showAuth, setShowAuth] = useState(false);
  const [showCabinet, setShowCabinet] = useState(false);
  const [authKey, setAuthKey] = useState(0);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const navigateTo = (sectionId: string) => {
    setShowCabinet(false);
    const el = sectionRefs.current[sectionId];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleAuthSuccess = (_role: string, _name: string) => {
    setAuthKey(k => k + 1);
    setShowAuth(false);
  };

  const handleCabinetClick = () => {
    setShowCabinet(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
  }, [showCabinet]);

  const role = getRole();

  return (
    <div className="min-h-screen">
      <Navbar
        activeSection={activeSection}
        onNavigate={navigateTo}
        onAuthClick={() => setShowAuth(true)}
        onCabinetClick={handleCabinetClick}
        authKey={authKey}
      />

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={handleAuthSuccess}
        />
      )}

      {showCabinet ? (
        <div className="pt-16">
          {role === 'brand' && <BrandCabinet />}
          {role === 'salon' && <SalonCabinet />}
          {role !== 'brand' && role !== 'salon' && (
            <div className="text-center py-24">
              <p className="font-cormorant text-2xl text-charcoal">Личный кабинет недоступен для вашей роли</p>
            </div>
          )}
        </div>
      ) : (
        <main>
          <div id="home"><HeroSection onNavigate={navigateTo} /></div>
          <div id="shop"><ShopSection /></div>
          <div id="consultations"><ConsultationsSection /></div>
          <div id="programs"><ProgramsSection /></div>
          <div id="optimizer"><OptimizerSection /></div>
          <div id="community"><CommunitySection /></div>
          <div id="about"><AboutSection /></div>
        </main>
      )}

      <Footer onNavigate={navigateTo} />
    </div>
  );
}
