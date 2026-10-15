import React from "react";
import DashboardFeatureBanner from "@/components/home/DashboardFeatureBanner";
import HeroSection from "@/components/home/HeroSection";
import StatsBar from "@/components/home/StatsBar";
import ServicesSection from "@/components/home/ServiceSection";
import WhyUsSection from "@/components/home/WhyUsSection";
import ProcessSection from "@/components/home/ProcessSection";
import TestimonialsSection from "@/components/home/TestimonialSection";
import ArticleSection from "@/components/home/ArticleSection";
import QuotationForm from "@/components/home/QuotationForm";
import CTASection from "@/components/home/CTASection";
import pemusnahanBanner from "@/assets/home/pemusnahan-banner.jpg";
import Seo from "@/components/Seo";

export default function Home() {
  return (
    <>
      <Seo
        title="Pengelolaan & Pengangkutan Limbah B3 Jabodetabek"
        description="LIMBAHIN: jasa pengangkutan limbah B3 berizin KLHK di Jakarta, Bekasi, Depok, Bogor & Cikarang. Konsultasi gratis."
        path="/"
      />
      <DashboardFeatureBanner />
      <HeroSection />

      <section className="relative bg-[#12242b] py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <StatsBar />
        </div>
      </section>

      <div className="w-full">
        <img
          src={pemusnahanBanner}
          alt="Limbah Medis, Produk, Barang, Bahan — Pemusnahan"
          className="w-full h-auto object-cover"
        />
      </div>

      <ServicesSection />
      <WhyUsSection />
      <ProcessSection />
      <TestimonialsSection />
      <ArticleSection />
      <QuotationForm />
      <CTASection />
    </>
  );
}