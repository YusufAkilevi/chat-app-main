import { useEffect, useRef } from "react";
import { ChatState } from "../../context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const chatContainerRef = useRef(null);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <div
      ref={chatContainerRef}
      className="w-full flex-grow overflow-y-auto flex flex-col gap-1 p-2 transition-all duration-300 ease-in-out"
    >
      {messages &&
        messages.map((message, i) => {
          return (
            <div
              className={`flex items-center gap-2 ${
                message.sender._id === user._id
                  ? "self-end flex-row-reverse "
                  : "self-start"
              }`}
              key={message._id}
            >
              <img
                className="h-8 w-8 rounded-full"
                src={message.sender.pic}
                alt={message.sender.name}
              />
              <span
                className={`${
                  message.sender._id === user._id
                    ? "bg-blue-200"
                    : "bg-green-200"
                } max-w-fit rounded-md px-4 py-1 text-gray-700`}
              >
                {message.content}
              </span>
            </div>
          );
        })}
    </div>
  );
};
export default ScrollableChat;
