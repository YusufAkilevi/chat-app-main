import { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";

import UserListItem from "../Drawer/UserListItem";
import SelectedUserList from "./SelectedUserList";
const CreateGroupChatForm = ({ closeModal }) => {
  const [groupChatName, setGroupChatName] = useState();
  const [groupChatError, setGroupChatError] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userSelectionError, setUserSelectionError] = useState(false);
  const [search, setSearch] = useState();
  const [searchResults, setSearchResults] = useState();
  const [loading, setLoading] = useState(false);
  const { user, chats, setChats } = ChatState();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!groupChatName || selectedUsers.length === 0) {
      setGroupChatError(true);
      setTimeout(() => {
        setGroupChatError(false);
      }, 5000);
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "http://localhost:3001/api/chat/group",
        { name: groupChatName, users: JSON.stringify(selectedUsers) },
        config
      );
      setChats((prevChats) => [data, ...prevChats]);
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };
  const groupHandler = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      setUserSelectionError(true);
      setTimeout(() => {
        setUserSelectionError(false);
      }, 5000);
    } else {
      setUserSelectionError(false);
      setSelectedUsers((prevUsers) => [...prevUsers, userToAdd]);
    }
  };
  const deleteUser = (userToRemove) => {
    setSelectedUsers((prevUsers) =>
      prevUsers.filter((user) => user._id !== userToRemove._id)
    );
  };
  const handleSearch = async (query) => {
    setSearch(query);

    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:3001/api/user?search=${query}`,
        config
      );

      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <form onSubmit={submitHandler} className="space-y-6">
        <div className="mt-2">
          <input
            type="text"
            placeholder="Chat name"
            onChange={(e) => setGroupChatName(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        <div className="mt-2 relative">
          <input
            placeholder="Add user; John, Jane etc."
            onChange={(e) => handleSearch(e.target.value)}
            autoComplete="current-password"
            className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
        {/* Selected Users List */}
        {selectedUsers.length > 0 && (
          <SelectedUserList
            selectedUsers={selectedUsers}
            deleteUser={deleteUser}
          />
        )}
        {userSelectionError && (
          <p className="text-sm text-red-400">User is already selected!</p>
        )}
        {/* Render searched users */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {searchResults?.slice(0, 4).map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                clickHandler={groupHandler.bind(this, user)}
              />
            ))}
          </ul>
        )}
        {groupChatError && (
          <p className="text-sm text-red-400">Please fill all the fields!</p>
        )}
        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Creat Group Chat
          </button>
        </div>
      </form>
    </>
  );
};

export default CreateGroupChatForm;
