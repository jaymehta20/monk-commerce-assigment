import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
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
import AddProductButton from './AddProductButton';
import ProductPicker from './ProductPicker';
import { availableProducts } from '@/lib/data';

interface Variant {
  id: number;
  product_id: number;
  title: string;
  price: string;
  discount: number;
  discountType: 'Flat' | '% Off';
}

export interface Product {
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
                              {product.variants.length > 1 && (
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
        <AddProductButton setShowProductModal={setShowProductModal} />
      </CardFooter>
      <ProductPicker
        availableProducts={availableProducts}
        handleAddProducts={handleAddProducts}
        isProductAdded={isProductAdded}
        isVariantAdded={isVariantAdded}
        searchTerm={searchTerm}
        selectedItems={selectedItems}
        setSearchTerm={setSearchTerm}
        setShowProductModal={setShowProductModal}
        showProductModal={showProductModal}
        toggleProductSelection={toggleProductSelection}
        toggleVariantSelection={toggleVariantSelection}
      />
    </Card>
  );
}
