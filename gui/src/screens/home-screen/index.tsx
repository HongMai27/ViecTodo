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
import theme, { AnimatedText, Box, Text } from "../../utils/theme";
import Task from "../../components/tasks/task";
import { format } from "date-fns-tz";
import TaskActions from "../../components/tasks/task-action";
import Icon from 'react-native-vector-icons/FontAwesome';
import { ModalPortal } from 'react-native-modals';
import LinearGradient from 'react-native-linear-gradient';

const today = new Date();
const greeting = getGreeting({ hour: new Date().getHours() });

const HomeScreen = ({ navigation }) => {
  const { user } = useUserGlobalStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTasks, setFilteredTasks] = useState<ITask[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const { data: tasks, isLoading, mutate: mutateTasks } = useSWR<ITask[]>("tasks/", fetcher, {
    refreshInterval: 1000,
  });

  useEffect(() => {
    if (tasks) {
      setFilteredTasks(tasks.filter(task => task.name.toLowerCase().includes(searchQuery.toLowerCase())));
    }
  }, [tasks, searchQuery]);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };
  const pendingTasksCount = tasks?.filter(task => !task.isCompleted).length ?? 0;
  const sortedTasks = filteredTasks
    .slice()
    .sort((a, b) => {
      const dueDateA = new Date(a.date);
      const dueDateB = new Date(b.date);
      if (a.isCompleted !== b.isCompleted) {
        return a.isCompleted ? 1 : -1;
      }
      return a.isCompleted
        ? dueDateB.getTime() - dueDateA.getTime() 
        : dueDateA.getTime() - dueDateB.getTime(); 
    })
    .slice(0, 15); 

  if (isLoading || !tasks) {
    return <Loader />;
  }

  return (
    <SafeAreaWrapper>
      <Box flex={1} mx="4" mt="4">
        {/* Container chung cho lời chào, avatar và ô tìm kiếm */}
        <Box flexDirection="column" alignItems="center" justifyContent="center">
          <Box flexDirection="row" alignItems="center" justifyContent="space-between" width="100%" mb="1">
            <AnimatedText
              variant="text2Xl"
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

          <Box flexDirection="row" alignItems="center" width="100%" mb="1">
            <Text variant="textBase" fontWeight="300">
              Hôm nay, {format(today, "dd/MM/yyyy")} có {pendingTasksCount} việc chưa làm
            </Text>
          </Box>

          <Box width="100%" paddingVertical="1">
            <View style={styles.searchContainer}>
              <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm công việc..."
                placeholderTextColor="#888"
                value={searchQuery}
                onChangeText={handleSearchChange}
              />
            </View>
          </Box>
        </Box>

        <Box height={10} />
        {tasks.length > 0 ? (
          <FlatList
            data={sortedTasks}
            renderItem={({ item }) => <Task task={item} mutateTasks={mutateTasks} />}
            ItemSeparatorComponent={() => <Box height={14} />}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item._id}
          />
        ) : (
          <View style={styles.emptyTaskContainer}>
            <Image
              style={styles.emptyTaskImage}
              source={{ uri: "https://cdn-icons-png.flaticon.com/128/6104/6104865.png" }}
            />
            <Text style={styles.emptyTaskText}>Danh sách công việc đang trống</Text>
            <Text style={styles.emptyTaskSubText}>Nhấp + để thêm công việc mới</Text>
          </View>
        )}

        <TaskActions
          categoryId=""
          isModalVisible={isModalVisible}
          setModalVisible={setModalVisible}
        />
      </Box>

      <Pressable
        onPress={() => setModalVisible(!isModalVisible)}
        style={[styles.container, styles.wrapper]}
      >
        <Icon  name="plus" size={28} color={theme.colors.white} />
      </Pressable>

      <ModalPortal />
    </SafeAreaWrapper>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 1,
  },
  wrapper: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    margin: 10,
  },
  container: {
    width: 60,
    height: 60,
    borderColor:'#DB3AFF',
    borderWidth:1,
    backgroundColor:'#f5d0fe',
    borderRadius:50, 
    alignItems:"center",
    justifyContent:"center"
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: '100%',
    borderWidth: 1,
    borderColor: '#d946e9',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  emptyTaskContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    marginLeft: "auto",
    marginRight: "auto",
  },
  emptyTaskImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  emptyTaskText: {
    fontSize: 18,
    marginTop: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  emptyTaskSubText: {
    fontSize: 13,
    marginTop: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  overlayButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: 10,
    zIndex: 0,
  },
  circleButton: {
    width: 66,
    height: 66,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusText: {
    fontSize: 45,
    color: '#fff',
    alignContent: 'center',
  },
});
