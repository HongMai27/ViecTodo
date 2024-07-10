import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootBottomTabParamList } from "./types";
import HomeStackNavigator from "./home-stack-navigator";
import CompletedScreen from "../screens/completed-screen";
import TodayScreen from "../screens/today-screen";
import CategoriesScreen from "../screens/categories-screen";
import Icons from "../components/shared/icons";
import { useTheme } from "@shopify/restyle";



const Tab = createBottomTabNavigator<RootBottomTabParamList>();
const BottomTabNavigator = () => {
    const theme= useTheme();
    return (
        <Tab.Navigator
        screenOptions={{
            //tabBarActiveTintColor: 'black',
            //tabBarInactiveTintColor: theme.colors.gray550,
            tabBarHideOnKeyboard: true,
        }}
        >
        <Tab.Screen name="HomeStack" component={HomeStackNavigator}
        options={() =>({
            title: 'Trang chủ',
            tabBarIcon:({color})=> <Icons name="home" color={color}/>,
            headerShown: false
        })
        }
        />
        <Tab.Screen name="Today" component={TodayScreen}
         options={() =>({
            title: 'Lịch',
            tabBarIcon:({color})=> <Icons name="calendar" color={color}/>,
            headerShown: false
        })
        }
        />
        <Tab.Screen name="Completed" component={CompletedScreen}
        options={() =>({
            title: 'Lịch sử',
            tabBarIcon:({color})=> <Icons name="completed" color={color}/>,
            headerShown: false
        })
        }
        />
        <Tab.Screen name="CategoriesStack" component={CategoriesScreen}
        options={() =>({
            title: 'Danh mục',
            tabBarIcon:({color})=> <Icons name="categories" color={color}/>,
            headerShown: false
        })
        }
        />
        </Tab.Navigator>
    );
    }

export default BottomTabNavigator;