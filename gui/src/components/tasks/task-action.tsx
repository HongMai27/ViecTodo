import { format, isToday } from "date-fns"
import React, { useState } from "react"
import { FlatList, Modal, Pressable, StyleSheet, TextInput, TouchableOpacity, View } from "react-native"
import { Calendar } from "react-native-calendars"
import useSWR, { useSWRConfig } from "swr"
import useSWRMutation from "swr/mutation"
import Loader from "../shared/loader"
import { ICategory, ITaskRequest } from "../../types"
import axiosInstance, { fetcher } from "../../services/config"
import { BottomModal, ModalContent, ModalTitle, SlideAnimation, ModalPortal } from 'react-native-modals';
import { Box, Text } from "../../utils/theme"
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from "@react-native-picker/picker"
import { Dropdown } from "react-native-element-dropdown"
import Button from "../shared/button"


type TaskActionsProps = {
  categoryId: string;
  isModalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const today = new Date()

export const todaysISODate = new Date()
todaysISODate.setHours(0, 0, 0, 0)

const createTaskRequest = async (
  url: string,
  { arg }: { arg: ITaskRequest }
) => {
  try {
    await axiosInstance.post(url, {
      ...arg,
    })
  } catch (error) {
    console.log("error in createTaskRequest", error)
    throw error
  }
}

const TaskActions = ({ categoryId, isModalVisible, setModalVisible }: TaskActionsProps) => {
  const [isSelectingStartDate, setIsSelectingStartDate] = useState(false);
  const [isSelectingEndDate, setIsSelectingEndDate] = useState(false);
  const [isSelectingDate, setIsSelectingDate] = useState<boolean>(false)
  const [newTask, setNewTask] = useState<ITaskRequest>({
    categoryId: categoryId,
    date: todaysISODate.toISOString(),
    isCompleted: false,
    name: "",
  })

  const { data, trigger } = useSWRMutation("tasks/create", createTaskRequest)

  const { data: categories, isLoading } = useSWR<ICategory[]>(
    "categories",
    fetcher
  )

  const { mutate } = useSWRConfig()

  if (isLoading || !categories) {
    return <Loader />
  }
 

  const dropdownItems = categories.map((category) => ({
    label: category.name,
    value: category._id,
  }));


  const onCreateTask = async () => {
    try {
      if (newTask.name.length.toString().trim().length > 0) {

        await trigger({
          ...newTask,
        })
        setNewTask({
          categoryId: newTask.categoryId,
          isCompleted: false,
          date: todaysISODate.toISOString(),
          name: "",
        })
        await mutate("tasks/")
        setModalVisible(!isModalVisible)
      }
    } catch (error) {
      console.log("error in onCreateTask", error)
      throw error
    }
  }

  return (
    <BottomModal
      onSwipeOut={() => setModalVisible(!isModalVisible)}
      swipeDirection={["up", "down"]}
      swipeThreshold={200}
      modalTitle={<ModalTitle title="Thêm công việc cần làm mới" />}
      modalAnimation={
        new SlideAnimation({
          slideFrom: "bottom",
        })
      }
      visible={isModalVisible}
      onTouchOutside={() => setModalVisible(!isModalVisible)}
    >
      <ModalContent style={{ width: "100%", height: 230 }}>
        <View style={{ marginVertical: 10, justifyContent:'space-around' }}>
          <TextInput
            placeholder='Tên công việc'
            value={newTask.name}
            onChangeText={(text) => {
              setNewTask((prev) => {
                return {
                  ...prev,
                  name: text,
                };
              });
            }}
            style={styles.textInput}
          />
    <View style={{flexDirection: 'row', alignItems:'center', justifyContent:'space-around', marginVertical: 10}}>
          <Pressable onPress={() => {
              setIsSelectingDate((prev) => !prev)
            }}>
             <Text style={[styles.textInput, {width:160}]}>
                {isToday(new Date(newTask.date))
                  ? "Today"
                  : format(new Date(newTask.date), "MMM-dd")}
              </Text>
          </Pressable>
          <Dropdown
              style={[styles.dropdown]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={dropdownItems}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder='Danh mục'
              value={newTask.categoryId}
              onChange={item => {
                setNewTask(prev => ({ ...prev, categoryId: item.value }));
              }}
            />
          </View>
          <Button  label='Thêm' onPress={onCreateTask}/>
        </View>
       
         {isSelectingDate && (
        <Modal transparent={true}  animationType="slide">
        <View style={styles.overlay}>
          <Box style={styles.modalContent}>
          <Calendar
            minDate={format(today, "y-MM-dd")}
            onDayPress={(day: { dateString: string | number | Date }) => {
              setIsSelectingDate(false)
              const selectedDate = new Date(day.dateString).toISOString()
              setNewTask((prev) => {
                return {
                  ...prev,
                  date: selectedDate,
                }
              })
            }}
          />
        </Box>
        </View>
      </Modal>
      )}
      </ModalContent>
    </BottomModal>
  )
}

const styles = StyleSheet.create ({
 
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    padding: 10, 
    borderColor: "#A1A1A1", 
    borderWidth: 1, 
    borderRadius: 5
  },

  dropdown: {
    height: 40,
    width: 200,
    borderColor: "#A1A1A1",
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
  },
  placeholderStyle: {
    color: '#A1A1A1',
  },
  selectedTextStyle: {
    color: '#000',
  },
})
export default TaskActions