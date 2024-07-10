import React, { useState } from 'react';
import { GestureResponderEvent, Pressable } from 'react-native';
import { Box, Text } from '../../utils/theme';
import { ICategory, ITask } from '../../types';
import { format } from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationType } from '../../navigation/types';
import Icon from 'react-native-vector-icons/Ionicons';

type TaskProps = {
  task: ITask;
  categories: ICategory[];
};

const Task: React.FC<TaskProps> = ({ task, categories }) => {
  const navigation = useNavigation<HomeScreenNavigationType>();

  const [isChecked, setIsChecked] = useState<boolean>(task.isCompleted);

  const category = categories ? categories.find(cat => cat._id === task.categoryId) : null;

  const formattedDate = format(new Date(task.date), 'dd/MM/yyyy');

  const toggleCheckBox = () => {
    setIsChecked(!isChecked);
  };

  const navigateToTaskDetail = (task: ITask) => {
    return (event: GestureResponderEvent) => {
      navigation.navigate('TaskDetail', { task, categories });
      console.log('taskId',task._id)
    };
  };

  return (
    <Pressable onPress={navigateToTaskDetail(task)}>
      <Box
        bg="fuchsia100"
        p="4"
        borderRadius="rounded-2xl"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Pressable onPress={toggleCheckBox}>
          <Box
            width={24}
            height={24}
            borderRadius="rounded-2xl"
            borderWidth={1}
            alignItems="center"
            justifyContent="center"
            borderColor="gray500"
            backgroundColor={isChecked ? 'gray500' : 'transparent'}
          >
            {isChecked && <Icon name="checkmark-outline" size={20} color="white" />}
          </Box>
        </Pressable>
        <Box flexDirection="column" flex={1} marginLeft={'10'}>
          <Text variant="textXl" fontWeight="500" mb="3">
            {task.name}
          </Text>
          <Text variant="textBase" fontWeight="600" mb="3">
            {formattedDate}
          </Text>
        </Box>
        <Pressable
          style={{
            backgroundColor: category?.color?.code ?? 'white',
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 8,
          }}
        >
          <Text variant="textBase" fontWeight="600">{category?.name}</Text>
        </Pressable>
      </Box>
    </Pressable>
  );
};

export default Task;
