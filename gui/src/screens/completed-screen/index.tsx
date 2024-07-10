import { Button, Image, Pressable, View,  } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Box,Text } from '../../utils/theme'
import { useNavigation } from '@react-navigation/native'
import { AuthScreenNavigationType } from '../../navigation/types'
import SafeAreaWrapper from '../../components/shared/safe-area-wrapper'
import useSWR from 'swr'
import { FlatList } from 'react-native-gesture-handler'
import { ICategory, ITask } from '../../types'
import Task from '../../components/tasks/task'
import { fetcher } from '../../services/config'
import { format } from 'date-fns'
import Icon from 'react-native-vector-icons/Ionicons';



const CompletedScreen = () => {
  const [completedTasks, setCompletedTasks] = useState<ITask[]>([]);

  const { data, error, isLoading, mutate } = useSWR<ITask[]>('tasks/', fetcher, {
    refreshInterval: 1000,
  });
  const { data: categories } = useSWR<ICategory[]>('categories/', fetcher);

  useEffect(() => {
    if (data) {
      const completeTasks = data.filter(task => task.isCompleted);
      setCompletedTasks(completeTasks);
    }
  }, [data]);


  const renderTaskItem = ({ item }: { item: ITask }) => {
    const formattedDate = format(new Date(item.date), 'dd/MM/yyyy');
    return (
      <Pressable>
        <Box
          bg="fuchsia100"
          p="5"
          borderRadius="rounded-2xl"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Pressable>
            <Box
              width={24}
              height={24}
              borderRadius="rounded-2xl"
              borderWidth={1}
              alignItems="center"
              justifyContent="center"
              borderColor="gray500"
              backgroundColor='gray4'
            >
              <Icon name="checkmark-outline" size={20} color="white" />
            </Box>
          </Pressable>
          <Box flexDirection="column" flex={1} marginLeft={'10'}>
            <Text variant="text2Xl" fontWeight="500" mb="3">
              {item.name}
            </Text>
            <Text variant="textBase" fontWeight="600" mb="3">
              Ngày hoàn thành:  {formattedDate}
            </Text>
          </Box>
          
        </Box>
      </Pressable>
    );
    };


  return (
    <SafeAreaWrapper>

    <Box>
          <Text style={{fontSize: 20, fontWeight:'bold', textAlign:'center', color:'#222222', top: 30 }}>Danh sách công việc đã hoàn thành</Text>
    </Box>
    <Box mb="10" />
    <Box flex={1} px="3" top={30}>
        {completedTasks.length > 0 ? (
          <FlatList
            data={completedTasks}
            ItemSeparatorComponent={() => <Box height={10} />}
            keyExtractor={(item) => item._id.toString()}
            renderItem={renderTaskItem}
          />
        )  : ( // return when 0 task completed
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
            Chưa có công việc nào hoàn thành
          </Text>
        </View>
      )}
      </Box>
    </SafeAreaWrapper>
  )
}

export default CompletedScreen