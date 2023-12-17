import { XMarkIcon } from "@heroicons/react/24/outline";

const SelectedUserBadge = ({ user, deleteUser }) => {
  return (
    <li className="bg-indigo-600 hover:bg-indigo-500 cursor-pointer  text-white rounded py-1 px-2 flex items-center">
      <span className="text-xs">{user.name}</span>
      <button type="button" className="" onClick={deleteUser.bind(this, user)}>
        <XMarkIcon className="block h-4 w-4" aria-hidden="true" />
      </button>
    </li>
  );
};
export default SelectedUserBadge;
