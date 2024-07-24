import { format, isToday } from "date-fns"
import React, { useState } from "react"
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
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
import Icons from "../shared/icons"


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
    description: '',
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
          description: "",
        })
        await mutate("tasks/")
        setModalVisible(!isModalVisible)
        console.log('Đã thêm task')
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
      modalTitle={<ModalTitle title="Thêm công việc cần làm" />}
      modalAnimation={
        new SlideAnimation({
          slideFrom: "bottom",
        })
      }
      visible={isModalVisible}
      onTouchOutside={() => setModalVisible(!isModalVisible)}
    >
      <ScrollView>
      <ModalContent style={{ width: "100%", height: 400 }}>
        <View style={{ marginVertical: 10, justifyContent:'space-around', padding: 2}}>
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
          <Box mb="4" />
          <TextInput
            placeholder='Mô tả'
            value={newTask.description}
            onChangeText={(text) => {
              setNewTask((prev) => {
                return {
                  ...prev,
                  description: text,
                };
              });
            }}
            style={[styles.textInput, { height: 150, textAlignVertical: 'top' }]}
            multiline={true}
            numberOfLines={4}
          />
           <View style={styles.dateCategoryContainer}>
            <Pressable onPress={() => setIsSelectingDate((prev) => !prev)} style={styles.datePickerButton}>
              <Text style={styles.datePickerText}>
                {isToday(new Date(newTask.date))
                  ? "Hôm nay"
                  : format(new Date(newTask.date), "dd/MM/yyyy")}
              </Text>
            </Pressable>
            <Dropdown
              style={styles.dropdown}
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
          <Button label='Thêm' onPress={onCreateTask} />
        </View>

        {isSelectingDate && (
          <Modal transparent={true} animationType="slide">
            <TouchableWithoutFeedback onPress={() => setIsSelectingDate(false)}>
            <View style={styles.overlay}>
              <Box style={styles.modalContent}>
                <Calendar
                  minDate={format(today, "y-MM-dd")}
                  theme={{
                    calendarBackground: 'white',
                    textSectionTitleColor: '#DB3AFF',
                    selectedDayBackgroundColor: '#DB3AFF',
                    selectedDayTextColor: 'white',
                    todayTextColor: '#DB3AFF',
                    dayTextColor: 'black',
                    dotColor: '#DB3AFF',
                    selectedDotColor: 'white',
                    arrowColor: '#DB3AFF',
                  }}
                  onDayPress={(day: { dateString: string | number | Date }) => {
                    setIsSelectingDate(false);
                    const selectedDate = new Date(day.dateString).toISOString();
                    setNewTask((prev) => {
                      return {
                        ...prev,
                        date: selectedDate,
                      };
                    });
                  }}
                />
              </Box>
            </View>
            </TouchableWithoutFeedback>
      </Modal>
      )}
      </ModalContent>
      </ScrollView>
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
    borderColor: "#d946e9",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 0,
  },
  dateCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  datePickerButton: {
    padding: 10,
    borderColor: "#d946e9",
    borderWidth: 1,
    borderRadius: 5,
    width: '49%',
    height: 45,
  },
  datePickerText: {
    color: '#a1a1a1',
  },
  dropdown: {
    height: 45,
    width: '48%',
    borderColor: "#d946e9",
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    padding: 10,
  },
  placeholderStyle: {
    color: '#A1A1A1',
    fontSize: 16,
  },
  selectedTextStyle: {
    color: '#000',
  },
})
export default TaskActions