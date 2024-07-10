import { Pressable } from "react-native"
import { Box, Text } from "../../utils/theme"

type ButtonProps = {
  label: string
  onPress: () => void
  onLongPress?: () => void
  disabled?: boolean
  uppercase?: boolean
  bg?: string
}

const Button = ({
  label,
  onLongPress,
  onPress,
  disabled,
  uppercase,
}: ButtonProps) => {
  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} disabled={disabled}>
      <Box
        bg={disabled ? "amber200" : "purple1000"}
        py="3.5"
        borderRadius="rounded-2xl"
        height={60}
        backgroundColor="purple1000"
      >
        <Text
          variant="textXs"
          fontWeight="700"
          fontSize={18}
          color="white"
          textAlign="center"
          lineHeight={30}
          textTransform={uppercase ? "uppercase" : "none"}
        >
          {label}
        </Text>
      </Box>
    </Pressable>
  )
}

export default Button