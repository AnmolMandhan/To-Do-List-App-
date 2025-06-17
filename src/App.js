import React, { useState, useEffect } from "react";
import "./App.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("All");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (text.trim() === "") return;

    if (editId !== null) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editId ? { ...task, text, priority, dueDate } : task
        )
      );
      setEditId(null);
    } else {
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          text,
          completed: false,
          priority,
          dueDate,
        },
      ]);
    }

    setText("");
    setPriority("Medium");
    setDueDate("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const editTask = (task) => {
    setText(task.text);
    setPriority(task.priority);
    setDueDate(task.dueDate);
    setEditId(task.id);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") return true;
    return filter === "Completed" ? task.completed : !task.completed;
  });

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(filteredTasks);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);

    // update main list
    const reorderedFull = tasks.filter((task) =>
      filteredTasks.includes(task)
    );
    const newList = tasks.map((task) => {
      const index = filteredTasks.findIndex((t) => t.id === task.id);
      return index !== -1 ? items[index] : task;
    });

    setTasks(newList);
  };

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <h1>📝 My To-Do List</h1>

      <div className="theme-toggle">
        <label>
          <input
            type="checkbox"
            onChange={() => setDarkMode(!darkMode)}
            checked={darkMode}
          />
          Dark Mode
        </label>
      </div>

      <div className="input-group">
        <input
          type="text"
          placeholder="Enter a task..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="input-group-row">
          <label>Priority:</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>

        <div className="input-group-row">
          <label>Due Date:</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <button onClick={addTask}>{editId ? "Update" : "Add"}</button>
      </div>

      <div className="filter-buttons">
        {["All", "Completed", "Pending"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={filter === f ? "active" : ""}
          >
            {f}
          </button>
        ))}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul
              className="task-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {filteredTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <li
                      className={task.completed ? "done" : ""}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div>
                        <strong>{task.text}</strong> <br />
                        <span className={`priority ${task.priority.toLowerCase()}`}>
                          {task.priority}
                        </span>{" "}
                        | Due: {task.dueDate || "N/A"}
                      </div>
                      <div className="actions">
                        <button onClick={() => toggleComplete(task.id)}>✔️</button>
                        <button onClick={() => editTask(task)}>✏️</button>
                        <button onClick={() => deleteTask(task.id)}>🗑️</button>
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default App;
