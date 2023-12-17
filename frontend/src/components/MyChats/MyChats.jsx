import { useEffect, useState } from "react";
import { PlusSmallIcon } from "@heroicons/react/24/outline";
import axios from "axios";

import CreateGroupChatModal from "../UI/CreateGroupChatModal";
import { ChatState } from "../../context/ChatProvider";
import { getSender } from "../../config/chatUtilities";

const MyChats = ({ fetchChatsAgain }) => {
  const [loggedUser, setLoggedUser] = useState(
    JSON.parse(localStorage.getItem("userInfo"))
  );
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => {
    setIsOpen(false);
  };
  const openModal = () => {
    setIsOpen(true);
  };

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        "http://localhost:3001/api/chat",
        config
      );

      setChats(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchChatsAgain]);

  const classes = selectedChat
    ? "m-2 p-4 rounded w-full md:w-1/3 bg-white hidden md:block"
    : "m-2 p-4 rounded w-full md:w-1/3 bg-white ";
  return (
    <>
      <CreateGroupChatModal isOpen={isOpen} closeModal={closeModal} />
      <section className={classes}>
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="font-semibold text-gray-700">My Chats</h2>
          <button
            onClick={openModal}
            className="text-gray-500 hover:text-gray-100 hover:bg-slate-400 bg-slate-300 rounded-md px-3 py-2 text-sm font-medium flex items-center gap-1"
          >
            <PlusSmallIcon className="block h-6 w-6" aria-hidden="true" />{" "}
            <span>New Group Chat</span>
          </button>
        </div>
        <ul className="flex flex-col gap-2 overflow-y-scroll">
          {chats.map((chat) => (
            <li
              onClick={() => {
                setSelectedChat(chat);
              }}
              className={
                chat._id === selectedChat?._id
                  ? "group bg-gradient-to-r from-cyan-500 to-blue-500 hover:cursor-pointer  py-1 px-4 rounded"
                  : "group bg-slate-200 hover:bg-slate-500 hover:cursor-pointer  py-1 px-4 rounded"
              }
              key={chat._id}
            >
              <p className="group-hover:text-white">
                {chat.isGroupChat
                  ? chat.chatName
                  : getSender(loggedUser, chat.users)}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};
export default MyChats;
