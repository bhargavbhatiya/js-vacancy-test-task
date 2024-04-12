import { NextPage } from "next";
import { Button, Card, Image, Text } from "@mantine/core";
import router from "next/router";
import { RoutePath } from "routes";

const PaymentFailed: NextPage = () => {
  return (
    <>
      <div
        style={{
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          padding: "20px",
        }}
      >
        <Card
          padding="xl"
          radius="md"
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image w="50" alt="App Info" src="/images/Cross Mark.svg" />
          <Text size="md" fw={700} style={{ marginTop: "20px" }}>
            Payment Failed
          </Text>
          <Text mx={0} mt={20} mb={24} c="gray">
            Sorry, your payment failed. Would you like to try again?
          </Text>
          <Button
            size="sm"
            radius="md"
            type="submit"
            onClick={() => {
              router.push(RoutePath.MyCart);
            }}
          >
            Back to Cart
          </Button>
        </Card>
      </div>
    </>
  );
};

export default PaymentFailed;
