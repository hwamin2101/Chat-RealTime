import { format, isToday, isYesterday, isThisWeek } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { useSocket } from "@/hooks/use-socket";
import type { ChatType } from "@/types/chat.type";

export const isUserOnline = (userId?: string) => {
  if (!userId) return false;
  const { onlineUsers } = useSocket.getState();
  return onlineUsers.includes(userId);
};

export const getOtherUserAndGroup = (
  chat: ChatType,
  currentUserId: string | null
) => {
  const isGroup = chat?.isGroup;

  if (isGroup) {
    return {
      name: chat.groupName || "Unnamed Group",
      subheading: `${chat.participants.length} members`,
      avatar: "",
      isGroup:true,
      isOnline: false,
      isAI: false,

    };
  }

  const other = chat?.participants.find((p) => p._id !== currentUserId);
 const isAIUser = 
  other?.isAI === true || 
  other?.name === "Whop AI" || 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (other as any)?.role === "ai"; 
  const subheading = isAIUser
    ? "Assistant" 
    : isUserOnline(other?._id) 
      ? "Online"
      : "Offline";
  console.log(subheading, other, "sub")

return {
    name: other?.name || "Unknown",
    subheading,
    avatar: other?.avatar || "",
    isGroup: false,
    isOnline: !isAIUser && isUserOnline(other?._id),
    isAI: isAIUser,
  };
};
export const formatChatTime = (date: string | Date) => {
  if (!date) return "";
  const newDate = new Date(date);
  if (isNaN(newDate.getTime())) return "Invalid date";

  if (isToday(newDate)) return format(newDate, "h:mm a");
  if (isYesterday(newDate)) return "Yesterday";
  if (isThisWeek(newDate)) return format(newDate, "EEEE");
  return format(newDate, "M/d");
};

export function generateUUID(): string {
  return uuidv4();
}
