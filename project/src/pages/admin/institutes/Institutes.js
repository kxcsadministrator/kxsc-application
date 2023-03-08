import Topbar from "../../../component/admin/Topbar";
import Sidebar from "../../../component/admin/Sidebar";
import { Context } from "../../../context/Context";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeleteInstituteModal from "../../../component/admin/institutes/DeleteInstituteModal";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaEye } from "react-icons/fa";

function Institutes() {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [allInstitues, setAllInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [modalInstitute, setModalInstitute] = useState([]);
  const [deleteInstituteModal, setDeleteInstituteModal] = useState(false);

  useEffect(() => {
    const getInstitutes = async () => {
      setLoading(true);
      setError(false);
      if (user.superadmin) {
        try {
          const res = await axios.get(
            "http://13.36.208.80:3001/institutes/all",
            {
              headers: { Authorization: `Bearer ${user.jwt_token}` },
            }
          );
          setLoading(false);
          setAllInstitutes(res.data);
          console.log(res.data);
        } catch (err) {
          setLoading(false);
          setError(true);

          console.log(err);
        }
      } else {
        try {
          const res = await axios.get(
            "http://13.36.208.80:3001/institutes/my-institutes",
            {
              headers: { Authorization: `Bearer ${user.jwt_token}` },
            }
          );
          setLoading(false);
          setAllInstitutes(res.data);
          console.log(res.data);
        } catch (err) {
          setLoading(false);
          setError(true);

          console.log(err);
        }
      }
    };
    getInstitutes();
  }, [user.jwt_token]);

  const viewInstitute = (institute) => {
    sessionStorage.setItem("id", institute._id);
    navigate(`/admin/institutes/${institute.name}`);
  };

  const deleteBtn = (institute) => {
    setModalInstitute(institute);
    setDeleteInstituteModal(true);
  };

  return (
    <div className="max-w-[1560px] mx-auto flex min-h-screen w-full bg-gray_bg">
      <div className="w-[24%]">
        <Sidebar />
      </div>
      <div className="w-[82%]">
        <div>
          <Topbar />
        </div>
        <div className="py-2 px-5">
          {loading ? (
            <div>
              <h1>Loading</h1>
            </div>
          ) : error ? (
            <div>{errMsg}</div>
          ) : (
            <>
              <div>
                <table className="bg-white rounded-md shadow-md">
                  <thead>
                    <tr>
                      <th scope="col">s/n</th>
                      <th scope="col">Institute Name</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allInstitues.map((institute, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{institute.name}</td>
                        <td>
                          <div className="flex gap-3 items-center justify-center">
                            <button
                              onClick={() => viewInstitute(institute)}
                              className="hover:text-green_bg p-2 border-gray_bg bg-gray_bg rounded-sm"
                            >
                              <FaEye size="1.2rem" />
                            </button>
                            {user.superadmin && (
                              <button
                                className="p-2 border-gray_bg bg-gray_bg rounded-sm text-red-600"
                                onClick={() => deleteBtn(institute)}
                              >
                                <RiDeleteBinLine size="1.2rem" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
        <div className="relative w-full h-full">
          {deleteInstituteModal && (
            <DeleteInstituteModal
              setDeleteInstituteModal={setDeleteInstituteModal}
              modalInstitute={modalInstitute}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Institutes;
