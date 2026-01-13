import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { Brand } from '@/types/catalog';

interface AddCategoryDialogProps {
  brands: Brand[];
  onAdd: (name: string, brandId: string) => void;
}

export const AddCategoryDialog = ({ brands, onAdd }: AddCategoryDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [brandId, setBrandId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && brandId) {
      onAdd(name.trim(), brandId);
      setName('');
      setBrandId('');
      setOpen(false);
    }
  };

  const isValid = name.trim() && brandId;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Brand *</Label>
            <Select value={brandId} onValueChange={setBrandId}>
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
            <Label htmlFor="category-name">Category Name *</Label>
            <Input
              id="category-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Chocolates, Chips, Toffees"
              autoFocus
            />
          </div>
          <Button type="submit" className="w-full" disabled={!isValid}>
            Add Category
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
