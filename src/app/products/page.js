"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

import { Suspense } from 'react';

function ProductsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filter states
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
    const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');

    // Load Categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories');
                const data = await res.json();
                setCategories(data);
            } catch (err) {
                console.error("Failed to load categories", err);
            }
        };
        fetchCategories();
    }, []);

    // Fetch Products
    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.set('search', search);
            if (category) params.set('category', category);
            params.set('sortBy', sortBy);
            params.set('sortOrder', sortOrder);

            const res = await fetch(`/api/products?${params.toString()}`);
            const data = await res.json();
            setProducts(data.products || []);
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setIsLoading(false);
        }
    }, [search, category, sortBy, sortOrder]);

    useEffect(() => {
        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchProducts();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [fetchProducts]);

    // Update URL params
    const updateFilters = (key, value) => {
        if (key === 'category') setCategory(value);
        if (key === 'sort') {
            // value format: field-order (e.g. price-asc)
            const [field, order] = value.split('-');
            setSortBy(field);
            setSortOrder(order);
        }
    };

    return (
        <>
            <main className="container mx-auto px-4 sm:px-6 py-12 min-h-screen bg-[#fffcfc]">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif text-[#4a4042] mb-4">All Collections</h1>
                    <p className="text-gray-500 font-light">Explore our complete range of premium hijabs and accessories.</p>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 sticky top-20 z-10 bg-[#fffcfc]/90 backdrop-blur-sm py-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-3 bg-white border border-[#eadddd] rounded-lg focus:ring-1 focus:ring-[#dca5ad] outline-none shadow-sm"
                        />
                    </div>

                    <select
                        value={category}
                        onChange={(e) => updateFilters('category', e.target.value)}
                        className="px-4 py-3 bg-white border border-[#eadddd] rounded-lg focus:ring-1 focus:ring-[#dca5ad] outline-none shadow-sm cursor-pointer"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>

                    <select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => updateFilters('sort', e.target.value)}
                        className="px-4 py-3 bg-white border border-[#eadddd] rounded-lg focus:ring-1 focus:ring-[#dca5ad] outline-none shadow-sm cursor-pointer"
                    >
                        <option value="createdAt-desc">Newest First</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="name-asc">Name: A-Z</option>
                        <option value="category-asc">Category: A-Z</option>
                    </select>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
                    {isLoading ? (
                        Array.from({ length: 8 }).map((_, index) => (
                            <div key={index} className="bg-gray-100 rounded-lg aspect-[3/4] animate-pulse"></div>
                        ))
                    ) : products.length > 0 ? (
                        products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                            <button
                                onClick={() => { setSearch(''); setCategory(''); }}
                                className="mt-4 text-[#dca5ad] hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}

export default function AllProductsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <ProductsContent />
        </Suspense>
    );
}
