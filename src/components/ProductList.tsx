import { useState } from 'react';
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
import { ChevronDown, ChevronUp, Pencil, X } from 'lucide-react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<{
    [key: number]: number[];
  }>({});

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

    const reorderedProducts = Array.from(products);
    const [removed] = reorderedProducts.splice(result.source.index, 1);
    reorderedProducts.splice(result.destination.index, 0, removed);

    setProducts(reorderedProducts);
  };

  const filteredProducts = availableProducts.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleProductSelection = (product: Product) => {
    setSelectedProducts((prev) =>
      prev.some((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );
    if (!selectedVariants[product.id]) {
      setSelectedVariants((prev) => ({ ...prev, [product.id]: [] }));
    }
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
    setProducts((prevProducts) => [...prevProducts, ...productsWithVariants]);
    setShowProductModal(false);
    setSelectedProducts([]);
    setSelectedVariants({});
  };

  const isProductAdded = (productId: number) => {
    return products.some((p) => p.id === productId);
  };

  return (
    <Card className="space-y-6 max-w-5xl mx-auto bg-white rounded-lg">
      <CardHeader>
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Add Products</h1>
        <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-100 p-4 rounded-md">
          <p className="font-semibold text-gray-700">Product</p>
          <p className="font-semibold text-gray-700">Discount</p>
        </div>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="products">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-6"
              >
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
                        <Card className="p-6 hover:shadow-md transition-shadow duration-200">
                          <div className="grid grid-cols-2 gap-6 items-center">
                            <div className="flex items-center gap-4">
                              <span className="text-gray-400 cursor-move">
                                ::
                              </span>
                              <span className="font-medium text-gray-600">
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
                                className="flex-grow"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-gray-100"
                              >
                                <Pencil className="h-4 w-4 text-gray-600" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-4">
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
                                className="w-24"
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
                                <SelectTrigger className="w-[120px]">
                                  <SelectValue placeholder="Discount type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Flat">Flat</SelectItem>
                                  <SelectItem value="% Off">% Off</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeProduct(product.id)}
                                className="hover:bg-red-100 hover:text-red-600"
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
                                className="text-blue-600 p-0 hover:text-blue-800"
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
                          {showVariants[product.id] && (
                            <div className="mt-6 space-y-4">
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
                                    {product.variants.map((variant, index) => (
                                      <Draggable
                                        key={variant.id}
                                        draggableId={`variant-${variant.id}`}
                                        index={
                                          `variant-${variant.id} ${index}` as any
                                        }
                                      >
                                        {(provided) => (
                                          <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className="bg-gray-50 border border-gray-200 rounded-md p-4 hover:shadow-sm transition-shadow duration-200"
                                          >
                                            <div className="flex items-center space-x-4">
                                              <div
                                                {...provided.dragHandleProps}
                                                className="cursor-move"
                                              >
                                                <span className="text-gray-400">
                                                  ::
                                                </span>
                                              </div>
                                              <Input
                                                value={variant.title}
                                                onChange={(e) =>
                                                  updateVariant(
                                                    product.id,
                                                    variant.id,
                                                    'title',
                                                    e.target.value
                                                  )
                                                }
                                                className="flex-grow"
                                              />
                                            </div>
                                            <div className="flex items-center gap-4 mt-4">
                                              <Input
                                                type="number"
                                                value={variant.discount}
                                                onChange={(e) =>
                                                  updateVariant(
                                                    product.id,
                                                    variant.id,
                                                    'discount',
                                                    Number(e.target.value)
                                                  )
                                                }
                                                className="w-24"
                                              />
                                              <Select
                                                value={variant.discountType}
                                                onValueChange={(
                                                  value: 'Flat' | '% Off'
                                                ) =>
                                                  updateVariant(
                                                    product.id,
                                                    variant.id,
                                                    'discountType',
                                                    value
                                                  )
                                                }
                                              >
                                                <SelectTrigger className="w-[120px]">
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
                                                className="hover:bg-red-100 hover:text-red-600"
                                              >
                                                <X className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          </div>
                                        )}
                                      </Draggable>
                                    ))}
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Droppable>
                            </div>
                          )}
                        </Card>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </CardContent>
      <CardFooter className="flex justify-end max-w-5xl mt-8">
        <Button
          onClick={() => setShowProductModal(true)}
          variant="outline"
          className="border-2 border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 rounded-md px-6 py-2 text-sm font-medium transition-colors duration-200"
        >
          Add Product
        </Button>
      </CardFooter>
      <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Select Products
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-6">
            <Input
              placeholder="Search product"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            <div className="max-h-[400px] overflow-y-auto pr-2">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="py-3 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex items-center space-x-4">
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <Checkbox
                              id={`product-${product.id}`}
                              checked={selectedProducts.some(
                                (p) => p.id === product.id
                              )}
                              onCheckedChange={() =>
                                toggleProductSelection(product)
                              }
                              disabled={isProductAdded(product.id)}
                            />
                          </div>
                        </TooltipTrigger>
                        {isProductAdded(product.id) && (
                          <TooltipContent>
                            <p>Product already added</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                    <img
                      src={product.image.src}
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <label
                      htmlFor={`product-${product.id}`}
                      className={`text-sm font-medium leading-none cursor-pointer ${
                        isProductAdded(product.id) ? 'text-gray-400' : ''
                      }`}
                    >
                      {product.title}
                      {isProductAdded(product.id) && ' (Already added)'}
                    </label>
                  </div>
                  {product.variants.length > 0 && (
                    <div className="pl-10 mt-2 space-y-2">
                      {product.variants.map((variant) => (
                        <div
                          key={variant.id}
                          className="flex items-center space-x-2"
                        >
                          <TooltipProvider delayDuration={100}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div>
                                  <Checkbox
                                    id={`variant-${variant.id}`}
                                    checked={
                                      selectedVariants[product.id]?.includes(
                                        variant.id
                                      ) || false
                                    }
                                    onCheckedChange={() =>
                                      toggleVariantSelection(
                                        product.id,
                                        variant.id
                                      )
                                    }
                                    disabled={isProductAdded(product.id)}
                                  />
                                </div>
                              </TooltipTrigger>
                              {isProductAdded(product.id) && (
                                <TooltipContent>
                                  <p>Product already added</p>
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </TooltipProvider>
                          <label
                            htmlFor={`variant-${variant.id}`}
                            className={`text-sm leading-none cursor-pointer ${
                              isProductAdded(product.id) ? 'text-gray-400' : ''
                            }`}
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
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-600">
              {selectedProducts.length} product(s) selected
            </span>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => setShowProductModal(false)}
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                onClick={handleAddProducts}
              >
                Add Selected
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
