import { env } from "./env";

export const endpoint = {
  // --- Base
  BASE_URL: `${env.AI_SERVER_URL}`,

  // --- Chat
  CHAT: `${env.AI_SERVER_URL}/generate`,
  GET_CHAT: `${env.AI_SERVER_URL}/chat`,
  HISTORY: `${env.AI_SERVER_URL}/chat/history`,
  BOOKMARKS: `${env.AI_SERVER_URL}/chat/bookmarks`,
  ARCHIVE: `${env.AI_SERVER_URL}/chat/archive`,
  IMPORTANT_CHATS: `${env.AI_SERVER_URL}/chat/important-chats`,

  // --- Settings
  SETTINGS: `${env.AI_SERVER_URL}/settings`,
};
