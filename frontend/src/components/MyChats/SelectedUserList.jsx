import SelectedUserBadge from "./SelectedUserBadge";

const SelectedUserList = ({ selectedUsers, deleteUser }) => {
  return (
    <ul className="flex gap-1 flex-wrap">
      {selectedUsers?.map((user) => (
        <SelectedUserBadge deleteUser={deleteUser} key={user._id} user={user} />
      ))}
    </ul>
  );
};
export default SelectedUserList;
