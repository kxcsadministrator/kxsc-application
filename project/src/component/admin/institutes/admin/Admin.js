import { useState, useContext, useCallback, useEffect } from "react";
import DeleteAdminModal from "./DeleteAdminModal";
import MakeAdminModal from "./MakeAdminModal";
import { Context } from "../../../../context/Context";
import cloneDeep from "lodash/cloneDeep";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";

function Admin({ admins, instituteId }) {
  //states
  const { user } = useContext(Context);
  const [adminModal, setAdminModal] = useState(false);
  const [deleteAdminModal, setDeleteAdminModal] = useState(false);
  const [admin, setAdmin] = useState([]);
  const [value, setValue] = useState("");

  //pagination Data
  const countPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const [collection, setCollection] = useState(
    cloneDeep(admins?.slice(0, countPerPage))
  );

  //search content
  const searchData = useCallback(
    (value) => {
      const query = value.toLowerCase();
      const data = cloneDeep(
        admins
          .filter((item) => item.username.toLowerCase().indexOf(query) > -1)
          .slice(0, 2)
      );
      setCollection(data);
      console.log(data);
    },
    [admins]
  );

  //updatePage Function
  const updatePage = useCallback(
    (p) => {
      setCurrentPage(p);
      const to = countPerPage * p;
      const from = to - countPerPage;
      setCollection(cloneDeep(admins?.slice(from, to)));
    },
    [admins]
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

  //delete btn
  const deleteBtn = (admin) => {
    setAdmin(admin);
    setDeleteAdminModal(true);
  };

  return (
    <div>
      <div className="all_heading my-3">
        {user.superadmin && (
          <button className="btn_green" onClick={() => setAdminModal(true)}>
            Add admin
          </button>
        )}
        <div>
          <input
            placeholder="Search Admins"
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
                <th scope="col">Admins</th>
                {(admin || user.superadmin) && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {collection.map((admin, index) => (
                <tr key={index}>
                  <td data-label="s/n">{index + 1}</td>
                  <td data-label="Admin">{admin.username}</td>
                  {user.superadmin && (
                    <td data-label="Action">
                      <div className="flex justify-end md:justify-center">
                        <button
                          className="btn_red"
                          onClick={() => deleteBtn(admin)}
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
              total={admin?.length}
            />
          </div>
        </div>
      ) : (
        <div className="flex  items-center justify-center w-full">
          <p className="text-center">No admin</p>
        </div>
      )}

      <div className="relative w-full h-full">
        {adminModal && (
          <MakeAdminModal
            setAdminModal={setAdminModal}
            instituteId={instituteId}
          />
        )}
      </div>
      <div className="relative w-full h-full">
        {deleteAdminModal && (
          <DeleteAdminModal
            setDeleteAdminModal={setDeleteAdminModal}
            instituteId={instituteId}
            admin={admin}
          />
        )}
      </div>
    </div>
  );
}

export default Admin;
