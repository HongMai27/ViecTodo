
import React from "react"
import { FlatList, Image, View } from "react-native"
import useSWR from "swr"
import { ITask } from "../../types"
import { fetcher } from "../../services/config"
import Loader from "../../components/shared/loader"
import SafeAreaWrapper from "../../components/shared/safe-area-wrapper"
import { Box, Text } from "../../utils/theme"
import Task from "../../components/tasks/task"

const TodayScreen = () => {
  const {
    data: tasks,
    isLoading: isLoadingTasks,
    mutate: mutateTasks,
  } = useSWR<ITask[]>(`tasks/today`, fetcher,
    {
      refreshInterval: 5000,
    }
  )

  if (isLoadingTasks || !tasks) {
    return <Loader />
  }
  // Sắp xếp các task
  const sortedTasks = tasks
    .slice()
    .sort((a, b) => {
      const dueDateA = new Date(a.date);
      const dueDateB = new Date(b.date);

      // Đưa các task chưa hoàn thành lên đầu
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }

      // Sắp xếp các task chưa hoàn thành theo ngày đến hạn gần nhất
      // và các task đã hoàn thành theo ngày đến hạn xa nhất
      return a.isCompleted
        ? dueDateB.getTime() - dueDateA.getTime() // Task đã hoàn thành: ngày đến hạn xa nhất
        : dueDateA.getTime() - dueDateB.getTime(); // Task chưa hoàn thành: ngày đến hạn gần nhất
    });

  return (
    <SafeAreaWrapper>
      
      <Box flex={1} mx="4">
        <Box height={16} />
        <Box flexDirection="row">
          <Text variant="textXl" fontWeight="700" ml="3">
            Today
          </Text>
        </Box>
        <Box height={16} />
  {/* Task Actions */}
        <Box height={16} />
        {tasks.length > 0 ? (
        <FlatList
          data={sortedTasks}
          renderItem={({ item, index }) => {
            return <Task task={item} mutateTasks={mutateTasks} />
          }}
          ItemSeparatorComponent={() => <Box height={1} />}
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
            style={{fontSize: 18,marginTop: 15,fontWeight: "600",textAlign: "center", fontFamily:'Lato'}}
          >
            Hôm nay không có công việc nào
          </Text>
        </View>
      )}
      </Box>
      
    </SafeAreaWrapper>
  )
}

export default TodayScreen