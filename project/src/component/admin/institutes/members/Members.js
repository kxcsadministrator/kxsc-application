import { useState } from "react";
import AddMemberModal from "./AddMemberModal";
import DeleteMemberModal from "./DeleteMemberModal";

function Members({ members, instituteId }) {
  const [memberModal, setMemberModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [member, setMember] = useState("");

  const deleteBtn = (member) => {
    setMember(member.username);
    setDeleteModal(true);
  };

  console.log(members);

  return (
    <div>
      <div className="flex justify-start my-4">
        <button
          className="p-2 bg-[#52cb83] rounded-md w-44 text-white"
          onClick={() => setMemberModal(true)}
        >
          Add members
        </button>
      </div>
      {members?.length ? (
        <table className="bg-white rounded-md shadow-md">
          <thead>
            <tr>
              <th scope="col">s/n</th>
              <th scope="col">Members</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{member.username}</td>
                <td>
                  <div className="flex gap-3 items-center justify-center">
                    <button
                      className="p-2 bg-[#d14949] rounded-md w-28 text-white"
                      onClick={() => deleteBtn(member)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex justify-center w-full">
          <p>No Members</p>
        </div>
      )}
      <div className="relative w-full h-full">
        {memberModal && (
          <AddMemberModal
            setMemberModal={setMemberModal}
            instituteId={instituteId}
          />
        )}
      </div>
      <div className="relative w-full h-full">
        {deleteModal && (
          <DeleteMemberModal
            setDeleteModal={setDeleteModal}
            instituteId={instituteId}
            member={member}
          />
        )}
      </div>
    </div>
  );
}

export default Members;