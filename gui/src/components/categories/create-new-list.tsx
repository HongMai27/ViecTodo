
import { Theme, useNavigation } from "@react-navigation/native"
import { useTheme } from "@shopify/restyle"
import React from "react"
import { Pressable } from "react-native"
import { CategoriesNavigationType } from "../../navigation/types"
import { Box, Text } from "../../utils/theme"
import Icon from 'react-native-vector-icons/FontAwesome6Pro';

const CreateNewList = () => {
  const navigation = useNavigation<CategoriesNavigationType>()
  const theme = useTheme<Theme>()

  const navigateToCreateCategory = () => {
    navigation.navigate("CreateCategory", {})
  }

  return (
    <Pressable onPress={navigateToCreateCategory}>
      <Box
        p="4"
        bg="lightGray"
        borderRadius="rounded-5xl"
        flexDirection="row"
        alignItems="center"
      >
        <Icon name="plus" size={24} color='gray500' />
        <Text variant="textXl" fontWeight="600" color="gray650" ml="3">
          Create new list
        </Text>
      </Box>
    </Pressable>
  )
}

export default CreateNewList