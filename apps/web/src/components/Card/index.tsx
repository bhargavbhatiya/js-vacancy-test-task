import { Card, Image, Text, Badge, Button, Group, Space } from "@mantine/core";
import queryClient from "query-client";
import { use, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  addToCart,
  removeFromCart,
} from "../../resources/redux/slices/cartSlice";
import { useRouter } from "next/router";
import { useAppDispatch } from "resources/redux/hooks";
import { RootState } from "resources/redux/store";

interface Product {
  name: string;
  price: string;
  image: string;
  cartQuantity: number;
}

function CardComponent(data: { name: string; price: string; image: string }) {
  const dispatch = useAppDispatch();

  const cart = useSelector((state: RootState) => state.cart);
  useEffect(() => {
    const checkItemInCart = cart.cartItems.find(
      (item) => item.name === data.name
    );
    setIsInCart(checkItemInCart ? true : false);
  }, []);

  const router = useRouter();

  const [isInCart, setIsInCart] = useState(false);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product as any));
    setIsInCart(true);
  };

  const handleRemoveFromCart = (product: Product) => {
    dispatch(removeFromCart(product as any));
    setIsInCart(false);
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{ position: "static" }}
    >
      <Card.Section>
        <Image
          src={data.image !== "" ? data.image : "images/cover-img.png"}
          height={160}
          alt={data.name}
        />
      </Card.Section>

      <div>
        <Text fw={700} pt="md" fz="lg">
          {data.name}
        </Text>
        <Space h="xs" />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>Price:</div>

          <Text fw={700}>${data.price}</Text>
        </div>
      </div>

      {isInCart ? (
        <Button
          variant="filled"
          color="red"
          fullWidth
          mt="md"
          radius="md"
          size="sm"
          onClick={() => handleRemoveFromCart(data as any)}
        >
          Remove from Cart
        </Button>
      ) : (
        <Button
          variant="filled"
          color="blue"
          fullWidth
          mt="md"
          radius="md"
          size="sm"
          onClick={() => handleAddToCart(data as any)}
        >
          Add to Cart
        </Button>
      )}
    </Card>
  );
}

export default CardComponent;
