import React from "react";

function TodoItem({ task, toggleTask, deleteTask }) {
  return (
    <li style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "8px",
      textDecoration: task.completed ? "line-through" : "none"
    }}>
      <span onClick={() => toggleTask(task.id)} style={{ cursor: "pointer" }}>
        {task.text}
      </span>
      <button onClick={() => deleteTask(task.id)} style={{
        background: "transparent",
        border: "none",
        color: "red",
        cursor: "pointer"
      }}>
        ❌
      </button>
    </li>
  );
}

export default TodoItem;