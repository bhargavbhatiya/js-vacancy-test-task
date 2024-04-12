import { UnstyledButton } from "@mantine/core";
import router from "next/router";
import { RoutePath } from "routes";

type CartLayoutProps = {
  children: React.ReactNode;
};

const CartLayout: React.FC<CartLayoutProps> = ({ children }) => {
  const isCartRoute = router.pathname === RoutePath.MyCart;
  const isHistoryRoute = router.pathname === RoutePath.History;
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <UnstyledButton
          onClick={() => router.push(RoutePath.MyCart)}
          style={{
            fontWeight: isCartRoute ? "bold" : "normal",
            padding: "10px",
          }}
        >
          My cart
        </UnstyledButton>
        <UnstyledButton
          onClick={() => router.push(RoutePath.History)}
          style={{
            fontWeight: isHistoryRoute ? "bold" : "normal",
            padding: "10px",
          }}
        >
          History
        </UnstyledButton>
      </div>
      {children}
    </div>
  );
};

export default CartLayout;
