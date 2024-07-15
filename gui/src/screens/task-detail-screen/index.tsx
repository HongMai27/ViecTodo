import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, Touchable, Modal } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ICategory, ITask, ITaskRequest, ParamList } from '../../types'; 
import { format } from 'date-fns';
import Button from '../../components/shared/button';
import { TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Box } from '../../utils/theme';
import axios from 'axios';
import axiosInstance, { TOKEN_NAME, fetcher } from '../../services/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SafeAreaWrapper from '../../components/shared/safe-area-wrapper';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import useSWR, { mutate, useSWRConfig } from 'swr';
import useSWRMutation from 'swr/dist/mutation';
import { Dropdown } from 'react-native-element-dropdown';


type TaskDetailScreenRouteProp = RouteProp<ParamList, 'TaskDetail'>;
type TaskDetailScreenNavigationProp = StackNavigationProp<ParamList, 'TaskDetail'>;

type Props = {
  route: TaskDetailScreenRouteProp;
  navigation: TaskDetailScreenNavigationProp;
};
export const today = new Date();
export const todaysISODate = new Date(today).setHours(0, 0, 0, 0);

const updateTaskRequest = async (url: string, { arg }: { arg: ITaskRequest }) => {
  try {
    await axiosInstance.put(url, arg);
  } catch (error) {
    console.error("error in updateTaskRequest", error);
    throw error;
  }
};
const TaskDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  
  const [taskName, setTaskName] = useState('');
  const { task, categories } = route.params;
  const [isSelectingDate, setIsSelectingDate] = useState<boolean>(false);
 
  const { mutate } = useSWRConfig();

  const [isSelectingStartDate, setIsSelectingStartDate] = useState(false);
  const [isSelectingEndDate, setIsSelectingEndDate] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(new Date(task.createdAt));
  const [selectedEndDate, setSelectedEndDate] = useState(new Date(task.date));
  const [taskStatus, setTaskStatus] = useState(task.isCompleted ? 'Đã hoàn thành' : 'Chưa hoàn thành');
  const [selectedCategory, setSelectedCategory] = useState('');
  // const { trigger } = useSWRMutation("tasks/edit", updateTaskRequest)
  const [updatedTask, setUpdatedTask] = useState(task)
    const formattedStartDate = format(selectedStartDate, 'dd/MM/yyyy');
  const formattedEndDate = format(selectedEndDate, 'dd/MM/yyyy');
  const category = categories.find(cat => cat._id === task.categoryId);
  
  const statusOptions = ['Đã hoàn thành', 'Chưa hoàn thành'];
  useEffect(() => {
    if (task) {
      setTaskName(task.name);
      setSelectedStartDate(new Date(task.createdAt));
      setSelectedEndDate(new Date(task.date));
      setSelectedCategory(task.categoryId);
      setTaskStatus(task.isCompleted ? 'Đã hoàn thành' : 'Chưa hoàn thành');
    }
  }, [task]);

  const { trigger } = useSWRMutation(`tasks/edit/${task._id}`, updateTaskRequest);
  const dropdownItems = categories.map((category) => ({
    label: category.name,
    value: category._id,
  }));
  const handleStatusChange = (itemValue) => {
    setTaskStatus(itemValue);
  };
  const { goBack } = useNavigation();

  const openStartDatePicker = () => {
    setIsSelectingStartDate(true);
  };

  const openEndDatePicker = () => {
    setIsSelectingEndDate(true);
  };

  const handleDayPress = (day: { dateString: string }) => {
    const selectedDate = new Date(day.dateString);
    if (isSelectingStartDate) {
      setSelectedStartDate(selectedDate);
      setIsSelectingStartDate(false);
    } else if (isSelectingEndDate) {
      setSelectedEndDate(selectedDate);
      setIsSelectingEndDate(false);
    }
  };
  const handleDelete = async () => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa công việc này?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem(TOKEN_NAME);
              console.log(TOKEN_NAME)
              if (!token) {
                Alert.alert('Lỗi', 'Không tìm thấy token xác thực.');
                return;
              }
              console.log(`Deleting task with ID: ${task._id}`);

              const response = await axiosInstance.delete(`/tasks/delete/${task._id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              if (response.status === 200) {
                Alert.alert('Thành công', 'Công việc đã được xóa.');
                navigation.goBack();
              } else {
                Alert.alert('Lỗi', 'Không thể xóa công việc. Vui lòng thử lại sau.');
              }
            } catch (error) {
              if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                  Alert.alert('Lỗi', 'Không tìm thấy công việc. Vui lòng kiểm tra lại ID.');
                } else if (error.response?.status === 401) {
                  Alert.alert('Lỗi', 'Không có quyền. Vui lòng đăng nhập lại.');
                } else {
                  Alert.alert('Lỗi', `Lỗi từ server: ${error.response?.status}`);
                }
              } else {
                Alert.alert('Lỗi', 'Không thể xóa công việc. Vui lòng thử lại sau.');
              }
              console.error(error);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };
  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_NAME);
      if (!token) {
        Alert.alert('Lỗi', 'Không tìm thấy token xác thực.');
        return;
      }
      const updatedData = {
        name: taskName,
        isCompleted: taskStatus === 'Đã hoàn thành' ? true : false,
        categoryId: categories.find(cat => cat.name === selectedCategory)?._id, 
        createdAt: selectedStartDate.toISOString(),
        date: selectedEndDate.toISOString(), 
      };
      const response = await axiosInstance.put(`/tasks/update/${task._id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        Alert.alert('Thành công', 'Thông tin công việc đã được cập nhật.');
        console.log('name trước khi gửi', taskName, 'name của task.name', task.name)
      } else {
        Alert.alert('Lỗi', 'Không thể cập nhật công việc. Vui lòng thử lại sau.');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật công việc. Vui lòng thử lại sau.');
      console.error('Error updating task:', error);
    }
  };
  
  const updateTask = async () => {
    try {
      if (updateTask.name.length.toString().trim().length > 0) {
        await trigger({ ...updatedTask })
        await mutate("tasks/")
        navigation.goBack()
      }
    } catch (error) {
      console.log("error in updateTask", error)
      throw error
    }
  }
  
  return (
    <SafeAreaWrapper>

    <View style={{ flex: 1,  justifyContent: 'flex-start', padding: 20 }}>
      <Pressable onPress={goBack} style={{ top: 30}}>
        <Icon name='angle-left' size={30}/>
      </Pressable>
      <Text style={{ fontSize: 24, color:'#222222', fontWeight:'bold', left: 20}}>Chi tiết công việc</Text>
      <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start', top: 90 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '72%' }}>
          <View>
            <Text style={styles.text}>Tên công việc:</Text>
            <Box mb="6" />
            <Text style={styles.text}>Ngày bắt đầu:</Text>
            <Box mb="6" />
            <Text style={styles.text}>Ngày hết hạn:</Text>
            <Box mb="6" />
            <Text style={styles.text}>Danh mục:</Text>
            <Box mb="6" />
            <Text style={styles.text}>Trạng thái:</Text>
            <Box mb="6" />
            <View style={{flexDirection: 'row'}}>
            <Icon name="trash" size={20} color="red"  />
            <Pressable onPress={handleDelete}>
                <Text style={{ fontSize: 18, marginBottom: 5, color:'red', fontWeight:'bold', left: 10}}>Xóa công việc</Text>
            </Pressable>
            </View>
          </View>
          <View>
          <TextInput
                style={styles.input}
                placeholder={task.name}
                value={taskName}
                onChangeText={setTaskName}
            />
            <Pressable  onPress={openStartDatePicker}>
              <Text style={styles.input}>{formattedStartDate}</Text>
            </Pressable>
            <Pressable  onPress={openEndDatePicker}>
              <Text style={styles.input}>{formattedEndDate}</Text>
            </Pressable>
            <Dropdown
              style={[styles.dropdown]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={dropdownItems}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={category.name}
              value={selectedCategory}
              onChange={item => {
                setSelectedCategory(item.value);
              }}
            />
           

            {/* <Picker
                selectedValue={taskStatus}
                onValueChange={(itemValue) => handleStatusChange(itemValue)}
                style={[styles.picker]}
            >
              {statusOptions.map((option, index) => (
                <Picker.Item key={index} label={option} value={option} />
              ))}
            </Picker> */}
          </View>
        </View>
      </View>
      <Modal transparent={true} visible={isSelectingStartDate || isSelectingEndDate} animationType="slide">
        <View style={styles.overlay}>
          <Box style={styles.modalContent}>
            <Calendar
              minDate={format(new Date(), 'y-MM-dd')}
              onDayPress={handleDayPress}
              markedDates={{
                [format(selectedStartDate, 'yyyy-MM-dd')]: { selected: true, marked: true, selectedColor: '#EB91FF' },
                [format(selectedEndDate, 'yyyy-MM-dd')]: { selected: true, marked: true, selectedColor: '#EB91FF' },
              }}
            />
            <TouchableOpacity
              onPress={() => {
                setIsSelectingStartDate(false);
                setIsSelectingEndDate(false);
              }}
            >
            </TouchableOpacity>
          </Box>
        </View>
      </Modal>
        <Button label='Lưu' onPress={handleUpdate} uppercase />
      </View>
  </SafeAreaWrapper>
  );
};

export default TaskDetailScreen;
 
const styles = StyleSheet.create({
    greetingText: {
      fontSize: 22, 
      fontWeight: 'bold', 
      marginRight: 10, 
    },
    container: {
      flex: 1,
      padding: 10,
      backgroundColor: '#CCCCCC',
    },
    text: {
        fontSize:18,
        marginBottom: 5,
        height: 35,
        color:'black'
    },
    input: {
        height: 50,
        borderColor: '#CCCCCC',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        fontSize:16,
        textAlign:'center',
        width: '100%',
        justifyContent:'center'
      },
      iconContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
  
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

      picker: {
        borderColor: 'black', 
        borderWidth: 2, 
        backgroundColor: '#CCCCCC',
        borderRadius: 10, 
        paddingHorizontal: 10, 
        height: 50,
        marginBottom: 10,
        fontSize:16,
        textAlign:'center',
        width: '200%',
    
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