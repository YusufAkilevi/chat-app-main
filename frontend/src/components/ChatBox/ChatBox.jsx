import { ChatState } from "../../context/ChatProvider";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchChatsAgain, setFetchChatsAgain }) => {
  const { selectedChat } = ChatState();

  const classes = selectedChat
    ? "flex my-2 mr-2 ml-2 md:ml-0 p-4 rounded w-full w:md-2/3 bg-white"
    : "hidden md:flex my-2 mr-2 p-4 rounded w-full  w:md-2/3 bg-white";
  return (
    <section className={classes}>
      <SingleChat
        fetchChatsAgain={fetchChatsAgain}
        setFetchChatsAgain={setFetchChatsAgain}
      />
    </section>
  );
};

export default ChatBox;
