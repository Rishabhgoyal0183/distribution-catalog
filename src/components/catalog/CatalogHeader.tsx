import { Package } from 'lucide-react';

export const CatalogHeader = () => {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary">
            <Package className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Distribution Catalog</h1>
            <p className="text-sm text-muted-foreground">Manage your product inventory</p>
          </div>
        </div>
      </div>
    </header>
  );
};
