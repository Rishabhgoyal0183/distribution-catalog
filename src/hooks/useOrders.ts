import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load orders from database
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        if (ordersData) {
          const { data: itemsData, error: itemsError } = await supabase
            .from('order_items')
            .select('*');

          if (itemsError) throw itemsError;

          const ordersWithItems: Order[] = ordersData.map(order => ({
            id: order.id,
            shopkeeperName: order.shopkeeper_name,
            status: order.status as 'pending' | 'packed' | 'delivered',
            createdAt: order.created_at,
            items: (itemsData || [])
              .filter(item => item.order_id === order.id)
              .map(item => ({
                productId: item.product_id,
                productName: item.product_name,
                brandId: item.brand_id,
                brandName: item.brand_name,
                categoryId: item.category_id,
                categoryName: item.category_name,
                quantity: item.quantity,
              })),
          }));

          setOrders(ordersWithItems);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchOrders();
  }, []);

  const addOrder = async (shopkeeperName: string, items: OrderItem[]) => {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({ shopkeeper_name: shopkeeperName.trim() })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.productId,
        product_name: item.productName,
        brand_id: item.brandId,
        brand_name: item.brandName,
        category_id: item.categoryId,
        category_name: item.categoryName,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      const newOrder: Order = {
        id: orderData.id,
        shopkeeperName: orderData.shopkeeper_name,
        items,
        createdAt: orderData.created_at,
        status: orderData.status as 'pending' | 'packed' | 'delivered',
      };

      setOrders(prev => [newOrder, ...prev]);
      return newOrder;
    } catch (error) {
      console.error('Error adding order:', error);
      return null;
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating order status:', error);
      return;
    }

    setOrders(prev =>
      prev.map(o => (o.id === id ? { ...o, status } : o))
    );
  };

  const deleteOrder = async (id: string) => {
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (error) {
      console.error('Error deleting order:', error);
      return;
    }
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

  const importFromJSON = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string) as Order[];
        
        for (const order of imported) {
          await addOrder(order.shopkeeperName, order.items);
        }
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
