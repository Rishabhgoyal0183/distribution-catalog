import { useState, useEffect } from 'react';
import { Brand, Category, Product } from '@/types/catalog';

const STORAGE_KEYS = {
  brands: 'catalog_brands',
  categories: 'catalog_categories',
  products: 'catalog_products',
};

export const useCatalog = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedBrands = localStorage.getItem(STORAGE_KEYS.brands);
    const storedCategories = localStorage.getItem(STORAGE_KEYS.categories);
    const storedProducts = localStorage.getItem(STORAGE_KEYS.products);

    if (storedBrands) setBrands(JSON.parse(storedBrands));
    if (storedCategories) setCategories(JSON.parse(storedCategories));
    if (storedProducts) setProducts(JSON.parse(storedProducts));
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEYS.brands, JSON.stringify(brands));
    }
  }, [brands, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(categories));
    }
  }, [categories, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
    }
  }, [products, isLoaded]);

  // Brand operations
  const addBrand = (name: string) => {
    const newBrand: Brand = {
      id: crypto.randomUUID(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
    };
    setBrands(prev => [...prev, newBrand]);
    return newBrand;
  };

  const deleteBrand = (id: string) => {
    setBrands(prev => prev.filter(b => b.id !== id));
    // Also delete products of this brand
    setProducts(prev => prev.filter(p => p.brandId !== id));
  };

  // Category operations
  const addCategory = (name: string) => {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: name.trim(),
      createdAt: new Date().toISOString(),
    };
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    // Also delete products of this category
    setProducts(prev => prev.filter(p => p.categoryId !== id));
  };

  // Product operations
  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const getProductsByBrand = (brandId: string) => {
    return products.filter(p => p.brandId === brandId);
  };

  const getProductsByCategory = (categoryId: string) => {
    return products.filter(p => p.categoryId === categoryId);
  };

  const getBrandById = (id: string) => brands.find(b => b.id === id);
  const getCategoryById = (id: string) => categories.find(c => c.id === id);

  return {
    brands,
    categories,
    products,
    isLoaded,
    addBrand,
    deleteBrand,
    addCategory,
    deleteCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductsByBrand,
    getProductsByCategory,
    getBrandById,
    getCategoryById,
  };
};
