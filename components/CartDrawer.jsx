import React, { useState } from 'react';

const CartDrawer = ({ isOpen, onClose, cart = [], onUpdateQuantity, onRemoveItem, onClearCart }) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Uttam Kumar',
    phone: '+91 98765 43210',
    address: '123 Health Street, Cyber City, Zone 4',
    city: 'Bhopal',
    pincode: '462001',
    paymentMethod: 'upi'
  });

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const shippingFee = subtotal > 499 || cart.length === 0 ? 0 : 99;
  const total = subtotal + shippingFee;

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setOrderPlaced(true);
    setTimeout(() => {
      onClearCart();
      setOrderPlaced(false);
      setIsCheckingOut(false);
      onClose();
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex justify-end animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Slide-out Panel */}
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0c1222] h-full shadow-2xl flex flex-col z-10 border-l border-slate-100 dark:border-white/10 rounded-l-[3rem] overflow-hidden">
        
        {/* Drawer Header */}
        <div className="p-6 md:p-8 bg-slate-50 dark:bg-slate-900/60 border-b dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#2f80ed]/10 text-[#2f80ed] flex items-center justify-center text-2xl">
              🛒
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Your Cart</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                {cart.length} {cart.length === 1 ? 'item' : 'items'} added
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 hover:bg-red-500 hover:text-white text-slate-500 transition-all flex items-center justify-center font-bold text-lg"
          >
            ✕
          </button>
        </div>

        {/* Drawer Body - Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-16">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800/80 rounded-full flex items-center justify-center text-5xl opacity-60">
                🛍️
              </div>
              <h3 className="text-xl font-black text-slate-700 dark:text-slate-300">Your Cart is Empty</h3>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed font-medium">
                Explore our Equipment Store or Pharmacy to add medical supplies & clinical hardware to your cart.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-8 py-3 bg-[#2f80ed] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-md"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.id}-${item.mode || 'buy'}`}
                className="p-4 bg-slate-50 dark:bg-slate-900/80 rounded-3xl border border-slate-100 dark:border-white/5 flex items-center gap-4 group transition-all hover:border-[#2f80ed]/30"
              >
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200'}
                  alt={item.name}
                  className="w-20 h-20 rounded-2xl object-cover border border-slate-200 dark:border-white/10 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-black text-[#2f80ed] uppercase tracking-widest block">
                    {item.brand || item.category || 'Product'} {item.mode === 'rent' ? '• Rental' : ''}
                  </span>
                  <h4 className="font-black text-sm text-slate-800 dark:text-white truncate">
                    {item.name}
                  </h4>
                  <p className="text-sm font-extrabold text-[#2f80ed] mt-0.5">
                    ₹{(item.price || 0).toLocaleString()}
                    {item.mode === 'rent' ? <span className="text-[10px] text-slate-400 font-normal"> / day</span> : ''}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={() => onRemoveItem(item.id, item.mode)}
                    className="text-slate-400 hover:text-red-500 text-xs transition-colors p-1"
                    title="Remove item"
                  >
                    🗑️
                  </button>

                  <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-1 shadow-sm">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.mode, -1)}
                      className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-white font-bold text-xs flex items-center justify-center transition-all"
                    >
                      -
                    </button>
                    <span className="text-xs font-black text-slate-800 dark:text-white min-w-[16px] text-center">
                      {item.quantity || 1}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.mode, 1)}
                      className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-white font-bold text-xs flex items-center justify-center transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer / Checkout Area */}
        {cart.length > 0 && (
          <div className="p-6 md:p-8 bg-slate-50 dark:bg-slate-900/90 border-t dark:border-white/5 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-500 font-medium">
                <span>Subtotal</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">₹{subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-xs text-slate-500 font-medium">
                <span>Delivery Charges</span>
                <span className="font-bold text-emerald-500">
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                </span>
              </div>

              <div className="pt-2 border-t dark:border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Total Payable</span>
                  <span className="text-2xl font-black text-slate-800 dark:text-white">₹{total.toLocaleString()}</span>
                </div>

                <button
                  onClick={onClearCart}
                  className="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase tracking-wider underline transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            <button
              onClick={() => setIsCheckingOut(true)}
              className="w-full bg-[#2f80ed] hover:bg-blue-600 active:scale-95 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <span>➔</span>
            </button>
          </div>
        )}
      </div>

      {/* Checkout Modal Dialog */}
      {isCheckingOut && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] max-w-lg w-full p-8 md:p-10 shadow-2xl border border-slate-100 dark:border-white/10 relative">
            {orderPlaced ? (
              <div className="text-center py-10 space-y-6 animate-in zoom-in">
                <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center text-4xl mx-auto shadow-2xl shadow-green-500/40 animate-bounce">
                  ✓
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-slate-800 dark:text-white">Order Confirmed! 🎉</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto">
                    Your medical equipment & supply order has been received. Our express health dispatch network is processing it.
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-2xl border border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400 font-bold text-xs uppercase tracking-widest">
                  Estimated Delivery: Within 24 Hours
                </div>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                <div className="flex justify-between items-center border-b dark:border-slate-800 pb-4">
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white">Express Checkout</h3>
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4 text-left">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold dark:text-white focus:outline-none focus:border-[#2f80ed]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Phone Number</label>
                      <input
                        type="text"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold dark:text-white focus:outline-none focus:border-[#2f80ed]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pincode</label>
                      <input
                        type="text"
                        required
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold dark:text-white focus:outline-none focus:border-[#2f80ed]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Delivery Address</label>
                    <textarea
                      required
                      rows={2}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold dark:text-white focus:outline-none focus:border-[#2f80ed]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Payment Method</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'upi', label: 'UPI / GPay', icon: '📱' },
                        { id: 'card', label: 'Card', icon: '💳' },
                        { id: 'cod', label: 'Cash on Delivery', icon: '💵' }
                      ].map((pm) => (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, paymentMethod: pm.id })}
                          className={`p-3 rounded-2xl border text-center font-bold text-xs transition-all flex flex-col items-center gap-1 ${
                            formData.paymentMethod === pm.id
                              ? 'bg-[#2f80ed] text-white border-[#2f80ed] shadow-md'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span className="text-lg">{pm.icon}</span>
                          <span>{pm.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center border-t dark:border-slate-800">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total Amount</span>
                    <span className="text-2xl font-black text-[#2f80ed]">₹{total.toLocaleString()}</span>
                  </div>

                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white font-black px-8 py-4 rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-green-500/20 hover:scale-105 transition-all"
                  >
                    Confirm Order
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartDrawer;
