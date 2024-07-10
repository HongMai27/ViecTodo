import { Button, View,  } from 'react-native'
import React from 'react'
import { Box,Text } from '../../utils/theme'
import { RouteProp, useNavigation } from '@react-navigation/native'
import { AuthScreenNavigationType } from '../../navigation/types'
import SafeAreaWrapper from '../../components/shared/safe-area-wrapper'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ParamList } from '../../types'
import { StackNavigationProp } from '@react-navigation/stack'

type TaskDetailScreenRouteProp = RouteProp<ParamList, 'TaskDetail'>;
type TaskDetailScreenNavigationProp = StackNavigationProp<ParamList, 'TaskDetail'>;

type Props = {
  route: TaskDetailScreenRouteProp;
  navigation: TaskDetailScreenNavigationProp;
};
const EditTaskScreen: React.FC<Props> = ({ route, navigation }) => {
  // const { task } = route.params;
  const { goBack } = useNavigation();
  return (
    <SafeAreaWrapper>
<View style={{ flex: 1,  justifyContent: 'flex-start', padding: 20 }}>
      <TouchableOpacity onPress={goBack} style={{ top: 30}}>
        <Text style={{ fontSize: 16, color: 'black' }}>Quay lại</Text>
      </TouchableOpacity>
      {/* <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start', top: 90 }}> */}
        {/* <Text style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 20, color:'black'}}>{task.name}</Text> */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
          <View>
            <Text style={{ fontSize: 18, marginBottom: 5 }}>Ngày bắt đầu:</Text>
            <Box mb="6" />
            <Text style={{ fontSize: 18, marginBottom: 5 }}>Ngày hết hạn:</Text>
            <Box mb="6" />
            <Text style={{ fontSize: 18, marginBottom: 5 }}>Danh mục:</Text>
            <Box mb="6" />
            <Text style={{ fontSize: 18, marginBottom: 5 }}>Trạng thái:</Text>
            <Box mb="6" />
          </View>
         
        </View>
      <TouchableOpacity
        // onPress={goEditTask}
        style={{
          backgroundColor: 'green',
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 8,
          bottom: 20,
          alignSelf: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Lưu</Text>
      </TouchableOpacity>
    </View>
  );
    </SafeAreaWrapper>
  )
}

export default EditTaskScreen