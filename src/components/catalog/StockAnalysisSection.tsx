import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Package, AlertTriangle } from 'lucide-react';
import { Product } from '@/types/catalog';
import { Order } from '@/hooks/useOrders';

interface StockAnalysisSectionProps {
  products: Product[];
  orders: Order[];
  getBrandById: (id: string) => { name: string } | undefined;
}

export const StockAnalysisSection = ({ products, orders, getBrandById }: StockAnalysisSectionProps) => {
  const stockAnalysis = useMemo(() => {
    // Calculate reserved stock from pending and packed orders
    const reservedStock: Record<string, number> = {};
    
    orders.forEach(order => {
      if (order.status === 'pending' || order.status === 'packed') {
        order.items.forEach(item => {
          reservedStock[item.productId] = (reservedStock[item.productId] || 0) + item.quantity;
        });
      }
    });

    return products.map(product => {
      const reserved = reservedStock[product.id] || 0;
      const available = Math.max(0, product.stock - reserved);
      const isLowStock = available <= 5 && available > 0;
      const isOutOfStock = available === 0;

      return {
        product,
        totalStock: product.stock,
        reserved,
        available,
        isLowStock,
        isOutOfStock,
      };
    }).sort((a, b) => {
      // Sort by: out of stock first, then low stock, then by available ascending
      if (a.isOutOfStock && !b.isOutOfStock) return -1;
      if (!a.isOutOfStock && b.isOutOfStock) return 1;
      if (a.isLowStock && !b.isLowStock) return -1;
      if (!a.isLowStock && b.isLowStock) return 1;
      return a.available - b.available;
    });
  }, [products, orders]);

  const summary = useMemo(() => {
    const outOfStock = stockAnalysis.filter(s => s.isOutOfStock).length;
    const lowStock = stockAnalysis.filter(s => s.isLowStock).length;
    const healthy = stockAnalysis.filter(s => !s.isOutOfStock && !s.isLowStock).length;
    return { outOfStock, lowStock, healthy };
  }, [stockAnalysis]);

  if (products.length === 0) {
    return null;
  }

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Stock Analysis</CardTitle>
        </div>
        <div className="flex gap-2 mt-2">
          <Badge variant="destructive" className="text-xs">
            {summary.outOfStock} Out of Stock
          </Badge>
          <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-700">
            {summary.lowStock} Low Stock
          </Badge>
          <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-700">
            {summary.healthy} Healthy
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-h-64 overflow-y-auto space-y-2">
          {stockAnalysis.map(({ product, totalStock, reserved, available, isLowStock, isOutOfStock }) => (
            <div
              key={product.id}
              className={`flex items-center justify-between p-2 rounded-lg border ${
                isOutOfStock 
                  ? 'border-destructive/50 bg-destructive/5' 
                  : isLowStock 
                    ? 'border-yellow-500/50 bg-yellow-500/5' 
                    : 'border-border bg-background'
              }`}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {isOutOfStock || isLowStock ? (
                  <AlertTriangle className={`h-4 w-4 flex-shrink-0 ${isOutOfStock ? 'text-destructive' : 'text-yellow-600'}`} />
                ) : (
                  <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {getBrandById(product.brandId)?.name || 'Unknown'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="text-center">
                  <p className="font-medium">{totalStock}</p>
                  <p className="text-muted-foreground">Total</p>
                </div>
                <div className="text-center">
                  <p className="font-medium text-orange-600">{reserved}</p>
                  <p className="text-muted-foreground">Reserved</p>
                </div>
                <div className="text-center">
                  <p className={`font-medium ${isOutOfStock ? 'text-destructive' : isLowStock ? 'text-yellow-600' : 'text-green-600'}`}>
                    {available}
                  </p>
                  <p className="text-muted-foreground">Available</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
