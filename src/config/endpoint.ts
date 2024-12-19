import { TIME } from "@/constants";
import { env } from "./env";

export const endpoint = {
  // --- Base
  BASE_URL: `${env.AI_SERVER_URL}`,
  TESTING_BASE_URL: `${env.TESTING_BASE_URL}`,

  // --- Chat
  CHAT: `${env.AI_SERVER_URL}/generate`,
  GET_CHAT: {
    TODAY: `${env.AI_SERVER_URL}/chat/all/?start_date=${TIME.TODAY.START}&end_date=${TIME.TODAY.END}`,
    YESTERDAY: `${env.AI_SERVER_URL}/chat/all/?start_date=${TIME.YESTERDAY.START}&end_date=${TIME.YESTERDAY.END}`,
    THIS_WEEK: `${env.AI_SERVER_URL}/chat/all/?start_date=${TIME.PAST_7_DAYS.START}&end_date=${TIME.PAST_7_DAYS.END}`,
    THIS_MONTH: `${env.AI_SERVER_URL}/chat/all/?start_date=${TIME.PAST_30_DAYS.START}&end_date=${TIME.PAST_30_DAYS.END}`,
    ARCHIVED: `${env.AI_SERVER_URL}/chat/all/?archived=true`,
    FAVORITE: `${env.AI_SERVER_URL}/chat/all/?favorite=true`,
    HISTORY: `${env.AI_SERVER_URL}/chat/all`,
  },
  REGISTER_CHAT: `${env.AI_SERVER_URL}/register`,
  UPDATE_CHAT: `${env.AI_SERVER_URL}/chat`, // i.e. /chat/{session_id}, PUT
  DELETE_CHAT: `${env.AI_SERVER_URL}/chat`, // i.e. /chat/{session}, DELETE

  // --- Context Search

  // --- Important Chat
  HISTORY: `${env.AI_SERVER_URL}/chat/history`,
  BOOKMARKS: `${env.AI_SERVER_URL}/chat/bookmarks`,
  ARCHIVE: `${env.AI_SERVER_URL}/chat/archive`,
  IMPORTANT_CHATS: `${env.AI_SERVER_URL}/chat/important-chats`,

  // --- Settings
  SETTINGS: `${env.AI_SERVER_URL}/settings`,
};
