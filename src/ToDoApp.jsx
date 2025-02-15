/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaPlus, FaTrash, FaCheck } from "react-icons/fa";
import { Modal, Button, Form } from "react-bootstrap";

// Function to get a random color
const getRandomColor = () => {
  const allowedColors = ["#A4B465", "#D17D98", "#A27B5C"];

  const excludedColors = ["#FFFFFF", "#FF0000", "#00FF00", "#000000"]; // White, Red, Green, Black
  const filteredColors = allowedColors.filter(
    (color) => !excludedColors.includes(color)
  );

  const randomIndex = Math.floor(Math.random() * filteredColors.length);
  return filteredColors[randomIndex];
};

// TaskCard Component
const TaskCard = ({ task, onDelete, onStatusChange }) => (
  <div
    className="p-3 rounded shadow-sm d-flex justify-content-between align-items-center mb-3"
    style={{ backgroundColor: task.color }}
  >
    <div>
      <p className="small fw-bold mb-2">{task.date}</p>
      <h3 className="fs-6 fw-semibold mb-3">{task.title}</h3>
      <p className="small text-muted mb-0">
        {task.time.from} - {task.time.to}
      </p>
    </div>
    <div className="d-flex gap-2">
      {task.status !== "completed" ? (
        <>
          <select
            className="form-select form-select-sm"
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            value={task.status}
          >
            <option value="todo">To Do</option>
            <option value="inProgress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button
            className="btn btn-sm btn-danger d-flex align-items-center justify-content-center"
            onClick={() => onDelete(task.id)}
          >
            <FaTrash />
          </button>
        </>
      ) : (
        <span className="text-success fs-4">
          <FaCheck />
        </span>
      )}
    </div>
  </div>
);

// TaskBoard Component
const TaskBoard = ({ tasks, onDelete, onStatusChange }) => {
  const categories = Object.keys(tasks);
  return (
    <div className="row g-4">
      {categories.map((category) => (
        <div className="col-md-4" key={category}>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-uppercase mb-4" style={{ fontSize: "1.2rem" }}>
              {category.replace(/([A-Z])/g, " $1")}
            </h3>
            <div>
              {tasks[category].length > 0 ? (
                tasks[category].map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                  />
                ))
              ) : (
                <p className="text-muted text-center">No tasks available</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Main ToDoApp Component
const ToDoApp = () => {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    completed: [],
  });
  const [showForm, setShowForm] = useState(false);

  const addTask = (newTask) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      todo: [...prevTasks.todo, { ...newTask, status: "todo" }],
    }));
  };

  const deleteTask = (taskId) => {
    setTasks((prevTasks) => {
      const updatedTasks = {};
      for (const category in prevTasks) {
        updatedTasks[category] = prevTasks[category].filter(
          (task) => task.id !== taskId
        );
      }
      return updatedTasks;
    });
  };

  const changeTaskStatus = (taskId, newStatus) => {
    setTasks((prevTasks) => {
      const updatedTasks = {
        todo: [],
        inProgress: [],
        completed: [],
      };
      Object.keys(prevTasks).forEach((category) => {
        prevTasks[category].forEach((task) => {
          if (task.id === taskId) {
            updatedTasks[newStatus].push({ ...task, status: newStatus });
          } else {
            updatedTasks[category].push(task);
          }
        });
      });
      return updatedTasks;
    });
  };

  // Overlay Form Component
  const TaskForm = () => {
    const [title, setTitle] = useState("");
    const today = new Date().toISOString().split("T")[0];
    const [timeFrom, setTimeFrom] = useState("");
    const [timeTo, setTimeTo] = useState("");

    const handleSubmit = (e) => {
      e.preventDefault();
      if (title && timeFrom && timeTo) {
        const newTask = {
          id: Date.now(),
          title,
          date: today,
          time: { from: timeFrom, to: timeTo },
          color: getRandomColor(),
          status: "todo",
        };
        addTask(newTask);
        setShowForm(false);
      }
    };

    return (
      <Modal show={showForm} onHide={() => setShowForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Task Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Time From</Form.Label>
              <Form.Control
                type="time"
                value={timeFrom}
                onChange={(e) => setTimeFrom(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Time To</Form.Label>
              <Form.Control
                type="time"
                value={timeTo}
                onChange={(e) => setTimeTo(e.target.value)}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="danger" onClick={() => setShowForm(false)}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Add Task
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };

  return (
    <>
      <div className="container py-4 mt-5">
        <div>
          <Button onClick={() => setShowForm(true)} className="mb-4">
            New Task <FaPlus className="mb-1 ms-2" />
          </Button>
        </div>
        {showForm && <TaskForm />}
        <TaskBoard
          tasks={tasks}
          onDelete={deleteTask}
          onStatusChange={changeTaskStatus}
        />
      </div>
    </>
  );
};

export default ToDoApp;
