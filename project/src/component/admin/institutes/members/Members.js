import { useState, useContext, useCallback, useEffect } from "react";
import AddMemberModal from "./AddMemberModal";
import DeleteMemberModal from "./DeleteMemberModal";
import { Context } from "../../../../context/Context";
import cloneDeep from "lodash/cloneDeep";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";

function Members({ members, instituteId, admin }) {
  //states
  const { user } = useContext(Context);
  const [memberModal, setMemberModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [member, setMember] = useState("");
  const [value, setValue] = useState("");

  //pagination Data
  const countPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const [collection, setCollection] = useState(
    cloneDeep(members?.slice(0, countPerPage))
  );

  //search content
  const searchData = useCallback(
    (value) => {
      const query = value.toLowerCase();
      const data = cloneDeep(
        members
          .filter((item) => item.username.toLowerCase().indexOf(query) > -1)
          .slice(0, 2)
      );
      setCollection(data);
      console.log(data);
    },
    [members]
  );

  //updatePage Function
  const updatePage = useCallback(
    (p) => {
      setCurrentPage(p);
      const to = countPerPage * p;
      const from = to - countPerPage;
      setCollection(cloneDeep(members?.slice(from, to)));
    },
    [members]
  );

  //useEffect search value
  useEffect(() => {
    if (!value) {
      updatePage(1);
    } else {
      setCurrentPage(1);
      searchData(value);
    }
  }, [value, updatePage, searchData]);

  const deleteBtn = (member) => {
    setMember(member.username);
    setDeleteModal(true);
  };

  return (
    <div>
      <div className="all_heading my-3">
        {(user.superadmin || admin) && (
          <button
            className="btn_green my-2"
            onClick={() => setMemberModal(true)}
          >
            Add members
          </button>
        )}
        <div>
          <input
            placeholder="Search Members"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      </div>

      {collection?.length ? (
        <div>
          <table className="bg-white rounded-md shadow-md">
            <thead>
              <tr>
                <th scope="col">s/n</th>
                <th scope="col">Members</th>
                {(user.superadmin || admin) && <th scope="col">Action</th>}
              </tr>
            </thead>
            <tbody>
              {collection.map((member, index) => (
                <tr key={index}>
                  <td data-label="s/n">{index + 1}</td>
                  <td data-label="Member Name">{member.username}</td>
                  {(user.superadmin || admin) && (
                    <td data-label="Action">
                      <div className="flex gap-3 items-center md:justify-center justify-end">
                        <button
                          className="btn_red"
                          onClick={() => deleteBtn(member)}
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="paginate my-4">
            <Pagination
              pageSize={countPerPage}
              onChange={updatePage}
              current={currentPage}
              total={members?.length}
            />
          </div>
        </div>
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
