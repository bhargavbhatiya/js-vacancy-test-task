import { NextPage } from 'next'
import { Button, Card, Image, Text } from '@mantine/core'
import router from 'next/router'
import { RoutePath } from 'routes'
import { useAppDispatch } from 'resources/redux/hooks'
import { clearCart, addToOrderHistory } from 'resources/redux/slices/cartSlice'
import { useSelector } from 'react-redux'
import { productApi } from 'resources/product'
import { RootState } from 'resources/redux/store'
import { use, useEffect } from 'react'

interface Product {
  name: string
  price: string
  image: string
  cartQuantity: string
}
const PaymentSuccessful: NextPage = () => {
  const dispatch = useAppDispatch()

  const cartData = useSelector((state: RootState) => state.cart)

  if (cartData.cartItems.length > 0) {
    dispatch(addToOrderHistory(cartData.cartItems as any))
    dispatch(clearCart())
  }

  return (
    <>
      <div
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
          padding: '20px',
        }}
      >
        <Card
          padding="xl"
          radius="md"
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            w="50"
            alt="App Info"
            src="https://res.cloudinary.com/bhatiya-bhargav/image/upload/v1713178245/Shopy/public/Party%20Popper.svg.svg"
          />
          <Text size="md" fw={700} style={{ marginTop: '20px' }}>
            Payment Successful
          </Text>
          <Text mx={0} mt={20} mb={24} c="gray">
            Hooray, you have completed your payment!
          </Text>
          <Button
            size="sm"
            radius="md"
            type="submit"
            onClick={() => {
              router.push(RoutePath.MyCart)
            }}
          >
            Back to Cart
          </Button>
        </Card>
      </div>
    </>
  )
}

export default PaymentSuccessful
