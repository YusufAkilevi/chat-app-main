const UserListItem = ({ user, clickHandler }) => {
  return (
    <li
      onClick={clickHandler?.bind(this, user._id)}
      className="group bg-slate-200 hover:bg-slate-500 hover:cursor-pointer  py-1 px-4 rounded flex items-center gap-3"
    >
      <div>
        <img className="h-8 w-8 rounded-full" src={user.pic} alt={user.name} />
      </div>
      <div>
        <p className="text-sm  group-hover:text-white text-gray-700">
          {user.name}
        </p>
        <p>
          <span className="text-xs font-bold group-hover:text-white hover:text-white text-gray-700">
            Email:
          </span>{" "}
          <span className="text-xs group-hover:text-white  text-gray-700">
            {user.email}
          </span>
        </p>
      </div>
    </li>
  );
};
export default UserListItem;
