
import { Theme, useNavigation } from "@react-navigation/native"
import React from "react"
import { Pressable } from "react-native"
import  Icon  from "react-native-vector-icons/Ionicons"
import { Box } from "../utils/theme"

const NavigateBack = () => {
  const navigation = useNavigation()
  const navigateBack = () => {
    navigation.goBack()
  }
  return (
    <Pressable onPress={navigateBack}>
      <Box  p="2" borderRadius="rounded-7xl" width={40} >
        <Icon name="chevron-back" size={28}  />
      </Box>
    </Pressable>
  )
}

export default NavigateBack