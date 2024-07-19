import React, { useState } from 'react';
import { View, Text, Image, Pressable, TextInput, StyleSheet, Alert, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import useSWR from 'swr';
import { IUser } from '../../types';
import axiosInstance, { fetcher, removeToken } from '../../services/config';
import useUserGlobalStore from '../../store/useUserGlobalStore';
import NavigateBack from '../../navigation/navigate-back';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChangeProfilePicture from '../../components/user/change-pass';
import { Box } from '../../utils/theme';
import Input from '../../components/shared/input';


const updatePasswordRequest = async (url: string, { arg }: { arg: { email: string, oldPassword: string, newPassword: string } }) => {
  try {
    const response = await axiosInstance.put(url, {
      email: arg.email,
      oldPassword: arg.oldPassword,
      newPassword: arg.newPassword
    });

    if (response.status === 200) {
      console.log('Password updated successfully');
    } else {
      console.error(response.data.message || 'Failed to update password');
    }
  } catch (error) {
    console.error('Error changing password', error);
  }
};
const Profile = () => {
  const { user } = useUserGlobalStore();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');


  const logout = async () => {
    const { updateUser } = useUserGlobalStore.getState();
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc muốn đăng xuất?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đăng xuất",
          onPress: async () => {
            try {
              await removeToken();
              updateUser(null);
              console.log("Đã đăng xuất thành công");
            } catch (error) {
              console.error("Error logging out:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };
  const handlePasswordChange = async () => {
    try {
      if (oldPassword.trim().length > 0 && newPassword.trim().length > 0) {
        await updatePasswordRequest('/users/change-password', {
          arg: { email, oldPassword, newPassword }
        });
        setIsEditingPassword(false);
        Alert.alert('Thông báo', 'Mật khẩu đã được thay đổi');
      } else {
        Alert.alert('Lỗi', 'Vui lòng nhập thông tin');
      }
    } catch (error) {
      console.error('Error password', error);
      Alert.alert('Lỗi', 'Lỗi không thể đổi mật khẩu');
    }
  };
  const handleCancel = () => {
    setIsEditingPassword(false);
  };
  return (
    
    <SafeAreaView>
    <NavigateBack/>
      <Pressable onPress={() => setIsEditingName(false)}>
      </Pressable>
      <View style={styles.container}>
        <Pressable>
          <Image
            source={{ uri: "https://picsum.photos/200" }}
            style={[styles.avatar, { alignSelf: 'center' }]}
          />
        </Pressable>
        <Text style={[styles.title, { textAlign: 'center', marginBottom: 20 }]}>
          {user?.name}
        </Text>

        <View>
          <View style={styles.box}>
            <Pressable onPress={() => setIsEditingName(true)}>
              <View style={{ flexDirection: 'row' }}>
                <Icon name="user" size={22} />
                <Text style={styles.text}>Đổi tên tài khoản</Text>
              </View>
            </Pressable>
            <Icon name="angle-right" size={24} />
          </View>
       
          <View style={styles.box}>
            <View style={{ flexDirection: 'row' }}>
              <Icon name="camera" size={20} />
              <Text style={styles.text}>Đổi ảnh đại diện</Text>
            </View>
            <Pressable onPress={() => {<ChangeProfilePicture/>}}>
              <Icon name="angle-right" size={24} />
            </Pressable>
          </View>
          <View style={styles.box}>
            <Pressable onPress={() => setIsEditingPassword(true)}>
              <View style={{ flexDirection: 'row' }}>
                <Icon name="key" size={20} />
                <Text style={styles.text}>Đổi mật khẩu</Text>
              </View>
            </Pressable>
            <Icon name="angle-right" size={24} />
          </View>
          <Modal transparent={true} visible={isEditingPassword} animationType="slide">
        <View style={styles.overlay}>
          <Box style={styles.modalContent}>
          <View style={{flexDirection:'column', width: 350, alignItems:'stretch'}}>
              <Text style={styles.title}>Đổi mật khẩu</Text>
             
              <Input
                    label="Mật khẩu cũ"
                    placeholder="Nhập mật khẩu cũ"
                    value={oldPassword}
                    onChangeText={setOldPassword}
                    secureTextEntry
              />
              <Box mb='6'/>
              <Input
                    label="Mật khẩu mới"
                    placeholder="Nhập mật khẩu mới"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
              />
              <Box mb='4'/>
              <View style={{flexDirection:'row', alignSelf:'center', }}>
                <Pressable onPress={handleCancel}>
                  <Text style={[styles.button, {color: 'red', backgroundColor: '#DDDDDD'}]}>Hủy</Text>
                </Pressable>
                <Pressable onPress={handlePasswordChange}>
                  <Text style={styles.button}>Lưu</Text>
                </Pressable>
              </View>
            </View>
            
          </Box>
        </View>
      </Modal>
         
          <View style={styles.box}>
            <Pressable onPress={logout}>
              <View style={{ flexDirection: 'row' }}>
                <Icon name="sign-out" size={24} color='red' />
                <Text style={[styles.text, { color: 'red', fontSize: 20 }]}>Đăng xuất</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  
  container: {
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign:'center'
  },
  box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    height: 50,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    
  },
  text: {
    marginLeft: 10,
    fontSize: 18,
  },

  button: {
    backgroundColor: '#EB91FF',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    fontSize: 16
  },
});

export default Profile;
