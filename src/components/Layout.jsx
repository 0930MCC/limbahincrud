import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";
import JsonLd from "@/components/JsonLd";
import { organizationSchema, serviceSchema, localBusinessSchema } from "@/lib/schema";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Organization + Service schema.org structured data — applies to every marketing page.
          Each page still sets its own title/description/page-specific schema via <Seo />. */}
      <JsonLd data={[organizationSchema, serviceSchema, localBusinessSchema]} />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloatButton />
    </div>
  );
}
