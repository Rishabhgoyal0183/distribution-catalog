import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCatalog } from '@/hooks/useCatalog';
import { useOrders, OrderItem } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';
import { CatalogHeader } from '@/components/catalog/CatalogHeader';
import { ManageSection } from '@/components/catalog/ManageSection';
import { StockAnalysisSection } from '@/components/catalog/StockAnalysisSection';
import { FilterBar } from '@/components/catalog/FilterBar';
import { ProductCard } from '@/components/catalog/ProductCard';
import { AddProductDialog } from '@/components/catalog/AddProductDialog';
import { TakeOrderDialog } from '@/components/catalog/TakeOrderDialog';
import { OrdersSection } from '@/components/catalog/OrdersSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Package, Settings, ClipboardList, LogIn, Lock } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const {
    brands,
    categories,
    products,
    isLoaded,
    addBrand,
    deleteBrand,
    addCategory,
    deleteCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    getBrandById,
    getCategoryById,
  } = useCatalog();

  const {
    orders,
    isLoaded: ordersLoaded,
    addOrder,
    updateOrderStatus,
    deleteOrder,
    exportToJSON,
    exportToCSV,
    importFromJSON,
  } = useOrders();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = selectedBrand === 'all' || product.brandId === selectedBrand;
      const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
      return matchesSearch && matchesBrand && matchesCategory;
    });
  }, [products, searchQuery, selectedBrand, selectedCategory]);

  // Handle stock deduction when order is delivered
  const handleDelivered = useCallback((items: OrderItem[]) => {
    items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        const newStock = Math.max(0, product.stock - item.quantity);
        updateProduct(item.productId, { stock: newStock });
      }
    });
  }, [products, updateProduct]);

  // Wrapper for updateOrderStatus that handles stock deduction
  const handleUpdateOrderStatus = useCallback((id: string, status: 'pending' | 'packed' | 'delivered') => {
    updateOrderStatus(id, status, handleDelivered);
  }, [updateOrderStatus, handleDelivered]);

  // Handle stock update from product card
  const handleUpdateStock = useCallback((id: string, newStock: number) => {
    updateProduct(id, { stock: newStock });
  }, [updateProduct]);

  if (!isLoaded || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading catalog...</div>
      </div>
    );
  }

  const ProtectedContent = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated) {
      return (
        <div className="text-center py-12">
          <Lock className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Login Required</h3>
          <p className="text-muted-foreground mb-4">
            Please sign in to access this section.
          </p>
          <Button onClick={() => navigate('/login')}>
            <LogIn className="h-4 w-4 mr-2" />
            Sign In
          </Button>
        </div>
      );
    }
    return <>{children}</>;
  };

  return (
    <div className="min-h-screen bg-background">
      <CatalogHeader />
      
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="catalog" className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="catalog" className="gap-2">
              <Package className="h-4 w-4" />
              Catalog
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <ClipboardList className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="manage" className="gap-2">
              <Settings className="h-4 w-4" />
              Manage
            </TabsTrigger>
          </TabsList>

          <TabsContent value="catalog" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <div className="flex-1">
                <FilterBar
                  brands={brands}
                  categories={categories}
                  searchQuery={searchQuery}
                  selectedBrand={selectedBrand}
                  selectedCategory={selectedCategory}
                  onSearchChange={setSearchQuery}
                  onBrandChange={setSelectedBrand}
                  onCategoryChange={setSelectedCategory}
                />
              </div>
              {isAuthenticated && brands.length > 0 && categories.length > 0 && (
                <AddProductDialog
                  brands={brands}
                  categories={categories}
                  products={products}
                  onAdd={addProduct}
                />
              )}
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No products yet</h3>
                <p className="text-muted-foreground mb-4">
                  {brands.length === 0 || categories.length === 0
                    ? 'Add brands and categories first in the Manage tab, then add your products.'
                    : 'Start adding products to your catalog!'}
                </p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products match your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    brandName={getBrandById(product.brandId)?.name || 'Unknown'}
                    categoryName={getCategoryById(product.categoryId)?.name || 'Unknown'}
                    onDelete={isAuthenticated ? deleteProduct : undefined}
                    isAuthenticated={isAuthenticated}
                    onUpdateStock={isAuthenticated ? handleUpdateStock : undefined}
                  />
                ))}
              </div>
            )}

            <div className="text-center text-sm text-muted-foreground">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <ProtectedContent>
              {ordersLoaded && (
                <>
                  <div className="flex justify-end">
                    {products.length > 0 && (
                      <TakeOrderDialog
                        products={products}
                        brands={brands}
                        categories={categories}
                        getBrandById={getBrandById}
                        getCategoryById={getCategoryById}
                        onAdd={addOrder}
                        orders={orders}
                      />
                    )}
                  </div>
                  <OrdersSection
                    orders={orders}
                    onUpdateStatus={handleUpdateOrderStatus}
                    onDelete={deleteOrder}
                    onExportJSON={exportToJSON}
                    onExportCSV={exportToCSV}
                    onImportJSON={importFromJSON}
                  />
                </>
              )}
            </ProtectedContent>
          </TabsContent>

          <TabsContent value="manage">
            <ProtectedContent>
              <ManageSection
                brands={brands}
                categories={categories}
                onAddBrand={addBrand}
                onDeleteBrand={deleteBrand}
                onAddCategory={addCategory}
                onDeleteCategory={deleteCategory}
                getBrandById={getBrandById}
              />
              <StockAnalysisSection
                products={products}
                orders={orders}
                getBrandById={getBrandById}
              />
            </ProtectedContent>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
