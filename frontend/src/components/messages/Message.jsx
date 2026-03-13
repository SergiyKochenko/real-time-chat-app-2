import { useAuthContext } from "../../context/AuthContext.jsx";
import useConversation from "../../zustand/useConversation.js";
import { extractTime } from "../../utils/extractTime.js";
import defaultAvatar from "../../assets/default-avatar.svg";

const Message = ({ message }) => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();
  const fromMe = message.senderId === authUser._id;
  const formatedTime = extractTime(message.createdAt);
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const rawProfilePic = fromMe
    ? authUser.profilePic
    : selectedConversation?.profilePic;
  const profilePic = rawProfilePic || defaultAvatar;
  const buubbleBgColor = fromMe ? "bg-blue-500" : "";
  const shackClass = message.shouldShake ? "shake" : "";
  const handleAvatarError = (event) => {
    event.target.onerror = null;
    event.target.src = defaultAvatar;
  };
  return (
    <div className={`chat ${chatClassName}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS chat bubble component"
            src={profilePic}
            onError={handleAvatarError}
          />
        </div>
      </div>
      <div
        className={`chat-bubble text-white ${buubbleBgColor} ${shackClass} pb-2`}
      >
        {message.message}
      </div>
      <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
        {formatedTime}
      </div>
    </div>
  );
};
export default Message;
