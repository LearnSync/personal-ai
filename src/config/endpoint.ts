import { env } from "./env";

export const endpoint = {
  // --- Base
  BASE_URL: `${env.AI_SERVER_URL}`,

  // --- Chat
  CHAT: `${env.AI_SERVER_URL}/generate`,
  GET_CHAT: `${env.AI_SERVER_URL}/c`,
  HISTORY: `${env.AI_SERVER_URL}/c/history`,
  BOOKMARKS: `${env.AI_SERVER_URL}/c/bookmarks`,
  ARCHIVE: `${env.AI_SERVER_URL}/c/archive`,
  IMPORTANT_CHATS: `${env.AI_SERVER_URL}/c/important-chats`,

  // --- Settings
  SETTINGS: `${env.AI_SERVER_URL}/settings`,
};
