import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const getCurrentDate = (): string => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  cartQuantity: number;
}

interface OrderHistoryItem {
  id: number;
  name: string;
  image: string;
  price: number;
  cartQuantity: number;
  Date: string;
}

interface CartState {
  cartItems: CartItem[];
  cartTotalQuantity: number;
  cartTotalAmount: number;
  OrderHistory: OrderHistoryItem[];
}

const initialState: CartState = {
  cartItems:
    typeof window !== "undefined" && localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems")!)
      : [],
  cartTotalQuantity: 0,
  cartTotalAmount: 0,
  OrderHistory:
    typeof window !== "undefined" && localStorage.getItem("OrderHistory")
      ? JSON.parse(localStorage.getItem("OrderHistory")!)
      : [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToOrderHistory(
      state,
      action: PayloadAction<OrderHistoryItem | OrderHistoryItem[]>
    ) {
      const currentDate = getCurrentDate();
      const itemsWithDate: OrderHistoryItem[] = Array.isArray(action.payload)
        ? action.payload.map((item) => ({
            ...item,
            Date: currentDate,
          }))
        : [{ ...action.payload, Date: currentDate }];
      state.OrderHistory.push(...itemsWithDate);
      localStorage.setItem("OrderHistory", JSON.stringify(state.OrderHistory));
    },
    addToCart(state, action: PayloadAction<CartItem>) {
      const existingIndex = state.cartItems.findIndex(
        (item) => item.name === action.payload.name
      );

      if (existingIndex >= 0) {
        state.cartItems[existingIndex] = {
          ...state.cartItems[existingIndex],
          cartQuantity: state.cartItems[existingIndex].cartQuantity + 1,
        };
        toast.info("Increased product quantity", {
          position: "bottom-left",
        });
      } else {
        let tempProductItem = { ...action.payload, cartQuantity: 1 };
        state.cartItems.push(tempProductItem);
        toast.success("Product added to cart", {
          position: "bottom-left",
        });
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    decreaseCart(state, action: PayloadAction<CartItem>) {
      const itemIndex = state.cartItems.findIndex(
        (item) => item.id === action.payload.id
      );

      if (state.cartItems[itemIndex].cartQuantity > 1) {
        state.cartItems[itemIndex].cartQuantity -= 1;

        toast.info("Decreased product quantity", {
          position: "bottom-left",
        });
      } else if (state.cartItems[itemIndex].cartQuantity === 1) {
        const nextCartItems = state.cartItems.filter(
          (item) => item.id !== action.payload.id
        );

        state.cartItems = nextCartItems;

        toast.error("Product removed from cart", {
          position: "bottom-left",
        });
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    removeFromCart(state, action: PayloadAction<CartItem>) {
      state.cartItems = state.cartItems.filter(
        (item) => item.name !== action.payload.name
      );

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      toast.error("Product removed from cart", {
        position: "bottom-left",
      });
    },
    getTotals(state) {
      let { total, quantity } = state.cartItems.reduce(
        (cartTotal, cartItem) => {
          const { price, cartQuantity } = cartItem;
          const itemTotal = price * cartQuantity;

          cartTotal.total += itemTotal;
          cartTotal.quantity += cartQuantity;

          return cartTotal;
        },
        {
          total: 0,
          quantity: 0,
        }
      );
      total = parseFloat(total.toFixed(2));
      state.cartTotalQuantity = quantity;
      state.cartTotalAmount = total;
    },
    clearCart(state) {
      state.cartItems = [];
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      toast.error("Cart cleared", { position: "bottom-left" });
    },
  },
});

export const {
  addToCart,
  decreaseCart,
  removeFromCart,
  getTotals,
  clearCart,
  addToOrderHistory,
} = cartSlice.actions;

export default cartSlice.reducer;
