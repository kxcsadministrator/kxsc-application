import Topbar from "../../../component/admin/Topbar";
import Sidebar from "../../../component/admin/Sidebar";
import { Context } from "../../../context/Context";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RiDeleteBinLine } from "react-icons/ri";
import SubCatModal from "../../../component/admin/categories/SubCatModal";
function Category() {
  const cat = sessionStorage.getItem("cat");
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [allSubCat, setAllSubCat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [subCatModal, setSubCatModal] = useState(false);
  const [deleteSubCat, setdeleteSubCat] = useState(false);

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      setError(false);

      try {
        const res = await axios.get(
          `http://13.36.208.80:3002/categories/subs?name=${cat}`,
          {
            headers: { Authorization: `Bearer ${user.jwt_token}` },
          }
        );
        setLoading(false);
        setAllSubCat(res.data);
        console.log(res.data);
      } catch (err) {
        setLoading(false);
        setError(true);
        setErrMsg(err.response.data.message);
        console.log(err);
      }
    };
    getCategories();
  }, [user.jwt_token]);

  const deleteBtn = (cat) => {
    setdeleteSubCat(cat);
    setSubCatModal(true);
  };

  return (
    <div className="max-w-[1560px] mx-auto flex min-h-screen w-full bg-gray_bg">
      <div className="sidebar_content">
        <Sidebar />
      </div>
      <div className="main_content">
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
              {allSubCat?.length === 0 ? (
                <div>
                  <h1>No SubCat</h1>
                </div>
              ) : (
                <table className="bg-white rounded-md shadow-md">
                  <thead>
                    <tr>
                      <th scope="col">s/n</th>
                      <th scope="col">Sub-Categories</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allSubCat.map((subCat, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{subCat}</td>
                        <td>
                          <div className="flex gap-3 items-center justify-center">
                            <button
                              className="p-2 border-gray_bg bg-gray_bg rounded-sm text-red-600"
                              onClick={() => deleteBtn(subCat)}
                            >
                              <RiDeleteBinLine size="1.2rem" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
        <div>
          {subCatModal && (
            <SubCatModal
              setSubCatModal={setSubCatModal}
              deleteSubCat={deleteSubCat}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Category;
