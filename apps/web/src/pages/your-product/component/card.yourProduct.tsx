import {
  Card,
  Image,
  Text,
  Badge,
  Button,
  Group,
  Space,
  ThemeIcon,
  ActionIcon,
} from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'

function CardComponent(data: {
  name: string
  price: string
  image: string
  quantity: string
  onDelete: () => void
}) {
  return (
    <div style={{ height: '300px' }}>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        style={{ height: '300px' }}
      >
        <Card.Section>
          <ActionIcon
            radius="md"
            variant="filled"
            color="gray.5"
            style={{ position: 'absolute', top: '10px', right: '10px' }}
            onClick={data.onDelete}
          >
            <IconTrash size={20} />
          </ActionIcon>
          <Badge
            color="yellow"
            variant="light"
            style={{ position: 'absolute', bottom: '110px', right: '12px' }}
          >
            {data.quantity !== '0' ? 'On Sale' : 'Sold'}
          </Badge>
          <Image
            src={
              // "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2065&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              data.image !== ''
                ? data.image
                : 'https://res.cloudinary.com/bhatiya-bhargav/image/upload/v1713178243/Shopy/public/Cover-img.png.png'
            }
            height={200}
            alt={data.name}
          />
        </Card.Section>

        <div>
          <Text fw={700} pt="md" fz="lg">
            {data.name}
          </Text>
          <Space h="xs" />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div>Price:</div>

            <Text fw={700}>${data.price}</Text>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default CardComponent
