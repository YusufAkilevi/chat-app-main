import {
  ArrowLeftIcon,
  UserIcon,
  UserGroupIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import ProfileModal from "../UI/ProfileModal";
import { ChatState } from "../../context/ChatProvider";
import { getSender, getSenderUserInfo } from "../../config/chatUtilities";
import UpdateGroupChatModal from "../UI/UpdateGroupChatModal";
import LoadingSpinner from "../UI/LoadingSpinner";
import ScrollableChat from "./ScrollableChat";

const ENDPOINT = "http://localhost:3001";
let socket, selectedChatCompare;

const SingleChat = ({ fetchChatsAgain, setFetchChatsAgain }) => {
  const {
    user,
    selectedChat,
    setSelectedChat,
    notifications,
    setNotifications,
  } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };
  const openModal = () => {
    setIsOpen(true);
  };
  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:3001/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.error(error);
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // Typing Indicator Logic
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  const sendMessage = async (e) => {
    e.preventDefault();
    socket.emit("stop typing", selectedChat._id);
    setTyping(false);
    if (newMessage?.length !== 0) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");
        const { data } = await axios.post(
          "http://localhost:3001/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message", data);
        setMessages((prevMessages) => [...prevMessages, data]);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // give notification
        if (!notifications.includes(newMessageReceived)) {
          setNotifications([newMessageReceived, ...notifications]);
          setFetchChatsAgain((prevState) => !prevState);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  return (
    <>
      {selectedChat ? (
        <div className="flex flex-col flex-grow gap-3">
          <div className="flex justify-between items-center w-full h-fit">
            <button
              onClick={() => setSelectedChat()}
              className="md:hidden text-gray-500 hover:text-gray-100 hover:bg-slate-400 bg-slate-300 rounded-md px-3 py-2 text-sm font-medium flex items-center gap-1"
            >
              <ArrowLeftIcon className="block h-6 w-6" aria-hidden="true" />{" "}
            </button>

            {selectedChat.isGroupChat ? (
              <>
                <div className="flex justify-between items-center w-full">
                  <h2 className="mx-auto md:mx-0 md:mr-auto">
                    {selectedChat.chatName.toUpperCase()}
                  </h2>
                  <button
                    onClick={openModal}
                    className="ml-auto text-gray-500 hover:text-gray-100 hover:bg-slate-400 bg-slate-300 rounded-full p-2 text-sm font-medium "
                  >
                    <UserGroupIcon
                      className="block h-6 w-6"
                      aria-hidden="true"
                    />
                  </button>
                </div>
                <UpdateGroupChatModal
                  isOpen={isOpen}
                  closeModal={closeModal}
                  fetchChatsAgain={fetchChatsAgain}
                  setFetchChatsAgain={setFetchChatsAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            ) : (
              <>
                <div className="flex justify-between items-center w-full">
                  <h2 className="mx-auto md:mx-0 md:mr-auto">
                    {getSender(user, selectedChat.users)}
                  </h2>
                  <button
                    onClick={openModal}
                    className=" text-gray-500 hover:text-gray-100 hover:bg-slate-400 bg-slate-300 rounded-full p-2 text-sm font-medium "
                  >
                    <UserIcon className="block h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <ProfileModal
                  isOpen={isOpen}
                  closeModal={closeModal}
                  user={getSenderUserInfo(user, selectedChat.users)}
                />
              </>
            )}
          </div>
          <div className="bg-slate-100 flex-grow flex flex-col rounded h-[90%] w-full relative">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <ScrollableChat messages={messages} />
            )}

            <form
              onSubmit={sendMessage}
              className="flex flex-col  gap-1 w-full p-2 border-t "
            >
              {isTyping ? <div>typing...</div> : <></>}
              <div className="flex justify-between gap-1 w-full">
                <input
                  type="text"
                  onChange={typingHandler}
                  value={newMessage}
                  placeholder="Your message"
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <button
                  type="submit"
                  className="text-gray-500 hover:text-gray-100 hover:bg-slate-400 bg-slate-300  rounded-md px-3 py-2 text-sm font-medium"
                >
                  <PaperAirplaneIcon
                    className="block h-6 w-6"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center w-full">
          <p className="text-3xl text-gray-400">
            Click on a user to start chatting
          </p>
        </div>
      )}
    </>
  );
};

export default SingleChat;
