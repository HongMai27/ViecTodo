import { Pressable, View, } from 'react-native'
import React from 'react'
import { Box, Text } from '../../utils/theme'
import { useNavigation } from '@react-navigation/native'
import { AuthScreenNavigationType } from '../../navigation/types'
import SafeAreaWrapper from '../../components/shared/safe-area-wrapper'
import Input from '../../components/shared/input'
import Button from '../../components/shared/button'
import { Controller, useForm } from 'react-hook-form'
import { IUser } from '../../types'
import { registerUser } from '../../services/api'
import LinearGradient from 'react-native-linear-gradient'


const SignUpScreen = () => {

    const navigation = useNavigation<AuthScreenNavigationType<"SignUp">>()
    const navigationToSignInScreen = () => {
        navigation.navigate('SignIn')
    }

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<IUser>({
        defaultValues: {
            email: "",
            name:" ",
            password: "",
            
        },
    })

    const onSubmit = async (data: IUser) => {
        try {
            const { email, name, password } = data
            await registerUser({
                email,
                name,
                password,
            })
            navigationToSignInScreen()
            console.log('user:', name)
        } catch (error) { }
    }


    return (
        <SafeAreaWrapper>
            <LinearGradient
            colors={[
                "#ffffff",
                "#fcecff",
                "#f8daff",
                "#fae2ff",
                "#fae2ff",
                "#ffffff",
              ]}
            style={{ flex: 1 }}
            >
            <Box flex={1} px="5.5" mt={"13"}>

                <Text variant="textXl" fontWeight="700" mb="6" style={{textAlign:'center'}}>
                    Đăng Ký
                </Text>
                <Box mb='6' />
                <Controller
                    control={control}
                    rules={{
                        required: true,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            label="Tài khoản"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Email"
                            error={errors.email}
                        />
                    )}
                    name="email"
                />
                <Box mb="6" />
                <Controller
                    control={control}
                    rules={{
                        required: true,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            label="Tên người dùng"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Tên người dùng"
                            error={errors.email}
                        />
                    )}
                    name="email"
                />
             
                <Box mb="6" />
                <Controller
                    control={control}
                    rules={{
                        required: true,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                            label="Mật khẩu"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Mật khẩu"
                            error={errors.name}
                            secureTextEntry
                        />
                    )}
                    name="password"
                />

                <Box mb="10" />

                <Button label='Đăng Ký' onPress={handleSubmit(onSubmit)} uppercase />
                <Box mt="3" />
                <Pressable onPress={navigationToSignInScreen}>
                    <Text color="purple1000" textAlign="center" fontSize={16}>
                        Đăng nhập
                    </Text>
                </Pressable>

            </Box>
            </LinearGradient>
        </SafeAreaWrapper>
    )
}

export default SignUpScreen