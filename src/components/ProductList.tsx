import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Pencil, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface Variant {
  id: number;
  product_id: number;
  title: string;
  price: string;
  discount: number;
  discountType: 'Flat' | '% Off';
}

interface Product {
  id: number;
  title: string;
  discount: number;
  discountType: 'Flat' | '% Off';
  variants: Variant[];
  image: {
    id: number;
    product_id: number;
    src: string;
  };
}

const availableProducts: Product[] = [
  {
    id: 77,
    title: 'Fog Linen Chambray Towel - Beige Stripe',
    discount: 0,
    discountType: '% Off',
    variants: [
      {
        id: 1,
        product_id: 77,
        title: 'XS / Silver',
        price: '49',
        discount: 0,
        discountType: '% Off',
      },
      {
        id: 2,
        product_id: 77,
        title: 'S / Silver',
        price: '49',
        discount: 0,
        discountType: '% Off',
      },
      {
        id: 3,
        product_id: 77,
        title: 'M / Silver',
        price: '49',
        discount: 0,
        discountType: '% Off',
      },
    ],
    image: {
      id: 266,
      product_id: 77,
      src: 'https://cdn11.bigcommerce.com/s-p1xcugzp89/products/77/images/266/foglinenbeigestripetowel1b.1647248662.386.513.jpg?c=1',
    },
  },
  {
    id: 80,
    title: 'Orbit Terrarium - Large',
    discount: 0,
    discountType: '% Off',
    variants: [
      {
        id: 64,
        product_id: 80,
        title: 'Default Title',
        price: '109',
        discount: 0,
        discountType: '% Off',
      },
    ],
    image: {
      id: 272,
      product_id: 80,
      src: 'https://cdn11.bigcommerce.com/s-p1xcugzp89/products/80/images/272/roundterrariumlarge.1647248662.386.513.jpg?c=1',
    },
  },
  // ... (other products)
];

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showVariants, setShowVariants] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [showProductModal, setShowProductModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<{
    [key: number]: number[];
  }>({});

  useEffect(() => {
    // Initialize selectedItems with currently added products and variants
    const initialSelected: { [key: number]: number[] } = {};
    products.forEach((product) => {
      initialSelected[product.id] = product.variants.map((v) => v.id);
    });
    setSelectedItems(initialSelected);
  }, []);

  const toggleProductSelection = (product: Product) => {
    setSelectedItems((prev) => {
      const newSelected = { ...prev };
      if (newSelected[product.id]) {
        delete newSelected[product.id];
      } else {
        newSelected[product.id] = [];
      }
      return newSelected;
    });
  };

  const toggleVariantSelection = (productId: number, variantId: number) => {
    setSelectedItems((prev) => {
      const newSelected = { ...prev };
      if (!newSelected[productId]) {
        newSelected[productId] = [];
      }
      const index = newSelected[productId].indexOf(variantId);
      if (index > -1) {
        newSelected[productId].splice(index, 1);
      } else {
        newSelected[productId].push(variantId);
      }
      return newSelected;
    });
  };

  const handleAddProducts = () => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      Object.entries(selectedItems).forEach(([productId, variantIds]) => {
        const numProductId = Number(productId);
        const selectedProduct = availableProducts.find(
          (p) => p.id === numProductId
        );
        if (!selectedProduct) return;

        const existingProductIndex = updatedProducts.findIndex(
          (p) => p.id === numProductId
        );

        if (existingProductIndex !== -1) {
          // Product already exists, merge new variants
          const existingProduct = updatedProducts[existingProductIndex];
          const newVariants = selectedProduct.variants.filter(
            (variant) =>
              variantIds.includes(variant.id) &&
              !existingProduct.variants.some((v) => v.id === variant.id)
          );
          existingProduct.variants = [
            ...existingProduct.variants,
            ...newVariants,
          ];
        } else {
          // Add new product with selected variants
          updatedProducts.push({
            ...selectedProduct,
            variants: selectedProduct.variants.filter((variant) =>
              variantIds.includes(variant.id)
            ),
          });
        }
      });

      return updatedProducts;
    });

    setShowProductModal(false);
    setSelectedItems({});
  };

  const isProductAdded = (productId: number) => {
    return products.some((p) => p.id === productId);
  };

  const isVariantAdded = (productId: number, variantId: number) => {
    const product = products.find((p) => p.id === productId);
    return product?.variants.some((v) => v.id === variantId) || false;
  };

  const toggleVariants = (productId: number) => {
    setShowVariants((prev) => ({ ...prev, [productId]: !prev[productId] }));
  };

  const updateProduct = (id: number, field: string, value: string | number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, [field]: value } : product
      )
    );
  };

  const updateVariant = (
    productId: number,
    variantId: number,
    field: string,
    value: string | number
  ) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              variants: product.variants.map((variant) =>
                variant.id === variantId
                  ? { ...variant, [field]: value }
                  : variant
              ),
            }
          : product
      )
    );
  };

  const removeProduct = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const removeVariant = (productId: number, variantId: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              variants: product.variants.filter((v) => v.id !== variantId),
            }
          : product
      )
    );
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === 'PRODUCT') {
      const reorderedProducts = Array.from(products);
      const [removed] = reorderedProducts.splice(source.index, 1);
      reorderedProducts.splice(destination.index, 0, removed);

      setProducts(reorderedProducts);
    } else if (type === 'VARIANT') {
      const productId = parseInt(source.droppableId.split('-')[1]);
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const reorderedVariants = Array.from(product.variants);
      const [removed] = reorderedVariants.splice(source.index, 1);
      reorderedVariants.splice(destination.index, 0, removed);

      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === productId ? { ...p, variants: reorderedVariants } : p
        )
      );
    }
  };

  return (
    <Card className="space-y-6 mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl">
      <CardHeader>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-8 text-gray-800 dark:text-gray-200 bg-gradient-to-r from-[#008060] to-[#00533f] bg-clip-text text-transparent"
        >
          Add Products
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 bg-gradient-to-r from-[#f0f7f4] to-[#e3f1ec] dark:from-[#1a3c34] dark:to-[#0d2620] p-4 rounded-md shadow-sm"
        >
          <p className="font-semibold text-[#008060] dark:text-[#00a67d]">
            Product
          </p>
          <p className="font-semibold text-[#008060] dark:text-[#00a67d]">
            Discount
          </p>
        </motion.div>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="products" type="PRODUCT">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-6"
              >
                <AnimatePresence>
                  {products.map((product, index) => (
                    <Draggable
                      key={product.id}
                      draggableId={product.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-center">
                                <div className="flex items-center gap-2 sm:gap-4">
                                  <span className="text-gray-400 dark:text-gray-500 cursor-move">
                                    ::
                                  </span>
                                  <span className="font-medium text-gray-600 dark:text-gray-300">
                                    {index + 1}.
                                  </span>
                                  <Input
                                    value={product.title}
                                    onChange={(e) =>
                                      updateProduct(
                                        product.id,
                                        'title',
                                        e.target.value
                                      )
                                    }
                                    className="flex-grow border-b-2 border-[#008060] focus:border-[#00533f] dark:border-[#00a67d] dark:focus:border-[#00c795] transition-colors duration-300"
                                  />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:bg-[#e6f3f0] dark:hover:bg-[#004d3d] text-[#008060] dark:text-[#00a67d]"
                                    onClick={() => setShowProductModal(true)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-4">
                                  <Input
                                    type="number"
                                    value={product.discount}
                                    onChange={(e) =>
                                      updateProduct(
                                        product.id,
                                        'discount',
                                        Number(e.target.value)
                                      )
                                    }
                                    className="w-20 sm:w-24 border-b-2 border-[#008060] focus:border-[#00533f] dark:border-[#00a67d] dark:focus:border-[#00c795] transition-colors duration-300"
                                  />
                                  <Select
                                    value={product.discountType}
                                    onValueChange={(value: 'Flat' | '% Off') =>
                                      updateProduct(
                                        product.id,
                                        'discountType',
                                        value
                                      )
                                    }
                                  >
                                    <SelectTrigger className="w-[100px] sm:w-[120px] bg-transparent border-b-2 border-[#008060] focus:border-[#00533f] dark:border-[#00a67d] dark:focus:border-[#00c795] transition-colors duration-300">
                                      <SelectValue placeholder="Discount type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Flat">Flat</SelectItem>
                                      <SelectItem value="% Off">
                                        % Off
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeProduct(product.id)}
                                    className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-400 transition-colors duration-300"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              {product.variants.length > 0 && (
                                <div className="mt-4">
                                  <Button
                                    variant="link"
                                    onClick={() => toggleVariants(product.id)}
                                    className="text-[#008060] dark:text-[#00a67d] p-0 hover:text-[#00533f] dark:hover:text-[#00c795] transition-colors duration-300"
                                  >
                                    {showVariants[product.id] ? (
                                      <>
                                        Hide variants
                                        <ChevronUp className="h-4 w-4 ml-1" />
                                      </>
                                    ) : (
                                      <>
                                        Show variants
                                        <ChevronDown className="h-4 w-4 ml-1" />
                                      </>
                                    )}
                                  </Button>
                                </div>
                              )}
                              <AnimatePresence>
                                {showVariants[product.id] && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="mt-6 space-y-4"
                                  >
                                    <Droppable
                                      droppableId={`variants-${product.id}`}
                                      type="VARIANT"
                                    >
                                      {(provided) => (
                                        <div
                                          {...provided.droppableProps}
                                          ref={provided.innerRef}
                                          className="space-y-4"
                                        >
                                          {product.variants.map(
                                            (variant, index) => (
                                              <Draggable
                                                key={variant.id}
                                                draggableId={`variant-${variant.id}`}
                                                index={index}
                                              >
                                                {(provided) => (
                                                  <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={{
                                                      ...provided.draggableProps
                                                        .style,
                                                    }}
                                                  >
                                                    <motion.div
                                                      initial={{
                                                        opacity: 0,
                                                        y: 10,
                                                      }}
                                                      animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                      }}
                                                      exit={{
                                                        opacity: 0,
                                                        y: -10,
                                                      }}
                                                      transition={{
                                                        duration: 0.2,
                                                      }}
                                                      className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-600 border border-gray-200 dark:border-gray-600 rounded-md p-3 sm:p-4 hover:shadow-md transition-all duration-300"
                                                    >
                                                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                                                        <div className="flex items-center space-x-2 sm:space-x-4">
                                                          <div className="cursor-move">
                                                            <span className="text-gray-400 dark:text-gray-500">
                                                              ::
                                                            </span>
                                                          </div>
                                                          <Input
                                                            value={
                                                              variant.title
                                                            }
                                                            onChange={(e) =>
                                                              updateVariant(
                                                                product.id,
                                                                variant.id,
                                                                'title',
                                                                e.target.value
                                                              )
                                                            }
                                                            className="flex-grow border-b-2 border-[#008060] focus:border-[#00533f] dark:border-[#00a67d] dark:focus:border-[#00c795] transition-colors duration-300"
                                                          />
                                                        </div>
                                                        <div className="flex items-center gap-2 sm:gap-4">
                                                          <Input
                                                            type="number"
                                                            value={
                                                              variant.discount
                                                            }
                                                            onChange={(e) =>
                                                              updateVariant(
                                                                product.id,
                                                                variant.id,
                                                                'discount',
                                                                Number(
                                                                  e.target.value
                                                                )
                                                              )
                                                            }
                                                            className="w-20 sm:w-24 border-b-2 border-[#008060] focus:border-[#00533f] dark:border-[#00a67d] dark:focus:border-[#00c795] transition-colors duration-300"
                                                          />
                                                          <Select
                                                            value={
                                                              variant.discountType
                                                            }
                                                            onValueChange={(
                                                              value:
                                                                | 'Flat'
                                                                | '% Off'
                                                            ) =>
                                                              updateVariant(
                                                                product.id,
                                                                variant.id,
                                                                'discountType',
                                                                value
                                                              )
                                                            }
                                                          >
                                                            <SelectTrigger className="w-[100px] sm:w-[120px] bg-transparent border-b-2 border-[#008060] focus:border-[#00533f] dark:border-[#00a67d] dark:focus:border-[#00c795] transition-colors duration-300">
                                                              <SelectValue placeholder="Discount type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                              <SelectItem value="Flat">
                                                                Flat
                                                              </SelectItem>
                                                              <SelectItem value="% Off">
                                                                % Off
                                                              </SelectItem>
                                                            </SelectContent>
                                                          </Select>
                                                          <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                              removeVariant(
                                                                product.id,
                                                                variant.id
                                                              )
                                                            }
                                                            className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-400 transition-colors duration-300"
                                                          >
                                                            <X className="h-4 w-4" />
                                                          </Button>
                                                        </div>
                                                      </div>
                                                    </motion.div>
                                                  </div>
                                                )}
                                              </Draggable>
                                            )
                                          )}
                                          {provided.placeholder}
                                        </div>
                                      )}
                                    </Droppable>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </Card>
                          </motion.div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                </AnimatePresence>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </CardContent>
      <CardFooter className="flex justify-end mt-8">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={() => setShowProductModal(true)}
            variant="outline"
            className="border-2 border-[#008060] text-[#008060] hover:bg-[#e6f3f0] hover:text-[#00533f] dark:border-[#00a67d] dark:text-[#00a67d] dark:hover:bg-[#004d3d] dark:hover:text-[#00c795] rounded-md px-2 sm:px-20 py-2 text-sm font-medium transition-colors duration-200"
          >
            Add Product
          </Button>
        </motion.div>
      </CardFooter>
      <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
        <DialogContent className="sm:max-w-[500px] w-[95vw] max-w-[95vw] sm:w-full bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#008060] to-[#00533f] bg-clip-text text-transparent">
              Select Products
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 sm:gap-6 py-4 sm:py-6">
            <Input
              placeholder="Search product"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-b-2 border-[#008060] focus:border-[#00533f] dark:border-[#00a67d] dark:focus:border-[#00c795] transition-colors duration-300"
            />
            <div className="max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-2 space-y-3 sm:space-y-4">
              <AnimatePresence>
                {availableProducts
                  .filter((product) =>
                    product.title
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                  .map((product) => (
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
                            onCheckedChange={() =>
                              toggleProductSelection(product)
                            }
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
                            <div
                              key={variant.id}
                              className="flex items-center space-x-2"
                            >
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
                                  checked={selectedItems[product.id]?.includes(
                                    variant.id
                                  )}
                                  onCheckedChange={() =>
                                    toggleVariantSelection(
                                      product.id,
                                      variant.id
                                    )
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
                  ))}
              </AnimatePresence>
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
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
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
    </Card>
  );
}
