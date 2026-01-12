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

  const handleSubmit = () => {
    const newStock = product.stock + stockChange;

    if (newStock < 0) {
      toast.error('Stock cannot be negative');
      return;
    }

    onUpdateStock(product.id, newStock);
    toast.success(`Stock updated to ${newStock}`);
    setOpen(false);
    setStockChange(0);
  };

  const previewStock = product.stock + stockChange;

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
          <div className="space-y-2">
            <Label>Quantity to Add/Remove</Label>
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
