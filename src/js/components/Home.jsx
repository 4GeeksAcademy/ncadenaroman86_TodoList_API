import React, { useState, useEffect } from "react";
import "../../styles/style.css";

const BASE = "https://playground.4geeks.com/todo";
const USER = "ncadenaroman86";

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  // Load user and tasks
  const loadTasks = async () => {
    try {
      let res = await fetch(`${BASE}/users/${USER}`);
      if (!res.ok) {
        res = await fetch(`${BASE}/users/${USER}`, { method: "POST" });
      }
      const data = await res.json();
      setTasks(data.todos || []);
    } catch (err) {
      console.error("Load error:", err);
    }
  };

  // Add task
  const addTask = async () => {
    if (!input.trim()) return;
    await fetch(`${BASE}/todos/${USER}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: input.trim(), is_done: false }),
    });
    setInput("");
    loadTasks();
  };

  // Update task
  const updateTask = async () => {
    if (!editText.trim()) return;
    await fetch(`${BASE}/todos/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: editText.trim(), is_done: false }),
    });
    setEditId(null);
    setEditText("");
    loadTasks();
  };

  // Delete task
  const deleteTask = async (id) => {
    await fetch(`${BASE}/todos/${id}`, { method: "DELETE" });
    loadTasks();
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="todo-container">
      <h1 className="title">Todo List (CRUD)</h1>

      <div className="input-row">
        <input
          className="task-input"
          placeholder="Add a new task"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button className="add-button" onClick={addTask}>Add</button>
      </div>

      <ul className="task-list">
        {tasks.length === 0 ? (
          <li className="no-tasks">No tasks yet</li>
        ) : (
          tasks.map((task) => (
            <li key={task.id} className="task-item">
              {editId === task.id ? (
                <>
                  <input
                    className="task-input"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && updateTask()}
                  />
                  <button className="add-button" onClick={updateTask}>Save</button>
                </>
              ) : (
                <>
                  {task.label}
                  <button
                    className="edit-button"
                    onClick={() => {
                      setEditId(task.id);
                      setEditText(task.label);
                    }}
                  >
                    ✎
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => deleteTask(task.id)}
                  >
                    ✖
                  </button>
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
