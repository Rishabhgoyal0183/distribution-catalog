import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Tag, Building2 } from 'lucide-react';
import { Brand, Category } from '@/types/catalog';
import { AddBrandDialog } from './AddBrandDialog';
import { AddCategoryDialog } from './AddCategoryDialog';

interface ManageSectionProps {
  brands: Brand[];
  categories: Category[];
  onAddBrand: (name: string) => void;
  onDeleteBrand: (id: string) => void;
  onAddCategory: (name: string) => void;
  onDeleteCategory: (id: string) => void;
}

export const ManageSection = ({
  brands,
  categories,
  onAddBrand,
  onDeleteBrand,
  onAddCategory,
  onDeleteCategory,
}: ManageSectionProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Brands</CardTitle>
            </div>
            <AddBrandDialog onAdd={onAddBrand} />
          </div>
        </CardHeader>
        <CardContent>
          {brands.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No brands yet. Add your first brand!
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {brands.map((brand) => (
                <Badge key={brand.id} variant="secondary" className="gap-1 pr-1">
                  {brand.name}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                    onClick={() => onDeleteBrand(brand.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Categories</CardTitle>
            </div>
            <AddCategoryDialog onAdd={onAddCategory} />
          </div>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No categories yet. Add your first category!
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge key={category.id} variant="outline" className="gap-1 pr-1">
                  {category.name}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                    onClick={() => onDeleteCategory(category.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
