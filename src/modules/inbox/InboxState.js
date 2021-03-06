import { Map } from 'immutable';
import { loop, Effects } from 'redux-loop-symbol-ponyfill';
import { GetMessages, DeleteMessage, ReadUserMessage, MarkUserMessage, SearchMessages, LoadMoreMessages } from './../../services/messageCenterServices';


// Initial state
const initialState = Map({
  value: [],
  InboxMessages: [],
  loadMore: true,
});

// Actions
const REQUEST_GET_MESSAGES = 'InboxState/REQUEST_GET_MESSAGES';
const RESPONSE_GET_MESSAGES = 'InboxState/RESPONSE_GET_MESSAGES';
const REQUEST_DELETE_MESSAGE = 'InboxState/REQUEST_DELETE_MESSAGE';
const REQUEST_READ_USER_MESSAGE = 'InboxState/REQUEST_READ_USER_MESSAGE';
const REQUEST_MARK_MESSAGE = 'InboxState/REQUEST_MARK_MESSAGE';
const REQUEST_SEARCH_MESSAGES = 'InboxState/REQUEST_SEARCH_MESSAGES';
const RESPONSE_SEARCH_MESSAGES = 'InboxState/RESPONSE_SEARCH_MESSAGES';
const REQUEST_LOAD_MORE_MESSAGES = 'InboxState/REQUEST_LOAD_MORE_MESSAGES';
const RESPONSE_LOAD_MORE_MESSAGES = 'InboxState/RESPONSE_LOAD_MORE_MESSAGES';

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

export function readMessage(userMessage,criteriaCollection) {
  return {
    type: REQUEST_READ_USER_MESSAGE,
    payload: {userMessage,criteriaCollection}
  }
}

export function deleteMessage(message,criteriaCollection) {
  return {
    type: REQUEST_DELETE_MESSAGE,
    payload: {message,criteriaCollection}
  };
}

export function markMessage(userMessage,criteriaCollection) {
  userMessage.Mark === 'Marked' ? userMessage.Mark = 'UnMark' : userMessage.Mark = 'Marked';
  return {
    type: REQUEST_MARK_MESSAGE,
    payload: {userMessage,criteriaCollection}
  }
}

export function searchMessage(criteriaCollection) {
  return {
    type: REQUEST_SEARCH_MESSAGES,
    payload: criteriaCollection
  }
}

export function loadMoreMessages(userMessage) {
  return {
    type: REQUEST_LOAD_MORE_MESSAGES,
    payload: userMessage
  };
}

export async function requestGetMessages(userId, inboxType) {
  try {
    const result = await GetMessages(userId, inboxType);
    return { type: RESPONSE_GET_MESSAGES, payload: result };
  } catch (err) {
    return { type: RESPONSE_GET_MESSAGES, payload: [] };
  }
}



export async function requestDeleteMessage(message,criteriaCollection) {
  try {
    const result = await DeleteMessage(message);
    return {
      type: REQUEST_SEARCH_MESSAGES,
      payload:criteriaCollection
    };
  } catch (error) {
    console.log(error);

  }
}

export async function requestReadUserMessage(userMessage,criteriaCollection) {
  try {
    const result = await ReadUserMessage(userMessage)
    return {
      type: REQUEST_SEARCH_MESSAGES,
      payload:criteriaCollection
    }
  } catch (err) {
    return { type: RESPONSE_GET_MESSAGES, payload: [] }
  }
}

export async function requestMarkUserMessage(userMessage,criteriaCollection) {
  try {
    const result = await MarkUserMessage(userMessage)
    return {
      type: REQUEST_SEARCH_MESSAGES,
      payload: criteriaCollection
    }
  } catch (err) {
    return { type: RESPONSE_GET_MESSAGES, payload: [] }
  }
}

export async function requestSearchMessage(criteriaCollection) {
  try {
    const result = await SearchMessages(criteriaCollection)
    return {
      type: RESPONSE_SEARCH_MESSAGES,
      payload: result
    }
  } catch (err) {
    return { type: RESPONSE_GET_MESSAGES, payload: [] }
  }
}

export async function requestLoadMoreMessage(userMessage) {
  try {
    const result = await LoadMoreMessages(userMessage)
    return {
      type: RESPONSE_LOAD_MORE_MESSAGES,
      payload: result
    }
  } catch (err) {
    return { type: RESPONSE_GET_MESSAGES, payload: [] }
  }
}

// Reducer
export default function InboxStateReducer(state = initialState, action = {}) {
  switch (action.type) {

    case REQUEST_GET_MESSAGES:
      return loop(state, Effects.promise(requestGetMessages, action.payload.userId, action.payload.inboxType));

    case RESPONSE_GET_MESSAGES:
      if (action.payload.ModelObject.length == 10) {
        return state.set('loadMore', true).set('value', action.payload.ModelObject);
      } else {
        return state.set('loadMore', false).set('value', action.payload.ModelObject);
      }

    case REQUEST_DELETE_MESSAGE:
      return loop(state, Effects.promise(requestDeleteMessage, action.payload.message,action.payload.criteriaCollection));

    case REQUEST_READ_USER_MESSAGE:
      return loop(state, Effects.promise(requestReadUserMessage, action.payload.userMessage,action.payload.criteriaCollection));

    case REQUEST_MARK_MESSAGE:
      return loop(state, Effects.promise(requestMarkUserMessage, action.payload.userMessage,action.payload.criteriaCollection))

    case REQUEST_SEARCH_MESSAGES:

      return loop(state, Effects.promise(requestSearchMessage, action.payload));

    case RESPONSE_SEARCH_MESSAGES:
      if (action.payload.ModelObject.length == 10) {
        return state.set('loadMore', true).set('value', action.payload.ModelObject);
      } else {
        return state.set('loadMore', false).set('value', action.payload.ModelObject);
      }

    case REQUEST_LOAD_MORE_MESSAGES:
      return loop(state, Effects.promise(requestLoadMoreMessage, action.payload));

    case RESPONSE_LOAD_MORE_MESSAGES:

      let oldData = state.get('value');
      let newData = [];
      newData = oldData.concat(action.payload.ModelObject);
      if (action.payload.ModelObject.length == 10) {
        return state.set('loadMore', true).set('value', [...(newData || [])]);

      } else {
        return state.set('loadMore', false).set('value', [...(newData || [])]);
      }

    default:
      return state;
  }
}
