import { useContext } from "react";
import { Context } from "../../../../context/Context";

function Files(files) {
  const { user } = useContext(Context);
  return (
    <div>
      {user.superadmin && (
        <button className="p-2 bg-[#52cb83] rounded-md w-44 text-white">
          Add files
        </button>
      )}

      {files?.length ? (
        <table className="bg-white rounded-md shadow-md">
          <thead>
            <tr>
              <th scope="col">s/n</th>
              <th scope="col">Files</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{file}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>
          <p>No files found</p>
        </div>
      )}
    </div>
  );
}

export default Files;
