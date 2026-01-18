import { useMemo } from 'react';
import { Category, Product } from '@/types/catalog';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface CategoryTabsProps {
  categories: Category[];
  allProducts: Product[];
  filteredProducts: Product[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  onScrollToCategory?: (categoryId: string) => void;
}

export const CategoryTabs = ({
  categories,
  allProducts,
  filteredProducts,
  selectedCategory,
  onCategoryChange,
  onScrollToCategory,
}: CategoryTabsProps) => {
  // Calculate product count per category using ALL products
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: filteredProducts.length };
    categories.forEach((category) => {
      counts[category.id] = allProducts.filter((p) => p.categoryId === category.id).length;
    });
    return counts;
  }, [categories, allProducts, filteredProducts]);

  // Filter categories that have products
  const categoriesWithProducts = useMemo(() => {
    return categories.filter((category) => categoryCounts[category.id] > 0);
  }, [categories, categoryCounts]);

  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategory === 'all' && categoryId !== 'all' && onScrollToCategory) {
      // In "All" view, scroll to the category section
      onScrollToCategory(categoryId);
    } else {
      // Otherwise, filter to that category
      onCategoryChange(categoryId);
    }
  };

  return (
    <div className="relative w-full">
      {/* Fade edges for scroll indication */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none opacity-0 md:opacity-100" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-3 px-1">
          {/* All Tab */}
          <button
            onClick={() => handleCategoryClick('all')}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300",
              "hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/20",
              "group overflow-hidden",
              selectedCategory === 'all'
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {/* Animated background glow */}
            <span
              className={cn(
                "absolute inset-0 rounded-full transition-opacity duration-300",
                selectedCategory === 'all'
                  ? "opacity-100 bg-gradient-to-r from-primary via-primary/80 to-primary animate-pulse"
                  : "opacity-0"
              )}
            />
            <span className="relative z-10">All</span>
            <span
              className={cn(
                "relative z-10 inline-flex items-center justify-center min-w-[1.5rem] h-5 px-1.5 rounded-full text-xs font-semibold transition-all duration-300",
                selectedCategory === 'all'
                  ? "bg-primary-foreground/20 text-primary-foreground scale-110"
                  : "bg-muted-foreground/20 text-muted-foreground group-hover:scale-105"
              )}
            >
              {categoryCounts.all}
            </span>
            {/* Underline indicator */}
            <span
              className={cn(
                "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary-foreground rounded-full transition-all duration-300",
                selectedCategory === 'all' ? "w-8 opacity-100" : "w-0 opacity-0"
              )}
            />
          </button>

          {/* Category Tabs */}
          {categoriesWithProducts.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300",
                "hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/20",
                "group overflow-hidden",
                selectedCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {/* Animated background glow */}
              <span
                className={cn(
                  "absolute inset-0 rounded-full transition-opacity duration-300",
                  selectedCategory === category.id
                    ? "opacity-100 bg-gradient-to-r from-primary via-primary/80 to-primary"
                    : "opacity-0"
                )}
              />
              <span className="relative z-10">{category.name}</span>
              <span
                className={cn(
                  "relative z-10 inline-flex items-center justify-center min-w-[1.5rem] h-5 px-1.5 rounded-full text-xs font-semibold transition-all duration-300",
                  selectedCategory === category.id
                    ? "bg-primary-foreground/20 text-primary-foreground scale-110"
                    : "bg-muted-foreground/20 text-muted-foreground group-hover:scale-105"
                )}
              >
                {categoryCounts[category.id]}
              </span>
              {/* Underline indicator */}
              <span
                className={cn(
                  "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary-foreground rounded-full transition-all duration-300",
                  selectedCategory === category.id ? "w-8 opacity-100" : "w-0 opacity-0"
                )}
              />
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-2" />
      </ScrollArea>
    </div>
  );
};
