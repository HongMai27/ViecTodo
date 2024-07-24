import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import useSWRMutation from "swr/mutation";
import { ICategory, ITask } from "../../types";
import axiosInstance, { fetcher } from "../../services/config";
import { HomeScreenNavigationType } from "../../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { Box } from "../../utils/theme";
import { isToday, format } from "date-fns";
import useSWR from "swr";

type TaskProps = {
  task: ITask;
  mutateTasks: () => Promise<ITask[] | undefined>;
};

interface ITaskStatusRequest {
  id: string;
  isCompleted: boolean;
}

const toggleTaskStatusRequest = async (
  url: string,
  { arg }: { arg: ITaskStatusRequest }
) => {
  try {
    await axiosInstance.put(url + "/" + arg.id, { ...arg });
  } catch (error) {
    console.log("error in toggleTaskStatusRequest", error);
    throw error;
  }
};

const Task = ({ task, mutateTasks }: TaskProps) => {
  const { trigger } = useSWRMutation("tasks/update", toggleTaskStatusRequest);
  const [updatedTask, setUpdatedTask] = useState(task);
  const navigation = useNavigation<HomeScreenNavigationType>();

  const toggleTaskStatus = async () => {
    try {
      const _updatedTask = {
        id: task._id,
        isCompleted: !task.isCompleted,
      };
      await trigger(_updatedTask);
      await mutateTasks();
    } catch (error) {
      console.log("error in toggleTaskStatus", error);
      throw error;
    }
  };
  const isTaskExpired = (dueDate) => {
    const today = new Date();
    return new Date(dueDate) < today;
  };
  const navigateToEditTask = () => {
    navigation.navigate("EditTask", { task });
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };
  const { data: categories, isLoading } = useSWR<ICategory[]>(
    "categories",
    fetcher
  );
  
  const selectedCategory = categories?.find(
    (_category) => _category._id === updatedTask.categoryId
  );

  return (
    <View style={styles.pressable}>
      <View
        style={[
          styles.taskContainer,
          {
            backgroundColor: task.isCompleted ? "white" : "white",
            borderColor: task.isCompleted ? "#DB3AFF" : "#d946ef",
          
          },
        ]}
      >
        <View style={styles.taskContent}>
          <Pressable
            style={[
              styles.checkmarkContainer,
              {
                backgroundColor: task.isCompleted ? "#DB3AFF" : "white",
              },
            ]}
            onPress={toggleTaskStatus}
          >
            {task.isCompleted && <Icon name="check" size={20} color="#ffffff" />}
          </Pressable>
          <View style={styles.taskTextContainer}>
            <Text
              style={[
                styles.taskText,
                {
                  color: task.isCompleted ? "black" : "black",
                  // textDecorationLine: !task.isCompleted && isTaskExpired(task.date)  ? "line-through" : "none",
                },
              ]}
            >
              {truncateText(task.name, 20)}
            </Text>
            {selectedCategory && (
              <Text style={[styles.categoryText, { color: selectedCategory.color.code }]}>
                {truncateText(selectedCategory.name, 25)}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.dateContainer}>
          <Pressable
            style={{  
            backgroundColor: !task.isCompleted && isTaskExpired(task.date) ? '#fca5a5' : '#bbf7d0',
            borderRadius: 10,
            height: 40,
            width: 60,
            right: -10
          }}
          >
            <Text style={[styles.dateText, {textAlign:'center'}]}>
              {isToday(new Date(task.date)) ? "Today" : format(new Date(task.date), "dd/MM")}
            </Text>
          </Pressable>
        </View>
        <Pressable onPress={navigateToEditTask} style={styles.editButton}>
          <Icon name="dots-three-vertical" size={20} color="#555555" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pressable: {
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  taskContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkmarkContainer: {
    height: 28,
    width: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    elevation: 1,
    borderWidth:1,
    borderColor: '#DB3AFF'
  },
  taskTextContainer: {
    flex: 1,
  },
  taskText: {
    fontSize: 18,
    fontWeight: '500',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '400',
    marginTop: 4,
  },
  dateContainer: {
    marginRight: 12,
  },
  dateText: {
    fontSize: 14,
    color: "black",
    justifyContent:'center',
    textAlign:'center',
    top: 10
  },
  editButton: {
    padding: 8,
  },
});

export default Task;