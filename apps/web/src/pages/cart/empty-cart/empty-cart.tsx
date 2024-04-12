import { FC, useCallback } from "react";
import Head from "next/head";
import router from "next/router";
import { Stack, Title, Text, Button, Image } from "@mantine/core";

import { RoutePath } from "routes";

const NotFound: FC = () => {
  const handleClick = useCallback(() => {
    router.push(RoutePath.Home);
  }, []);

  return (
    <>
      <Head>
        <title>Empty Cart</title>
      </Head>
      <Stack m="auto" justify="center" display="flex" align="center">
        <Image w="250" alt="App Info" src="/images/empty-cart.svg" />
        <Title order={3}>Oops! there's nothing here yet!</Title>

        <Text mx={0} mt={20} mb={24} c="gray.6">
          You haven't made any purchases Go to the marketplace and make
          purchases.
        </Text>

        <Button size="sm" radius="md" type="submit" onClick={handleClick}>
          Go to MarketPlace
        </Button>
      </Stack>
    </>
  );
};

export default NotFound;
