import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Minus } from 'lucide-react';
import { Product } from '@/types/catalog';
import { toast } from 'sonner';

interface UpdateStockDialogProps {
  product: Product;
  onUpdateStock: (id: string, newStock: number) => void;
}

export const UpdateStockDialog = ({ product, onUpdateStock }: UpdateStockDialogProps) => {
  const [open, setOpen] = useState(false);
  const [stockChange, setStockChange] = useState<number>(0);
  const [mode, setMode] = useState<'add' | 'set'>('add');

  const handleSubmit = () => {
    let newStock: number;
    
    if (mode === 'add') {
      newStock = product.stock + stockChange;
    } else {
      newStock = stockChange;
    }

    if (newStock < 0) {
      toast.error('Stock cannot be negative');
      return;
    }

    onUpdateStock(product.id, newStock);
    toast.success(`Stock updated to ${newStock}`);
    setOpen(false);
    setStockChange(0);
    setMode('add');
  };

  const previewStock = mode === 'add' ? product.stock + stockChange : stockChange;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="h-6 px-2 text-[10px] gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Plus className="h-3 w-3" />
          Stock
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle className="text-base">Update Stock</DialogTitle>
          <p className="text-sm text-muted-foreground">{product.name}</p>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={mode === 'add' ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
              onClick={() => setMode('add')}
            >
              Add/Remove
            </Button>
            <Button
              variant={mode === 'set' ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
              onClick={() => setMode('set')}
            >
              Set Value
            </Button>
          </div>

          <div className="space-y-2">
            <Label>
              {mode === 'add' ? 'Quantity to Add/Remove' : 'New Stock Value'}
            </Label>
            {mode === 'add' ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setStockChange(prev => prev - 1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={stockChange}
                  onChange={(e) => setStockChange(parseInt(e.target.value) || 0)}
                  className="text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setStockChange(prev => prev + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Input
                type="number"
                min="0"
                value={stockChange}
                onChange={(e) => setStockChange(parseInt(e.target.value) || 0)}
                placeholder="Enter new stock value"
              />
            )}
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="text-sm">
              <p className="text-muted-foreground">Current: <span className="font-medium text-foreground">{product.stock}</span></p>
            </div>
            <div className="text-sm">
              <p className="text-muted-foreground">New: <span className={`font-medium ${previewStock < 0 ? 'text-destructive' : 'text-green-600'}`}>{previewStock}</span></p>
            </div>
          </div>

          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={previewStock < 0}
          >
            Update Stock
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
