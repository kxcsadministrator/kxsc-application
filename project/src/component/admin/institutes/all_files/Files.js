import { useContext, useState } from "react";
import { Context } from "../../../../context/Context";
import { Link } from "react-router-dom";
import axios from "axios";
import AddFiles from "./AddFiles";
import DeleteFileModal from "./DeleteFileModal";
import fileDownload from "js-file-download";

function Files({ files, instituteId, admin }) {
  const { user } = useContext(Context);
  const [addFileModal, setAddFileModal] = useState(false);
  const [deleteFileModal, setDeleteFileModal] = useState(false);
  const [file, setFile] = useState();
  console.log(files);

  const deleteBtn = (file) => {
    setFile(file);
    setDeleteFileModal(true);
  };

  const downloadBtn = async (file) => {
    try {
      const res = await axios.get(
        `http://13.36.208.80:3001/institutes/download-file/${file._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.jwt_token}`,
          },
          responseType: "blob",
        }
      );
      fileDownload(res.data, `${file.original_name}`);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {(user.superadmin || admin) && (
        <button
          className="btn_green_h my-2"
          onClick={() => setAddFileModal(true)}
        >
          Add files
        </button>
      )}

      {files?.length ? (
        <table className="bg-white rounded-md shadow-md">
          <thead>
            <tr>
              <th scope="col">s/n</th>
              <th scope="col">Files</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{file.original_name}</td>
                <td>
                  <div class="flex gap-3 items-center">
                    <button
                      className="btn_green"
                      onClick={() => downloadBtn(file)}
                    >
                      Download
                    </button>
                    {(user.superadmin || admin) && (
                      <button
                        className="btn_red"
                        onClick={() => deleteBtn(file)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>
          <p>No files found</p>
        </div>
      )}
      <div className="relative w-full h-full">
        {addFileModal && (
          <AddFiles
            setAddFileModal={setAddFileModal}
            instituteId={instituteId}
          />
        )}
      </div>
      <div className="relative w-full h-full">
        {deleteFileModal && (
          <DeleteFileModal
            setDeleteFileModal={setDeleteFileModal}
            instituteId={instituteId}
            file={file}
          />
        )}
      </div>
    </div>
  );
}

export default Files;
