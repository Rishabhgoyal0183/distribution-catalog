import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link2, ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

export const ImageUpload = ({ value, onChange }: ImageUploadProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="image-url">Image URL</Label>
      <div className="relative">
        <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          id="image-url"
          type="url"
          placeholder="https://example.com/image.jpg"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-9"
        />
      </div>
      
      {value && (
        <div className="relative w-full h-32 rounded-lg overflow-hidden border border-border bg-muted">
          <img
            src={value}
            alt="Product preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
          </div>
        </div>
      )}
    </div>
  );
};
