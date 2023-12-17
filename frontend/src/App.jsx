import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import RootLayout from "./pages/RootLayout.jsx";
import ChatPage from "./pages/ChatPage";
import HomePage from "./pages/HomePage";
import ChatProvider from "./context/ChatProvider.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "/chats", element: <ChatPage /> },
    ],
  },
]);

function App() {
  return (
    <ChatProvider>
      <RouterProvider router={router} />
    </ChatProvider>
  );
}

export default App;
