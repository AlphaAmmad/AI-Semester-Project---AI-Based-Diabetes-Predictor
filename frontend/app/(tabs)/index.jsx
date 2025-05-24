import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screen/login';
import SignupScreen from '../screen/signup';
import DashboardScreen from '../screen/dashboard';
import IndexScreen from '../screen/app';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
   
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Index" component={IndexScreen} />
      </Stack.Navigator>
   
  );
}
