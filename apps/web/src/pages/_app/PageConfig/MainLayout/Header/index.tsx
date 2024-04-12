import { memo, FC, useState, useEffect } from "react";
import {
  AppShellHeader as LayoutHeader,
  Container,
  Flex,
  ActionIcon,
  Badge,
  Space,
} from "@mantine/core";

import { accountApi } from "resources/account";

import { Link } from "components";
import { RoutePath } from "routes";
import { Button } from "@mantine/core";

// import { LogoImage } from '';

import UserMenu from "./components/UserMenu";
import ShadowLoginBanner from "./components/ShadowLoginBanner";

import classes from "./index.module.css";
import { useRouter } from "next/router";
import {
  IconCategory,
  IconPlus,
  IconShoppingCart,
  IconTrolley,
} from "@tabler/icons-react";
import { useSelector } from "react-redux";
import { RootState } from "resources/redux/store";

const Header: FC = () => {
  const { data: account } = accountApi.useGet();
  if (!account) return null;

  const router = useRouter();
  const isYourProductRoute =
    router.pathname === RoutePath.YourProduct ||
    router.pathname === RoutePath.CreateProduct;
  const isMarketPlaceRoute = router.pathname === RoutePath.Home;

  const cart = useSelector((state: RootState) => state.cart);

  return (
    <LayoutHeader>
      {account.isShadow && <ShadowLoginBanner email={account.email} />}
      <Container
        className={classes.header}
        mih={72}
        px={32}
        py={0}
        display="flex"
        fluid
      >
        <Link type="router" href={RoutePath.Home}>
          <img className="w-24" src="/images/logo.png" alt="Logo" />
        </Link>

        <Flex
          mih={50}
          gap="md"
          justify="center"
          align="center"
          direction="row"
          wrap="wrap"
        >
          <Link type="router" href="/">
            <Button
              variant={isMarketPlaceRoute ? "filled" : "subtle"}
              radius="xl"
              size="sm"
            >
              Marketplace
            </Button>
          </Link>
          <Link type="router" href={RoutePath.YourProduct}>
            <Button
              variant={isYourProductRoute ? "filled" : "subtle"}
              radius="xl"
              size="sm"
            >
              Your Product
            </Button>
          </Link>
        </Flex>
        <Flex
          mih={50}
          gap="md"
          justify="center"
          align="center"
          direction="row"
          wrap="wrap"
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginRight: "10px",
            }}
          >
            <Badge
              style={{ position: "absolute", top: "-10px", right: "-18px" }}
            >
              {cart.cartItems.length}
            </Badge>
            <ActionIcon
              size={35}
              variant="outline"
              color="blue"
              onClick={() => router.push(RoutePath.MyCart)}
            >
              <IconShoppingCart size={40} />
            </ActionIcon>
          </div>
          <UserMenu />
        </Flex>
      </Container>
    </LayoutHeader>
  );
};

export default memo(Header);
