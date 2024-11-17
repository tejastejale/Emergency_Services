import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import tw from 'twrnc';
import {removeContactFromAdded} from '../Store/contactsActions'; // Import the remove action

export default function AddedContacts() {
  const dispatch = useDispatch();
  const {addedContacts} = useSelector(state => state); // Access added contacts from Redux store
  const [loading, setLoading] = useState(null); // Track which contact is being removed

  const handleRemoveContact = async contact => {
    setLoading(contact.phone); // Set loading for the contact being removed
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
    dispatch(removeContactFromAdded(contact)); // Dispatch the action to remove the contact
    setLoading(null); // Reset loading state
  };

  const renderContact = ({item}) => (
    <View style={tw`flex flex-row items-center p-4 border-b border-gray-200`}>
      <View style={tw`flex-1`}>
        <Text style={tw`font-bold text-lg text-gray-800`}>{item.name}</Text>
        <Text style={tw`text-gray-600`}>{item.phone}</Text>
      </View>

      {/* Show loader or trash icon */}
      <TouchableOpacity
        style={tw`p-2`}
        onPress={() => handleRemoveContact(item)}
        disabled={loading === item.phone} // Disable button while loading
      >
        {loading === item.phone ? (
          <ActivityIndicator size="small" color="red" />
        ) : (
          <Text style={tw`text-red-500`}>Remove</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={tw`flex-1 bg-white`}>
      <Text style={tw`text-xl font-bold text-center p-4`}>
        Emergency Contacts
      </Text>
      {addedContacts.length > 0 ? (
        <FlatList
          data={addedContacts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderContact}
        />
      ) : (
        <Text style={tw`text-center text-gray-500 mt-4`}>
          No added contacts yet
        </Text>
      )}
    </View>
  );
}
