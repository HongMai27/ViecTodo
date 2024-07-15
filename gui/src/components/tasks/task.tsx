

import { useNavigation } from "@react-navigation/native"
import React from "react"
import { GestureResponderEvent, Pressable } from "react-native"
import {
  FadeInLeft,
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import useSWRMutation from "swr/mutation"
import { ICategory, ITask } from "../../types"
import axiosInstance from "../../services/config"
import { HomeScreenNavigationType } from "../../navigation/types"
import { AnimatedBox, Box, Text } from "../../utils/theme"
import Icon  from "react-native-vector-icons/Entypo"
import { format } from "date-fns"


type TaskProps = {
  task: ITask;
  mutateTasks: () => Promise<ITask[] | undefined>
}

interface ITaskStatusRequest {
  id: string
  isCompleted: boolean
}

const toggleTaskStatusRequest = async (
  url: string,
  { arg }: { arg: ITaskStatusRequest }
) => {
  try {
    await axiosInstance.put(url + "/" + arg.id, {
      ...arg,
    })
  } catch (error) {
    console.log("error in toggleTaskStatusRequest", error)
    throw error
  }
}

const Task = ({ task, mutateTasks }: TaskProps) => {
  const { trigger } = useSWRMutation("tasks/update", toggleTaskStatusRequest)

  const offset = useSharedValue(1)
  const checkmarkIconSize = useSharedValue(0.8)

  const formattedDate = format(new Date(task.date), 'dd/MM/yyyy');
  const navigation = useNavigation<HomeScreenNavigationType>()

  const toggleTaskStatus = async () => {
    try {
      const _updatedTask = {
        id: task._id,
        isCompleted: !task.isCompleted,
      }
      await trigger(_updatedTask)
      await mutateTasks()
      if (!_updatedTask.isCompleted) {
        offset.value = 1
        checkmarkIconSize.value = 0
      } else {
        offset.value = 1.1
        checkmarkIconSize.value = 1
      }
    } catch (error) {
      console.log("error in toggleTaskStatus", error)
      throw error
    }
  }

 const navigateToEditTask = () => {
    navigation.navigate("EditTask", {
      task,
    })
  }


  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(offset.value) }],
    }
  })

  const checkMarkIconStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(checkmarkIconSize.value) }],
      opacity: task.isCompleted ? offset.value : 0,
    }
  })

  return (
    <AnimatedBox entering={FadeInRight} exiting={FadeInLeft}>
     <Box
        bg="gray100"
        p="4"
        borderRadius="rounded-2xl"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
          <Box flexDirection="row" alignItems="center">
            <AnimatedBox
              style={[animatedStyles]}
              flexDirection="row"
              alignItems="center"
            >
              <Pressable onPress={toggleTaskStatus}>
              <Box
                height={26}
                width={26}
                bg={task.isCompleted ? "gray9" : "gray300"}
                borderRadius="rounded-xl"
                alignItems="center"
                justifyContent="center"
              >
                {task.isCompleted && (
                  <AnimatedBox style={[checkMarkIconStyles]}>
                    <Icon name="check" size={20} color="white" />
                  </AnimatedBox>
                )}
              </Box>
              </Pressable>
            </AnimatedBox>
            <Box flexDirection="column" flex={1} marginLeft={'10'}>
          <Box flexDirection='row'>
      <Text variant="textXl" fontWeight="500" mb="3">
            {task.name}
          </Text>
      </Box>
          <Text variant="textBase" fontWeight="600" mb="3">
            {formattedDate}
          </Text>
        </Box>
          </Box>
          <Box>
          <Pressable onPress={navigateToEditTask} style={{right: 10}}>
              <Icon name="dots-three-vertical" size={16} color='#EB91FF' />
            </Pressable>
          </Box>
        </Box>
    </AnimatedBox>
  )
}

export default Task