import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Package, CheckCircle, Truck } from 'lucide-react';
import { Order } from '@/hooks/useOrders';

interface OrderCardProps {
  order: Order;
  onUpdateStatus: (id: string, status: Order['status']) => void;
  onDelete: (id: string) => void;
}

const statusConfig = {
  pending: { label: 'Pending', variant: 'secondary' as const, icon: Package },
  packed: { label: 'Packed', variant: 'default' as const, icon: CheckCircle },
  delivered: { label: 'Delivered', variant: 'outline' as const, icon: Truck },
};

export const OrderCard = ({ order, onUpdateStatus, onDelete }: OrderCardProps) => {
  const status = statusConfig[order.status];
  const StatusIcon = status.icon;
  
  const nextStatus: Order['status'] | null =
    order.status === 'pending' ? 'packed' :
    order.status === 'packed' ? 'delivered' : null;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-lg">{order.shopkeeperName}</CardTitle>
            <p className="text-xs text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <Badge variant={status.variant} className="gap-1">
            <StatusIcon className="h-3 w-3" />
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5 max-h-32 overflow-y-auto">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span>
                {item.productName}
                <span className="text-muted-foreground"> ({item.brandName})</span>
              </span>
              <span className="font-medium">×{item.quantity}</span>
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-2 pt-2 border-t">
          {nextStatus && (
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() => onUpdateStatus(order.id, nextStatus)}
            >
              Mark as {statusConfig[nextStatus].label}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(order.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
