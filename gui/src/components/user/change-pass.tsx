import React, { useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ChangeProfilePicture = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleSelectImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', response.errorMessage || 'Failed to pick image');
      } else {
        // Response contains the image data
        const { uri } = response.assets[0];
        setProfileImage(uri); // Update state with the new image URI
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Pressable onPress={handleSelectImage} style={styles.pressable}>
          <View style={{ flexDirection: 'row' }}>
            <Icon name="camera" size={20} />
            <Text style={styles.text}>Đổi ảnh đại diện</Text>
          </View>
          <Icon name="angle-right" size={24} />
        </Pressable>
      </View>
      {profileImage && (
        <Image source={{ uri: profileImage }} style={styles.image} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  pressable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    fontSize: 16,
    marginLeft: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20,
    alignSelf: 'center',
  },
});

export default ChangeProfilePicture;
