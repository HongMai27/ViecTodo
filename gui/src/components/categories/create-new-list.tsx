import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@shopify/restyle";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { CategoriesNavigationType } from "../../navigation/types";
import { Box, Text, Theme } from "../../utils/theme";
import Icon from "react-native-vector-icons/FontAwesome6Pro";

const CreateNewList = () => {
  const navigation = useNavigation<CategoriesNavigationType>();
  const theme = useTheme<Theme>();

  const navigateToCreateCategory = () => {
    navigation.navigate("CreateCategory", {});
  };

  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={navigateToCreateCategory}
        style={[styles.container, styles.wrapper]}
      >
        <Icon  name="plus" size={48} color={theme.colors.white} style={{fontWeight: 100, alignSelf:'center', top: -5}}/>
      </Pressable>
      </View>
     
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    margin: 10,
  },
  container: {
    width: 60,
    height: 60,
    borderColor:'#DB3AFF',
    borderWidth:1,
    backgroundColor:'#f5d0fe',
    borderRadius:50, 
    alignItems:"center",
    justifyContent:"center", 
    alignSelf:'center'
  },
});

export default CreateNewList;