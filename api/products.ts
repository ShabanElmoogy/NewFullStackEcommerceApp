import { PRODUCT_URLS } from '@/constants';

export async function listProducts() {
  const res = await fetch(PRODUCT_URLS.GET_ALL);

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}

export async function getProduct(id: string | number) {
  const res = await fetch(PRODUCT_URLS.GET_BY_ID(id));

  if (!res.ok) {
    throw new Error(`Failed to fetch product: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}