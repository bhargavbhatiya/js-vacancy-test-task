import { NextPage } from "next";
import {
  Table,
  Image,
  Text,
  Button,
  px,
  Space,
  UnstyledButton,
  Card,
  Divider,
  Flex,
} from "@mantine/core";
// import Table from "components/Table";
import { RoutePath } from "routes";
import { useRouter } from "next/router";
import { Grid } from "@mantine/core";
import { RootState } from "resources/redux/store";
import { useSelector } from "react-redux";
import { IconX } from "@tabler/icons-react";
import {
  clearCart,
  getTotals,
  removeFromCart,
} from "resources/redux/slices/cartSlice";
import { useAppDispatch } from "resources/redux/hooks";
import NotFound from "../empty-cart/empty-cart";
import { productApi } from "resources/product";
import CartLayout from "../index.layout";

interface Product {
  name: string;
  price: string;
  image: string;
  cartQuantity: string;
}

const MyCart: NextPage = () => {
  const router = useRouter();
  const cartData = useSelector((state: RootState) => state.cart);
  const totalPrice = useSelector(
    (state: RootState) => state.cart.cartTotalAmount
  );

  const dispatch = useAppDispatch();

  dispatch(getTotals());
  const handleRemoveFromCart = (product: Product) => {
    dispatch(removeFromCart(product as any));
  };

  const { mutate: createCheckoutSession, isLoading } =
    productApi.useCreateCheckoutSession<Product[]>();

  const proceedToCheckout = () => {
    const formattedCartItems: Product[] = cartData.cartItems.map((item) => ({
      ...item,
      price: item.price.toString(),
      cartQuantity: item.cartQuantity.toString(),
    }));

    createCheckoutSession(formattedCartItems, {
      onSuccess: (sessionUrl) => {
        console.log("Product created successfully");
        //dispatch(clearCart());

        if (sessionUrl !== undefined) {
          router.push(sessionUrl);
        }
      },
      onError: (e: any) => {
        console.error("Error on checkout session:", e);
      },
    });
  };
  // const proceedToCheckout = async () => {
  //   const stripe = await loadStripe(
  //     process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""
  //   );
  //   if (stripe) {
  //     const { error } = await stripe.redirectToCheckout({
  //       items: cartData.cartItems.map((item) => ({
  //         currency: item.price,
  //         quantity: item.cartQuantity,
  //       })),
  //       successUrl: "{process.env.NEXT_PUBLIC_WEB_URL}/payment/successful",
  //       cancelUrl: "{process.env.NEXT_PUBLIC_WEB_URL}/payment/failed",
  //     });
  //     if (error) {
  //       console.error(error);
  //     }
  //   }
  // };

  return (
    <CartLayout>
      <>
        <div
          style={{
            backgroundColor: "white",
          }}
        >
          {cartData.cartItems.length === 0 && <NotFound />}
          {cartData && cartData.cartItems.length > 0 && (
            <Grid>
              <Grid.Col span={9}>
                <Table horizontalSpacing="xl">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Item</Table.Th>
                      <Table.Th>Unit Price</Table.Th>
                      <Table.Th>Quantity</Table.Th>
                      <Table.Th></Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {cartData.cartItems.map((item) => (
                      <Table.Tr>
                        <Table.Td>
                          <div
                            style={{
                              display: "flex",

                              alignItems: "center",
                            }}
                          >
                            <Image
                              src={item.image}
                              radius="md"
                              alt={item.name}
                              style={{
                                width: 50,
                                height: 50,
                                objectFit: "cover",
                                flex: "none",
                              }}
                            />
                            <Space w={px(10)}></Space>
                            <Text size="sm" fw={700}>
                              {item.name}
                            </Text>
                          </div>
                        </Table.Td>
                        <Table.Td>${item.price}</Table.Td>
                        <Table.Td>{item.cartQuantity}</Table.Td>
                        <Table.Td>
                          <Button
                            size="sm"
                            variant="transparent"
                            color="gray"
                            leftSection={<IconX size="20" />}
                            onClick={() => {
                              handleRemoveFromCart(item as any);
                            }}
                          >
                            Remove
                          </Button>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Grid.Col>
              <Grid.Col span={3}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Card.Section inheritPadding py="xs">
                    <Text fw={700} size="sm">
                      Summary
                    </Text>
                  </Card.Section>
                  <Divider />

                  <Space h="md" />
                  <Flex justify="space-between">
                    <Text size="sm" fw={500}>
                      Subtotal
                    </Text>
                    <Text size="lg" fw={700} pr="sm">
                      ${totalPrice}
                    </Text>
                  </Flex>
                  <Space h="lg" />
                  <Button
                    fullWidth
                    size="sm"
                    color="blue"
                    radius="md"
                    onClick={() => {
                      proceedToCheckout();
                    }}
                  >
                    Proceed to Checkout
                  </Button>
                </Card>
              </Grid.Col>
            </Grid>
          )}
        </div>
      </>
    </CartLayout>
  );
};

export default MyCart;
