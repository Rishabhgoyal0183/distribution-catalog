import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Package } from 'lucide-react';
import { Product } from '@/types/catalog';

interface ProductCardProps {
  product: Product;
  brandName: string;
  categoryName: string;
  onDelete?: (id: string) => void;
  isAuthenticated?: boolean;
}

export const ProductCard = ({ product, brandName, categoryName, onDelete, isAuthenticated }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden group hover:shadow-md transition-shadow">
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`absolute inset-0 flex items-center justify-center ${product.imageUrl ? 'hidden' : ''}`}>
          <Package className="h-8 w-8 text-muted-foreground/50" />
        </div>
        {onDelete && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
            onClick={() => onDelete(product.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      <CardContent className="p-2 sm:p-3 space-y-1.5">
        <h3 className="font-semibold text-foreground line-clamp-1 text-sm">{product.name}</h3>
        <div className="flex gap-1 flex-wrap">
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{brandName}</Badge>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">{categoryName}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm sm:text-base font-bold text-primary">₹{product.price.toFixed(2)}</span>
          {isAuthenticated && (
            <span className={`text-[10px] sm:text-xs ${product.stock > 0 ? 'text-green-600' : 'text-destructive'}`}>
              {product.stock > 0 ? `${product.stock}` : 'Out'}
            </span>
          )}
        </div>
        {product.description && (
          <p className="text-xs text-muted-foreground line-clamp-1 hidden sm:block">{product.description}</p>
        )}
      </CardContent>
    </Card>
  );
};
