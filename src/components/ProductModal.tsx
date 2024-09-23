import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface Product {
  id: number;
  title: string;
  variants: Array<{
    id: number;
    product_id: number;
    title: string;
    price: string;
  }>;
  image: {
    id: number;
    product_id: number;
    src: string;
  };
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProducts: (products: Product[]) => void;
  availableProducts: Product[];
}

export default function ProductModal({
  isOpen,
  onClose,
  onAddProducts,
  availableProducts,
}: ProductModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<{
    [key: number]: number[];
  }>({});

  useEffect(() => {
    setSelectedProducts([]);
    setSelectedVariants({});
  }, [isOpen]);

  const filteredProducts = availableProducts
    ? availableProducts.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const toggleProductSelection = (product: Product) => {
    setSelectedProducts((prev) =>
      prev.some((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );
  };

  const toggleVariantSelection = (productId: number, variantId: number) => {
    setSelectedVariants((prev) => {
      const productVariants = prev[productId] || [];
      return {
        ...prev,
        [productId]: productVariants.includes(variantId)
          ? productVariants.filter((id) => id !== variantId)
          : [...productVariants, variantId],
      };
    });
  };

  const handleAddProducts = () => {
    const productsWithVariants = selectedProducts.map((product) => ({
      ...product,
      variants: product.variants.filter((variant) =>
        selectedVariants[product.id]?.includes(variant.id)
      ),
    }));
    onAddProducts(productsWithVariants);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Products</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Search product"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="max-h-[300px] overflow-y-auto">
            {filteredProducts.map((product) => (
              <div key={product.id} className="py-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`product-${product.id}`}
                    checked={selectedProducts.some((p) => p.id === product.id)}
                    onCheckedChange={() => toggleProductSelection(product)}
                  />
                  <img
                    src={product.image.src}
                    alt={product.title}
                    className="size-10"
                  />
                  <label
                    htmlFor={`product-${product.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {product.title}
                  </label>
                </div>
                {product.variants.length > 0 && (
                  <div className="pl-6">
                    {product.variants.map((variant) => (
                      <div
                        key={variant.id}
                        className="flex items-center space-x-2 py-1"
                      >
                        <Checkbox
                          id={`variant-${variant.id}`}
                          checked={
                            selectedVariants[product.id]?.includes(
                              variant.id
                            ) || false
                          }
                          onCheckedChange={() =>
                            toggleVariantSelection(product.id, variant.id)
                          }
                        />
                        <label
                          htmlFor={`variant-${variant.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {variant.title} - ${variant.price}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span>{selectedProducts.length} product(s) selected</span>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button className="bg-green-700" onClick={handleAddProducts}>
              Add
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
