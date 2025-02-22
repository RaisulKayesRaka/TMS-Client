import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { MdDragHandle } from "react-icons/md";
import useAuth from "../hooks/useAuth";

const API_URL = "https://tms-server-lyart.vercel.app/tasks";

const App = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], done: [] });
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todo");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await fetch(`${API_URL}?email=${user?.email}`);
    const data = await response.json();
    const categorizedTasks = { todo: [], inProgress: [], done: [] };
    data.forEach((task) => {
      categorizedTasks[task.category].push(task);
    });
    setTasks(categorizedTasks);
  };

  const addTask = async () => {
    if (!newTitle.trim() || newTitle.length > 50) return;
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        description: newDescription,
        category: selectedCategory,
        timestamp: new Date().toLocaleString(),
        email: user?.email,
      }),
    });
    if (response.ok) fetchTasks();
    setNewTitle("");
    setNewDescription("");
  };

  const updateTask = async (taskId, newTitle, newDescription, category) => {
    await fetch(`${API_URL}/${taskId}?email=${user?.email}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        description: newDescription,
        category,
      }),
    });
    fetchTasks();
  };

  const deleteTask = async (taskId) => {
    await fetch(`${API_URL}/${taskId}?email=${user?.email}`, {
      method: "DELETE",
    });
    fetchTasks();
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCategory = source.droppableId;
    const destinationCategory = destination.droppableId;

    if (sourceCategory === destinationCategory) {
      const reorderedTasks = Array.from(tasks[sourceCategory]);
      const [movedTask] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, movedTask);
      setTasks((prev) => ({ ...prev, [sourceCategory]: reorderedTasks }));
    } else {
      const sourceTasks = Array.from(tasks[sourceCategory]);
      const destinationTasks = Array.from(tasks[destinationCategory]);
      const [movedTask] = sourceTasks.splice(source.index, 1);
      destinationTasks.splice(destination.index, 0, movedTask);
      setTasks((prev) => ({
        ...prev,
        [sourceCategory]: sourceTasks,
        [destinationCategory]: destinationTasks,
      }));
      await updateTask(
        movedTask._id,
        movedTask.title,
        movedTask.description,
        destinationCategory,
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 p-10 dark:bg-gray-900">
      <h1 className="mb-6 text-3xl font-bold text-black dark:text-white">
        📝 Drag & Drop Todo List
      </h1>
      <div className="mb-6 flex gap-3">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Task title (max 50 chars)"
          maxLength={50}
          className="w-64 rounded-md border p-2 dark:bg-gray-800 dark:text-white"
        />
        <input
          type="text"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Task description (max 200 chars)"
          maxLength={200}
          className="w-64 rounded-md border p-2 dark:bg-gray-800 dark:text-white"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-md border p-2 dark:bg-gray-800 dark:text-white"
        >
          <option value="todo">Todo</option>
          <option value="inProgress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button
          onClick={addTask}
          className="rounded-md bg-blue-500 px-4 py-2 text-white"
        >
          Add
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid w-full max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {Object.entries(tasks).map(([columnId, columnTasks]) => (
            <Droppable key={columnId} droppableId={columnId}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex min-h-[300px] flex-col rounded-lg bg-white p-4 shadow-md dark:bg-gray-800"
                >
                  <h2 className="mb-4 text-lg font-semibold text-black dark:text-white">
                    {columnId === "todo"
                      ? "📝 Todo"
                      : columnId === "inProgress"
                        ? "🚀 In Progress"
                        : "✅ Done"}
                  </h2>
                  {columnTasks.map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mb-2 flex cursor-pointer flex-col rounded-md bg-gray-200 p-3 shadow-sm dark:bg-gray-700"
                        >
                          <input
                            type="text"
                            value={task?.title}
                            onChange={(e) =>
                              updateTask(
                                task._id,
                                e.target.value,
                                task.description,
                                columnId,
                              )
                            }
                            className="border-none bg-transparent font-bold focus:ring-0 dark:text-white"
                          />
                          <textarea
                            value={task?.description}
                            onChange={(e) =>
                              updateTask(
                                task._id,
                                task.title,
                                e.target.value,
                                columnId,
                              )
                            }
                            className="border-none bg-transparent text-sm text-gray-600 focus:ring-0 dark:text-gray-300"
                          />
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {task?.timestamp}
                          </span>
                          <button
                            onClick={() => deleteTask(task._id)}
                            className="mt-2 rounded-md bg-red-500 px-2 py-2 text-xs text-white"
                          >
                            Delete
                          </button>
                          <div className="mt-2 flex items-center justify-center">
                            <MdDragHandle />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default App;
