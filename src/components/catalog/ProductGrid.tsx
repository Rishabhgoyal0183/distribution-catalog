import { useMemo } from 'react';
import { Product, Brand, Category } from '@/types/catalog';
import { ProductCard } from './ProductCard';
import { Package } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  brands: Brand[];
  categories: Category[];
  selectedCategory: string;
  getBrandById: (id: string) => Brand | undefined;
  getCategoryById: (id: string) => Category | undefined;
  isAuthenticated: boolean;
  onDelete?: (id: string) => void;
  onUpdateStock?: (id: string, stock: number) => void;
  onUpdate?: (id: string, updates: Partial<Omit<Product, 'id' | 'createdAt'>>) => void;
}

interface CategorySection {
  category: Category;
  products: Product[];
}

export const ProductGrid = ({
  products,
  brands,
  categories,
  selectedCategory,
  getBrandById,
  getCategoryById,
  isAuthenticated,
  onDelete,
  onUpdateStock,
  onUpdate,
}: ProductGridProps) => {
  // Group products by category when "All" is selected
  const categorySections = useMemo((): CategorySection[] => {
    if (selectedCategory !== 'all') {
      return [];
    }

    const grouped: Record<string, Product[]> = {};
    products.forEach((product) => {
      if (!grouped[product.categoryId]) {
        grouped[product.categoryId] = [];
      }
      grouped[product.categoryId].push(product);
    });

    return categories
      .filter((category) => grouped[category.id]?.length > 0)
      .map((category) => ({
        category,
        products: grouped[category.id],
      }));
  }, [products, categories, selectedCategory]);

  // Filter products for specific category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return [];
    }
    return products.filter((p) => p.categoryId === selectedCategory);
  }, [products, selectedCategory]);

  if (products.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <Package className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
        <p className="text-muted-foreground">
          No products match your current filters.
        </p>
      </div>
    );
  }

  const renderProductCard = (product: Product) => (
    <div key={product.id} className="animate-scale-in">
      <ProductCard
        product={product}
        brandName={getBrandById(product.brandId)?.name || 'Unknown'}
        categoryName={getCategoryById(product.categoryId)?.name || 'Unknown'}
        onDelete={isAuthenticated ? onDelete : undefined}
        isAuthenticated={isAuthenticated}
        onUpdateStock={isAuthenticated ? onUpdateStock : undefined}
        brands={brands}
        categories={categories}
        onUpdate={isAuthenticated ? onUpdate : undefined}
      />
    </div>
  );

  // Render grouped view for "All" category
  if (selectedCategory === 'all') {
    return (
      <div className="space-y-8">
        {categorySections.map(({ category, products: categoryProducts }, index) => (
          <section
            key={category.id}
            id={`category-section-${category.id}`}
            className="animate-fade-in scroll-mt-32"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                {category.name}
              </h2>
              <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                {categoryProducts.length} {categoryProducts.length === 1 ? 'product' : 'products'}
              </span>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {categoryProducts.map(renderProductCard)}
            </div>
          </section>
        ))}
      </div>
    );
  }

  // Render single category view
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 animate-fade-in">
      {filteredProducts.map(renderProductCard)}
    </div>
  );
};
