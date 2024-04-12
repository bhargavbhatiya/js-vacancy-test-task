import {
  Alert,
  Button,
  Text,
  Stack,
  TextInput,
  ThemeIcon,
  Space,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconDevicesPlus,
  IconPlus,
  IconSum,
} from "@tabler/icons-react";
import { NextPage } from "next";
import { register } from "mixpanel-browser";
import Link from "next/link";
import YourProduct from "pages/your-product/index.page";
import { RoutePath } from "routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { productApi } from "resources/product";
import { useEffect, useState } from "react";
import handleError from "utils/handle-error.util";
import queryClient from "query-client";
import router from "next/router";
import ProductPhotoUpload from "./component/productPhotoUpload";

const createProduct: NextPage = () => {
  const [userId, setUserId] = useState<string>("");
  const [image, setImage] = useState<string>("/images/Cover-img.png");

  useEffect(() => {
    const user = queryClient.getQueryData(["account"]) as any;

    if (user) {
      setUserId(user._id);
    }
  }, []);
  const schema = z.object({
    name: z.string().min(1, "Please enter product name"),
    price: z.string().min(1, "Please enter product price"),
    image: z.string().min(1, "Please enter product image url").optional(),
    quantity: z.string().min(1, "Please enter product quantity"),
  });

  type ProductParams = z.infer<typeof schema> & { credentials?: string };
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ProductParams>({ resolver: zodResolver(schema) });

  const { mutate: productSubmit, isLoading } =
    productApi.creatProduct<ProductParams>();

  const onSubmit = async (data: ProductParams) => {
    const product = queryClient.getQueryData(["productUrl"]) as any;

    console.log("product", product);
    if (product) {
      setImage(product.url);
    }
    // Convert price and quantity to numbers
    const formDataWithUserId = {
      ...data,
      createdBy: userId,
      price: data.price,
      quantity: data.quantity,
      image: product ? product.url : image,
    };

    productSubmit(formDataWithUserId, {
      onSuccess: () => {
        router.push(RoutePath.YourProduct);
        console.log("Product created successfully");
      },
      onError: (e: any) => handleError(e, setError),
    });
  };

  useEffect(() => {
    console.log("Image after setImage", image);
  }, [image]);

  return (
    <>
      <Text fw={700} size="lg">
        Create New product
      </Text>
      <Space h="lg" />
      <ProductPhotoUpload />
      <div
        style={{
          width: "800px",
          marginTop: "20px",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={10}>
            <TextInput
              size="sm"
              {...register("name")}
              label="Title of the Product"
              placeholder="Enter title of the product..."
              error={errors.name?.message}
            />

            <TextInput
              size="sm"
              {...register("price")}
              label="Price"
              placeholder="Enter price of the Product"
              error={errors.price?.message}
            />
            <TextInput
              size="sm"
              {...register("quantity")}
              label="Quantity"
              placeholder="Enter Quantity of the Product"
              error={errors.quantity?.message}
            />

            {errors!.credentials && (
              <Alert icon={<IconAlertCircle size={16} />} color="red">
                {errors.credentials.message}
              </Alert>
            )}
          </Stack>

          <Button loading={isLoading} type="submit" fullWidth mt={30} size="sm">
            Add Product
          </Button>
        </form>
      </div>
    </>
  );
};

export default createProduct;
