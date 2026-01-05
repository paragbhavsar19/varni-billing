"use client";
import { useState } from "react";
import { Plus, Minus, X, Edit2, Trash2, Check } from "lucide-react";

type BillItem = {
  id: string;
  name: string;
  size: string;
  qty: number;
  rate: number;
  total: number;
};

type Product = {
  id: string;
  name: string;
  price130: number;
  price150: number;
  enabled: boolean;
};

// Thermal Print Component
const ThermalBillPrint = ({ billItems, grandTotal }: { billItems: BillItem[], grandTotal: number }) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-IN', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
  const formattedTime = currentDate.toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  return (
    <div className="thermal-print hidden print:block">
      <div className="thermal-receipt">
        {/* Header */}
        <div className="text-center mb-3">
          <h2 className="text-lg font-semibold">Varni Khajur Dudh Billing</h2>
          <div className="border-t-2 border-dashed border-black my-2"></div>
        </div>

        {/* Date & Time */}
        <div className="text-sm mb-3">
          <div className="flex justify-between">
            <span>Date: {formattedDate}</span>
            <span>Time: {formattedTime}</span>
          </div>
          <div className="border-t border-dashed border-black my-2"></div>
        </div>

        {/* Items Table */}
        <table className="w-full text-sm mb-3">
          <thead>
            <tr className="border-b border-black">
              <th className="text-left py-1">Item</th>
              <th className="text-center py-1 w-12">Qty</th>
              <th className="text-right py-1 w-16">Rate</th>
              <th className="text-right py-1 w-20">Total</th>
            </tr>
          </thead>
          <tbody>
            {billItems.map((item, index) => (
              <tr key={index} className="border-b border-dashed border-gray-400">
                <td className="py-1.5 pr-2">{item.name}</td>
                <td className="text-center py-1.5">{item.qty}</td>
                <td className="text-right py-1.5">₹{item.rate}</td>
                <td className="text-right py-1.5 font-semibold">₹{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total Section */}
        <div className="border-t-2 border-black pt-2 mb-3">
          <div className="flex justify-between text-lg font-bold">
            <span>GRAND TOTAL:</span>
            <span>₹{grandTotal}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm mt-4">
          <div className="border-t border-dashed border-black my-2"></div>
          <p className="font-semibold mb-1">Thank You for Your Order!</p>
          <p className="text-xs">Visit Again</p>
        </div>
      </div>

      <style jsx>{`
        @media print {
          @page {
            size: 80mm auto;
            margin: 0;
          }
          
          body {
            margin: 0;
            padding: 0;
          }

          .thermal-receipt {
            width: 80mm;
            padding: 10mm 5mm;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.4;
            color: black;
            background: white;
          }

          .thermal-receipt * {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          /* Hide everything except thermal print */
          body > *:not(.thermal-print) {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

// Mock Header component
const Header = ({ showBackButton }: { showBackButton?: boolean }) => (
  <div className="bg-orange-600 text-white p-3 h-[50px] flex items-center">
    {showBackButton && <button className="mr-3">←</button>}
    <h1 className="text-xl font-bold">OCBIS KH Billing</h1>
  </div>
);

export default function KhajurDudhPage() {
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price130: "",
    price150: "",
  });

  // Product catalog with prices
  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "Plain KHD", price130: 50, price150: 70, enabled: true },
    { id: "2", name: "Thabdi KHD", price130: 60, price150: 80, enabled: true },
    { id: "3", name: "Elaichi KHD", price130: 60, price150: 80, enabled: true },
    { id: "4", name: "Chocolate KHD", price130: 60, price150: 80, enabled: true },
    { id: "5", name: "Gulkand KHD", price130: 60, price150: 80, enabled: true },
    { id: "6", name: "Anjeer KHD", price130: 70, price150: 90, enabled: true },
    { id: "7", name: "Dryfruit KHD", price130: 70, price150: 90, enabled: true },
    { id: "8", name: "Kesar KHD", price130: 70, price150: 90, enabled: true },
    { id: "9", name: "Varni Special", price130: 100, price150: 120, enabled: true },
    { id: "10", name: "Packing Charge", price130: 10, price150: 10, enabled: true },
  ]);

  const [editFormData, setEditFormData] = useState({
    name: "",
    price130: "",
    price150: "",
  });

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
    if (billItems.length === 0) {
      alert("Please add items to the bill before printing!");
      return;
    }
    window.print();
  };

  const toggleProductEnabled = (id: string) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const deleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const startEditingProduct = (product: Product) => {
    setEditingProductId(product.id);
    setEditFormData({
      name: product.name,
      price130: product.price130.toString(),
      price150: product.price150.toString(),
    });
  };

  const saveEditProduct = (id: string) => {
    if (!editFormData.name.trim()) {
      alert("Please enter item name");
      return;
    }
    if (!editFormData.price130 || parseFloat(editFormData.price130) <= 0) {
      alert("Please enter valid 130ml price");
      return;
    }
    if (!editFormData.price150 || parseFloat(editFormData.price150) <= 0) {
      alert("Please enter valid 150ml price");
      return;
    }

    setProducts(
      products.map((p) =>
        p.id === id
          ? {
              ...p,
              name: editFormData.name.trim(),
              price130: parseFloat(editFormData.price130),
              price150: parseFloat(editFormData.price150),
            }
          : p
      )
    );
    setEditingProductId(null);
  };

  const cancelEdit = () => {
    setEditingProductId(null);
    setEditFormData({ name: "", price130: "", price150: "" });
  };

  const handleAddNewProduct = () => {
    if (!newProduct.name.trim()) {
      alert("Please enter item name");
      return;
    }
    if (!newProduct.price130 || parseFloat(newProduct.price130) <= 0) {
      alert("Please enter valid 130ml price");
      return;
    }
    if (!newProduct.price150 || parseFloat(newProduct.price150) <= 0) {
      alert("Please enter valid 150ml price");
      return;
    }

    const productToAdd: Product = {
      id: Date.now().toString(),
      name: newProduct.name.trim(),
      price130: parseFloat(newProduct.price130),
      price150: parseFloat(newProduct.price150),
      enabled: true,
    };

    setProducts([...products, productToAdd]);
    setNewProduct({ name: "", price130: "", price150: "" });
    setIsAddingNew(false);
  };

  const cancelAddNew = () => {
    setIsAddingNew(false);
    setNewProduct({ name: "", price130: "", price150: "" });
  };

  const enabledProducts = products.filter((p) => p.enabled);

  return (
    <>
      <Header showBackButton />
      
      {/* Thermal Print Component - Hidden on screen, visible on print */}
      <ThermalBillPrint billItems={billItems} grandTotal={calculateGrandTotal()} />
      
      {/* Main UI - Visible on screen, hidden on print */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-100 h-[calc(100vh-50px)] print:hidden">
        <div className="h-[51%] p-2">
          <div className="bg-white rounded-md shadow-md h-full p-2">
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
            <div className="block h-[calc(100%-86px)]">
              <div className="h-full">
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
                <div className="max-h-[83%] overflow-y-auto">
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
        <div className="h-[49%] p-2">
          <div className="bg-white rounded-md shadow-md h-full p-2">
            <div className="justify-between flex items-center mb-2">
              <h3 className="text-lg sm:text-xl font-bold text-orange-950 ">
                Products
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="bg-green-600 text-white px-3 py-1 rounded-md text-[12px] hover:bg-green-700 transition-colors"
                >
                  Edit Product
                </button>
              </div>
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
            <div className="overflow-auto relative z-10 pt-2 h-[66%]">
              {enabledProducts.map((product, index) => {
                const qty130 = getProductQuantity(product.name, "130ml");
                const qty150 = getProductQuantity(product.name, "150ml");

                return (
                  <div
                    key={product.id}
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

      {/* Edit Product Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 print:hidden">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-orange-950">
                Product List
              </h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAddingNew(true)}
                  className="bg-green-600 text-white px-3 py-1 rounded-lg text-[12px] font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Plus size={10} />
                  Add Product
                </button>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingProductId(null);
                    setIsAddingNew(false);
                    setNewProduct({ name: "", price130: "", price150: "" });
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-4 overflow-auto flex-1">
              <table className="w-full">
                <thead className="bg-orange-100 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-orange-950">
                      Item Name
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-orange-950">
                      130ml Price
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-orange-950">
                      150ml Price
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-orange-950">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      {editingProductId === product.id ? (
                        <>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={editFormData.name}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  name: e.target.value,
                                })
                              }
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-black focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={editFormData.price130}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  price130: e.target.value,
                                })
                              }
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-black text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={editFormData.price150}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  price150: e.target.value,
                                })
                              }
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-black text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => saveEditProduct(product.id)}
                                className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition-colors"
                                title="Save"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition-colors"
                                title="Cancel"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3 text-sm text-black">
                            {product.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-black text-center">
                            ₹{product.price130}
                          </td>
                          <td className="px-4 py-3 text-sm text-black text-center">
                            ₹{product.price150}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-2">
                               <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={product.enabled}
                                  onChange={() =>
                                    toggleProductEnabled(product.id)
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-8 h-4 bg-gray-300 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-green-600"></div>
                              </label>
                              <button
                                onClick={() => startEditingProduct(product)}
                                className="bg-blue-600 text-white p-1.5 rounded hover:bg-blue-700 transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                onClick={() => deleteProduct(product.id)}
                                className="bg-red-600 text-white p-1.5 rounded hover:bg-red-700 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={10} />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                  {/* Add New Product Row */}
                  {isAddingNew && (
                    <tr className="border-b-2 border-green-500 bg-green-50">
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={newProduct.name}
                          onChange={(e) =>
                            setNewProduct({ ...newProduct, name: e.target.value })
                          }
                          placeholder="Enter item name"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={newProduct.price130}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              price130: e.target.value,
                            })
                          }
                          placeholder="Price"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-black text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={newProduct.price150}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              price150: e.target.value,
                            })
                          }
                          placeholder="Price"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-black text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={handleAddNewProduct}
                            className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition-colors text-xs font-semibold"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelAddNew}
                            className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 transition-colors text-xs font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}