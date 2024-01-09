import { useState, useContext, useCallback, useEffect } from "react";
import { Context } from "../../../../context/Context";
import cloneDeep from "lodash/cloneDeep";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import AddCollaborators from "./AddCollaborators";
import DeleteCollaborator from "./DeleteCollaborator";

function Collaborators({ collaborators, admin, instituteId, task }) {
  //states
  const { user } = useContext(Context);
  const [value, setValue] = useState("");
  const [addCollaboratorsModal, setAddCollaboratorsModal] = useState(false);
  const [deleteCollabModal, setDeleteCollabModal] = useState(false);
  const [member, setMember] = useState("");

  //pagination Data
  const countPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const [collection, setCollection] = useState(
    cloneDeep(collaborators?.slice(0, countPerPage))
  );

  //search content
  const searchData = useCallback(
    (value) => {
      const query = value.toLowerCase();
      const data = cloneDeep(
        collaborators
          .filter((item) => item.username.toLowerCase().indexOf(query) > -1)
          .slice(0, 2)
      );
      setCollection(data);
      console.log(data);
    },
    [collaborators]
  );

  //updatePage Function
  const updatePage = useCallback(
    (p) => {
      setCurrentPage(p);
      const to = countPerPage * p;
      const from = to - countPerPage;
      setCollection(cloneDeep(collaborators?.slice(from, to)));
    },
    [collaborators]
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

  //remove member
  const deleteBtn = (member) => {
    setMember(member);
    setDeleteCollabModal(true);
  };
  return (
    <div>
      <div className="all_heading my-3">
        {(user.superadmin || admin) && (
          <button
            className="btn_green my-2 max-w-none"
            onClick={() => setAddCollaboratorsModal(true)}
          >
            Add Collaborators
          </button>
        )}
        {collection?.length > 0 && (
          <div>
            <input
              placeholder="Search Members"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
        )}
      </div>

      {collection?.length ? (
        <div>
          <table className="bg-white rounded-md shadow-md">
            <thead>
              <tr>
                <th scope="col">s/n</th>
                <th scope="col">collaborators</th>
                {(user.superadmin || admin) && <th scope="col">Action</th>}
              </tr>
            </thead>
            <tbody>
              {collection.map((member, index) => (
                <tr key={index}>
                  <td data-label="s/n">{index + 1}</td>
                  <td data-label="Collaborator">{member.username}</td>
                  {(user.superadmin || admin) && (
                    <td data-label="Action">
                      <div className="flex gap-3 items-center md:justify-center justify-end">
                        <button
                          className="btn_red"
                          onClick={() => deleteBtn(member.username)}
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
              total={collaborators?.length}
            />
          </div>
        </div>
      ) : (
        <div className="flex justify-center w-full">
          <p>No Collaborators</p>
        </div>
      )}
      <div>
        {addCollaboratorsModal && (
          <AddCollaborators
            setAddCollaboratorsModal={setAddCollaboratorsModal}
            instituteId={instituteId}
          />
        )}
      </div>
      {deleteCollabModal && (
        <DeleteCollaborator
          setDeleteCollabModal={setDeleteCollabModal}
          member={member}
        />
      )}
    </div>
  );
}

export default Collaborators;
