import React, { useState, useEffect } from "react";
import "../../styles/style.css";

const BASE = "https://playground.4geeks.com/todo";
const USER = "ncadenaroman86"; // 👈 Your account

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Load or create user
  const loadUser = async () => {
    try {
      const res = await fetch(`${BASE}/users/${USER}`);
      if (!res.ok) {
        const created = await fetch(`${BASE}/users/${USER}`, { method: "POST" }).then(r => r.json());
        setTasks(created.todos ?? []);
        return;
      }
      const data = await res.json();
      setTasks(data.todos);
    } catch (err) {
      console.error("Error loading user:", err);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // Add new task
  const addTask = async (e) => {
    if (e.key !== "Enter" || !newTask.trim()) return;
    try {
      await fetch(`${BASE}/todos/${USER}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newTask.trim(), is_done: false }),
      });
      setNewTask("");
      loadUser();
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await fetch(`${BASE}/todos/${id}`, { method: "DELETE" });
      loadUser();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div className="todo-container">
      <h1 className="title">To-do List</h1>
      <input
        type="text"
        placeholder="Add a task and press Enter"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        onKeyDown={addTask}
        className="task-input"
      />
      <ul className="task-list">
        {tasks.length === 0 ? (
          <li className="no-tasks">No tasks – add one!</li>
        ) : (
          tasks.map((task) => (
            <li key={task.id} className="task-item">
              {task.label}
              <button
                className="delete-button"
                onClick={() => deleteTask(task.id)}
              >
                ✖
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
