import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProductModal from './ProductModal';
import { Pencil } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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

const availableProducts: Product[] = [
  {
    id: 77,
    title: 'Fog Linen Chambray Towel - Beige Stripe',
    variants: [
      {
        id: 1,
        product_id: 77,
        title: 'XS / Silver',
        price: '49',
      },
      {
        id: 2,
        product_id: 77,
        title: 'S / Silver',
        price: '49',
      },
      {
        id: 3,
        product_id: 77,
        title: 'M / Silver',
        price: '49',
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
    variants: [
      {
        id: 64,
        product_id: 80,
        title: 'Default Title',
        price: '109',
      },
    ],
    image: {
      id: 272,
      product_id: 80,
      src: 'https://cdn11.bigcommerce.com/s-p1xcugzp89/products/80/images/272/roundterrariumlarge.1647248662.386.513.jpg?c=1',
    },
  },
  {
    id: 81,
    title: 'Handmade Ceramic Mug',
    variants: [
      {
        id: 65,
        product_id: 81,
        title: 'Default Title',
        price: '25',
      },
    ],
    image: {
      id: 273,
      product_id: 81,
      src: 'https://cdn11.bigcommerce.com/s-p1xcugzp89/products/81/images/273/ceramicmug.1647248662.386.513.jpg?c=1',
    },
  },
  {
    id: 82,
    title: 'Wooden Desk Organizer',
    variants: [
      {
        id: 66,
        product_id: 82,
        title: 'Default Title',
        price: '45',
      },
    ],
    image: {
      id: 274,
      product_id: 82,
      src: 'https://cdn11.bigcommerce.com/s-p1xcugzp89/products/82/images/274/deskorganizer.1647248662.386.513.jpg?c=1',
    },
  },
  {
    id: 83,
    title: 'Leather Journal',
    variants: [
      {
        id: 67,
        product_id: 83,
        title: 'Default Title',
        price: '35',
      },
    ],
    image: {
      id: 275,
      product_id: 83,
      src: 'https://cdn11.bigcommerce.com/s-p1xcugzp89/products/83/images/275/leatherjournal.1647248662.386.513.jpg?c=1',
    },
  },
  {
    id: 84,
    title: 'Bamboo Cutting Board',
    variants: [
      {
        id: 68,
        product_id: 84,
        title: 'Default Title',
        price: '20',
      },
    ],
    image: {
      id: 276,
      product_id: 84,
      src: 'https://cdn11.bigcommerce.com/s-p1xcugzp89/products/84/images/276/cuttingboard.1647248662.386.513.jpg?c=1',
    },
  },
];

export default function ProductList() {
  const [showProductModal, setShowProductModal] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  const addProducts = (newProducts: Product[]) => {
    setProducts((prevProducts) => [...prevProducts, ...newProducts]);
  };

  const removeProduct = (id: number) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedProducts = Array.from(products);
    const [removed] = reorderedProducts.splice(result.source.index, 1);
    reorderedProducts.splice(result.destination.index, 0, removed);

    setProducts(reorderedProducts);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Add Products</h3>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="products">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {products.map((product, index) => (
                <Draggable
                  key={product.id}
                  draggableId={product.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="flex items-center gap-10 p-4 max-w-2xl"
                    >
                      <span className="inline-flex gap-4 items-center">
                        <span className="text-muted-foreground"> :: </span>
                        {index + 1}
                      </span>
                      <img
                        src={product.image.src}
                        alt={product.title}
                        className="size-20 object-cover"
                      />
                      <span className="w-full">{product.title}</span>
                      <div className="flex space-x-2 w-full justify-end">
                        <Button
                          onClick={() => {
                            setShowProductModal(true);
                          }}
                          variant="ghost"
                          size="icon"
                        >
                          <Pencil className="size-4" />
                        </Button>
                        {products.length > 1 && (
                          <Button
                            onClick={() => removeProduct(product.id)}
                            variant="ghost"
                            className="text-base text-muted-foreground"
                          >
                            X
                          </Button>
                        )}
                      </div>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div className="flex justify-end max-w-2xl">
        <Button
          onClick={() => setShowProductModal(true)}
          variant="outline"
          className="border border-green-700 text-green-700 hover:text-green-800 rounded-sm px-10 py-2 text-xs"
        >
          Add Product
        </Button>
      </div>
      <ProductModal
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        onAddProducts={addProducts}
        availableProducts={availableProducts}
      />
    </div>
  );
}
