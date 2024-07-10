import React, { useState } from 'react'
import { Box,Text } from '../../utils/theme'
import SafeAreaWrapper from '../../components/shared/safe-area-wrapper'
import moment from 'moment';
import { View } from 'react-native';
import { Calendar } from 'react-native-calendars';


const TodayScreen = () => {

  const today = moment().format("YYYY-MM-DD");
  const [selectedDate, setSelectedDate] = useState(today);
  return (
    <SafeAreaWrapper>
      <View style={{flex:1, backgroundColor:"white"}}>
        <Calendar onDayPress={(day) => setSelectedDate(day.dateString)} />
      </View>
 </SafeAreaWrapper>
  )
}


export default TodayScreen