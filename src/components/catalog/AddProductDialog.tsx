import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { Brand, Category, Product } from '@/types/catalog';
import { ImageUpload } from './ImageUpload';

interface AddProductDialogProps {
  brands: Brand[];
  categories: Category[];
  onAdd: (product: Omit<Product, 'id' | 'createdAt'>) => void;
}

export const AddProductDialog = ({ brands, categories, onAdd }: AddProductDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brandId: '',
    categoryId: '',
    price: '',
    stock: '',
    description: '',
    imageUrl: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.brandId && formData.categoryId) {
      onAdd({
        name: formData.name.trim(),
        brandId: formData.brandId,
        categoryId: formData.categoryId,
        price: parseFloat(formData.price) || 0,
        stock: parseInt(formData.stock) || 0,
        description: formData.description.trim(),
        imageUrl: formData.imageUrl.trim(),
      });
      setFormData({
        name: '',
        brandId: '',
        categoryId: '',
        price: '',
        stock: '',
        description: '',
        imageUrl: '',
      });
      setOpen(false);
    }
  };

  const isValid = formData.name.trim() && formData.brandId && formData.categoryId;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product-name">Product Name *</Label>
            <Input
              id="product-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Dairy Milk Silk"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Brand *</Label>
              <Select
                value={formData.brandId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, brandId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                placeholder="0"
              />
            </div>
          </div>

          <ImageUpload
            value={formData.imageUrl}
            onChange={(dataUrl) => setFormData(prev => ({ ...prev, imageUrl: dataUrl }))}
          />

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Product description..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={!isValid}>
            Add Product
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
