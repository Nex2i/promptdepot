export const SOCKET_EVENTS = {
  SEND_TRAINING_MESSAGE: 'send-training-message',
  SEND_TRAINING_MESSAGE_SUCCESS: 'send-training-message-success',
  SEND_TRAINING_MESSAGE_FAILURE: 'send-training-message-failure',

  // Chat session events
  CREATE_CHAT_SESSION: 'create-chat-session',
  CREATE_CHAT_SESSION_SUCCESS: 'create-chat-session-success',
  CREATE_CHAT_SESSION_FAILURE: 'create-chat-session-failure',

  // Agent interaction events
  SEND_CHAT_MESSAGE: 'send-chat-message',
  SEND_CHAT_MESSAGE_SUCCESS: 'send-chat-message-success',
  SEND_CHAT_MESSAGE_FAILURE: 'send-chat-message-failure',

  // History management events
  GET_CHAT_HISTORY: 'get-chat-history',
  GET_CHAT_HISTORY_SUCCESS: 'get-chat-history-success',
  GET_CHAT_HISTORY_FAILURE: 'get-chat-history-failure',

  CLEAR_CHAT_HISTORY: 'clear-chat-history',
  CLEAR_CHAT_HISTORY_SUCCESS: 'clear-chat-history-success',
  CLEAR_CHAT_HISTORY_FAILURE: 'clear-chat-history-failure',

  // Statistics events
  GET_CHAT_STATS: 'get-chat-stats',
  GET_CHAT_STATS_SUCCESS: 'get-chat-stats-success',
  GET_CHAT_STATS_FAILURE: 'get-chat-stats-failure',
} as const;

export type SocketEvent = (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];
