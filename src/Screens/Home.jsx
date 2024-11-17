import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import Contacts from 'react-native-contacts';
import {PermissionsAndroid} from 'react-native';
import tw from 'twrnc';
import Button from '../Components/Button';

export default function Home({navigation}) {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMaually, setIsManually] = useState(false);
  const [addContact, setAddContact] = useState({
    name: '',
    phone: '',
  });

  useEffect(() => {
    getContacts();
  }, []);

  useEffect(() => {
    console.log(addContact);
  }, [addContact]);

  const handleManually = () => {
    setIsManually(!isMaually);
  };

  const handleNameChange = e => {
    setAddContact(prev => ({...prev, name: e}));
  };

  const handlePhoneChange = e => {
    setAddContact(prev => ({...prev, phone: e}));
  };

  const getContacts = async () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Contacts',
      message: 'This app would like to view your contacts.',
      buttonPositive: 'Please accept',
    })
      .then(res => {
        if (res === 'granted') saveContacts();
        else console.log('Permission denied');
      })
      .catch(err => console.log(err, 'Error while requesting permissions'));
  };

  const saveContacts = async () => {
    try {
      const res = await Contacts.getAll();
      setContacts(res);
      setFilteredContacts(res); // Initially, all contacts are shown
    } catch (err) {
      console.log('Error fetching contacts:', err);
    }
  };

  const handleSearch = query => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredContacts(contacts); // Reset to full list if query is empty
    } else {
      const filtered = contacts.filter(contact =>
        `${contact.givenName} ${contact.familyName}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      );
      setFilteredContacts(filtered);
    }
  };

  const handleContactPress = number => {
    console.log('Selected contact number:', number);
  };

  const renderContact = ({item}) => (
    <TouchableOpacity
      style={tw`flex flex-row items-center p-4 border-b border-gray-200`}
      onPress={() => handleContactPress(item.phoneNumbers[0]?.number)}>
      <Image
        source={
          item.hasThumbnail
            ? {uri: item.thumbnailPath}
            : require('../Assets/User-Icon.png') // Placeholder image
        }
        style={tw`w-12 h-12 rounded-full mr-4`}
      />
      <View>
        <Text style={tw`font-bold text-lg text-gray-800`}>
          {item.givenName} {item.familyName}
        </Text>
        <Text style={tw`text-gray-600`}>
          {item.phoneNumbers[0]?.number || 'No Phone Number'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex flex-col h-full bg-white`}>
      {/* Header */}
      <View
        style={tw`flex flex-col justify-center items-center p-10 bg-gray-100 gap-2`}>
        <Text style={tw`font-bold text-lg tracking-wide text-gray-800`}>
          Add Emergency Contacts
        </Text>
        <Text
          style={tw`font-medium text-md text-gray-500 text-center tracking-wide`}>
          This person should be close to you and must be very reliable and
          trustable
        </Text>
        <Button
          classname={'bg-transparent border border-gray-400'}
          textClass={'text-gray-400'}
          text={`Add Contacts ${!isMaually ? 'Manually' : 'From List'}`}
          onPress={e => handleManually()}
        />
      </View>

      {/* Search Input */}

      {/* Contact List */}
      {isMaually ? (
        <View style={tw`flex flex-col gap-2 items-center justify-center p-10`}>
          <TextInput
            onChangeText={e => handleNameChange(e)}
            value={addContact.name}
            placeholder="Name"
            keyboardType="default"
            style={tw`border border-gray-400 w-full p-3 rounded-lg`}
          />
          <TextInput
            onChangeText={e => handlePhoneChange(e)}
            value={addContact.phone}
            placeholder="Number"
            keyboardType="phone-pad"
            maxLength={10}
            style={tw`border border-gray-400 w-full p-3 rounded-lg`}
          />
          <Button text={'Add'} />
        </View>
      ) : (
        <>
          <View style={tw`p-4 bg-gray-100`}>
            <TextInput
              style={tw`bg-white p-3 rounded-lg border border-gray-300`}
              placeholder="Search contacts..."
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
          <FlatList
            data={filteredContacts}
            keyExtractor={item => item.phoneNumbers[0]?.number || item.recordID}
            renderItem={renderContact}
            contentContainerStyle={tw`flex-grow`}
          />
        </>
      )}
    </View>
  );
}
