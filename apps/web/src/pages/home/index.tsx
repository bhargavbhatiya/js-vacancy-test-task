import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import Head from "next/head";
import { NextPage } from "next";
import {
  Select,
  TextInput,
  Group,
  Title,
  Stack,
  Skeleton,
  Text,
  Container,
  UnstyledButton,
  Flex,
  Grid,
  Button,
  Space,
  Chip,
  Pagination,
  NumberInput,
  Pill,
} from "@mantine/core";
import { useDebouncedValue, useInputState } from "@mantine/hooks";
import {
  IconSearch,
  IconX,
  IconSelector,
  IconCross,
  IconBoxPadding,
  IconFoldDown,
  IconArrowAutofitDown,
  IconArrowDown,
  IconSortAZ,
  IconSortAscending,
  IconSortAscending2,
  IconArrowsSort,
  IconArrowDownRhombus,
  IconDropletDown,
  IconSelect,
  IconSection,
} from "@tabler/icons-react";
import {
  PaginationState,
  RowSelectionState,
  SortingState,
} from "@tanstack/react-table";
import { DatePickerInput, DatesRangeValue } from "@mantine/dates";

import { userApi } from "resources/user";

import { Table } from "components";

import { PER_PAGE, columns, selectOptions } from "./constants";

import classes from "./index.module.css";
import CardComponent from "components/Card";
import { productApi } from "resources/product";
import { reset } from "mixpanel-browser";
import { set } from "zod";

interface ProductsListParams {
  page?: number;
  perPage?: number;
  searchValue?: string;
  sort?: {
    createdOn: "asc" | "desc";
  };
  filter?: {
    createdOn?: {
      sinceDate: Date | null;
      dueDate: Date | null;
    };
    price?: {
      from: number | null;
      to: number | null;
    };
  };
}

