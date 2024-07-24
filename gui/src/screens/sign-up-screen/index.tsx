import { Pressable, View, Alert, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Box, Text } from '../../utils/theme';
import { useNavigation } from '@react-navigation/native';
import { AuthScreenNavigationType } from '../../navigation/types';
import SafeAreaWrapper from '../../components/shared/safe-area-wrapper';
import Input from '../../components/shared/input';
import Button from '../../components/shared/button';
import { Controller, useForm } from 'react-hook-form';
import { IUser } from '../../types';
import { registerUser } from '../../services/api';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-crop-picker';
import NavigateBack from '../../navigation/navigate-back';


const SignUpScreen = () => {
    const navigation = useNavigation<AuthScreenNavigationType<"SignUp">>();
    const navigationToSignInScreen = () => {
        navigation.navigate('SignIn');
    };
    const [selectedAvt, setSelectedAvt] = useState(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const selectAvt = async () => {
        try {
          const image = await ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
          });
    
          setSelectedAvt(image.path);
        } catch (error) {
          console.error('Error selecting image:', error);
        }
      };
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!confirmPasswordVisible);
    };
    
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<IUser & { confirmPassword: string }>({
        defaultValues: {
            email: "",
            name: "",
            password: "",
            confirmPassword: "",
            avatar:'',
        },
    });

    const onSubmit = async (data: IUser & { confirmPassword: string }) => {
        try {
            const { email, name, password, confirmPassword, avatar } = data;

            if (password !== confirmPassword) {
                Alert.alert('Lỗi', 'Mật khẩu không khớp. Vui lòng kiểm tra lại.');
                return;
            }

            await registerUser({
                email,
                name,
                password,
                avatar,
            });
            Alert.alert(
                'Thành công',
                'Đăng ký thành công!',
                [
                    {
                        text: 'OK',
                        onPress: navigationToSignInScreen,
                    },
                ],
                { cancelable: false }
            );
            console.log('user:', name);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <SafeAreaWrapper>
            <NavigateBack/>
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
                <Box  px="5.5" >
                <Pressable onPress={selectAvt} style={{alignItems:'center'}}>
                {selectedAvt && <Image source={{ uri: selectedAvt }} style={styles.avatar} />}
                    <Text style={{color:'#EB91FF', fontWeight:'bold'}}>Chọn ảnh</Text>
                 
                </Pressable>
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
                                error={errors.name}
                            />
                        )}
                        name="name"
                    />
                    <Box mb="6" />
                    <View style={{ position: 'relative' }}>
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
                                    error={errors.password}
                                    secureTextEntry={!passwordVisible}
                                />
                            )}
                            name="password"
                        />
                        <TouchableOpacity
                            onPress={togglePasswordVisibility}
                            style={{
                                position: 'absolute',
                                right: 10,
                                top: 35,
                            }}
                        >
                            <Icon name={passwordVisible ? 'eye' : 'eye-slash'} size={20} color="gray" style={{top: 10}} />
                        </TouchableOpacity>
                    </View>
                    <Box mb="6" />
                    <View style={{ position: 'relative', justifyContent:"center"}}>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                                validate: (value) =>
                                    value === watch('password') || 'Mật khẩu không khớp',
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input
                                    label="Xác nhận mật khẩu"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder="Xác nhận mật khẩu"
                                    error={errors.confirmPassword}
                                    secureTextEntry={!confirmPasswordVisible}
                                />
                            )}
                            name="confirmPassword"
                        />
                        <TouchableOpacity
                            onPress={toggleConfirmPasswordVisibility}
                            style={{
                                position: 'absolute',
                                right: 10,
                                top: 35,

                            }}
                        >
                            <Icon name={confirmPasswordVisible ? 'eye' : 'eye-slash'} size={20} color="gray" style={{ top: 10}} />
                        </TouchableOpacity>
                    </View>
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
    );
};

export default SignUpScreen;

const styles = StyleSheet.create({
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 50,
      },
})