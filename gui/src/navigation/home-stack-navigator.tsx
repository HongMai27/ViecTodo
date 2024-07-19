import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import {HomeStackParamList } from './types'
import HomeScreen from '../screens/home-screen'
import EditTaskScreen from '../screens/edit-task'
import TaskDetailScreen from '../screens/task-detail-screen'
import AddTaskScreen from '../screens/add-task-screen'
import WelcomeScreen from '../screens/welcome-screen'
import AuthStackNavigator from './auth-stack-navigator'
import BottomTabNavigator from './bottom-tab-navigator'
import ProfileScreen from '../screens/profile-screen'

const Stack = createStackNavigator<HomeStackParamList>()


const HomeStackNavigator = () => {
  return (
    <Stack.Navigator>

        <Stack.Screen name="Home" component={HomeScreen}
        options={{
            headerShown: false
        }}
        />
        <Stack.Screen name="EditTask" component={EditTaskScreen}
         options={{
            headerShown: false
        }}
        />
        <Stack.Screen name="TaskDetail" component={TaskDetailScreen}
         options={{
            headerShown: false
        }}
        />
        <Stack.Screen name="Profile" component ={ProfileScreen}
         options={{
            headerShown: false
        }}
        />
   



    </Stack.Navigator> 
  )
}

export default HomeStackNavigator