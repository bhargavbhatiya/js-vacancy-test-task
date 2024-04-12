import { useMutation, useQuery } from "react-query";

import { Product } from "types";

import { apiService } from "services";
import queryClient from "query-client";

export function useList<T>(params: T) {
  const list = () => apiService.get("/products", params);

  interface ProductListResponse {
    count: number;
    items: Product[];
    totalPages: number;
  }

  return useQuery<ProductListResponse>(["products", params], list);
}

export function useUploadProductPhoto<T>() {
  const uploadProductPhoto = (data: T) =>
    apiService.post("/products/product-photo", data);

  return useMutation<Product, unknown, T>(uploadProductPhoto, {
    onSuccess: (data) => {
      queryClient.setQueryData(["productUrl"], data);
    },
  });
}

export function creatProduct<T>() {
  const product = (data: T) => apiService.post("/products", data);

  return useMutation<Product, unknown, T>(product, {
    onSuccess: (data) => {
      queryClient.setQueryData(["product"], data);
    },
  });
}

export function useDeleteProduct<T>() {
  const deleteProduct = (productId: string) =>
    apiService.delete(`/products/${productId}`);

  return useMutation<void, unknown, string>(deleteProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries("products");
      console.log("Product deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting product:", error);
    },
  });
}

export function useCreateCheckoutSession<T>() {
  const createCheckoutSession = (data: T) =>
    apiService.post("/products/create-checkout-session", data);

  return useMutation<void, unknown, T>(createCheckoutSession, {
    onSuccess: () => {
      // const dispatch = useAppDispatch();

      // dispatch(clearCart());
      console.log("Checkout session created successfully");
    },
    onError: (error) => {
      console.error("Error creating checkout session:", error);
    },
  });
}
