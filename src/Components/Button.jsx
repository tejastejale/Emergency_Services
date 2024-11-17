import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import tw from 'twrnc';
function Button({onPress, text, classname, textClass}) {
  return (
    <View className="w-full h-fit">
      <TouchableOpacity
        onPress={onPress}
        style={tw`bg-lime-500 py-3 rounded-xl w-full ${classname}`}>
        <Text style={tw`text-white text-center font-bold ${textClass}`}>
          {text}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default Button;
