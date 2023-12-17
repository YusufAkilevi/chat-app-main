import { useState } from "react";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { ChatState } from "../../context/ChatProvider";
import SelectedUserList from "../MyChats/SelectedUserList";
import UserListItem from "../Drawer/UserListItem";

function UpdateGroupChatModal({
  isOpen,
  closeModal,
  fetchChatsAgain,
  setFetchChatsAgain,
  fetchMessages,
}) {
  const { selectedChat, setSelectedChat, user } = ChatState();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState();
  const [searchResults, setSearchResults] = useState();
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  //   const [selectedUsers, setSelectedUsers] = useState(selectedChat.users);
  const [userSelectionError, setUserSelectionError] = useState({
    isError: false,
    errorMessage: "",
  });

  const handleRemove = async (userToRemove) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      userToRemove._id !== user._id
    ) {
      setUserSelectionError({
        errorMessage: "Only the group admin can remove users!",
        isError: true,
      });
      setTimeout(() => {
        setUserSelectionError({
          errorMessage: "",
          isError: false,
        });
      }, 5000);
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "http://localhost:3001/api/chat/groupremove",
        { chatId: selectedChat._id, userId: userToRemove._id },
        config
      );
      userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchChatsAgain(!fetchChatsAgain);
      setLoading(false);
      fetchMessages();
      if (userToRemove._id === user._id) closeModal();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
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
  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "http://localhost:3001/api/chat/rename",
        { chatId: selectedChat._id, chatName: groupChatName },
        config
      );
      setSelectedChat(data);
      setFetchChatsAgain(!fetchChatsAgain);
      setRenameLoading(false);
    } catch (error) {
      console.error(error);
      setRenameLoading(false);
    }
    setGroupChatName("");
  };
  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find((user) => user._id === userToAdd._id)) {
      setUserSelectionError({
        errorMessage: "User is already selected!",
        isError: true,
      });
      setTimeout(() => {
        setUserSelectionError((prevState) => ({
          ...prevState,
          isError: false,
        }));
      }, 5000);
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      setUserSelectionError({
        errorMessage: "Only the group admin can add users!",
        isError: true,
      });
      setTimeout(() => {
        setUserSelectionError({
          errorMessage: "",
          isError: false,
        });
      }, 5000);
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "http://localhost:3001/api/chat/groupadd",
        { chatId: selectedChat._id, userId: userToAdd._id },
        config
      );
      setSelectedChat(data);
      setFetchChatsAgain(!fetchChatsAgain);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-3"
                  >
                    {selectedChat.chatName}
                  </Dialog.Title>
                  <SelectedUserList
                    selectedUsers={selectedChat.users}
                    deleteUser={handleRemove}
                  />
                  <form className="flex justify-between gap-1 mt-2 relative mt-3">
                    <input
                      type="text"
                      placeholder="Chat name"
                      value={groupChatName}
                      onChange={(e) => setGroupChatName(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <button
                      disabled={renameLoading ? true : false}
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                      onClick={handleRename}
                    >
                      {renameLoading ? "Updating..." : "Update"}
                    </button>
                  </form>
                  <form className="flex justify-between gap-1 mt-2 relative mb-5">
                    <input
                      placeholder="Add user; John, Jane etc."
                      onChange={(e) => handleSearch(e.target.value)}
                      value={search}
                      autoComplete="current-password"
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </form>
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    <ul className="flex flex-col gap-2">
                      {searchResults?.slice(0, 4).map((user) => (
                        <UserListItem
                          key={user._id}
                          user={user}
                          clickHandler={handleAddUser.bind(this, user)}
                        />
                      ))}
                    </ul>
                  )}
                  {userSelectionError.isError && (
                    <p className="text-sm text-red-400">
                      {userSelectionError.errorMessage}
                    </p>
                  )}
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={handleRemove.bind(this, user)}
                    >
                      Leave Group
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
export default UpdateGroupChatModal;
