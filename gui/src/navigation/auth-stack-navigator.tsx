
import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { AuthStackParamList } from './types'
import WelcomeScreen from '../screens/welcome-screen'
import SignInScreen from '../screens/sign-in-screen'
import SignUpScreen from '../screens/sign-up-screen'
import HomeScreen from '../screens/home-screen'


const Stack = createStackNavigator<AuthStackParamList>()


const AuthStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name='Welcome'
                options={{
                    headerShown: false
                }}
                component={WelcomeScreen} />
            <Stack.Screen name='SignIn'
                options={{
                    headerShown: false
                }}
                component={SignInScreen} />
            <Stack.Screen name='SignUp'
                options={{
                    headerShown: false
                }}
                component={SignUpScreen} />

        </Stack.Navigator>
    )
}

export default AuthStackNavigator