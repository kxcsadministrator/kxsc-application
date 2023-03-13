import Topbar from "../../../component/admin/Topbar";
import Sidebar from "../../../component/admin/Sidebar";
import { Context } from "../../../context/Context";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaEye } from "react-icons/fa";

import DeleteCategory from "../../../component/admin/categories/DeleteCategory";

function Categories() {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [allCat, setAllCat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [deleteCatModal, setDeleteCatModal] = useState(false);
  const [deleteCat, setdeleteCat] = useState(false);

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      setError(false);

      try {
        const res = await axios.get("http://13.36.208.80:3002/categories/all", {
          headers: { Authorization: `Bearer ${user.jwt_token}` },
        });
        setLoading(false);
        setAllCat(res.data);
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
    setdeleteCat(cat);
    setDeleteCatModal(true);
  };
  const viewCat = (cat) => {
    sessionStorage.setItem("cat", cat.name);
    navigate(`/admin/category/${cat.name}`);
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
              {allCat?.length === 0 ? (
                <div>
                  <h1>No resource</h1>
                </div>
              ) : (
                <table className="bg-white rounded-md shadow-md">
                  <thead>
                    <tr>
                      <th scope="col">s/n</th>
                      <th scope="col">Categories</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allCat.map((cat, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{cat.name}</td>
                        <td>
                          <div className="flex gap-3 items-center justify-center">
                            <button
                              onClick={() => viewCat(cat)}
                              className="hover:text-green_bg p-2 border-gray_bg bg-gray_bg rounded-sm"
                            >
                              <FaEye size="1.2rem" />
                            </button>
                            <button
                              className="p-2 border-gray_bg bg-gray_bg rounded-sm text-red-600"
                              onClick={() => deleteBtn(cat)}
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
          {deleteCatModal && (
            <DeleteCategory
              setDeleteCatModal={setDeleteCatModal}
              deleteCat={deleteCat}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Categories;
