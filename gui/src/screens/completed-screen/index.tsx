
import React from "react"
import { FlatList, Image, View } from "react-native"
import useSWR from "swr"
import { ITask } from "../../types"
import { fetcher } from "../../services/config"
import Loader from "../../components/shared/loader"
import SafeAreaWrapper from "../../components/shared/safe-area-wrapper"
import { Box, Text } from "../../utils/theme"
import Task from "../../components/tasks/task"
import TaskBink from "../../components/tasks/task"

const CompletedScreen = () => {
  const {
    data: tasks,
    isLoading: isLoadingTasks,
    mutate: mutateTasks,
  } = useSWR<ITask[]>(`tasks/tasks-completed`, fetcher, {
    refreshInterval: 1000,
  })
  
  if (isLoadingTasks || !tasks) {
    return <Loader />
  }

  return (
    <SafeAreaWrapper>
      <Box flex={1} mx="4" >
        <Box height={16} />
        <Box flexDirection="row">
          <Text variant="text3Xl" fontWeight="700" ml="3">
            Đã hoàn thành
          </Text>
        </Box>
        <Box height={16} />
        {tasks.length > 0 ? (
        <FlatList
          data={tasks}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            return <Task task={item} mutateTasks={mutateTasks} />
          }}
          ItemSeparatorComponent={() => <Box height={14} />}
          keyExtractor={(item) => item._id}
        />
        )  : ( // return when 0 task
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: "auto",
            marginLeft: "auto",
            marginRight: "auto",
          }}>
          <Image
            style={{ width: 200, height: 200, resizeMode: "contain" }}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/128/6104/6104865.png",
            }}
          />
          <Text
            style={{fontSize: 18,marginTop: 15,fontWeight: "600",textAlign: "center",}}
          >
            Chưa có công việc nào hoàn thành!
          </Text>
         
        </View>
      )}
      </Box>
    </SafeAreaWrapper>
  )
}

export default CompletedScreen