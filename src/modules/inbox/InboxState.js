import {Map} from 'immutable';
import {loop, Effects} from 'redux-loop-symbol-ponyfill';
import {GetMessages, DeleteMessage,ReadUserMessage,MarkUserMessage,SearchMessages} from './../../services/messageCenterServices';


// Initial state
const initialState = Map({
  value: [],
  InboxMessages: [],
});

// Actions
const REQUEST_GET_MESSAGES = 'InboxState/REQUEST_GET_MESSAGES';
const RESPONSE_GET_MESSAGES = 'InboxState/RESPONSE_GET_MESSAGES';
const REQUEST_DELETE_MESSAGE = 'InboxState/REQUEST_DELETE_MESSAGE';
const REQUEST_READ_USER_MESSAGE='InboxState/REQUEST_READ_USER_MESSAGE';
const REQUEST_MARK_MESSAGE='InboxState/REQUEST_MARK_MESSAGE';
const REQUEST_SEARCH_MESSAGES='InboxState/REQUEST_SEARCH_MESSAGES';
const RESPONSE_SEARCH_MESSAGES='InboxState/RESPONSE_SEARCH_MESSAGES';

export function transformMessage(){
  return type="";
}

// Action creators
export function getMessages(userId, inboxType) {
  return {
    type: REQUEST_GET_MESSAGES,
    payload: {
      userId,
      inboxType
    }
  };
}

export function readMessage(userMessage){
  return {
    type: REQUEST_READ_USER_MESSAGE,
    payload: userMessage
  }
}

export function deleteMessage(message){
  return{
    type: REQUEST_DELETE_MESSAGE,
    payload: message
  };
}

export function markMessage(userMessage){
  return{
    type:REQUEST_MARK_MESSAGE,
    payload:userMessage
  }
}

export function searchMessage(criteriaCollection){
   return {
     type:REQUEST_SEARCH_MESSAGES,
     payload:criteriaCollection
   }
}

export async function requestGetMessages(userId,inboxType) {
  try {
    const result = await GetMessages(userId, inboxType);
    return {type: RESPONSE_GET_MESSAGES, payload: result};
  } catch (err) {
    return {type: RESPONSE_GET_MESSAGES, payload: []};
  }
}



export async function deleteInbox(message) {
  try {
    const result = await DeleteMessage(message);
    return {
      type: REQUEST_GET_MESSAGES,
      payload: {
        userId: message.UserId,
        inboxType: message.Type
      }
    };
  } catch (error) {
    console.log(error);

  }
}

export async function requestReadUserMessage(userMessage){
  try{
    const result=await ReadUserMessage(userMessage)
    return {
      type:REQUEST_GET_MESSAGES,
      payload:{
        userId:userMessage.UserId,
        inboxType:userMessage.Type
      }
    }
  }catch(err){
    return {type: RESPONSE_GET_MESSAGES, payload: []}
  }
}

export async function requestMarkUserMessage(userMessage){
  try{
    const result=await MarkUserMessage(userMessage)
    return {
      type:REQUEST_GET_MESSAGES,
      payload:{
        userId:userMessage.UserId,
        inboxType:userMessage.Type
      }
    }
  }catch(err){
    return {type: RESPONSE_GET_MESSAGES, payload: []}
  }
}

export async function requestSearchMessage(criteriaCollection){
   try{
     const result=await SearchMessages(criteriaCollection)
     return {
       type:RESPONSE_SEARCH_MESSAGES,
       payload:result
     }
   }catch(err){
     return {type: RESPONSE_GET_MESSAGES, payload: []}
    }
}

// Reducer
export default function InboxStateReducer(state = initialState, action = {}) {
  switch (action.type) {

    case REQUEST_GET_MESSAGES:
      return loop(state, Effects.promise(requestGetMessages,action.payload.userId,action.payload.inboxType));

    case RESPONSE_GET_MESSAGES:
      return state.set('value', action.payload.ModelObject);

    case REQUEST_DELETE_MESSAGE:
      return loop(state,Effects.promise(deleteInbox, action.payload));   

    case REQUEST_READ_USER_MESSAGE:
      return loop(state,Effects.promise(requestReadUserMessage,action.payload));

    case REQUEST_MARK_MESSAGE:
      return loop(state,Effects.promise(requestMarkUserMessage,action.payload))  
    
    case REQUEST_SEARCH_MESSAGES:
      return loop(state,Effects.promise(requestSearchMessage,action.payload));
    
     case RESPONSE_SEARCH_MESSAGES:
       return state.set('value',action.payload.ModelObject)

    default:
      return state;
  }
}
