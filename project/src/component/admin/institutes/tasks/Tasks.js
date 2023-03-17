import { useContext, useState } from "react";
import AddTaskModal from "./AddTaskModal";
import DeleteTaskModal from "./DeleteTaskModal";
import { Context } from "../../../../context/Context";

function Tasks({ tasks, instituteId, admin }) {
  const [taskModal, setTaskModal] = useState(false);
  const [deleteTaskModal, setDeleteTaskModal] = useState(false);
  const [task, setTask] = useState([]);
  const { user } = useContext(Context);

  const deleteBtn = (task) => {
    setTask(task);
    setDeleteTaskModal(true);
  };
  return (
    <div>
      {(user.superadmin || admin) && (
        <button
          className="p-2 my-2 bg-[#52cb83] rounded-md w-44 text-white"
          onClick={() => setTaskModal(true)}
        >
          Add Tasks
        </button>
      )}

      {tasks?.length ? (
        <table className="bg-white rounded-md shadow-md">
          <thead>
            <tr>
              <th scope="col">s/n</th>
              <th scope="col">Members</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{task.name}</td>
                <td>
                  <button
                    className="p-2 bg-[#d14949] rounded-md  lg:w-28 w-[70%] text-white"
                    onClick={() => deleteBtn(task)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
