const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function listProducts() {
  const res = await fetch(`${API_URL}/api/v1/Products/GetAll`);

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}

export async function getProduct(id) {

  const res = await fetch(`${API_URL}/api/v1/Products/GetById/${id}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch product: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data;
}