const Home: NextPage = () => {
  const [search, setSearch] = useInputState("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [sortBy, setSortBy] = useState(selectOptions[0].value);

  const [params, setParams] = useState<ProductsListParams>({});

  const [debouncedSearch] = useDebouncedValue(search, 500);

  const handleSort = useCallback((value: string) => {
    setSortBy(value);
    setParams((prev) => ({
      ...prev,
      sort: value === "newest" ? { createdOn: "desc" } : { createdOn: "asc" },
    }));
  }, []);

  useLayoutEffect(() => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      searchValue: debouncedSearch,
      perPage: PER_PAGE,
    }));
  }, [debouncedSearch]);

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 1,
    pageSize: PER_PAGE,
  });
  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const onPageChangeHandler = useCallback(
    (currentPage: any, direction?: string) => {
      setPagination({ pageIndex: currentPage, pageSize });
      console.log("currentPage", currentPage);
      if (setParams) {
        setParams((prev: Record<string, any>) => ({
          ...prev,
          page: currentPage,
          direction,
        }));
      }
    },
    [setParams, pageSize]
  );
  const { data, isLoading: isListLoading } = productApi.useList(params);
  const renderPagination = useCallback(() => {
    //console.log("renderingg,..", data);

    return (
      <Pagination
        size="sm"
        total={data ? Math.ceil((data.count || 0) / PER_PAGE) : -1}
        value={pageIndex}
        onChange={onPageChangeHandler}
        color="blue"
        style={{ display: "flex", justifyContent: "center" }}
      />
    );
  }, [onPageChangeHandler, pageIndex, data]);

  const [fromPrice, setFromPrice] = useState(0);
  const [toPrice, setToPrice] = useState(0);

  const handlePriceChange = useCallback(
    (value: number, type: "from" | "to") => {
      if (type === "from") {
        setFromPrice(value);
      } else {
        setToPrice(value);
      }
    },

    []
  );

  useEffect(() => {
    if (fromPrice >= 0 && toPrice > 0 && fromPrice <= toPrice) {
      setParams((prev) => ({
        ...prev,
        filter: {
          price: {
            from: fromPrice,
            to: toPrice,
          },
        },
      }));
    } else if ((fromPrice == 0 && toPrice == 0) || fromPrice > toPrice) {
      setParams((prev) => ({
        ...prev,
        filter: {
          ...prev.filter,
          price: undefined,
        },
      }));
    }
  }, [fromPrice, toPrice]);

  const resetPrice = () => {
    setFromPrice(0);
    setToPrice(0);
    setParams((prev) => ({
      ...prev,
      filter: {
        ...prev.filter,
        price: undefined,
      },
    }));
  };

  return (
    <>
      <Head>
        <title>MarketPlace</title>
      </Head>
      {/* <Stack gap="lg"> */}
      <Grid>
        <Grid.Col span={3}>
          <div
            //className={classes.filter}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text fw={700}>Filters</Text>
            <div>
              <Button
                size="sm"
                color="gray"
                variant="subtle"
                onClick={() => {
                  resetPrice();
                }}
              >
                Reset All
                <IconX size={16} color="gray" />
              </Button>
            </div>
          </div>
          <Space h="md" />
          <Text fw={700}>Price</Text>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <NumberInput
              placeholder="From"
              prefix="From: $"
              value={fromPrice}
              onChange={(value) => handlePriceChange(Number(value), "from")}
              min={0}
            />
            <Space w="md" />
            <NumberInput
              placeholder="To"
              prefix="To: $"
              value={toPrice}
              onChange={(value) => handlePriceChange(Number(value), "to")}
              error={fromPrice > toPrice}
              min={fromPrice}
            />
          </div>
        </Grid.Col>
        <Grid.Col span={9}>
          <Skeleton
            className={classes.inputSkeleton}
            height={42}
            radius="sm"
            visible={isListLoading}
            width="auto"
          >
            <div style={{ width: "1050px" }}>
              <TextInput
                w={"100%"}
                size="sm"
                value={search}
                onChange={setSearch}
                placeholder="Type to search..."
                leftSection={<IconSearch size={16} />}
                rightSection={
                  search ? (
                    <UnstyledButton
                      component={Flex}
                      display="flex"
                      align="center"
                      onClick={() => setSearch("")}
                    >
                      <IconX color="gray" />
                    </UnstyledButton>
                  ) : null
                }
              />
            </div>
          </Skeleton>
          {/* </Group>
            </Group> */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0px 0px 10px",
            }}
          >
            <div style={{ fontWeight: 700 }}>
              {data ? data.items.length : 0} results
            </div>
            <Skeleton width="auto" radius="sm" visible={isListLoading}>
              <Select
                w={"120"}
                variant="unstyled"
                size="sm"
                data={selectOptions}
                value={sortBy}
                onChange={handleSort}
                leftSection={<IconArrowsSort size={16} />}
                rightSection={<IconSelect size={16} />}
                comboboxProps={{
                  withinPortal: false,
                  transitionProps: {
                    transition: "pop-bottom-right",
                    duration: 210,
                    timingFunction: "ease-out",
                  },
                }}
              />
            </Skeleton>
          </div>

          <Chip
            checked={false}
            onClick={() => {
              resetPrice();
            }}
            variant="outline"
            style={{ padding: "0px 0px 10px 5px" }}
            display={
              (fromPrice === 0 && toPrice === 0) || fromPrice > toPrice
                ? "none"
                : "flex"
            }
          >
            ${fromPrice} - ${toPrice} <IconX dx={10} size={16} />
          </Chip>

          <Grid style={{ display: "flex" }}>
            {!isListLoading &&
              data?.items.map((item) => (
                <Grid.Col span={4}>
                  <CardComponent
                    key={item.name}
                    name={item.name}
                    price={item.price}
                    image={item.image ?? ""}
                  />
                </Grid.Col>
              ))}
          </Grid>

          {isListLoading && (
            <>
              {[1, 2, 3].map((item) => (
                <Skeleton
                  key={`sklton-${String(item)}`}
                  height={50}
                  radius="sm"
                  mb="sm"
                />
              ))}
            </>
          )}

          {/* {data?.items.length ? (
            <Table
              columns={columns}
              data={data.items}
              dataCount={data.count}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              sorting={sorting}
              onSortingChange={setSorting}
              onPageChange={setParams}
              perPage={PER_PAGE}
            />
          ) : (
            <Container p={75}>
              <Text size="xl" c="gray">
                No results found, try to adjust your search.
              </Text>
            </Container>
          )} */}
        </Grid.Col>
      </Grid>
      <Space h="lg" />
      {renderPagination()}
      <Space h="lg" />
      {/* </Stack> */}
    </>
  );
};

export default Home;
