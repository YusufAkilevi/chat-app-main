import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header/Header";
import Drawer from "../components/Drawer/Drawer";
import { ChatState } from "../context/ChatProvider";
import MyChats from "../components/MyChats/MyChats";
import ChatBox from "../components/ChatBox/ChatBox";

const ChatPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = ChatState();
  const [fetchChatsAgain, setFetchChatsAgain] = useState(false);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    if (!userInfo) {
      navigate("/");
    }
  }, [navigate, setUser]);
  return (
    <div className="h-screen flex flex-col">
      {user && <Header />}
      {user && <Drawer />}
      <main className="flex flex-grow overflow-y-auto">
        {user && <MyChats fetchChatsAgain={fetchChatsAgain} />}
        {user && (
          <ChatBox
            fetchChatsAgain={fetchChatsAgain}
            setFetchChatsAgain={setFetchChatsAgain}
          />
        )}
      </main>
    </div>
  );
};
export default ChatPage;
