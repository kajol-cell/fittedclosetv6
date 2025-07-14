// EntryView.js
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import SignUpView from './SignUpView';
import SignInView from './SignInView';
import {View} from 'react-native';
import {Text} from 'react-native-paper';

const EntryTab = createMaterialTopTabNavigator();

const EntryView = () => (
  <View style={{flex: 1}}>
    <EntryTab.Navigator
      screenOptions={({route}) => ({
        tabBarLabel: ({focused}) => (
          <Text
            style={{
              fontSize: 16,
              fontWeight: focused ? 'bold' : 'normal',
              color: focused ? 'black' : 'gray',
            }}>
            {route.name === 'SignUp' ? 'Create Account' : 'Log in'}
          </Text>
        ),
        tabBarStyle: {backgroundColor: 'white'},
      })}>
      <EntryTab.Screen name="SignUp" component={SignUpView} />
      <EntryTab.Screen name="SignIn" component={SignInView} />
    </EntryTab.Navigator>
  </View>
);

export default EntryView;
