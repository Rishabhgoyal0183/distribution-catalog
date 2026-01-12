import { useState, useEffect } from 'react';

export interface OrderItem {
  productId: string;
  productName: string;
  brandId: string;
  brandName: string;
  categoryId: string;
  categoryName: string;
  quantity: number;
}

export interface Order {
  id: string;
  shopkeeperName: string;
  items: OrderItem[];
  createdAt: string;
  status: 'pending' | 'packed' | 'delivered';
}

const STORAGE_KEY = 'catalog_orders';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setOrders(JSON.parse(stored));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    }
  }, [orders, isLoaded]);

  const addOrder = (shopkeeperName: string, items: OrderItem[]) => {
    const newOrder: Order = {
      id: crypto.randomUUID(),
      shopkeeperName: shopkeeperName.trim(),
      items,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    setOrders(prev => [...prev, newOrder]);
    return newOrder;
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(o => (o.id === id ? { ...o, status } : o))
    );
  };

  const deleteOrder = (id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  const exportToJSON = () => {
    const data = JSON.stringify(orders, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const headers = ['Order ID', 'Shopkeeper', 'Product', 'Brand', 'Category', 'Quantity', 'Status', 'Date'];
    const rows = orders.flatMap(order =>
      order.items.map(item => [
        order.id,
        order.shopkeeperName,
        item.productName,
        item.brandName,
        item.categoryName,
        item.quantity.toString(),
        order.status,
        new Date(order.createdAt).toLocaleDateString(),
      ])
    );
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importFromJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string) as Order[];
        setOrders(prev => [...prev, ...imported]);
      } catch (error) {
        console.error('Failed to import orders:', error);
      }
    };
    reader.readAsText(file);
  };

  return {
    orders,
    isLoaded,
    addOrder,
    updateOrderStatus,
    deleteOrder,
    exportToJSON,
    exportToCSV,
    importFromJSON,
  };
};
