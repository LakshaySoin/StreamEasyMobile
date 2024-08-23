import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import Playlists from './components/Playlists' 
import Home from './components/Home';
import Form from './components/Form';

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

const homeName = 'Home';
const formName = 'Set Up';
const playlistsName = 'Playlists';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName={homeName}>
        <Tab.Screen name={homeName} component={Home} options={{ headerShown: false }} />
        <Tab.Screen name={formName} component={Form} options={{ headerShown: false }} />
        <Tab.Screen name={playlistsName} component={Playlists} options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}