import React from "react";

export default function TodoItem({ task, toggleComplete, deleteTask }) {
  return (
    <div className={`todo-item ${task.completed ? "done" : ""}`}>
      <span onClick={() => toggleComplete(task.id)}>{task.text}</span>
      <button onClick={() => deleteTask(task.id)}>❌</button>
    </div>
  );
}

