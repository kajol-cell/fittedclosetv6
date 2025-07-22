import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme} from 'react-native-paper';
import ClosetView from '../views/ClosetView';
import ProfileView from '../views/ProfileView';
import {Platform} from 'react-native';
import {createMaterialBottomTabNavigator} from "react-native-paper/react-navigation";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import SearchView from '../views/SearchView';

const Tab = createMaterialBottomTabNavigator();
const tabBarHeight = Platform.select({
  ios: 40,
  android: 56, // Default for Material Bottom Tabs on Android
});

const MainView = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  theme.paddingBottom = 0;
  return (
    <Tab.Navigator
      initialRouteName="Closet"
      activeColor={theme.colors.primary}
      inactiveColor="gray"
      shifting={false}
      barStyle={{
        backgroundColor: 'white',
        paddingBottom: insets.bottom,
        height: tabBarHeight + insets.bottom,
      }}
      screenOptions={{
          headerShown: false,
      }}
      keyboardHidesNavigationBar={true}>
      <Tab.Screen
        name="Closet"
        component={ClosetView}
        options={{
          tabBarLabel: 'Closet',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="wardrobe-outline"
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileView}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={26}
              color={color}
            />
          ),
        }}
      />
        <Tab.Screen
            name="Search"
            component={SearchView}
            options={{
                tabBarLabel: 'Search',
                tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="magnify" size={26} color={color} />
                ),
            }}
        />
    </Tab.Navigator>
  );
};

export default MainView;
