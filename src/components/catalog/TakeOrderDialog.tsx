import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, ShoppingCart } from 'lucide-react';
import { Brand, Category, Product } from '@/types/catalog';
import { OrderItem } from '@/hooks/useOrders';

interface TakeOrderDialogProps {
  products: Product[];
  brands: Brand[];
  categories: Category[];
  getBrandById: (id: string) => Brand | undefined;
  getCategoryById: (id: string) => Category | undefined;
  onAdd: (shopkeeperName: string, items: OrderItem[]) => void;
}

export const TakeOrderDialog = ({
  products,
  brands,
  categories,
  getBrandById,
  getCategoryById,
  onAdd,
}: TakeOrderDialogProps) => {
  const [open, setOpen] = useState(false);
  const [shopkeeperName, setShopkeeperName] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [filterBrand, setFilterBrand] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredProducts = products.filter(p => {
    const matchesBrand = filterBrand === 'all' || p.brandId === filterBrand;
    const matchesCategory = filterCategory === 'all' || p.categoryId === filterCategory;
    return matchesBrand && matchesCategory;
  });

  const addItemToOrder = () => {
    if (!selectedProduct || !quantity) return;

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const existingIndex = orderItems.findIndex(i => i.productId === selectedProduct);

    if (existingIndex >= 0) {
      setOrderItems(prev =>
        prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + parseInt(quantity) }
            : item
        )
      );
    } else {
      const brand = getBrandById(product.brandId);
      const category = getCategoryById(product.categoryId);

      setOrderItems(prev => [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          brandId: product.brandId,
          brandName: brand?.name || 'Unknown',
          categoryId: product.categoryId,
          categoryName: category?.name || 'Unknown',
          quantity: parseInt(quantity),
        },
      ]);
    }

    setSelectedProduct('');
    setQuantity('1');
  };

  const removeItem = (productId: string) => {
    setOrderItems(prev => prev.filter(i => i.productId !== productId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (shopkeeperName.trim() && orderItems.length > 0) {
      onAdd(shopkeeperName, orderItems);
      setShopkeeperName('');
      setOrderItems([]);
      setOpen(false);
    }
  };

  const resetForm = () => {
    setShopkeeperName('');
    setOrderItems([]);
    setSelectedProduct('');
    setQuantity('1');
    setFilterBrand('all');
    setFilterCategory('all');
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <ShoppingCart className="h-4 w-4" />
          Take Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Take New Order</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shopkeeper">Shopkeeper Name *</Label>
            <Input
              id="shopkeeper"
              value={shopkeeperName}
              onChange={(e) => setShopkeeperName(e.target.value)}
              placeholder="Enter shopkeeper name"
              autoFocus
            />
          </div>

          <div className="space-y-3 p-3 border rounded-lg bg-muted/30">
            <Label>Add Products</Label>

            <div className="grid grid-cols-2 gap-2">
              <Select value={filterBrand} onValueChange={setFilterBrand}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {brands.map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {filteredProducts.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} - {getBrandById(p.brandId)?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-20"
                placeholder="Qty"
              />

              <Button
                type="button"
                variant="secondary"
                size="default"
                onClick={addItemToOrder}
                disabled={!selectedProduct}
              >
                Add Item
              </Button>
            </div>
          </div>

          {orderItems.length > 0 && (
            <div className="space-y-2">
              <Label>Order Items ({orderItems.length})</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {orderItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between p-2 bg-muted rounded-lg text-sm"
                  >
                    <div>
                      <span className="font-medium">{item.productName}</span>
                      <span className="text-muted-foreground"> × {item.quantity}</span>
                      <div className="text-xs text-muted-foreground">
                        {item.brandName} • {item.categoryName}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive"
                      onClick={() => removeItem(item.productId)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={!shopkeeperName.trim() || orderItems.length === 0}
          >
            Save Order ({orderItems.length} items)
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
