import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import ProfileModal from "../UI/ProfileModal";
import Drawer from "../Drawer/Drawer";
import { ChatState } from "../../context/ChatProvider";
import { getSender } from "../../config/chatUtilities";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Header = () => {
  const navigate = useNavigate();
  const { user, notifications, setNotifications, setSelectedChat } =
    ChatState();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => {
    setIsOpen(false);
  };
  const openModal = () => {
    setIsOpen(true);
  };
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <>
      <Drawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} />

      <Disclosure as="nav" className="bg-slate-100 h-[8vh]">
        {() => (
          <>
            <div className=" max-w-full px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="flex flex-1 items-center  sm:items-stretch sm:justify-start">
                  <div className="flex w-1/3">
                    <button
                      onClick={() => setIsDrawerOpen(true)}
                      className={classNames(
                        "text-gray-500 hover:text-gray-100 hover:bg-slate-400 bg-slate-300 w-full ",
                        "rounded-md px-3 py-2 text-sm font-medium flex items-center gap-3"
                      )}
                    >
                      <MagnifyingGlassIcon
                        className="block h-6 w-6"
                        aria-hidden="true"
                      />
                      <span className="hidden sm:inline-block">
                        Search User
                      </span>
                    </button>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="relative rounded-full bg-slate-300 hover:bg-slate-400 p-1 text-gray-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-400">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open notifications</span>
                        {notifications.length > 0 && (
                          <span className="absolute -top-2 -right-5 bg-red-100 text-red-800 text-xs font-medium me-2 px-2 py-1 rounded-full bg-red-700 dark:text-red-300">
                            {notifications.length}
                          </span>
                        )}

                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {notifications.length === 0 && (
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700 w-full text-left"
                                )}
                              >
                                No new messages!
                              </button>
                            )}
                          </Menu.Item>
                        )}
                        {notifications.map((notif) => (
                          <Menu.Item key={notif.chat._id}>
                            {({ active }) => (
                              <button
                                onClick={() => {
                                  setSelectedChat(notif.chat);
                                  setNotifications(
                                    notifications.filter((n) => n !== notif)
                                  );
                                }}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm text-gray-700 w-full text-left"
                                )}
                              >
                                {notif.chat.isGroupChat
                                  ? `New message in ${notif.chat.chatName}`
                                  : `New message from ${getSender(
                                      user,
                                      notif.chat.users
                                    )}`}
                              </button>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="relative flex rounded-full bg-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-400">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src={user.pic}
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={openModal}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700 w-full text-left"
                              )}
                            >
                              Your Profile
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={logoutHandler}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700 w-full text-left"
                              )}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>
      <ProfileModal isOpen={isOpen} closeModal={closeModal} user={user} />
    </>
  );
};
export default Header;
