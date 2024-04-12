import { Card, Grid, Space, ThemeIcon } from "@mantine/core";
import { IconDevicesPlus, IconPlus, IconSum } from "@tabler/icons-react";
import { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { productApi } from "resources/product";
import queryClient from "query-client";
import CardComponent from "./component/card.yourProduct";
import { Link } from "components";
import { RoutePath } from "routes";

const YourProduct: NextPage = () => {
  const [userId, setUserId] = useState<string>("");

  // Get userId from cookies
  useEffect(() => {
    const user = queryClient.getQueryData(["account"]) as any;
    // console.log("user", user);
    if (user) {
      setUserId(user._id);
    }
  }, []);

  const { data, isLoading: isListLoading } = productApi.useList({
    createdBy: userId,
  });

  const deleteProductMutation = productApi.useDeleteProduct();
  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProductMutation.mutateAsync(productId);

      queryClient.invalidateQueries("products");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  return (
    <>
      <div>Your Product</div>
      <Grid>
        <Grid.Col span={2.5}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section style={{ display: "flex", justifyContent: "center" }}>
              <Link type="router" href={RoutePath.CreateProduct}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    height: "300px",
                    width: "100%",
                  }}
                >
                  <ThemeIcon radius="xl" size="lg">
                    <IconPlus size={40} />
                  </ThemeIcon>
                  <Space h="md" />
                  <div> New Product</div>
                </div>
              </Link>
            </Card.Section>
          </Card>
        </Grid.Col>
        {!isListLoading &&
          data?.items.map((item) => (
            <Grid.Col span={2.5}>
              <CardComponent
                key={item._id}
                name={item.name}
                price={item.price}
                image={item.image ?? ""}
                quantity={item.quantity ?? "0"}
                onDelete={() => handleDeleteProduct(item._id)}
              />
            </Grid.Col>
          ))}
      </Grid>
    </>
  );
};

export default YourProduct;
