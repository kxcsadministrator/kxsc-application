import { useContext, useState, useEffect, useCallback } from "react";
import { Context } from "../../../../context/Context";
import axios from "axios";
import fileDownload from "js-file-download";
import cloneDeep from "lodash/cloneDeep";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import AddFiles from "./AddFiles";
import API_URL from "../../../../Url";
import DeleteFile from "./DeleteFile";

function Files({ files, admin }) {
  //states
  const { user } = useContext(Context);
  const [addFileModal, setAddFileModal] = useState(false);
  // const [taskFile, setTaskFile] = useState("");
  // const [deleteFileModal, setDeleteFileModal] = useState(false);
  const [value, setValue] = useState("");
  const id = sessionStorage.getItem("taskId");

  //pagination Data
  const countPerPage = 50;
  const [currentPage, setCurrentPage] = useState(1);
  const [collection, setCollection] = useState(
    cloneDeep(files?.slice(0, countPerPage))
  );

  //search content
  const searchData = useCallback(
    (value) => {
      const query = value.toLowerCase();
      const data = cloneDeep(
        files
          .filter(
            (item) => item.original_name.toLowerCase().indexOf(query) > -1
          )
          .slice(0, 2)
      );
      setCollection(data);
      console.log(data);
    },
    [files]
  );

  //updatePage Function
  const updatePage = useCallback(
    (p) => {
      setCurrentPage(p);
      const to = countPerPage * p;
      const from = to - countPerPage;
      setCollection(cloneDeep(files?.slice(from, to)));
    },
    [files]
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

  //download files
  const downloadBtn = async (file) => {
    try {
      const res = await axios.get(
        `${API_URL.institute}/tasks/${id}/download-file/${file._id}`,
        {
          headers: { Authorization: `Bearer ${user.jwt_token}` },
          responseType: "blob",
        }
      );
      fileDownload(res.data, `${file.original_name}`);
    } catch (err) {}
  };

  // const deleteTaskFile = (file) => {

  //   setTaskFile(file);
  //   setDeleteFileModal(true);
  // };

  return (
    <div>
      <div className="all_heading my-3">
        {(user.superadmin || admin) && (
          <button
            className="btn_green_h my-2"
            onClick={() => setAddFileModal(true)}
          >
            Add files
          </button>
        )}
        {collection?.length > 0 && (
          <div>
            <input
              placeholder="Search Files"
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
                <th scope="col">Files</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {collection.map((file, index) => (
                <tr key={index}>
                  <td data-label="s/n">{index + 1}</td>
                  <td data-label="File-name">{file.original_name}</td>
                  <td data-label="Action">
                    <div class="flex gap-3 items-center justify-end md:justify-center">
                      <button
                        className="btn_green"
                        onClick={() => downloadBtn(file)}
                      >
                        Download
                      </button>
                      {/* {(user.superadmin || admin) && (
                        <button
                          className="btn_red"
                          onClick={() => deleteTaskFile(file)}
                        >
                          Delete
                        </button>
                      )} */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="paginate my-4">
            <Pagination
              pageSize={countPerPage}
              onChange={updatePage}
              current={currentPage}
              total={files?.length}
            />
          </div>
        </div>
      ) : (
        <div>
          <p>No files found</p>
        </div>
      )}
      <div>
        {addFileModal && <AddFiles setAddFileModal={setAddFileModal} />}
        {/* {deleteFileModal && (
          <DeleteFile setDeleteFileModal={setDeleteFileModal} file={taskFile} />
        )} */}
      </div>
    </div>
  );
}

export default Files;
