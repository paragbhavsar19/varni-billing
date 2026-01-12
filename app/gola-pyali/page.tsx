"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { FileText, Printer, Save, ShoppingCart } from "lucide-react";

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

   const [orders, setOrders] = useState({});
  const [customerName, setCustomerName] = useState('');
  const [showBill, setShowBill] = useState(false);

  const golas = [
    { id: 1, name: 'Kala Khatta', price: 20 },
    { id: 2, name: 'Orange', price: 20 },
    { id: 3, name: 'Mango', price: 25 },
    { id: 4, name: 'Cola', price: 20 },
    { id: 5, name: 'Lemon', price: 20 },
    { id: 6, name: 'Strawberry', price: 25 },
    { id: 7, name: 'Pineapple', price: 25 },
    { id: 8, name: 'Grapes', price: 20 },
    { id: 9, name: 'Kesar Pista', price: 30 },
    { id: 10, name: 'Rose', price: 25 },
    { id: 11, name: 'Chocolate', price: 30 },
    { id: 12, name: 'Vanilla', price: 25 },
    { id: 13, name: 'Butterscotch', price: 30 },
    { id: 14, name: 'Green Apple', price: 25 },
    { id: 15, name: 'Blueberry', price: 30 },
    { id: 16, name: 'Watermelon', price: 20 },
    { id: 17, name: 'Guava', price: 20 },
    { id: 18, name: 'Litchi', price: 25 },
    { id: 19, name: 'Mixed Fruit', price: 30 },
    { id: 20, name: 'Kokam', price: 25 },
    { id: 21, name: 'Mint', price: 25 },
    { id: 22, name: 'Jeera', price: 20 }
  ];

  const updateQuantity = (id, change) => {
    setOrders(prev => {
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
      const gola = golas.find(g => g.id === parseInt(id));
      total += gola.price * qty;
    });
    return total;
  };

  const generateBillNumber = () => {
    return 'G' + Date.now().toString().slice(-8);
  };

  const handleSave = () => {
    setShowBill(true);
    setTimeout(() => {
      setShowBill(false);
      alert('Order Saved Successfully!');
    }, 100);
  };

  const handlePrint = () => {
    setShowBill(true);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleSaveAndPrint = () => {
    setShowBill(true);
    setTimeout(() => {
      window.print();
      alert('Order Saved Successfully!');
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
              <h1 className="text-xl font-bold text-black">GOLA SHOP</h1>
              <p className="text-xs text-gray-700 mt-0.5">Fresh & Delicious Ice Gola</p>
            </div>

            {/* Bill Info */}
            <div className="mb-3 text-xs space-y-0.5">
              <div className="flex justify-between">
                <span>Date:</span>
                <span className="font-medium">{new Date().toLocaleDateString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span className="font-medium">{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex justify-between">
                <span>Bill No:</span>
                <span className="font-bold">{generateBillNumber()}</span>
              </div>
              {customerName && (
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span className="font-medium">{customerName}</span>
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
              const gola = golas.find(g => g.id === parseInt(id));
              return (
                <div key={id} className="flex justify-between text-xs py-1.5 border-b border-dashed border-gray-300">
                  <span className="flex-1">{gola.name}</span>
                  <span className="w-10 text-center font-medium">{qty}</span>
                  <span className="w-16 text-right font-semibold">₹{gola.price * qty}</span>
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
      

      <div className="p-4 max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full p-3 border-2 border-orange-300 rounded-lg text-lg font-medium focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-auto h-[calc(100vh-264px)]">
          {golas.map(gola => (
            <div key={gola.id} className="flex items-center justify-between border-b border-gray-200 py-3 px-4 last:border-b-0">
              <span className="font-medium flex-1 text-gray-800">{gola.name}</span>
              
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

      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t-2 border-gray-200 p-4">
        <div className="max-w-md mx-auto flex gap-2">
          <button
            onClick={handleSave}
            disabled={!hasOrders}
            className={`flex-1 py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all ${
              hasOrders 
                ? 'bg-blue-600 hover:bg-blue-700 active:scale-95' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
             Save
          </button>
          
          <button
            onClick={handlePrint}
            disabled={!hasOrders}
            className={`flex-1 py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all ${
              hasOrders 
                ? 'bg-green-600 hover:bg-green-700 active:scale-95' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
             Print
          </button>
          
          <button
            onClick={handleSaveAndPrint}
            disabled={!hasOrders}
            className={`flex-1 py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 transition-all ${
              hasOrders 
                ? 'bg-orange-600 hover:bg-orange-700 active:scale-95' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
             Save & Print
          </button>
        </div>
      </div>
    </div>
    </>
  );
}