import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, ShoppingCart, AlertTriangle } from 'lucide-react';
import { Brand, Category, Product } from '@/types/catalog';
import { OrderItem, Order } from '@/hooks/useOrders';
import { toast } from 'sonner';

interface TakeOrderDialogProps {
  products: Product[];
  brands: Brand[];
  categories: Category[];
  getBrandById: (id: string) => Brand | undefined;
  getCategoryById: (id: string) => Category | undefined;
  onAdd: (shopkeeperName: string, items: OrderItem[]) => void;
  orders: Order[]; // Added to check existing orders
}

export const TakeOrderDialog = ({
  products,
  brands,
  categories,
  getBrandById,
  getCategoryById,
  onAdd,
  orders,
}: TakeOrderDialogProps) => {
  const [open, setOpen] = useState(false);
  const [shopkeeperName, setShopkeeperName] = useState('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Calculate reserved stock from pending and packed orders (not delivered)
  const reservedStock = useMemo(() => {
    const reserved: Record<string, number> = {};
    orders
      .filter(order => order.status === 'pending' || order.status === 'packed')
      .forEach(order => {
        order.items.forEach(item => {
          reserved[item.productId] = (reserved[item.productId] || 0) + item.quantity;
        });
      });
    return reserved;
  }, [orders]);

  // Get available stock for a product (total stock - reserved)
  const getAvailableStock = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return 0;
    const reserved = reservedStock[productId] || 0;
    return Math.max(0, product.stock - reserved);
  };

  // Get quantity already in current order items
  const getQuantityInCurrentOrder = (productId: string) => {
    const item = orderItems.find(i => i.productId === productId);
    return item?.quantity || 0;
  };

  // Get categories that have products with the selected brand
  const filteredCategories = filterBrand
    ? categories.filter(category => 
        products.some(product => 
          product.brandId === filterBrand && product.categoryId === category.id
        )
      )
    : [];

  // Get products filtered by selected brand and category
  const filteredProducts = products.filter(p => {
    const matchesBrand = filterBrand && p.brandId === filterBrand;
    const matchesCategory = filterCategory && p.categoryId === filterCategory;
    return matchesBrand && matchesCategory;
  });

  // Reset category and product when brand changes
  const handleBrandChange = (value: string) => {
    setFilterBrand(value);
    setFilterCategory('');
    setSelectedProduct('');
  };

  // Reset product when category changes
  const handleCategoryChange = (value: string) => {
    setFilterCategory(value);
    setSelectedProduct('');
  };

  const addItemToOrder = () => {
    if (!selectedProduct || !quantity) return;

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const requestedQty = parseInt(quantity);
    const availableStock = getAvailableStock(selectedProduct);
    const alreadyInOrder = getQuantityInCurrentOrder(selectedProduct);
    const remainingAvailable = availableStock - alreadyInOrder;

    // Check if adding this quantity would exceed available stock
    if (requestedQty > remainingAvailable) {
      toast.error(`Insufficient stock! Only ${remainingAvailable} available for ${product.name}`, {
        description: `Stock: ${product.stock}, Reserved in orders: ${reservedStock[selectedProduct] || 0}, In this order: ${alreadyInOrder}`,
      });
      return;
    }

    const existingIndex = orderItems.findIndex(i => i.productId === selectedProduct);

    if (existingIndex >= 0) {
      setOrderItems(prev =>
        prev.map((item, idx) =>
          idx === existingIndex
            ? { ...item, quantity: item.quantity + requestedQty }
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
          quantity: requestedQty,
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
    setFilterBrand('');
    setFilterCategory('');
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
              <Select value={filterBrand} onValueChange={handleBrandChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[200]">
                  {brands.map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={filterCategory} 
                onValueChange={handleCategoryChange}
                disabled={!filterBrand}
              >
                <SelectTrigger>
                  <SelectValue placeholder={filterBrand ? "Select category" : "Select brand first"} />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[200]">
                  {filteredCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Select 
                value={selectedProduct} 
                onValueChange={setSelectedProduct}
                disabled={!filterCategory}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder={filterCategory ? "Select product" : "Select category first"} />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[200]">
                  {filteredProducts.map((p) => {
                    const available = getAvailableStock(p.id) - getQuantityInCurrentOrder(p.id);
                    const isOutOfStock = available <= 0;
                    return (
                      <SelectItem 
                        key={p.id} 
                        value={p.id}
                        disabled={isOutOfStock}
                        className={isOutOfStock ? 'opacity-50' : ''}
                      >
                        {p.name} {isOutOfStock ? '(Out of stock)' : `(${available} available)`}
                      </SelectItem>
                    );
                  })}
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
                {orderItems.map((item) => {
                  const available = getAvailableStock(item.productId);
                  const exceedsStock = item.quantity > available;
                  return (
                    <div
                      key={item.productId}
                      className={`flex items-center justify-between p-2 rounded-lg text-sm ${exceedsStock ? 'bg-destructive/10 border border-destructive/30' : 'bg-muted'}`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{item.productName}</span>
                          <span className="text-muted-foreground"> × {item.quantity}</span>
                          {exceedsStock && (
                            <AlertTriangle className="h-3 w-3 text-destructive" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.brandName} • {item.categoryName}
                          {exceedsStock && (
                            <span className="text-destructive ml-1">(Only {available} available)</span>
                          )}
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
                  );
                })}
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
