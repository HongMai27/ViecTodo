import { RouteProp, useRoute } from "@react-navigation/native"
import React, { useEffect } from "react"
import { FlatList } from "react-native"
import useSWR from "swr"
import { CategoriesStackParamList } from "../../navigation/types"
import { ICategory, ITask } from "../../types"
import { fetcher } from "../../services/config"
import Loader from "../../components/shared/loader"
import SafeAreaWrapper from "../../components/shared/safe-area-wrapper"
import { Box, Text } from "../../utils/theme"
import NavigateBack from "../../navigation/navigate-back"
import TaskActions from "../../components/tasks/task-action"
import TaskBink from "../../components/tasks/task-bink"

type CategoryScreenRouteProp = RouteProp<CategoriesStackParamList, "Category">

const CategoryScreen = () => {
  const route = useRoute<CategoryScreenRouteProp>()

  const { id } = route.params

  const { data: category, isLoading: isLoadingCategory } = useSWR<ICategory>(
    `categories/${id}`,
    fetcher
  )

  //console.log(`categories/${id}`, JSON.stringify(category, null, 2))

  const {
    data: tasks,
    isLoading: isLoadingTasks,
    mutate: mutateTasks,
  } = useSWR<ITask[]>(`tasks/tasks-by-category/${id}`, fetcher, {
    refreshInterval: 1000,
  })

 // console.log('Tasks data:', tasks);

  if (isLoadingTasks || isLoadingCategory || !category || !tasks) {
    return <Loader />
  }

  return (
    <SafeAreaWrapper>
      <Box flex={1} mx="4">
        <Box width={40}>
          <NavigateBack />
        </Box>
        <Box height={16} />
        <Box flexDirection="row">
          <Text variant="textXl" fontWeight="700">
            {category.icon.symbol}
          </Text>
          <Text
            variant="textXl"
            fontWeight="700"
            ml="3"
            style={{
              color: category.color.code,
            }}
          >
            {category.name}
          </Text>
        </Box>
        <Box height={16} />
        <TaskActions categoryId={id} />
        <Box height={16} />

        <FlatList
          data={tasks}
          renderItem={({ item, index }) => {
            return <TaskBink task={item} mutateTasks={mutateTasks} />
          }}
          ItemSeparatorComponent={() => <Box height={14} />}
        />
      </Box>
    </SafeAreaWrapper>
  )
}

export default CategoryScreen