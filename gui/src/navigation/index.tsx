
import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import AuthStackNavigator from './auth-stack-navigator'
import AppStackNavigator from './app-stack-navigator'
import useUserGlobalStore from '../store/useUserGlobalStore'
import { createStackNavigator } from '@react-navigation/stack'

const Navigation = () => {
  const Stack = createStackNavigator();

    const { user } = useUserGlobalStore()


  return (
   <NavigationContainer>
    {/* <AuthStackNavigator /> */}
    {user ? <AppStackNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  )
}

export default Navigation