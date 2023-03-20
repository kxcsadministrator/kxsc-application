import { useContext, useState } from "react";
import { Context } from "../../../../../context/Context";
import axios from "axios";
import AddResourceFile from "./AddResourceFile";
import DeleteResourceFiles from "./DeleteResourceFiles";
import fileDownload from "js-file-download";

function ResourceFiles({ resource }) {
  const { user } = useContext(Context);
  const [addFileModal, setAddFileModal] = useState(false);
  const [deleteFileModal, setDeleteFileModal] = useState(false);
  const [file, setFile] = useState();

  const deleteBtn = (file) => {
    setFile(file);
    setDeleteFileModal(true);
  };

  const downloadBtn = async (file) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_PORT}:3002/resources/download-file/${file._id}`,
        {
          headers: { Authorization: `Bearer ${user.jwt_token}` },
          responseType: "blob",
        }
      );
      fileDownload(res.data, `${file.original_name}`);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  console.log(file);

  return (
    <div>
      {(user.superadmin || user.id === resource.author._id) && (
        <button
          className="p-2 my-2 bg-[#52cb83] rounded-md w-44 text-white"
          onClick={() => setAddFileModal(true)}
        >
          Add files
        </button>
      )}
      {resource?.files?.length ? (
        <table className="bg-white rounded-md shadow-md">
          <thead>
            <tr>
              <th scope="col">s/n</th>
              <th scope="col">Files</th>
            </tr>
          </thead>
          <tbody>
            {resource.files.map((file, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{file.original_name}</td>
                <td>
                  <div className="flex gap-3 items-center">
                    <button
                      className="btn_green"
                      onClick={() => downloadBtn(file)}
                    >
                      Download
                    </button>
                    {user.superadmin && (
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
        {deleteFileModal && (
          <DeleteResourceFiles
            setDeleteFileModal={setDeleteFileModal}
            resource={resource}
            file={file}
          />
        )}
      </div>
      <div className="relative w-full h-full">
        {addFileModal && (
          <AddResourceFile
            setAddFileModal={setAddFileModal}
            resourceId={resource.id}
          />
        )}
      </div>
    </div>
  );
}

export default ResourceFiles;
