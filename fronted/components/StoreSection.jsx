import React, { useMemo, useState } from 'react';
import { AppView, Language } from '../../backened/types';
import { translations } from '../../backened/i18n';

const products = [
    { id: 'med1', name: 'Paracetamol 500mg', price: 45, originalPrice: 120, category: 'Medicine', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400', description: 'Relief from pain and fever.' },
    { id: 's1', name: 'Vitamin C Serum', price: 599, originalPrice: 1499, category: 'Skincare', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=400', description: 'Brightening formulation.' },
    { id: 'm2', name: 'Digital BP Monitor', price: 1299, originalPrice: 2999, category: 'Equipment', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400', description: 'Accurate tracking.' },
    { id: 'm3', name: 'Pulse Oximeter', price: 399, originalPrice: 899, category: 'Equipment', image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=400', description: 'SpO2 monitoring.' }
];

const productHindiNames = {
    med1: 'पैरासिटामोल 500mg',
    s1: 'विटामिन C सीरम',
    m2: 'डिजिटल बीपी मॉनिटर',
    m3: 'पल्स ऑक्सीमीटर'
};

const StoreSection = ({ onNavigate, lang = Language.EN, cart = [], onAddToCart, onOpenCart }) => {
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [addedIds, setAddedIds] = useState({});
    const isHindi = lang === Language.HI;
    const t = translations[lang]?.sections || translations[Language.EN].sections;
    const storeT = translations[lang]?.store || translations[Language.EN].store;

    const filteredProducts = useMemo(() => products.filter(product => {
        const prodName = isHindi ? (productHindiNames[product.id] || product.name) : product.name;
        return (filter === 'All' || product.category === filter) && prodName.toLowerCase().includes(search.toLowerCase());
    }), [search, filter, isHindi]);
    const cartTotal = cart.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);

    const handleAddProduct = (product) => {
        if (onAddToCart) {
            onAddToCart(product);
            setAddedIds((prev) => ({ ...prev, [product.id]: true }));
            setTimeout(() => {
                setAddedIds((prev) => ({ ...prev, [product.id]: false }));
            }, 1800);
        }
    };

    return (
        <section className="px-4 md:px-8 py-20 space-y-12 max-w-[1440px] mx-auto relative z-10">
            <div className="bg-[#1e2a3a] dark:bg-slate-900 rounded-[4rem] p-10 md:p-14 text-white shadow-2xl space-y-10 relative overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                    <div className="space-y-2 text-center md:text-left">
                        <h2 className="text-4xl font-black tracking-tighter uppercase">{storeT.title || t.marketplace}</h2>
                        <p className="text-slate-400 font-medium max-w-md">{storeT.subtitle || t.marketplaceSub}</p>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={onOpenCart} className="bg-white/10 hover:bg-white/20 px-8 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest border border-white/10 transition-all flex items-center gap-2 cursor-pointer">
                            <span>🛒 {storeT.cart || 'Cart'}</span>
                            <span className="bg-[#2f80ed] text-white px-2 py-0.5 rounded-full text-[10px]">{cart.reduce((s, i) => s + (i.quantity || 1), 0)}</span>
                            <span>(₹{cartTotal.toLocaleString()})</span>
                        </button>
                        <button onClick={() => onNavigate?.(AppView.AMBULANCE)} className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all cursor-pointer">{storeT.emergencySos || 'Emergency SOS'}</button>
                    </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                    {[
                        { label: storeT.buyMeds || 'Buy Meds', icon: '💊', color: 'bg-blue-500/20', view: AppView.STORE },
                        { label: storeT.sellGear || 'Sell Gear', icon: '📸', color: 'bg-green-500/20', view: AppView.SCANNER },
                        { label: storeT.rentEquipment || 'Rent Equipment', icon: '🦽', color: 'bg-orange-500/20', view: AppView.EQUIPMENT_PORTAL },
                        { label: storeT.donations || 'Donations', icon: '🤝', color: 'bg-purple-500/20', view: AppView.EQUIPMENT_PORTAL }
                    ].map(hub => <div key={hub.label} onClick={() => onNavigate?.(hub.view)} className={`${hub.color} p-6 rounded-[2.5rem] border border-white/5 hover:bg-white/10 cursor-pointer transition-all flex items-center gap-4 group active:scale-95`}><span className="text-3xl group-hover:rotate-12 transition-transform">{hub.icon}</span><span className="text-[10px] font-black uppercase tracking-widest">{hub.label}</span></div>)}
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{storeT.title || "Essential Pharmacy"}</h3>
                <div className="flex gap-2">{(storeT.categories || ['All', 'Medicine', 'Skincare', 'Equipment']).map((category, idx) => {
                    const rawCat = ['All', 'Medicine', 'Skincare', 'Equipment'][idx] || category;
                    return <button key={category} onClick={() => setFilter(rawCat)} className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === rawCat ? 'bg-[#2f80ed] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>{category}</button>;
                })}</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredProducts.map(product => (
                    <div key={product.id} className="bg-white dark:bg-slate-800 p-6 rounded-[4rem] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all group flex flex-col justify-between">
                        <div className="aspect-[4/5] rounded-[3rem] overflow-hidden mb-6 bg-slate-50 dark:bg-slate-900">
                            <img
                                src={product.image}
                                alt={product.name}
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=400';
                                }}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                            />
                        </div>
                        <div className="space-y-4 px-2">
                            <h4 className="text-xl font-black dark:text-white group-hover:text-[#2f80ed] transition-colors line-clamp-1">
                                {isHindi ? (productHindiNames[product.id] || product.name) : product.name}
                            </h4>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-2xl font-black dark:text-white">₹{product.price}</span>
                                <button
                                    onClick={() => handleAddProduct(product)}
                                    className={`h-12 px-5 rounded-2xl font-black text-xs transition-all shadow-sm cursor-pointer flex items-center gap-1.5 ${addedIds[product.id]
                                            ? 'bg-green-500 text-white scale-105'
                                            : 'bg-slate-100 dark:bg-slate-900 hover:bg-[#2f80ed] hover:text-white text-slate-700 dark:text-slate-300'
                                        }`}
                                >
                                    <span>
                                        {addedIds[product.id]
                                            ? (isHindi ? '✓ जोड़ा गया' : '✓ Added')
                                            : (isHindi ? '+ जोड़ें' : '+ Add')}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default StoreSection;
