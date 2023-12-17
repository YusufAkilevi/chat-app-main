import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Modal from "../UI/Modal";
import { ChatState } from "../../context/ChatProvider";

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setSelectedChat } = ChatState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState();
  const [loginError, setLoginError] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const closeModal = () => {
    setIsOpen(false);
  };
  const openModal = (message) => {
    setModalMessage(message);
    setIsOpen(true);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!email || !password) {
      openModal("Please fill all the fields!");
    }

    try {
      const config = { headers: { "Content-Type": "application/json" } };
      const { data } = await axios.post(
        "http://localhost:3001/api/user/login",
        {
          email,
          password,
        },
        config
      );

      setUser(data);
      setSelectedChat();
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);

      navigate("/chats");
    } catch (err) {
      console.error(err.response.data.error);
      setLoading(false);
      setLoginError(true);
      setErrorMessage(err.response.data.error);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className=" sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            onSubmit={submitHandler}
            className="space-y-6"
            action="#"
            method="POST"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Your email"
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <button
                  type="button"
                  className="text-sm absolute right-1 top-1/2 -translate-y-1/2 font-semibold	"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div>
              <button
                disabled={
                  loading || email.length === 0 || password.length === 0
                    ? true
                    : false
                }
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {loading ? "Signing in..." : "Login"}
              </button>
            </div>
            {loginError && (
              <p className="text-sm text-red-400">*{errorMessage}</p>
            )}
          </form>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        closeModal={closeModal}
        openModal={openModal}
        modalMessage={modalMessage}
      />
    </>
  );
};

export default Login;
