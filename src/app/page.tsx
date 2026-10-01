"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import PracticeNotice from "@/components/PracticeNotice";
import ProductsSection from "@/components/products/ProductsSection";
import ClassesSection from "@/components/classes/ClassesSection";

type TabKey = "products" | "classes";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabKey>("products");

  return (
    <div className="flex min-h-full flex-col bg-[#F8F5EF]">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <Hero />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <PracticeNotice className="mb-10" />

        <div
          id="panel-products"
          role="tabpanel"
          aria-labelledby="tab-products"
          hidden={activeTab !== "products"}
          tabIndex={0}
        >
          {activeTab === "products" ? <ProductsSection /> : null}
        </div>

        <div
          id="panel-classes"
          role="tabpanel"
          aria-labelledby="tab-classes"
          hidden={activeTab !== "classes"}
          tabIndex={0}
        >
          {activeTab === "classes" ? <ClassesSection /> : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}
