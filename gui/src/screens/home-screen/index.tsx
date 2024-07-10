import React, { useEffect, useState } from 'react';
import {Alert, Image, Pressable, ScrollView,StyleSheet,TextInput,View,ViewBase,} from "react-native";
import SafeAreaWrapper from '../../components/shared/safe-area-wrapper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native'
import { Box, Text } from '../../utils/theme'
import { useNavigation } from '@react-navigation/native'
import { AuthScreenNavigationType, HomeScreenNavigationType } from '../../navigation/types'
import { BottomModal, ModalContent, ModalTitle, SlideAnimation, ModalPortal } from 'react-native-modals';
import useSWR from 'swr'
import axiosInstance, { TOKEN_NAME, fetcher } from '../../services/config'
import { SearchBar } from 'react-native-screens';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { ICategory, ITask } from '../../types';
import Loader from '../../components/shared/loader';
import Task from '../../components/tasks/task';
import useUserGlobalStore from '../../store/useUserGlobalStore';
import {  removeToken } from '../../services/config'
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Dropdown } from 'react-native-element-dropdown';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import TaskActions from '../../components/tasks/task-action';

const HomeScreen: React.FC = () => {
  
  const [searchQuery, setSearchQuery] = useState('');
  const [taskName, setTaskName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStartDate, setSelectedStartDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');


  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filteredTasks, setFilteredTasks] = useState<ITask[]>([]);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [toDo, setTodo] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [deadline, setDeadline] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [category, setCategory] = useState<string | null>(null);
  const { user } = useUserGlobalStore();
  const { data, error, isLoading, mutate } = useSWR<ITask[]>('tasks/', fetcher, {
    refreshInterval: 1000,
  });
  const { data: categories, error: categoriesError, isLoading: isCategoriesLoading } = useSWR<ICategory[]>('categories/', fetcher);
    //Search
    
    useEffect(() => {
      if (data) {
        setFilteredTasks(data.filter(task => task.name.toLowerCase().includes(searchQuery.toLowerCase())));
      }
    }, [data, searchQuery]);
    const handleSearchChange = (text: string) => {
      setSearchQuery(text);
    };

    const handleCreate = async () => {
      try {
        const token = await AsyncStorage.getItem(TOKEN_NAME);
        if (!token) {
          Alert.alert('Lỗi', 'Không tìm thấy token xác thực.');
          return;
        }
    
        const newTaskData = {
          name: taskName, 
          categoryId: categories.find(cat => cat.name === selectedCategory)?._id,
          date: selectedEndDate, 
        };
    
        const response = await axiosInstance.post('/tasks/create', newTaskData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        console.log('Phản hồi từ server:', response.data);
        // Xử lý kết quả từ server sau khi thành công
      } catch (error) {
        console.error('Lỗi khi tạo task:', error.response?.data); // In ra lỗi từ server nếu có
        Alert.alert('Lỗi', 'Đã xảy ra lỗi khi tạo task. Vui lòng thử lại sau.');
      }
    }
    
    const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date | undefined) => {
      const currentDate = selectedDate || deadline;
      setShowDatePicker(false);
      setDeadline(currentDate);
    };
    const logout = async () => {
      const { updateUser } = useUserGlobalStore.getState();
      Alert.alert(
        'Đăng xuất',
        'Bạn có chắc muốn đăng xuất?',
        [
          {
            text: 'Hủy',
            style: 'cancel',
          },
          {
            text: 'Đăng xuất',
            onPress: async () => {
              try {
                await removeToken();  
                updateUser(null);  
                console.log('Đã đăng xuất thành công');
              } catch (error) {
                console.error('Error logging out:', error);
              }
            }
          }
            ],
            { cancelable: true }
      )
    };
  const navigation = useNavigation<HomeScreenNavigationType>()
    const navigationToAddTaskScreen = () => {
        navigation.navigate('AddTask')
    }

  if (isLoading) {
    return <Loader />;
  }
  if (error) {
    if (error.message.includes('401')) {
      return (
        <SafeAreaWrapper>
          <Box flex={1} px="4" justifyContent="center" alignItems="center">
            <Text>Lỗi xác thực. Vui lòng đăng nhập lại.</Text>
            {/* <Button title="Login" onPress={() => {goToSignIn}} /> */}
          </Box>
        </SafeAreaWrapper>
      );
    }
    return (
      <SafeAreaWrapper>
        <Box flex={1} px="4" justifyContent="center" alignItems="center">
          <Text>Lỗi khi tải dữ liệu</Text>
        </Box>
      </SafeAreaWrapper>
    );
  }
  
  const renderItem = ({ item }: { item: ITask }) => (
    <Task task={item} categories={categories} />
  );
    
 
  //FilterAll
  const handleAll = () =>{
    const allTasks = data ? [...data] : [];
    setFilteredTasks(allTasks);
    setSelectedFilter('all');
  }
  //FilterComplete
  const handleComplete = () => {
    const completedTasks = data?.filter(task => task.isCompleted);
    setFilteredTasks(completedTasks)
    setSelectedFilter('complete');
  };
  //FilterUnComplete
  const handleUnComplete = () => {
    const unCompletedTasks = data?.filter(task => !task.isCompleted);
    setFilteredTasks(unCompletedTasks)
    setSelectedFilter('uncomplete');
  };

  return (
    <SafeAreaWrapper>
      
      <Box flexDirection="row" justifyContent="space-between" alignItems="center" paddingHorizontal="4" paddingVertical="2">
        <View>
          <Text style={styles.greetingText}>Hello  </Text>
        </View>
        <View>
          <Pressable onPress={logout}>
          <Image
            source={{ uri: 'https://picsum.photos/200' }} // Example URI for avatar image
            style={styles.avatar}
          />
          </Pressable>
        </View>
      </Box>
      <Box paddingHorizontal="4" paddingVertical="2">
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
        </View>
      </Box>
      <View
          style={{
            marginHorizontal: 17,
            marginVertical: 2,
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Pressable 
            onPress={handleAll}  
            style={[
              styles.filter,
              selectedFilter === 'all' && styles.selectedFilter,
          ]}>
            <Text style={{ color: "white", textAlign: "center", fontSize: 16 }}>Tất cả</Text>
          </Pressable>
          <Pressable 
            onPress={handleComplete}  
            style={[
              styles.filter,
              selectedFilter === 'complete' && styles.selectedFilter,
          ]}>
            <Text style={{ color: "white", textAlign: "center", fontSize: 16 }}>Đã hoàn thành</Text>
          </Pressable>
          <Pressable 
            onPress={handleUnComplete}  
            style={[
              styles.filter,
              selectedFilter === 'uncomplete' && styles.selectedFilter,
          ]}>
            <Text style={{ color: "white", textAlign: "center", fontSize: 16 }}>Chưa hoàn thành</Text>
          </Pressable>
          <Pressable onPress={() => setModalVisible(!isModalVisible)} style={{right:-10}}>
            <Icon name="plus-circle" size={30} color="#EB91FF" />
          </Pressable>
        </View>
        <Box height={10} />
        <TaskActions categoryId="" />
        <Box height={10} />
      <Box flex={1} px="4">
      {data.length > 0 ? (
        <FlatList
          data={filteredTasks}
          ItemSeparatorComponent={() => <Box height={10} />}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderItem}
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
            Danh sách công việc đang trống
          </Text>
          <Text
            style={{fontSize: 13,marginTop: 15,fontWeight: "600",textAlign: "center",
            }}
          >
            Nhấp + để thêm công việc mới
          </Text>
        </View>
      )}
      </Box>
      <BottomModal //Add Task
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
          <ModalContent style={{ width: "100%", height: 280 }}>
            <View style={{marginVertical:10}}>
              <TextInput 
                placeholder='Name'
                value={taskName}
                onChangeText={setTaskName}
                style={{padding:10, borderColor:"#A1A1A1", borderWidth:1, borderRadius:5}}
              />
            </View>


            <Pressable onPress={handleCreate}
              style={styles.submitButton}
            >
              <Icon name="chevron-circle-right" color="#e884f5" size={40} />
            </Pressable>
          </ModalContent>
        </BottomModal>
      <ModalPortal />
    </SafeAreaWrapper>
  );
};
export default HomeScreen;

const styles = StyleSheet.create({
    greetingText: {
    fontSize: 22, 
    fontWeight: 'bold', 
    marginRight: 10,
    color:'black'
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  projectContainer: {
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 15,
    elevation: 3,
    padding: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginLeft: 10, 
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filter:{
    backgroundColor: "#EB91FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedFilter: {
    backgroundColor: '#DB3AFF', 
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  datePickerButton: {
    padding: 10,
    borderColor: '#A1A1A1',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 0,
    alignItems: 'center',
  },
  dropdown: {
    padding: 10,
    borderColor: '#A1A1A1',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 0,
    marginLeft: 10
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#A1A1A1',
  },
  submitButton: {
    marginTop: 10,
    alignItems: 'flex-end',
  },
  selectedTextStyle: {
    fontSize: 16,
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

  }
});

