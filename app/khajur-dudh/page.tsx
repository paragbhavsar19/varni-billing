"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import Header from "@/components/Header";

type BillItem = {
  id: string;
  name: string;
  size: string;
  qty: number;
  rate: number;
  total: number;
};

type Product = {
  name: string;
  price130: number;
  price150: number;
};

export default function KhajurDudhPage() {
  const [billItems, setBillItems] = useState<BillItem[]>([]);

  // Product catalog with prices
  const products: Product[] = [
    { name: "Plain KHD", price130: 50, price150: 70 },
    { name: "Thabdi KHD", price130: 60, price150: 80 },
    { name: "Elaichi KHD", price130: 60, price150: 80 },
    { name: "Chocolate KHD", price130: 60, price150: 80 },
    { name: "Gulkand KHD", price130: 60, price150: 80 },
    { name: "Anjeer KHD", price130: 70, price150: 90 },
    { name: "Dryfruit KHD", price130: 70, price150: 90 },
    { name: "Kesar KHD", price130: 70, price150: 90 },
    { name: "Varni Special ", price130: 100, price150: 120 },
    { name: "Packing Charge", price130: 10, price150: 10 },
  ];

  const addProduct = (productName: string, size: "130ml" | "150ml") => {
    const product = products.find((p) => p.name === productName);
    if (!product) return;

    const rate = size === "130ml" ? product.price130 : product.price150;
    const itemKey = `${productName}-${size}`;

    setBillItems((prev) => {
      const existing = prev.find((item) => item.id === itemKey);

      if (existing) {
        return prev.map((item) =>
          item.id === itemKey
            ? {
                ...item,
                qty: item.qty + 1,
                total: (item.qty + 1) * item.rate,
              }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: itemKey,
            name: `${productName} ${size}`,
            size: size,
            qty: 1,
            rate: rate,
            total: rate,
          },
        ];
      }
    });
  };

  const updateQuantity = (id: string, change: number) => {
    setBillItems((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + change;
            if (newQty <= 0) return null;
            return {
              ...item,
              qty: newQty,
              total: newQty * item.rate,
            };
          }
          return item;
        })
        .filter((item): item is BillItem => item !== null);
    });
  };

  const getProductQuantity = (productName: string, size: "130ml" | "150ml") => {
    const itemKey = `${productName}-${size}`;
    const item = billItems.find((item) => item.id === itemKey);
    return item ? item.qty : 0;
  };

  const clearBill = () => {
    if (confirm("Are you sure you want to clear the bill?")) {
      setBillItems([]);
    }
  };

  const calculateGrandTotal = () => {
    return billItems.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSaveAndPrint = () => {
    handleSave();
    handlePrint();
  };

  const handleSave = () => {
    alert("Bill saved successfully!");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <main className="h-[100vh] bg-gradient-to-br from-amber-50 to-orange-100 overflow-hidden flex flex-col">
        <Header showBackButton />
        <div className="flex flex-col  items-stretch h-full flex-1 pb-52">
          {/* Left Section - Bill Table */}
          {/* <div className="lg:col-span-2 h-[381px]"> */}
          <div className="lg:col-span-2 h-[50%] p-2">
            <div className="bg-white rounded-lg shadow-md p-2 sm:p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[18px] font-bold text-orange-950">
                  Current Bill
                </h3>
                {billItems.length > 0 && (
                  <div className="">
                    <span className="text-[18px] font-bold text-orange-950 pr-5">
                      Grand Total:
                    </span>
                    <span className="text-[18px] sm:text-2xl font-bold text-orange-950">
                      ₹{calculateGrandTotal()}
                    </span>
                  </div>
                )}
              </div>

              {/* Bill Table */}
              <div className="block overflow-x-auto flex-1">
                <div className="inline-block min-w-full">
                  <table className="w-full">
                    <thead className="bg-orange-100 sticky top-0 z-10">
                      <tr>
                        <th className="px-2 py-3 text-left text-sm font-semibold text-orange-950 min-w-[160px]">
                          Item
                        </th>
                        <th className="px-2 py-3 text-center text-sm font-semibold text-orange-950">
                          Qty
                        </th>
                        <th className="px-2 py-3 text-right text-sm font-semibold text-orange-950">
                          Rate
                        </th>
                        <th className="px-2 py-3 text-right text-sm font-semibold text-orange-950">
                          Total
                        </th>
                      </tr>
                    </thead>
                  </table>
                  {/* max-h-[230px] overflow-y-auto */}
                  <div className="max-h-[230px] overflow-y-auto">
                    <table className="w-full">
                      <tbody>
                        {billItems.length === 0 ? (
                          <tr>
                            <td
                              colSpan={4}
                              className="px-2 py-8 text-center text-gray-500"
                            >
                              No items added yet.
                            </td>
                          </tr>
                        ) : (
                          billItems.map((item) => (
                            <tr
                              key={item.id}
                              className="border-b border-gray-200 hover:bg-gray-50"
                            >
                              <td className="px-2 py-3 text-sm min-w-[160px] text-black">
                                {item.name}
                              </td>
                              <td className="px-2 py-3">
                                <div className="flex items-center justify-center gap-1">
                                  <span className=" w-8 text-center text-sm text-black">
                                    {item.qty}
                                  </span>
                                </div>
                              </td>
                              <td className="px-2 py-3 text-right text-sm text-black">
                                ₹{item.rate}
                              </td>
                              <td className="px-2 py-3 text-right  text-sm text-black">
                                ₹{item.total}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-3 grid grid-cols-4 sm:flex sm:flex-wrap gap-2 sm:gap-3 sticky bottom-0 bg-white">
                <button
                  onClick={clearBill}
                  className="bg-gray-500 text-white px-2.5 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-colors text-xs sm:text-sm"
                >
                  Clear
                </button>
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-2.5 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors text-xs sm:text-sm"
                >
                  Save
                </button>
                <button
                  onClick={handlePrint}
                  className="bg-orange-600 text-white px-2.5 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors text-xs sm:text-sm"
                >
                  Print
                </button>
                <button
                  onClick={handleSaveAndPrint}
                  className="bg-blue-600 text-white px-2.5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-xs sm:text-sm"
                >
                  Save & Print
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - Add Products */}
          <div className="lg:col-span-1 h-[50%] p-2 pt-0  relative">
            <div className="bg-white rounded-lg shadow-md p-2 sm:p-4">
              <div className="justify-between flex items-center mb-2">
                  <h3 className="text-lg sm:text-xl font-bold text-orange-950 ">
                    Products
                  </h3>
                  <button className="bg-green-600 text-white px-3 py-1 rounded-lg text-[14px]">Add Product</button>
                </div>
                <div className="flex items-center bg-orange-100 z-10 justify-between py-2 px-3 rounded mb-3">
                  <p className="px-2 py-1 text-left text-sm font-semibold text-orange-950">
                    Item Name
                  </p>
                  <div className="flex items-center gap-16">
                    <p className="px-2 py-1 text-center text-sm font-semibold text-orange-950">
                      130ml
                    </p>
                    <p className="px-2 py-1 text-center text-sm font-semibold text-orange-950">
                      150ml
                    </p>
                  </div>
              
              </div>
              {/* <div className=" overflow-auto"> */}
              <div className="overflow-auto relative z-10 pt-2 h-[calc(100vh-590px)]">
                {products.map((product, index) => {
                  const qty130 = getProductQuantity(product.name, "130ml");
                  const qty150 = getProductQuantity(product.name, "150ml");

                  return (
                    <div
                      key={index}
                      className="border-b border-gray-200 hover:border-orange-300 transition-colors flex justify-between items-center py-3 px-2"
                    >
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                        {product.name}
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {/* 130ml */}
                        <div className="flex flex-col items-center gap-1">
                          {qty130 > 0 ? (
                            <div className="flex items-center justify-between gap-1 bg-amber-100 px-2 py-1 rounded w-[115px]">
                              <button
                                onClick={() =>
                                  updateQuantity(`${product.name}-130ml`, -1)
                                }
                                className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="font-semibold w-6 text-center text-xs text-black">
                                {qty130}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(`${product.name}-130ml`, 1)
                                }
                                className="bg-green-500 text-white p-1 rounded hover:bg-green-600"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addProduct(product.name, "130ml")}
                              className="bg-amber-500 text-white px-5 py-2 w-[115px] rounded hover:bg-amber-600 transition-colors text-xs sm:text-sm font-semibold"
                            >
                              Add ₹{product.price130}
                            </button>
                          )}
                        </div>

                        {/* 150ml */}
                        <div className="flex flex-col items-center gap-1">
                          {qty150 > 0 ? (
                            <div className="flex justify-between items-center gap-1 bg-amber-100 px-2 py-1 rounded w-[115px]">
                              <button
                                onClick={() =>
                                  updateQuantity(`${product.name}-150ml`, -1)
                                }
                                className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="font-semibold w-6 text-center text-xs text-black">
                                {qty150}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(`${product.name}-150ml`, 1)
                                }
                                className="bg-green-500 text-white p-1 rounded hover:bg-green-600"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addProduct(product.name, "150ml")}
                              className="bg-amber-500 text-white px-5 py-2 w-[115px] rounded hover:bg-amber-600 transition-colors text-xs sm:text-sm font-semibold"
                            >
                              Add ₹{product.price150}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
