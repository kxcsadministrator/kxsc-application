import { useState, useContext } from "react";
import DeleteAdminModal from "./DeleteAdminModal";
import MakeAdminModal from "./MakeAdminModal";
import { Context } from "../../../../context/Context";

function Admin({ admins, instituteId }) {
  const { user } = useContext(Context);
  const [adminModal, setAdminModal] = useState(false);
  const [deleteAdminModal, setDeleteAdminModal] = useState(false);
  const [admin, setAdmin] = useState([]);

  const deleteBtn = (admin) => {
    setAdmin(admin);
    setDeleteAdminModal(true);
  };

  return (
    <div>
      {user.superadmin && (
        <button
          className="p-2 bg-[#52cb83] rounded-md w-44 text-white my-3"
          onClick={() => setAdminModal(true)}
        >
          Add admin
        </button>
      )}
      {admins?.length ? (
        <table className="bg-white rounded-md shadow-md">
          <thead>
            <tr>
              <th scope="col">s/n</th>
              <th scope="col">Admins</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{admin.username}</td>
                {user.superadmin && (
                  <td>
                    <button
                      className="btn_red"
                      onClick={() => deleteBtn(admin)}
                    >
                      Remove
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
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
