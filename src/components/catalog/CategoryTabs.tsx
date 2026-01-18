import { useMemo } from 'react';
import { Category, Product } from '@/types/catalog';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Package,
  ShoppingBag,
  Coffee,
  Utensils,
  Cookie,
  Milk,
  Wheat,
  Droplets,
  Flame,
  Apple,
  Candy,
  Sandwich,
  IceCream,
  Soup,
  Salad,
  Beef,
  Fish,
  Egg,
  Carrot,
  Grape,
  type LucideIcon,
} from 'lucide-react';

// Smart icon mapping based on category name keywords
const getCategoryIcon = (categoryName: string): LucideIcon => {
  const name = categoryName.toLowerCase();
  
  if (name.includes('snack') || name.includes('chips') || name.includes('boondi')) return Cookie;
  if (name.includes('bakery') || name.includes('bread') || name.includes('biscuit')) return Sandwich;
  if (name.includes('batter') || name.includes('battery')) return Droplets;
  if (name.includes('kirana') || name.includes('grocery')) return ShoppingBag;
  if (name.includes('drink') || name.includes('beverage') || name.includes('juice')) return Coffee;
  if (name.includes('dairy') || name.includes('milk') || name.includes('curd')) return Milk;
  if (name.includes('flour') || name.includes('atta') || name.includes('wheat') || name.includes('sooji') || name.includes('besan') || name.includes('maida')) return Wheat;
  if (name.includes('oil') || name.includes('ghee')) return Droplets;
  if (name.includes('spice') || name.includes('masala')) return Flame;
  if (name.includes('fruit')) return Apple;
  if (name.includes('sweet') || name.includes('candy') || name.includes('chocolate')) return Candy;
  if (name.includes('ice') || name.includes('cream')) return IceCream;
  if (name.includes('soup') || name.includes('instant')) return Soup;
  if (name.includes('vegetable') || name.includes('veggie')) return Salad;
  if (name.includes('meat') || name.includes('chicken')) return Beef;
  if (name.includes('fish') || name.includes('seafood')) return Fish;
  if (name.includes('egg')) return Egg;
  if (name.includes('dal') || name.includes('pulse') || name.includes('lentil')) return Carrot;
  if (name.includes('rice') || name.includes('grain')) return Grape;
  if (name.includes('food') || name.includes('meal')) return Utensils;
  
  return Package; // Default fallback
};

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
            <Package className="relative z-10 h-4 w-4" />
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
          {categoriesWithProducts.map((category) => {
            const CategoryIcon = getCategoryIcon(category.name);
            return (
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
                <CategoryIcon className="relative z-10 h-4 w-4" />
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
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="h-2" />
      </ScrollArea>
    </div>
  );
};
