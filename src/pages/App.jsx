import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const LOCAL_STORAGE_KEY = "todoListData";

const defaultTasks = {
  todo: [],
  inProgress: [],
  done: [],
};

const App = () => {
  const [tasks, setTasks] = useState(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : defaultTasks;
  });

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("todo");
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    if (sourceCol === destCol) {
      const newTasks = [...tasks[sourceCol]];
      const [movedTask] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, movedTask);
      setTasks({ ...tasks, [sourceCol]: newTasks });
    } else {
      const sourceTasks = [...tasks[sourceCol]];
      const destTasks = [...tasks[destCol]];
      const [movedTask] = sourceTasks.splice(source.index, 1);
      destTasks.splice(destination.index, 0, movedTask);
      setTasks({ ...tasks, [sourceCol]: sourceTasks, [destCol]: destTasks });
    }
  };

  const addTask = () => {
    if (!newTitle.trim() || newTitle.length > 50) return;
    const newId = Date.now().toString();
    const timestamp = new Date().toLocaleString();
    const updatedTasks = {
      ...tasks,
      [selectedCategory]: [
        ...tasks[selectedCategory],
        { id: newId, title: newTitle, description: newDescription, timestamp },
      ],
    };
    setTasks(updatedTasks);
    setNewTitle("");
    setNewDescription("");
  };

  const editTask = (taskId, columnId, newTitle, newDescription) => {
    const updatedColumn = tasks[columnId].map((task) =>
      task.id === taskId
        ? { ...task, title: newTitle, description: newDescription }
        : task,
    );
    setTasks({ ...tasks, [columnId]: updatedColumn });
    setEditingTask(null);
  };

  const deleteTask = (taskId, columnId) => {
    const updatedColumn = tasks[columnId].filter((task) => task.id !== taskId);
    setTasks({ ...tasks, [columnId]: updatedColumn });
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 p-10 dark:bg-gray-900">
      <div className="mb-6 flex gap-3">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Task title (max 50 chars)"
          maxLength={50}
          className="w-64 rounded-md border p-2 dark:border-gray-700 dark:bg-black"
        />
        <input
          type="text"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Task description (max 200 chars)"
          maxLength={200}
          className="w-64 rounded-md border p-2 dark:border-gray-700 dark:bg-black"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-md border p-2 dark:border-gray-700 dark:bg-black"
        >
          <option value="todo">Todo</option>
          <option value="inProgress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button
          onClick={addTask}
          className="rounded-md bg-black px-4 py-2 font-semibold text-white dark:bg-white dark:text-black"
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
                  className="flex min-h-[300px] flex-col rounded-lg bg-white p-4 shadow-md dark:bg-black"
                >
                  <h2 className="mb-4 text-lg font-semibold">
                    {columnId === "todo"
                      ? "📝 Todo"
                      : columnId === "inProgress"
                        ? "🚀 In Progress"
                        : "✅ Done"}
                  </h2>

                  {columnTasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
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
                            value={task.title}
                            onChange={(e) =>
                              editTask(
                                task.id,
                                columnId,
                                e.target.value,
                                task.description,
                              )
                            }
                            className="border-none bg-transparent font-bold focus:ring-0"
                          />
                          <textarea
                            value={task.description}
                            onChange={(e) =>
                              editTask(
                                task.id,
                                columnId,
                                task.title,
                                e.target.value,
                              )
                            }
                            className="border-none bg-transparent text-sm text-gray-600 focus:ring-0"
                          />
                          <span className="text-xs text-gray-400">
                            {task.timestamp}
                          </span>
                          <button
                            onClick={() => deleteTask(task.id, columnId)}
                            className="mt-2 rounded-md bg-black px-2 py-2 text-xs font-semibold text-white dark:bg-white dark:text-black"
                          >
                            Delete
                          </button>
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
