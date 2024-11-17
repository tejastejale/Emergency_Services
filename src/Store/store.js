import {createStore} from 'redux';
import contactsReducer from './contactsReducer';

const store = createStore(contactsReducer);

export default store;
