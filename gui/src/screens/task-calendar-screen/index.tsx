import React, { useState, useEffect } from "react"
import { FlatList, Pressable } from "react-native"
import useSWR from "swr"
import { format, parseISO, isToday } from "date-fns"
import { fetcher } from "../../services/config"
import Loader from "../../components/shared/loader"
import SafeAreaWrapper from "../../components/shared/safe-area-wrapper"
import { Box, Text } from "../../utils/theme"
import Task from "../../components/tasks/task"
import { Calendar, CalendarList, Agenda } from "react-native-calendars"
import { ITask } from "../../types"
import TaskBink from "../../components/tasks/task"


const TaskCalendarScreen = () => {
 const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"))
 const {
   data: tasks,
   isLoading: isLoadingTasks,
   mutate: mutateTasks,
 } = useSWR<ITask[]>(`tasks`, fetcher, {
   refreshInterval: 5000,
 })


 if (isLoadingTasks || !tasks) {
   return <Loader />
 }


 const markedDates = tasks.reduce((acc, task) => {
   const date = format(parseISO(task.date), "yyyy-MM-dd")
   if (!acc[date]) {
     acc[date] = { marked: true, dotColor: 'blue' }
   }
   return acc
 }, {} as { [key: string]: { marked: boolean, dotColor: string } })


 const handleDayPress = (day: any) => {
   setSelectedDate(day.dateString)
 }


 return (
   <SafeAreaWrapper>
     <Box flex={1} mx="4">
       <Box height={16} />

       <Box mb="4">
         <Calendar
           current={format(new Date(), "yyyy-MM-dd")}
           minDate={format(new Date(), "yyyy-MM-dd")}
           onDayPress={handleDayPress}
           markedDates={markedDates}
           theme={{
             calendarBackground: 'white',
             textSectionTitleColor: 'blue',
             selectedDayBackgroundColor: 'blue',
             selectedDayTextColor: 'white',
             todayTextColor: 'blue',
             dayTextColor: 'black',
             dotColor: 'blue',
             selectedDotColor: 'white',
             arrowColor: 'blue',
           }}
         />
       </Box>


       <Text variant="textLg" fontWeight="500" ml="3" mb="4">
         Công việc ngày {format(parseISO(selectedDate), "dd/MM/yyyy")}
       </Text>


       <FlatList
         data={tasks.filter(task => format(parseISO(task.date), "yyyy-MM-dd") === selectedDate)}
         renderItem={({ item }) => <Task task={item} mutateTasks={mutateTasks} />}
         keyExtractor={(item) => item._id}
         ItemSeparatorComponent={() => <Box height={14} />}
       />
     </Box>
   </SafeAreaWrapper>
 )
}


export default TaskCalendarScreen


