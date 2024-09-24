import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { Product } from './ProductList';
import { DialogDescription } from '@radix-ui/react-dialog';
import { useDebounce } from '@/hooks/debounce';
import { useInView } from 'react-intersection-observer';

interface ProductPickerProps {
  showProductModal: boolean;
  setShowProductModal: (value: boolean) => void;
  availableProducts: any;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  handleAddProducts: () => void;
  isProductAdded: (productId: number) => boolean;
  toggleProductSelection: (product: Product) => void;
  selectedItems: { [key: number]: number[] };
  isVariantAdded: (productId: number, variantId: number) => boolean;
  toggleVariantSelection: (productId: number, variantId: number) => void;
  fetchNextPage: () => void;
  hasNextPage: boolean | undefined;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  error: any;
}

const ProductPicker: React.FC<ProductPickerProps> = ({
  showProductModal,
  setShowProductModal,
  availableProducts,
  searchTerm,
  setSearchTerm,
  handleAddProducts,
  isProductAdded,
  toggleProductSelection,
  selectedItems,
  isVariantAdded,
  toggleVariantSelection,
  fetchNextPage,
  hasNextPage,
  isLoading,
  isFetchingNextPage,
  error,
}) => {
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { ref: observerTarget, inView } = useInView({
    root: null,
    rootMargin: '100px',
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isLoading && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage]);

  const filteredProducts = useMemo(() => {
    return availableProducts.filter((product: Product) =>
      product.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [availableProducts, debouncedSearchTerm]);

  const renderProduct = useCallback(
    (product: Product) => (
      <motion.div
        key={product.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="p-2 sm:p-3 rounded-md border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
      >
        <div className="flex items-center space-x-2 sm:space-x-4">
          {isProductAdded(product.id) ? (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Checkbox
                      id={`product-${product.id}`}
                      checked={true}
                      disabled={true}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={5}>
                  <p>Product already added</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Checkbox
              id={`product-${product.id}`}
              checked={!!selectedItems[product.id]}
              onCheckedChange={() => toggleProductSelection(product)}
            />
          )}
          <img
            src={product.image.src}
            alt={product.title}
            className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-md shadow-sm"
          />
          <label
            htmlFor={`product-${product.id}`}
            className="text-xs sm:text-sm font-medium leading-none cursor-pointer hover:text-[#008060] dark:hover:text-[#00a67d] transition-colors duration-200"
          >
            {product.title}
          </label>
        </div>
        {product.variants.length > 0 && (
          <div className="pl-8 sm:pl-10 mt-2 space-y-1 sm:space-y-2">
            {product.variants.map((variant) => (
              <div key={variant.id} className="flex items-center space-x-2">
                {isVariantAdded(product.id, variant.id) ? (
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Checkbox
                            id={`variant-${variant.id}`}
                            checked={true}
                            disabled={true}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" sideOffset={5}>
                        <p>Variant already added</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <Checkbox
                    id={`variant-${variant.id}`}
                    checked={selectedItems[product.id]?.includes(variant.id)}
                    onCheckedChange={() =>
                      toggleVariantSelection(product.id, variant.id)
                    }
                  />
                )}
                <label
                  htmlFor={`variant-${variant.id}`}
                  className="text-xs sm:text-sm leading-none cursor-pointer hover:text-[#008060] dark:hover:text-[#00a67d] transition-colors duration-200"
                >
                  {variant.title} - ${variant.price}
                </label>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    ),
    [
      isProductAdded,
      selectedItems,
      toggleProductSelection,
      isVariantAdded,
      toggleVariantSelection,
    ]
  );

  return (
    <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
      <DialogContent className="sm:max-w-[500px] w-[95vw] max-w-[95vw] sm:w-full bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#008060] to-[#00533f] bg-clip-text text-transparent">
            Select Products
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Select products and variants you want to add.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:gap-6 py-2">
          <Input
            placeholder="Search product"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-b-2 border-[#008060] focus:border-[#00533f] dark:border-[#00a67d] dark:focus:border-[#00c795] transition-colors duration-300"
          />
          <div className="max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-2 space-y-3 sm:space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#008060]"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center">
                Error loading products. Please try again.
              </div>
            ) : (
              <AnimatePresence>
                {filteredProducts.map(renderProduct)}
              </AnimatePresence>
            )}
            {hasNextPage && (
              <div className="py-4 flex items-center justify-center">
                {isFetchingNextPage && (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#008060]"></div>
                )}
                <p className="ml-2" ref={observerTarget}>
                  Loading more...
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 sm:mb-0">
            {Object.keys(selectedItems).length} product(s) selected
          </span>
          <div className="flex space-x-2 sm:space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowProductModal(false)}
              className="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Cancel
            </Button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="bg-gradient-to-r from-[#008060] to-[#00533f] hover:from-[#00533f] hover:to-[#008060] dark:from-[#00a67d] dark:to-[#008060] dark:hover:from-[#008060] dark:hover:to-[#00a67d] text-white px-4 sm:px-6 py-1 sm:py-2 rounded-md transition-all duration-300 text-xs sm:text-sm"
                onClick={handleAddProducts}
              >
                Add Selected
              </Button>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductPicker;
