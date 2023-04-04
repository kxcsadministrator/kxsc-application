import Topbar from "../../../component/admin/Topbar";
import Sidebar from "../../../component/admin/Sidebar";
import { Context } from "../../../context/Context";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RiDeleteBinLine } from "react-icons/ri";
import SubCatModal from "../../../component/admin/categories/SubCatModal";
import { FaRegEdit } from "react-icons/fa";
import AddSubCat from "../../../component/admin/categories/AddSubCat";
import EditCatModal from "../../../component/admin/categories/EditCatModal";
function Category() {
  //states
  const catId = sessionStorage.getItem("catId");
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
  });
  const [subCatModal, setSubCatModal] = useState(false);
  const [deleteSubCat, setdeleteSubCat] = useState(false);
  const [addSubCatModal, setAddSubCatModal] = useState(false);
  const [editCatModal, setEditCatModal] = useState(false);

  //get categories
  useEffect(() => {
    const getCategory = async () => {
      setStates({ loading: true, error: false });

      try {
        const res = await axios.get(
          `http://13.36.208.34:3002/categories/category/${catId}`,
          {
            headers: { Authorization: `Bearer ${user.jwt_token}` },
          }
        );
        setStates({ loading: false, error: false });
        setCategory(res.data);
      } catch (err) {
        setStates({
          loading: false,
          err: true,
          errMsg: err.response.data.message,
        });
      }
    };
    getCategory();
  }, [catId, user.jwt_token]);

  const deleteBtn = (sub) => {
    setdeleteSubCat(sub);
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
          {states.loading ? (
            <div>
              <p>Loading</p>
            </div>
          ) : (
            <>
              {category?.length === 0 ? (
                <div>
                  <h1>No SubCat</h1>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div>
                    <h4 className="text-gray-500">Category Name:</h4>
                    <div className="flex gap-4 items-center">
                      <p className="text-lg font-bold">{category.name}</p>
                      <button
                        className="p-2 border-gray_bg bg-gray-600 text-white rounded-sm -mt-2"
                        onClick={() => setEditCatModal(true)}
                      >
                        <FaRegEdit />
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="flex gap-4 items-center">
                      <h4 className="text-gray-500">sub_categories:</h4>
                      <button
                        className="btn_green lg:w-20"
                        onClick={() => setAddSubCatModal(true)}
                      >
                        Add
                      </button>
                    </div>
                    {category.sub_categories.map((sub, index) => (
                      <div className="flex gap-4 items-center" key={index}>
                        <p className="text-lg font-bold">{sub}</p>
                        <button
                          className="p-2 border-gray_bg bg-gray-200 text-red-500 rounded-sm -mt-2"
                          onClick={() => deleteBtn(sub)}
                        >
                          <RiDeleteBinLine />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div>
          {subCatModal && (
            <SubCatModal
              setSubCatModal={setSubCatModal}
              deleteSubCat={deleteSubCat}
              category={category}
            />
          )}
        </div>
        <div>
          {addSubCatModal && (
            <AddSubCat
              setAddSubCatModal={setAddSubCatModal}
              category={category}
            />
          )}
        </div>
        <div>
          {editCatModal && (
            <EditCatModal
              setEditCatModal={setEditCatModal}
              category={category}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Category;
