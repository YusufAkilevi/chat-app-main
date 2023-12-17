import { useState } from "react";
// import { useNavigate } from "react-router-dom";

import SearchHeader from "./SearchHeader";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import UserListItem from "./UserListItem";

export default function Drawer({ isOpen, setIsOpen }) {
  // const navigate = useNavigate();
  const { user, setSelectedChat, chats, setChats } = ChatState();
  const [searcInput, setSearchInput] = useState();
  const [searchInputError, setSearchInputError] = useState(false);

  const [loadingChat, setLoadingChat] = useState(false);
  const [searchResult, setSearchResult] = useState();
  const [searchError, setSearchError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searcInput) {
      setSearchInputError(true);
    } else {
      setSearchInputError(false);
      try {
        setLoading(true);
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };

        const { data } = await axios.get(
          `http://localhost:3001/api/user?search=${searcInput}`,
          config
        );

        setLoading(false);
        setSearchResult(data);
      } catch (error) {
        console.error(error);
        setSearchError(true);
        setLoading(false);
      }
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "http://localhost:3001/api/chat",
        { userId },
        config
      );
      if (!chats.find((chat) => chat._id === data._id)) {
        setChats((prevChats) => [data, ...prevChats]);
      }

      setSelectedChat(data);
      setLoadingChat(false);
      setIsOpen(false);
    } catch (error) {
      console.error(error);
      setLoadingChat(false);
    }
  };

  return (
    <main
      className={
        " fixed overflow-hidden z-10 bg-gray-900 bg-opacity-25 inset-0 transform ease-in-out " +
        (isOpen
          ? " transition-opacity opacity-100 duration-500 -translate-x-0  "
          : " transition-all delay-500 opacity-0 -translate-x-full  ")
      }
    >
      <section
        className={
          "relative w-screen max-w-sm left-0  bg-white h-full shadow-xl delay-400 duration-500 ease-in-out transition-all transform  " +
          (isOpen ? "-translate-x-0 " : " -translate-x-full ")
        }
      >
        <SearchHeader
          setIsOpen={setIsOpen}
          setSearchInput={setSearchInput}
          handleSearch={handleSearch}
          searchInputError={searchInputError}
        />
        <article className="relative w-screen max-w-sm pb-10 flex flex-col space-y-6 overflow-y-scroll h-full">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul className="mx-5 mt-5 flex flex-col gap-2">
              {searchResult?.map((user) => (
                <UserListItem
                  clickHandler={accessChat}
                  user={user}
                  key={user._id}
                />
              ))}
            </ul>
          )}
          {searchError && <p>Failed to load search results!</p>}
        </article>
      </section>
      <section
        className="z-20 w-screen max-w-lg h-screen cursor-pointer "
        onClick={() => setIsOpen(false)}
      ></section>
    </main>
  );
}
