import React, { useEffect, useState } from "react";
import { Alert, FlatList, Image, Pressable, StyleSheet, TextInput, View } from "react-native";
import { ZoomInEasyDown } from "react-native-reanimated";
import useSWR from "swr";
import { getGreeting } from "../../utils/helpers";
import useUserGlobalStore from "../../store/useUserGlobalStore";
import { ITask } from "../../types";
import { fetcher, removeToken } from "../../services/config";
import Loader from "../../components/shared/loader";
import SafeAreaWrapper from "../../components/shared/safe-area-wrapper";
import { AnimatedText, Box, Text } from "../../utils/theme";
import Task from "../../components/tasks/task";
import { format } from "date-fns-tz";
import TaskActions from "../../components/tasks/task-action";
import TaskBink from "../../components/tasks/task";
import Icon from 'react-native-vector-icons/FontAwesome';
import { BottomModal, ModalContent, ModalTitle, SlideAnimation, ModalPortal } from 'react-native-modals';

const today = new Date();
const greeting = getGreeting({ hour: new Date().getHours() });

const HomeScreen = ({navigation}) => {
  const { user } = useUserGlobalStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTasks, setFilteredTasks] = useState<ITask[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const {
    data: tasks,
    isLoading,
    mutate: mutateTasks,
  } = useSWR<ITask[]>("tasks/", fetcher,
    {
      refreshInterval: 1000,
    }
  );
  useEffect(() => {
    if (tasks) {
      setFilteredTasks(tasks.filter(task => task.name.toLowerCase().includes(searchQuery.toLowerCase())));
    }
  }, [tasks, searchQuery]);
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  if (isLoading || !tasks) {
    return <Loader />;
  }

  return (
    <SafeAreaWrapper>
      <Box flex={1} mx="4" mt="4">
        <Box flexDirection="row" alignItems="center" justifyContent="space-between">
          <AnimatedText
            variant="textXl"
            fontWeight="500"
            entering={ZoomInEasyDown.delay(500).duration(700)}
          >
             {greeting}, {''}
            <Text color="purple1000">
            {user?.name}
            </Text>
          </AnimatedText>
          <Pressable onPress={() => navigation.navigate('Profile')}>
            <Image
              source={{ uri: "https://picsum.photos/200" }}
              style={styles.avatar}
            />
          </Pressable>
        </Box>

        <Box flexDirection="row" alignItems="center">
          <Text variant="textLg" fontWeight="500">
            Hôm nay, {format(today, "dd/MM/yyyy")} - {tasks.length} việc chưa làm
          </Text>
        </Box>
        <Box paddingHorizontal="4" paddingVertical="2" flexDirection="row">
        <View style={[styles.searchContainer, ]}>
          <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
              <Pressable  onPress={() => setModalVisible(!isModalVisible)} style={{ right: -45 }}>
        <Icon name="plus-circle" size={30} color="#EB91FF" />
          </Pressable>
          <TaskActions
        categoryId=""
        isModalVisible={isModalVisible}
        setModalVisible={setModalVisible}
      />            
        </View>
      </Box>
    
        <Box height={10} />
        {tasks.length > 0 ? (
        <FlatList
          data={filteredTasks}
          renderItem={({ item }) =>( 
          <Task task={item} mutateTasks={mutateTasks} />
          )
        }
          ItemSeparatorComponent={() => <Box height={14} />}
          showsVerticalScrollIndicator={false}
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
      <ModalPortal />
    </SafeAreaWrapper>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 50,
    left: -20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: 350
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    
  },
});