import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCatalog } from '@/hooks/useCatalog';
import { useOrders, OrderItem } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';
import { CatalogHeader } from '@/components/catalog/CatalogHeader';
import { ManageSection } from '@/components/catalog/ManageSection';
import { StockAnalysisSection } from '@/components/catalog/StockAnalysisSection';
import { FilterBar } from '@/components/catalog/FilterBar';
import { CategoryTabs } from '@/components/catalog/CategoryTabs';
import { ProductGrid } from '@/components/catalog/ProductGrid';
import { AddProductDialog } from '@/components/catalog/AddProductDialog';
import { TakeOrderDialog } from '@/components/catalog/TakeOrderDialog';
import { OrdersSection } from '@/components/catalog/OrdersSection';
import { CatalogPagination } from '@/components/catalog/CatalogPagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Package, Settings, ClipboardList, LogIn, Lock, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = selectedBrand === 'all' || product.brandId === selectedBrand;
      const matchesCategory = selectedCategory === 'all' || product.categoryId === selectedCategory;
      return matchesSearch && matchesBrand && matchesCategory;
    });
  }, [products, searchQuery, selectedBrand, selectedCategory]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Reset to first page when filters change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

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
            {/* Search and Add Product Row */}
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-3">
                <Select value={selectedBrand} onValueChange={handleBrandChange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="All Brands" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brands</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isAuthenticated && brands.length > 0 && categories.length > 0 && (
                  <AddProductDialog
                    brands={brands}
                    categories={categories}
                    products={products}
                    onAdd={addProduct}
                  />
                )}
              </div>
            </div>

            {/* Category Tabs - Sticky */}
            <div className="sticky top-0 z-20 bg-background py-2 -mx-4 px-4 border-b border-border/50">
              <CategoryTabs
                categories={categories}
                products={filteredProducts}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>

            {/* Products Grid */}
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
              <>
                <ProductGrid
                  products={filteredProducts}
                  brands={brands}
                  categories={categories}
                  selectedCategory={selectedCategory}
                  getBrandById={getBrandById}
                  getCategoryById={getCategoryById}
                  isAuthenticated={isAuthenticated}
                  onDelete={deleteProduct}
                  onUpdateStock={handleUpdateStock}
                  onUpdate={updateProduct}
                />
                {selectedCategory !== 'all' && (
                  <CatalogPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredProducts.length}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                  />
                )}
              </>
            )}
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
