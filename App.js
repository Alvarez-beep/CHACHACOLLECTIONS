import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  // Initialize tasks state directly from localStorage
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem("tasks"); // Retrieve tasks from localStorage
    return storedTasks ? JSON.parse(storedTasks) : []; // Parse JSON if available, else return empty array
  });

  const [deletedTasks, setDeletedTasks] = useState([]); // Stores deleted tasks
  const [inputValue, setInputValue] = useState(""); // Stores input value for new tasks
  const [showCompleted, setShowCompleted] = useState(false); // Toggles visibility of completed tasks
  const [showDeleted, setShowDeleted] = useState(false); // Toggles visibility of deleted tasks

  // Load deletedTasks from localStorage on initial render
  useEffect(() => {
    const loadDeletedTasks = () => {
      try {
        const storedDeletedTasks = JSON.parse(localStorage.getItem("deletedTasks")) || [];
        setDeletedTasks(storedDeletedTasks);
      } catch (error) {
        console.error("Error loading deletedTasks from localStorage:", error);
      }
    };
    loadDeletedTasks();
  }, []);

  // Save tasks and deleted tasks to localStorage whenever they change
  useEffect(() => {
    const saveTasks = () => {
      try {
        localStorage.setItem("tasks", JSON.stringify(tasks));
        localStorage.setItem("deletedTasks", JSON.stringify(deletedTasks));
      } catch (error) {
        console.error("Error saving tasks to localStorage:", error);
      }
    };
    saveTasks();
  }, [tasks, deletedTasks]);

  // Add a new task
  const addTask = () => {
    if (inputValue.trim() !== "") {
      const newTask = {
        id: Date.now(), // Unique ID for the task
        text: inputValue, // Task text
        completed: false, // Task completion status
        temporarilyCompleted: false, // Temporary completion status for animation
      };
      setTasks((prevTasks) => [...prevTasks, newTask]); // Add new task to the list
      setInputValue(""); // Clear input field
    }
  };

  // Delete a task (move to deletedTasks)
  const deleteTask = (id) => {
    const taskToDelete = tasks.find((task) => task.id === id); // Find the task to delete
    if (taskToDelete) {
      const updatedTasks = tasks.filter((task) => task.id !== id); // Remove the task from the list
      setTasks(updatedTasks);
      setDeletedTasks((prevDeletedTasks) => [...prevDeletedTasks, taskToDelete]); // Add to deletedTasks
    }
  };

  // Toggle task completion (with a 2-second delay)
  const toggleComplete = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, temporarilyCompleted: true } : task // Temporarily mark as completed
    );
    setTasks(updatedTasks);

    setTimeout(() => {
      setTasks((prevTasks) => {
        const taskToComplete = prevTasks.find((task) => task.id === id); // Find the task
        const updatedTasks = prevTasks.filter((task) => task.id !== id); // Remove from the list
        if (taskToComplete) {
          taskToComplete.completed = true; // Mark as completed
          taskToComplete.temporarilyCompleted = false; // Reset temporary status
          return [...updatedTasks, taskToComplete]; // Add back to the list
        }
        return updatedTasks;
      });
    }, 2000); // 2-second delay
  };

  // Restore a task from completed or deleted lists
  const restoreTask = (id, from) => {
    let taskToRestore;
    if (from === "completed") {
      taskToRestore = tasks.find((task) => task.id === id); // Find the task in completed list
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id)); // Remove from completed list
    } else if (from === "deleted") {
      taskToRestore = deletedTasks.find((task) => task.id === id); // Find the task in deleted list
      setDeletedTasks((prevDeletedTasks) =>
        prevDeletedTasks.filter((task) => task.id !== id) // Remove from deleted list
      );
    }

    if (taskToRestore) {
      const updatedTask = { ...taskToRestore, completed: false, temporarilyCompleted: false }; // Reset task status
      setTasks((prevTasks) => [...prevTasks, updatedTask]); // Add back to the main list
    }
  };

  // Delete a task from the completed list
  const deleteFromCompleted = (id) => {
    const taskToDelete = tasks.find((task) => task.id === id); // Find the task
    if (taskToDelete) {
      const updatedTasks = tasks.filter((task) => task.id !== id); // Remove from the list
      setTasks(updatedTasks);
      setDeletedTasks((prevDeletedTasks) => [...prevDeletedTasks, taskToDelete]); // Add to deletedTasks
    }
  };

  // Filter tasks
  const incompleteTasks = tasks.filter((task) => !task.completed); // Incomplete tasks
  const completedTasks = tasks.filter((task) => task.completed); // Completed tasks

  return (
    <div className="App">
      <h1>AP To-Do List</h1>
      <div className="task-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new task"
          maxLength="50"
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <div className="main-container">
        <div className="task-list-box">
          <h2>Do This!! </h2>
          <ul>
            {incompleteTasks.map((task) => (
              <li key={task.id}>
                <button
                  className={`checkbox ${task.temporarilyCompleted ? "checked" : ""}`}
                  onClick={() => toggleComplete(task.id)}
                  aria-label={task.temporarilyCompleted ? "Mark task as incomplete" : "Mark task as complete"}
                >
                  {task.temporarilyCompleted ? (
                    <i className="fas fa-check"></i>
                  ) : (
                    <i className="fas fa-pencil"></i>
                  )}
                </button>
                <span className={task.temporarilyCompleted ? "crossed-out-text" : ""}>{task.text}</span>
                <button onClick={() => deleteTask(task.id)} aria-label="Delete task">
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="controls">
          <button className="smiley" onClick={() => setShowCompleted(!showCompleted)} aria-label="Toggle completed tasks">
            😊
          </button>
          <button className="trash" onClick={() => setShowDeleted(!showDeleted)} aria-label="Toggle deleted tasks">
            🗑️
          </button>
        </div>

        <div className="completed-tasks">
          {showCompleted && (
            <div className="completed-list">
              <h2>Completed Tasks</h2>
              <ul>
                {completedTasks.map((task) => (
                  <li key={task.id}>
                    <span className="crossed-out-text">{task.text}</span>
                    <div className="icon-container">
                      <button className="restore" onClick={() => restoreTask(task.id, "completed")} aria-label="Restore task">
                        🔄
                      </button>
                      <button className="delete-trash" onClick={() => deleteFromCompleted(task.id)} aria-label="Delete task">
                        🗑️
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="deleted-tasks">
          {showDeleted && (
            <div className="deleted-list">
              <h2>Deleted Tasks</h2>
              <ul>
                {deletedTasks.map((task) => (
                  <li key={task.id}>
                    <span>{task.text}</span>
                    <button className="restore" onClick={() => restoreTask(task.id, "deleted")} aria-label="Restore task">
                      🔄
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;