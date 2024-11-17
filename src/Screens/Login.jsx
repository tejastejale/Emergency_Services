import {View, Text, Image, TouchableOpacity, TextInput} from 'react-native';
import React, {useEffect, useState} from 'react';
// import {images} from '../Assets/Assets';
import OTPTextView from 'react-native-otp-textinput';
import Button from '../Components/Button';
import tw from 'twrnc';
export default function Login({navigation}) {
  const [screen, setScreen] = useState(true);
  const [cbutton, setCButton] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);
  const [number, setNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (timeLeft === 0) return;
    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [screen, timeLeft]);

  useEffect(() => {
    if (screen) {
      setTimeout(() => {
        setCButton(false);
      }, 30000);
    }
  }, [screen]);

  const handleNumber = () => {
    if (number.length == 10) {
      setIsError(false);
      handleClick();
    } else {
      setIsError(true);
    }
  };

  const handleResend = () => {
    setTimeLeft(30); // Reset the timer to 30 seconds
    setCButton(true); // Disable the button until the timer runs out

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerId); // Clear the timer when it reaches 0
          setCButton(false); // Enable the button again
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const handleContinue = () => {
    if (otp.length === 4) navigation.navigate('Home');
  };

  const handleOTP = e => {
    setOtp(e);
  };

  const handleClick = () => {
    setScreen(!screen);
    setCButton(true);
    setTimeLeft(30);
  };

  return (
    <View>
      {screen ? (
        <View
          style={tw`flex h-full items-center justify-center p-10 bg-white gap-5`}>
          <View style={tw`flex flex-col gap-5`}>
            <View style={tw`flex flex-row justify-center px-7`}>
              <TextInput
                onChangeText={e => setNumber(e)}
                // value={number}
                placeholder="+91"
                keyboardType="numeric"
                maxLength={2}
                style={tw`border rounded-lg rounded-r-none w-fit border-gray-500 p-3`}
              />
              <TextInput
                onChangeText={e => setNumber(e)}
                value={number}
                placeholder="Phone"
                keyboardType="numeric"
                maxLength={10}
                style={tw`border w-full rounded-lg rounded-l-none p-3 border-gray-500`}
              />
            </View>
            {isError && (
              <Text style={tw`text-red-400 -mt-4 pl-2 text-[13px]`}>
                Enter a valid number
              </Text>
            )}
            <Button text={'Send OTP'} onPress={handleNumber}></Button>
          </View>
          <View style={tw`flex-row items-center`}>
            <View style={tw`flex-1 h-px bg-gray-500 `} />
            <View>
              <Text style={tw`w-12 text-center`}>or</Text>
            </View>
            <View style={tw`flex-1 h-px bg-gray-500`} />
          </View>
          <View style={tw`flex flex-col gap-5 px-0`}>
            <Button
              text={'Continue with Email'}
              onPress={handleNumber}></Button>
          </View>
        </View>
      ) : (
        <View
          style={tw`flex -mt-2 p-5 bg-white rounded-t-xl h-full flex-col justify-start `}>
          <TouchableOpacity
            onPress={handleClick}
            style={tw`mb-2 w-16 bg-white rounded`}>
            <Text
              style={tw`text-md text-center text-white px-3 py-2 bg-lime-500 rounded-lg`}>
              Back
            </Text>
          </TouchableOpacity>

          <Text style={tw`text-2xl font-bold`}>OTP Verification</Text>

          <View style={tw`py-4 gap-5`}>
            <Text style={tw`text-md`}>Check for the OTP</Text>
            <OTPTextView
              inputCount={4}
              caretHidden={true}
              handleTextChange={handleOTP}
              style={tw`border border-gray-500 w-12 h-12 text-center my-5 rounded-lg`}
            />
            {cbutton ? (
              <Text style={tw`text-md text-center`}>
                Next resend in {timeLeft} seconds
              </Text>
            ) : (
              <Button
                text={'Resend'}
                style={tw`mt-6`}
                onPress={handleResend} // Attach the updated handleResend function
              />
            )}
            <Button
              onPress={handleContinue}
              text={'Continue'}
              style={tw`mt-6`}
            />
          </View>
        </View>
      )}
    </View>
  );
}
