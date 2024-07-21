
import React from "react"
import { FlatList } from "react-native"
import useSWR from "swr"
import { ICategory } from "../../types"
import { fetcher } from "../../services/config"
import Loader from "../../components/shared/loader"
import Category from "../../components/categories/category"
import SafeAreaWrapper from "../../components/shared/safe-area-wrapper"
import { Box, Text } from "../../utils/theme"
import CreateNewList from "../../components/categories/create-new-list"



const CategoriesScreen = () => {
  const { data, isLoading, error } = useSWR<ICategory[]>(
    "categories/",
    fetcher,
    {
      refreshInterval: 1000,
    }
  )

  if (isLoading) {
    return <Loader />
  }

  const renderItem = ({ item }: { item: ICategory }) => (
    <Category category={item} />
  )

  return (
    <SafeAreaWrapper>
      <Box flex={1} px="4" style={{}}>
      <Box height={16} />
        <Text variant="textXl" fontWeight="700" mb="10">
          Danh sách danh mục
        </Text>
        <FlatList
          data={data}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Box />}
          keyExtractor={(item) => item._id}
        />
         <Box height={24} />
        <CreateNewList/>
      </Box>
      
    </SafeAreaWrapper>
  )
}

export default CategoriesScreen