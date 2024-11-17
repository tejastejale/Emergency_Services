// Action Types
export const SET_CONTACTS = 'SET_CONTACTS';
export const ADD_CONTACT_MANUALLY = 'ADD_CONTACT_MANUALLY';
export const CLEAR_ADDED_CONTACTS = 'CLEAR_ADDED_CONTACTS';
export const ADD_CONTACT_TO_ADDED = 'ADD_CONTACT_TO_ADDED';
// Action Creators
export const setContacts = contacts => ({
  type: SET_CONTACTS,
  payload: contacts,
});

export const addContactToAdded = contact => ({
  type: ADD_CONTACT_TO_ADDED,
  payload: contact,
});

export const addContactManually = contact => ({
  type: ADD_CONTACT_MANUALLY,
  payload: contact,
});

export const removeContactFromAdded = contact => ({
  type: 'REMOVE_CONTACT_FROM_ADDED',
  payload: contact,
});

export const clearAddedContacts = () => ({
  type: CLEAR_ADDED_CONTACTS,
});
