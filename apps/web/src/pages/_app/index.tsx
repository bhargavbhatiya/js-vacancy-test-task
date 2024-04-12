import { FC } from "react";
import { QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import Head from "next/head";
import { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import "@mantine/core/styles.css";

import queryClient from "query-client";
import mainTheme from "theme/main-theme";

import PageConfig from "./PageConfig";
import { Provider } from "react-redux";
import { store } from "resources/redux/store";

const App: FC<AppProps> = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>Ship</title>
    </Head>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={mainTheme}>
          <ModalsProvider>
            <Notifications autoClose={10000} />

            <PageConfig>
              <Component {...pageProps} />
            </PageConfig>
          </ModalsProvider>
          <ReactQueryDevtools position="bottom-right" />
        </MantineProvider>
      </QueryClientProvider>
    </Provider>
  </>
);

export default App;
