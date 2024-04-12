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
import { FC } from "react";
import CartLayout from "../index.layout";

const MyOrderHistory: NextPage = () => {
  const historyData = useSelector(
    (state: RootState) => state.cart.OrderHistory
  );

  return (
    <>
      <CartLayout>
        {historyData.length === 0 && <NotFound />}
        {historyData && historyData.length > 0 && (
          <Grid>
            <Grid.Col span={9}>
              <div
                style={{
                  backgroundColor: "white",
                  padding: 20,
                }}
              >
                <Table horizontalSpacing="xl">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Item</Table.Th>
                      <Table.Th>Unit Price</Table.Th>
                      <Table.Th>Date</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {historyData.map((item) => (
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
                        <Table.Td>{item.Date}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
            </Grid.Col>
          </Grid>
        )}
      </CartLayout>
    </>
  );
};

export default MyOrderHistory;
