import { FC, ReactElement } from "react";

import { SimpleGrid, Image, Center, Grid } from "@mantine/core";

interface UnauthorizedLayoutProps {
  children: ReactElement;
}

const UnauthorizedLayout: FC<UnauthorizedLayoutProps> = ({ children }) => (
  <Grid>
    <Grid.Col span={7.5}>
      <Center px={32} w="100%" h="100vh" component="main">
        {children}
      </Center>
    </Grid.Col>
    <Grid.Col span={4.5}>
      <div>
        <Image
          alt="App Info"
          radius="lg"
          p="sm"
          src="/images/poster.png"
          h="100vh"
        />
      </div>
    </Grid.Col>
  </Grid>
);

export default UnauthorizedLayout;
