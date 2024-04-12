import queryClient from "query-client";
import { apiService, socketService } from "services";

import { Product } from "types";

apiService.on("error", (error: any) => {
  if (error.status === 401) {
    queryClient.setQueryData(["product"], null);
  }
});

socketService.on("connect", () => {
  const product = queryClient.getQueryData(["product"]) as Product;

  socketService.emit("subscribe", `product-${product._id}`);
});

socketService.on("product:updated", (data: Product) => {
  queryClient.setQueryData(["product"], data);
});
