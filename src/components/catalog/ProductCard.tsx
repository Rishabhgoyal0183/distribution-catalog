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
}

export const ProductCard = ({ product, brandName, categoryName, onDelete }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <div className="aspect-square bg-muted relative overflow-hidden">
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
          <Package className="h-12 w-12 text-muted-foreground/50" />
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
      <CardContent className="p-4 space-y-2">
        <h3 className="font-semibold text-foreground line-clamp-1">{product.name}</h3>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary" className="text-xs">{brandName}</Badge>
          <Badge variant="outline" className="text-xs">{categoryName}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">₹{product.price.toFixed(2)}</span>
          <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-destructive'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
        {product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        )}
      </CardContent>
    </Card>
  );
};
