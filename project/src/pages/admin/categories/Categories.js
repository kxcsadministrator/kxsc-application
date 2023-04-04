import Topbar from "../../../component/admin/Topbar";
import Sidebar from "../../../component/admin/Sidebar";
import { Context } from "../../../context/Context";
import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
import DeleteCategory from "../../../component/admin/categories/DeleteCategory";
import cloneDeep from "lodash/cloneDeep";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";

function Categories() {
  //states
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const [allCat, setAllCat] = useState([]);
  const [states, setStates] = useState({
    loading: false,
    error: false,
    errMsg: "",
  });
  const [deleteCatModal, setDeleteCatModal] = useState(false);
  const [deleteCat, setdeleteCat] = useState(false);
  const [value, setValue] = useState("");

  //get categories
  useEffect(() => {
    const getCategories = async () => {
      setStates({ loading: true, error: false });

      try {
        const res = await axios.get(`http://13.36.208.34:3002/categories/all`, {
          headers: { Authorization: `Bearer ${user.jwt_token}` },
        });
        setStates({ loading: false, error: false });
        setAllCat(res.data);
        console.log(res.data);
      } catch (err) {
        setStates({
          loading: false,
          err: true,
          errMsg: err.response.data.message,
        });
      }
    };
    getCategories();
  }, [user.jwt_token]);

  //pagination Data
  const countPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const [collection, setCollection] = useState(
    cloneDeep(allCat.slice(0, countPerPage))
  );

  const searchData = useCallback(
    (value) => {
      const query = value.toLowerCase();
      const data = cloneDeep(
        allCat
          .filter((item) => item.name.toLowerCase().indexOf(query) > -1)
          .slice(0, 2)
      );
      setCollection(data);
      console.log(data);
    },
    [allCat]
  );

  //updatePage Function
  const updatePage = useCallback(
    (p) => {
      setCurrentPage(p);
      const to = countPerPage * p;
      const from = to - countPerPage;
      setCollection(cloneDeep(allCat.slice(from, to)));
    },
    [allCat]
  );

  //useEffect Search
  useEffect(() => {
    if (!value) {
      updatePage(1);
    } else {
      setCurrentPage(1);
      searchData(value);
    }
  }, [value, updatePage, searchData]);

  //delete category
  const deleteBtn = (cat) => {
    setdeleteCat(cat);
    setDeleteCatModal(true);
  };

  //view category
  const viewCat = (cat) => {
    sessionStorage.setItem("catId", cat._id);
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
          {states.loading ? (
            <div>
              <h1>Loading</h1>
            </div>
          ) : states.error ? (
            <div>{states.errMsg}</div>
          ) : (
            <div className="flex flex-col gap-8">
              <div className="all_heading">
                <h1>All Category</h1>
                <div>
                  <input
                    placeholder="Search Resources"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                </div>
              </div>
              {collection.length > 0 ? (
                <div>
                  {collection?.map((cat, index) => (
                    <div className="grid gap-6" key={index}>
                      <div className="flex flex-col ">
                        <p className="text-base font-bold text-[#1f1f1f]">
                          {cat.name}
                        </p>
                        {cat?.sub_categories.map((sub, index) => (
                          <p className="text-sm -mt-3" key={index}>
                            {sub}
                          </p>
                        ))}

                        <p className="flex gap-1 items-center -mt-1">
                          <button
                            onClick={() => viewCat(cat)}
                            className="hover:text-green_bg px-2 py-1 border-gray_bg bg-[#e9e9e9] rounded-sm "
                          >
                            <FaEye />
                          </button>
                          {user.superadmin && (
                            <button
                              className="px-2 p-1 border-gray_bg bg-[#ffcbcb] rounded-sm text-red-600"
                              onClick={() => deleteBtn(cat)}
                            >
                              <RiDeleteBinLine />
                            </button>
                          )}
                        </p>
                      </div>
                      <div className="h-[1.5px] w-full bg-[#cecece] mb-3" />
                    </div>
                  ))}
                  <div className="paginate my-4">
                    <Pagination
                      pageSize={countPerPage}
                      onChange={updatePage}
                      current={currentPage}
                      total={allCat.length}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <p>No Category</p>
                </div>
              )}
            </div>
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
