import { useState } from "react";
import AddTaskModal from "./AddTaskModal";
import DeleteTaskModal from "./DeleteTaskModal";

function Tasks({ tasks, instituteId }) {
  const [taskModal, setTaskModal] = useState(false);
  const [deleteTaskModal, setDeleteTaskModal] = useState(false);
  const [task, setTask] = useState([]);

  const deleteBtn = (task) => {
    setTask(task);
    setDeleteTaskModal(true);
  };
  return (
    <div>
      <button
        className="p-2 bg-[#52cb83] rounded-md w-44 text-white"
        onClick={() => setTaskModal(true)}
      >
        Add Tasks
      </button>
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
                    className="p-2 bg-[#d14949] rounded-md w-28 text-white"
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
