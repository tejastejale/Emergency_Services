const initialState = {
  contactsList: [],
  addedContacts: [],
};

export default function contactsReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_CONTACTS':
      return {
        ...state,
        contactsList: action.payload,
      };
    case 'ADD_CONTACT_TO_ADDED':
      return {
        ...state,
        addedContacts: [...state.addedContacts, action.payload],
      };
    case 'REMOVE_CONTACT_FROM_ADDED':
      return {
        ...state,
        addedContacts: state.addedContacts.filter(
          contact => contact.phone !== action.payload.phone,
        ),
      };
    default:
      return state;
  }
}
