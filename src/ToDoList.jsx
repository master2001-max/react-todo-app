import React, { useState, useEffect, useRef } from "react";
import { FiTrash2, FiArrowUp, FiArrowDown, FiPlus, FiEdit2, FiCheck } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function ToDoList() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved
      ? JSON.parse(saved)
      : [
          { text: "Eat Breakfast", completed: false },
          { text: "Take a shower", completed: false },
          { text: "Walk the dog", completed: false },
        ];
  });

  const [newTask, setNewTask] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const editInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editIndex]);

  function addTask() {
    if (newTask.trim() === "") return;
    setTasks([...tasks, { text: newTask.trim(), completed: false }]);
    setNewTask("");
  }

  function deleteTask(i) {
    setTasks(tasks.filter((_, index) => index !== i));
  }

  function toggleComplete(i) {
    const updated = [...tasks];
    updated[i].completed = !updated[i].completed;
    setTasks(updated);
  }

  function moveUp(i) {
    if (i === 0) return;
    const updated = [...tasks];
    [updated[i - 1], updated[i]] = [updated[i], updated[i - 1]];
    setTasks(updated);
  }

  function moveDown(i) {
    if (i === tasks.length - 1) return;
    const updated = [...tasks];
    [updated[i + 1], updated[i]] = [updated[i], updated[i + 1]];
    setTasks(updated);
  }

  function startEditing(i) {
    setEditIndex(i);
    setEditText(tasks[i].text);
  }

  function saveEdit(i) {
    if (editText.trim() === "") return;
    const updated = [...tasks];
    updated[i].text = editText.trim();
    setTasks(updated);
    setEditIndex(null);
    setEditText("");
  }

  function cancelEdit() {
    setEditIndex(null);
    setEditText("");
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-600 via-purple-700 to-pink-600 p-6 flex items-center justify-center">
      <div className="bg-white/30 backdrop-blur-md rounded-3xl shadow-lg w-full max-w-lg p-6">
        <h1 className="text-4xl font-extrabold text-white text-center mb-6 drop-shadow-lg">
          ⚡ TaskWave
        </h1>

        {/* Input */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="What’s next?"
            className="flex-grow p-3 rounded-xl border border-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-900"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <button
            onClick={addTask}
            aria-label="Add task"
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-5 flex items-center justify-center transition"
          >
            <FiPlus size={24} />
          </button>
        </div>

        {/* Task List */}
        <ul className="space-y-4 max-h-[60vh] overflow-y-auto">
          <AnimatePresence>
            {tasks.map((task, i) => (
              <motion.li
                key={task.text + i}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                className={`bg-white/80 rounded-xl shadow p-4 flex items-center justify-between ${
                  task.completed ? "line-through text-gray-400" : "text-gray-900"
                }`}
              >
                <div className="flex items-center gap-4 flex-grow min-w-0">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(i)}
                    className="w-5 h-5 text-purple-600 rounded"
                  />

                  {editIndex === i ? (
                    <input
                      ref={editInputRef}
                      className="flex-grow border-b border-purple-600 focus:outline-none focus:ring-1 focus:ring-purple-400"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(i);
                        if (e.key === "Escape") cancelEdit();
                      }}
                    />
                  ) : (
                    <span
                      onDoubleClick={() => startEditing(i)}
                      className="truncate cursor-pointer select-none"
                      title="Double click to edit"
                    >
                      {task.text}
                    </span>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-2 ml-4">
                  {editIndex === i ? (
                    <>
                      <button
                        onClick={() => saveEdit(i)}
                        aria-label="Save edit"
                        className="text-green-600 hover:text-green-800"
                      >
                        <FiCheck size={20} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        aria-label="Cancel edit"
                        className="text-red-600 hover:text-red-800"
                      >
                        ✖️
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(i)}
                        aria-label="Edit task"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEdit2 size={20} />
                      </button>
                      <button
                        onClick={() => moveUp(i)}
                        aria-label="Move up"
                        disabled={i === 0}
                        className={`text-purple-600 hover:text-purple-800 ${
                          i === 0 ? "opacity-30 cursor-not-allowed" : ""
                        }`}
                      >
                        <FiArrowUp size={20} />
                      </button>
                      <button
                        onClick={() => moveDown(i)}
                        aria-label="Move down"
                        disabled={i === tasks.length - 1}
                        className={`text-purple-600 hover:text-purple-800 ${
                          i === tasks.length - 1 ? "opacity-30 cursor-not-allowed" : ""
                        }`}
                      >
                        <FiArrowDown size={20} />
                      </button>
                      <button
                        onClick={() => deleteTask(i)}
                        aria-label="Delete task"
                        className="text-red-600 hover:text-red-800"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </>
                  )}
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {tasks.length === 0 && (
          <p className="mt-6 text-center text-white/80 select-none">
            No tasks yet. Add something awesome!
          </p>
        )}
      </div>
    </div>
  );
}
