import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import {
    VideoCall,
    SearchLocation,
    SearchLocationBy,
    Pricing
} from '../components';

const Tab = createBottomTabNavigator();

const Router = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="SearchLocation" component={SearchLocation} />
                <Tab.Screen name="SearchLocationBy" component={SearchLocationBy} />
                <Tab.Screen name="Pricing" component={Pricing} />
                <Tab.Screen name="VideoCall" component={VideoCall} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default Router;