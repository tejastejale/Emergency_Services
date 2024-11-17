import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Text,
  AppState,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Contacts from 'react-native-contacts';
import {PermissionsAndroid} from 'react-native';
import tw from 'twrnc';
import {
  setContacts,
  addContactManually,
  addContactToAdded,
} from '../Store/contactsActions';
import Button from '../Components/Button';

export default function Home() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {contactsList, addedContacts} = useSelector(state => state);
  const [filteredContacts, setFilteredContacts] = useState(contactsList);
  const [searchQuery, setSearchQuery] = useState('');
  const [isManually, setIsManually] = useState(false);
  const [addContact, setAddContact] = useState({
    name: '',
    phone: '',
  });
  const [appState, setAppState] = useState(AppState.currentState);
  const [loading, setLoading] = useState(false);

  // Check if app state changes (app comes to foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        // App is active again, refetch contacts if not already fetched
        if (contactsList.length === 0) {
          getContacts(); // Fetch contacts when app comes back to foreground
        }
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState, contactsList]);

  // Fetch contacts on initial mount if the contacts list is empty
  useEffect(() => {
    if (contactsList.length === 0) {
      getContacts(); // Fetch contacts if the list is empty
    } else {
      setFilteredContacts(contactsList); // Set filtered contacts from Redux state
    }
  }, [contactsList]);

  const handleManually = () => {
    setIsManually(!isManually);
  };

  const handleNameChange = e => {
    setAddContact(prev => ({...prev, name: e}));
  };

  const handlePhoneChange = e => {
    setAddContact(prev => ({...prev, phone: e}));
  };

  const getContacts = async () => {
    setLoading(true); // Start loading before fetching contacts
    try {
      const permission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts',
          message: 'This app would like to view your contacts.',
          buttonPositive: 'Please accept',
        },
      );

      if (permission === 'granted') {
        const res = await Contacts.getAll();
        if (res.length > 0) {
          dispatch(setContacts(res)); // Dispatch to Redux only if contacts are fetched
        }
      } else {
        console.log('Permission denied');
      }
    } catch (err) {
      console.log('Error fetching contacts:', err);
    } finally {
      setLoading(false); // Stop loading once the contacts are fetched
    }
  };

  const handleSearch = query => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredContacts(contactsList);
    } else {
      const filtered = contactsList.filter(contact =>
        `${contact.givenName} ${contact.familyName}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      );
      setFilteredContacts(filtered);
    }
  };

  const handleAddContact = () => {
    const newContact = {
      name: addContact.name,
      phone: addContact.phone,
    };
    dispatch(addContactManually(newContact));
    setAddContact({name: '', phone: ''});
  };

  const handleAddToAddedContacts = contact => {
    const phoneNumber = contact.phoneNumbers[0]?.number;
    // Check if contact is already in addedContacts
    const isAlreadyAdded = addedContacts.some(
      addedContact => addedContact.phone === phoneNumber,
    );

    if (!isAlreadyAdded) {
      const contactToAdd = {
        name: contact.givenName,
        phone: phoneNumber,
      };
      dispatch(addContactToAdded(contactToAdd)); // Dispatch action to add contact to addedContacts
    }
  };

  const renderContact = ({item}) => {
    const isAdded = addedContacts.some(
      addedContact => addedContact.phone === item.phoneNumbers[0]?.number,
    );

    return (
      <TouchableOpacity
        style={tw`flex flex-row items-center p-4 border-b border-gray-200`}
        onPress={() => handleAddToAddedContacts(item)} // Add contact to addedContacts on click
      >
        <Image
          source={
            item.hasThumbnail
              ? {uri: item.thumbnailPath}
              : require('../Assets/User-Icon.png')
          }
          style={tw`w-12 h-12 rounded-full mr-4`}
        />
        <View style={tw`flex-1`}>
          <Text style={tw`font-bold text-lg text-gray-800`}>
            {item.givenName} {item.familyName}
          </Text>
          <Text style={tw`text-gray-600`}>
            {item.phoneNumbers[0]?.number || 'No Phone Number'}
          </Text>
        </View>

        {/* Show a green dot if the contact is added */}
        {isAdded && (
          <View
            style={tw`w-4 h-4 rounded-full bg-green-500 absolute right-4 top-4`}
          />
        )}
      </TouchableOpacity>
    );
  };

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
          text={`Add Contacts ${!isManually ? 'Manually' : 'From List'}`}
          onPress={handleManually}
        />
      </View>

      {/* Loading Indicator */}
      {loading ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          {/* Search Input */}
          {isManually ? (
            <View
              style={tw`flex flex-col gap-2 items-center justify-center p-10`}>
              <TextInput
                onChangeText={handleNameChange}
                value={addContact.name}
                placeholder="Name"
                keyboardType="default"
                style={tw`border border-gray-400 w-full p-3 rounded-lg`}
              />
              <TextInput
                onChangeText={handlePhoneChange}
                value={addContact.phone}
                placeholder="Number"
                keyboardType="phone-pad"
                maxLength={10}
                style={tw`border border-gray-400 w-full p-3 rounded-lg`}
              />
              <Button text={'Add'} onPress={handleAddContact} />
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
                keyExtractor={item =>
                  item.phoneNumbers[0]?.number || item.recordID
                }
                renderItem={renderContact}
              />
            </>
          )}
        </>
      )}

      {/* FAB to navigate to added contacts */}
      <TouchableOpacity
        style={tw`absolute bottom-5 right-5 bg-lime-500 p-4 rounded-full`}
        onPress={() => navigation.navigate('AddedContacts')} // Navigate to AddedContacts screen
      >
        <Text style={tw`text-white font-semibold`}>See List</Text>
      </TouchableOpacity>
    </View>
  );
}
