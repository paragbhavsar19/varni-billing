"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import DashboardCard from "@/components/DashboardCard";
import { Package, ShoppingCart } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isLoggedIn = sessionStorage.getItem("isLoggedIn");
      if (!isLoggedIn) {
        router.push("/login");
      }
    }
  }, [router]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 pb-10 pt-20 px-4 ">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-orange-950 mb-8 text-center">
            Select Your Business
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <DashboardCard
              title="Khajur Dudh Business"
              description="Manage your Khajur Dudh sales and billing"
              icon={<Package className="w-16 h-16" />}
              href="/khajur-dudh"
              colorScheme="amber"
            />

            <DashboardCard
              title="Gola Pyali Business"
              description="Manage your Gola Pyali sales and billing"
              icon={<ShoppingCart className="w-16 h-16" />}
              href="/gola-pyali"
              colorScheme="green"
            />
          </div>
        </div>
      </main>
    </>
  );
}
