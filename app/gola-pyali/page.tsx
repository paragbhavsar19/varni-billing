"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function GolaPyaliPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLoggedIn = sessionStorage.getItem("isLoggedIn");
      if (!isLoggedIn) {
        router.push("/login");
      }
    }
  }, [router]);

  const [orders, setOrders] = useState<Record<number, number>>({});
  const [customerName, setCustomerName] = useState("");
  const [showBill, setShowBill] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [billNumber, setBillNumber] = useState("");
  const [billTime, setBillTime] = useState("");

  const golas = [
    { id: 1, name: "Kala Khatta", price: 20 },
    { id: 2, name: "Orange", price: 20 },
    { id: 3, name: "Mango", price: 25 },
    { id: 4, name: "Cola", price: 20 },
    { id: 5, name: "Lemon", price: 20 },
    { id: 6, name: "Strawberry", price: 25 },
    { id: 7, name: "Pineapple", price: 25 },
    { id: 8, name: "Grapes", price: 20 },
    { id: 9, name: "Kesar Pista", price: 30 },
    { id: 10, name: "Rose", price: 25 },
    { id: 11, name: "Chocolate", price: 30 },
    { id: 12, name: "Vanilla", price: 25 },
    { id: 13, name: "Butterscotch", price: 30 },
    { id: 14, name: "Green Apple", price: 25 },
    { id: 15, name: "Blueberry", price: 30 },
    { id: 16, name: "Watermelon", price: 20 },
    { id: 17, name: "Guava", price: 20 },
    { id: 18, name: "Litchi", price: 25 },
    { id: 19, name: "Mixed Fruit", price: 30 },
    { id: 20, name: "Kokam", price: 25 },
    { id: 21, name: "Mint", price: 25 },
    { id: 22, name: "Jeera", price: 20 },
  ];

  const updateQuantity = (id: number, change: number) => {
    setOrders((prev) => {
      const current = prev[id] || 0;
      const newQty = Math.max(0, current + change);
      if (newQty === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: newQty };
    });
  };

  const hasOrders = Object.keys(orders).length > 0;

  const calculateTotal = () => {
    let total = 0;
    Object.entries(orders).forEach(([id, qty]) => {
      const gola = golas.find((g) => g.id === parseInt(id));
      if (gola) {
        total += gola.price * qty;
      }
    });
    return total;
  };

  const generateBillNumber = () => {
    return "G" + Date.now().toString().slice(-8);
  };

  const prepareBill = () => {
    setBillNumber(generateBillNumber());
    setBillTime(new Date().toLocaleString("en-IN"));
    setShowBill(true);
  };

  const handleViewOrder = () => {
    setShowViewModal(true);
  };

  const handleSave = () => {
    prepareBill();
    setTimeout(() => {
      setShowBill(false);
      alert("Order Saved Successfully!");
    }, 100);
  };

  const handlePrint = () => {
    prepareBill();
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleSaveAndPrint = () => {
    prepareBill();
    setTimeout(() => {
      window.print();
      alert("Order Saved Successfully!");
    }, 100);
  };

  if (showBill) {
    return (
      <>
        <style>{`
          @media print {
            @page {
              size: 80mm auto;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
            }
          }
        `}</style>
        <div className="min-h-screen bg-white">
          <div className="print:w-[80mm] mx-auto bg-white p-4 print:p-2">
            {/* Header */}
            <div className="text-center mb-3 pb-2 border-b-2 border-dashed border-gray-800">
              <div className="text-4xl mb-1">🍧</div>
              <h1 className="text-xl font-bold text-black">VARNI GOLA SHOP</h1>
              <p className="text-xs text-gray-700 mt-0.5">
                Fresh & Delicious Ice Gola Pyali
              </p>
            </div>

            {/* Bill Info */}
            <div className="mb-3 text-xs space-y-0.5 font-bold">
              <div className="flex justify-between ">
                <span>Date & Time</span>
                <span className="">{billTime.split(",")[0]} {billTime.split(",")[1]?.trim() || ""}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Bill No:</span>
                <span className="font-bold">{billNumber}</span>
              </div>
              {customerName && (
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span className="">{customerName}</span>
                </div>
              )}
            </div>

            {/* Items Table */}
            <div className="border-t-2 border-b border-gray-800 py-1 mb-1">
              <div className="flex justify-between font-bold text-xs">
                <span className="flex-1">ITEM</span>
                <span className="w-10 text-center">QTY</span>
                <span className="w-16 text-right">PRICE</span>
              </div>
            </div>

            {Object.entries(orders).map(([id, qty]) => {
              const gola = golas.find((g) => g.id === parseInt(id));
              if (!gola) return null;

              return (
                <div
                  key={id}
                  className="flex justify-between text-xs py-1.5 border-b border-dashed border-gray-300 font-bold"
                >
                  <span className="flex-1">{gola.name}</span>
                  <span className="w-10 text-center font-medium">{qty}</span>
                  <span className="w-16 text-right font-semibold">
                    ₹{gola.price * qty}
                  </span>
                </div>
              );
            })}

            {/* Total */}
            <div className="border-t-2 border-gray-800 mt-2 pt-2">
              <div className="flex justify-between text-base font-bold">
                <span>TOTAL</span>
                <span>₹{calculateTotal()}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-4 pt-3 border-t-2 border-dashed border-gray-800">
              <p className="text-sm font-semibold">Thank You!</p>
              <p className="text-xs mt-0.5">Visit Again 😊</p>
            </div>

            {/* Back Button - Hidden on Print */}
            <button
              onClick={() => setShowBill(false)}
              className="w-full mt-6 bg-orange-600 text-white py-3 rounded-lg font-bold print:hidden"
            >
              Back to Order
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header showBackButton />
      <div className="min-h-screen bg-gradient-to-br from-orange-100 to-pink-100 pb-24">
        <div className="px-4 py-2 max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md  mb-2">
            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-3 border-2 border-orange-300 rounded-lg text-lg font-medium focus:outline-none focus:border-orange-500 text-black placeholder:text-black"
            />
          </div>

          <div className="font-bold flex items-center justify-between border-b border-gray-200 py-3 px-4 last:border-b-0 bg-white p-1.5 mb-2 rounded-lg shadow-md  mb-2">
            <span className=" flex-1 text-gray-800 ">Item Name</span>
            <span className=" flex-1 text-gray-800 pl-16">Quantity</span>
            <span className=" text-gray-800 w-16 text-right text-lg">
              Price
            </span>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-auto h-[calc(100vh-264px)]">
            {golas.map((gola) => (
              <div
                key={gola.id}
                className="flex items-center justify-between border-b border-gray-200 py-3 px-4 last:border-b-0"
              >
                <span className="font-medium flex-1 text-gray-800">
                  {gola.name}
                </span>

                <div className="flex items-center gap-3 mr-4">
                  <button
                    onClick={() => updateQuantity(gola.id, -1)}
                    className="w-9 h-9 bg-red-500 text-white rounded-full font-bold text-xl hover:bg-red-600 active:scale-95 transition-all"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-bold text-lg text-gray-800">
                    {orders[gola.id] || 0}
                  </span>
                  <button
                    onClick={() => updateQuantity(gola.id, 1)}
                    className="w-9 h-9 bg-green-500 text-white rounded-full font-bold text-xl hover:bg-green-600 active:scale-95 transition-all"
                  >
                    +
                  </button>
                </div>

                <span className="font-bold text-orange-600 w-16 text-right text-lg">
                  ₹{gola.price}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t-2 border-gray-200 px-2 py-2">
          <div className="max-w-md mx-auto flex gap-1">
            <button
              onClick={handleViewOrder}
              disabled={!hasOrders}
              className={`flex-1 py-1.5 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all text-sm ${
                hasOrders
                  ? "bg-[#14B8A6] hover:bg-blue-700 active:scale-95"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              View
            </button>
            <button
              onClick={handleSave}
              disabled={!hasOrders}
              className={`flex-1 py-1.5 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all text-sm ${
                hasOrders
                  ? "bg-blue-600 hover:bg-blue-700 active:scale-95"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Save
            </button>

            <button
              onClick={handlePrint}
              disabled={!hasOrders}
              className={`flex-1 py-1.5 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all text-sm ${
                hasOrders
                  ? "bg-green-600 hover:bg-green-700 active:scale-95"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Print
            </button>

            <button
              onClick={handleSaveAndPrint}
              disabled={!hasOrders}
              className={`flex-1 py-1.5 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all text-sm ${
                hasOrders
                  ? "bg-orange-600 hover:bg-orange-700 active:scale-95"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Save & Print
            </button>
          </div>
        </div>
      </div>

      {/* View Order Modal - iPhone style bottom sheet */}
      {showViewModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40 transition-opacity"
            onClick={() => setShowViewModal(false)}
          />
          
          {/* Modal */}
          <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
            <div className="bg-white rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col">
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
              </div>

              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">Order Summary</h2>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <span className="text-2xl text-gray-600">×</span>
                  </button>
                </div>
                {customerName && (
                  <p className="text-sm text-gray-600 mt-1">Customer: <span className="font-semibold">{customerName}</span></p>
                )}
              </div>

              {/* Order Items */}
              <div className="flex-1 overflow-auto px-6 py-4">
                <div className="space-y-3">
                  {Object.entries(orders).map(([id, qty]) => {
                    const gola = golas.find((g) => g.id === parseInt(id));
                    if (!gola) return null;

                    return (
                      <div
                        key={id}
                        className="flex items-center justify-between bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-4 border border-orange-200"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 text-lg">{gola.name}</p>
                          <p className="text-sm text-gray-600">₹{gola.price} × {qty}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-orange-600">₹{gola.price * qty}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total Section */}
              <div className="px-6 py-4 border-t-2 border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-gray-800">Total Amount</span>
                  <span className="text-3xl font-bold text-orange-600">₹{calculateTotal()}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      handlePrint();
                    }}
                    className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 active:scale-95 transition-all"
                  >
                    Print Bill
                  </button>
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      handleSaveAndPrint();
                    }}
                    className="flex-1 py-3 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 active:scale-95 transition-all"
                  >
                    Save & Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}