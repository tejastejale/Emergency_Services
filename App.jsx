import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './src/Screens/Login';
import {View, Text} from 'react-native';
import Home from './src/Screens/Home';
import store from './src/Store/store';
import {Provider} from 'react-redux';
import AddedContacts from './src/Screens/AddedContacts';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // <View>
    //   <Text>assad</Text>
    // </View>
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{title: 'Welcome'}}
          />
          <Stack.Screen name="AddedContacts" component={AddedContacts} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
