import { useState, useContext, useCallback, useEffect } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaEye } from "react-icons/fa";
import AddTaskModal from "./AddTaskModal";
import DeleteTaskModal from "./DeleteTaskModal";
import { Context } from "../../../../context/Context";
import cloneDeep from "lodash/cloneDeep";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import { useNavigate } from "react-router-dom";

function Tasks({ tasks, instituteId, admin }) {
  //states
  const [taskModal, setTaskModal] = useState(false);
  const [deleteTaskModal, setDeleteTaskModal] = useState(false);
  const [task, setTask] = useState([]);
  const { user } = useContext(Context);
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  //pagination Data
  const countPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const [collection, setCollection] = useState(
    cloneDeep(tasks?.slice(0, countPerPage))
  );

  //search content
  const searchData = useCallback(
    (value) => {
      const query = value.toLowerCase();
      const data = cloneDeep(
        tasks
          .filter((item) => item.name.toLowerCase().indexOf(query) > -1)
          .slice(0, 2)
      );
      setCollection(data);
      console.log(data);
    },
    [tasks]
  );

  //updatePage Function
  const updatePage = useCallback(
    (p) => {
      setCurrentPage(p);
      const to = countPerPage * p;
      const from = to - countPerPage;
      setCollection(cloneDeep(tasks?.slice(from, to)));
    },
    [tasks]
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

  const deleteBtn = (task) => {
    setTask(task);
    setDeleteTaskModal(true);
  };

  const viewTask = (task) => {
    sessionStorage.setItem("taskId", task._id);
    navigate(`/admin/tasks/${task.name}`);
  };
  console.log(tasks);
  return (
    <div>
      <div className="all_heading my-3">
        {(user.superadmin || admin) && (
          <button className="btn_green my-2" onClick={() => setTaskModal(true)}>
            Add Tasks
          </button>
        )}
        {collection?.length > 0 && (
          <div>
            <input
              placeholder="Search Tasks"
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
                <th scope="col">Tasks</th>
                <th scope="col">Status</th>
                {(admin || user.superadmin) && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {collection.map((task, index) => (
                <tr key={index}>
                  <td data-label="s/n">{index + 1}</td>
                  <td data-label="Task">{task.name}</td>
                  <td data-label="Task">{task.status}</td>
                  <td data-label="Action">
                    <div className="flex gap-3 items-center md:justify-center justify-end">
                      <button
                        onClick={() => viewTask(task)}
                        className="hover:text-green_bg p-2 border-gray_bg bg-gray_bg rounded-sm"
                      >
                        <FaEye size="1.2rem" />
                      </button>
                      {user.superadmin && (
                        <button
                          className="text-red-500 p-2 border-gray_bg bg-gray_bg rounded-sm"
                          onClick={() => deleteBtn(task)}
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
          <div className="paginate my-4">
            <Pagination
              pageSize={countPerPage}
              onChange={updatePage}
              current={currentPage}
              total={tasks?.length}
            />
          </div>
        </div>
      ) : (
        <div>
          <p>No task</p>
        </div>
      )}
      <div className="relative w-full h-full">
        {taskModal && (
          <AddTaskModal setTaskModal={setTaskModal} instituteId={instituteId} />
        )}
      </div>
      <div className="relative w-full h-full">
        {deleteTaskModal && (
          <DeleteTaskModal
            setDeleteTaskModal={setDeleteTaskModal}
            instituteId={instituteId}
            task={task}
          />
        )}
      </div>
    </div>
  );
}

export default Tasks;
