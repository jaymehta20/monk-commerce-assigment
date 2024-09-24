import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Variant {
  id: number;
  product_id: number;
  title: string;
  price: string;
}

interface Product {
  id: number;
  title: string;
  variants: Variant[];
  image: {
    id: number;
    product_id: number;
    src: string;
  };
}

export const useProductList = () => {
  const fetchProducts = async ({
    pageParam = 1,
  }: {
    pageParam?: number | undefined | unknown;
  }) => {
    const response = await axios.get<Product[]>(
      `https://stageapi.monkcommerce.app/task/products/search?search=&page=${pageParam}&limit=10`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '72njgfa948d9aS7gs5',
        },
      }
    );
    return response.data;
  };

  const query = useInfiniteQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: ({ pageParam }) => fetchProducts({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return pages.length + 1;
    },
  });

  console.log(query.data, 'query data');

  return query;
};
