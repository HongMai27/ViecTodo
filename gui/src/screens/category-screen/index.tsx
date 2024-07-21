import { RouteProp, useRoute } from "@react-navigation/native";
import React from "react";
import { FlatList, StyleSheet } from "react-native";
import useSWR from "swr";
import { CategoriesStackParamList } from "../../navigation/types";
import { ICategory, ITask } from "../../types";
import { fetcher } from "../../services/config";
import Loader from "../../components/shared/loader";
import SafeAreaWrapper from "../../components/shared/safe-area-wrapper";
import { Box, Text } from "../../utils/theme";
import Task from "../../components/tasks/task";
import NavigateBack from "../../navigation/navigate-back";
import TaskActions from "../../components/tasks/task-action";

type CategoryScreenRouteProp = RouteProp<CategoriesStackParamList, "Category">;

const CategoryScreen = () => {
  const route = useRoute<CategoryScreenRouteProp>();
  const { id } = route.params;

  const { data: category, isLoading: isLoadingCategory } = useSWR<ICategory>(
    `categories/${id}`,
    fetcher
  );

  const {
    data: tasks,
    isLoading: isLoadingTasks,
    mutate: mutateTasks,
  } = useSWR<ITask[]>(`tasks/tasks-by-category/${id}`, fetcher, {
    refreshInterval: 1000,
  });

  if (isLoadingTasks || isLoadingCategory || !category || !tasks) {
    return <Loader />;
  }

  return (
    <SafeAreaWrapper>
      <Box flex={1} mx="4">
        <Box width={40}>
          <NavigateBack />
        </Box>
        <Box height={16} />
        <Box flexDirection="row" alignItems="center">
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
        <Box height={8} />
        <Text variant="textBase" fontWeight="500" color="gray600">
          {tasks.length} {tasks.length === 1 ? "Task" : "Tasks"}
        </Text>
        <Box height={16} />
        <FlatList
          data={tasks}
          renderItem={({ item }) => (
            <Task task={item} mutateTasks={mutateTasks} />
          )}
          ItemSeparatorComponent={() => <Box height={14} />}
        />
      </Box>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  taskCount: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6b7280", // Gray color for task count
  },
});

export default CategoryScreen;