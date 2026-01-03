"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { ShoppingCart } from "lucide-react";

export default function GolaPyaliPage() {
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
      <Header showBackButton />
      <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <ShoppingCart className="w-24 h-24 text-green-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Gola Pyali Billing System
              </h2>
              <p className="text-gray-600 text-lg">
                Welcome to Gola Pyali business management system
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}