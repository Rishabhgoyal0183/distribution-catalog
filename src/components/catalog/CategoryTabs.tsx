import { useMemo } from 'react';
import { Category, Product } from '@/types/catalog';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface CategoryTabsProps {
  categories: Category[];
  allProducts: Product[]; // Full product list for counting
  filteredProducts: Product[]; // Filtered by search/brand for "All" count
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export const CategoryTabs = ({
  categories,
  allProducts,
  filteredProducts,
  selectedCategory,
  onCategoryChange,
}: CategoryTabsProps) => {
  // Calculate product count per category using ALL products (not filtered)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: filteredProducts.length };
    categories.forEach((category) => {
      // Count from allProducts so tabs always show
      counts[category.id] = allProducts.filter((p) => p.categoryId === category.id).length;
    });
    return counts;
  }, [categories, allProducts, filteredProducts]);

  // Filter categories that have products
  const categoriesWithProducts = useMemo(() => {
    return categories.filter((category) => categoryCounts[category.id] > 0);
  }, [categories, categoryCounts]);

  return (
    <div className="relative w-full">
      {/* Fade edges for scroll indication */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none opacity-0 md:opacity-100" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-3 px-1">
          {/* All Tab */}
          <button
            onClick={() => onCategoryChange('all')}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
              "hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/20",
              selectedCategory === 'all'
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            All
            <span
              className={cn(
                "inline-flex items-center justify-center min-w-[1.5rem] h-5 px-1.5 rounded-full text-xs font-semibold",
                selectedCategory === 'all'
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted-foreground/20 text-muted-foreground"
              )}
            >
              {categoryCounts.all}
            </span>
          </button>

          {/* Category Tabs */}
          {categoriesWithProducts.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
                "hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/20",
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {category.name}
              <span
                className={cn(
                  "inline-flex items-center justify-center min-w-[1.5rem] h-5 px-1.5 rounded-full text-xs font-semibold",
                  selectedCategory === category.id
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted-foreground/20 text-muted-foreground"
                )}
              >
                {categoryCounts[category.id]}
              </span>
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-2" />
      </ScrollArea>
    </div>
  );
};
