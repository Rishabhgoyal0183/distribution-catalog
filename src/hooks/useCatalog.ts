import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Brand, Category, Product } from '@/types/catalog';

export const useCatalog = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from database on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsRes, categoriesRes, productsRes] = await Promise.all([
          supabase.from('brands').select('*').order('created_at', { ascending: true }),
          supabase.from('categories').select('*').order('created_at', { ascending: true }),
          supabase.from('products').select('*').order('created_at', { ascending: true }),
        ]);

        if (brandsRes.data) {
          setBrands(brandsRes.data.map(b => ({
            id: b.id,
            name: b.name,
            createdAt: b.created_at,
          })));
        }

        if (categoriesRes.data) {
          setCategories(categoriesRes.data.map(c => ({
            id: c.id,
            name: c.name,
            brandId: c.brand_id,
            createdAt: c.created_at,
          })));
        }

        if (productsRes.data) {
          setProducts(productsRes.data.map(p => ({
            id: p.id,
            name: p.name,
            brandId: p.brand_id,
            categoryId: p.category_id,
            price: Number(p.price),
            stock: p.stock,
            description: p.description,
            imageUrl: p.image_url,
            createdAt: p.created_at,
          })));
        }
      } catch (error) {
        console.error('Error fetching catalog data:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchData();
  }, []);

  // Brand operations
  const addBrand = async (name: string) => {
    const { data, error } = await supabase
      .from('brands')
      .insert({ name: name.trim() })
      .select()
      .single();

    if (error) {
      console.error('Error adding brand:', error);
      return null;
    }

    const newBrand: Brand = {
      id: data.id,
      name: data.name,
      createdAt: data.created_at,
    };
    setBrands(prev => [...prev, newBrand]);
    return newBrand;
  };

  const deleteBrand = async (id: string) => {
    const { error } = await supabase.from('brands').delete().eq('id', id);
    if (error) {
      console.error('Error deleting brand:', error);
      return;
    }
    setBrands(prev => prev.filter(b => b.id !== id));
    // Products are deleted automatically via CASCADE
    setProducts(prev => prev.filter(p => p.brandId !== id));
  };

  // Category operations
  const addCategory = async (name: string, brandId: string) => {
    const { data, error } = await supabase
      .from('categories')
      .insert({ name: name.trim(), brand_id: brandId })
      .select()
      .single();

    if (error) {
      console.error('Error adding category:', error);
      return null;
    }

    const newCategory: Category = {
      id: data.id,
      name: data.name,
      brandId: data.brand_id,
      createdAt: data.created_at,
    };
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) {
      console.error('Error deleting category:', error);
      return;
    }
    setCategories(prev => prev.filter(c => c.id !== id));
    // Products are deleted automatically via CASCADE
    setProducts(prev => prev.filter(p => p.categoryId !== id));
  };

  // Product operations
  const addProduct = async (product: Omit<Product, 'id' | 'createdAt'>) => {
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: product.name,
        brand_id: product.brandId,
        category_id: product.categoryId,
        price: product.price,
        stock: product.stock,
        description: product.description,
        image_url: product.imageUrl,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding product:', error);
      return null;
    }

    const newProduct: Product = {
      id: data.id,
      name: data.name,
      brandId: data.brand_id,
      categoryId: data.category_id,
      price: Number(data.price),
      stock: data.stock,
      description: data.description,
      imageUrl: data.image_url,
      createdAt: data.created_at,
    };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = async (id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>) => {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.brandId !== undefined) dbUpdates.brand_id = updates.brandId;
    if (updates.categoryId !== undefined) dbUpdates.category_id = updates.categoryId;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.stock !== undefined) dbUpdates.stock = updates.stock;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl;

    const { error } = await supabase.from('products').update(dbUpdates).eq('id', id);
    if (error) {
      console.error('Error updating product:', error);
      return;
    }
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error('Error deleting product:', error);
      return;
    }
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
