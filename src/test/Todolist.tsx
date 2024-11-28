import React, { useState } from 'react'

type Task = {
    id: number;
    text: string;
  };
  
  const Todolist: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState<string>("");
  
    const addTask = () => {
      if (newTask.trim() === "") return;
      const newTaskObj: Task = {
        id: Date.now(),
        text: newTask,
      };
      setTasks([...tasks, newTaskObj]);
      setNewTask("");
    };
  
    const deleteTask = (id: number) => {
      setTasks(tasks.filter((task) => task.id !== id));
    };
  
    return (
      <div className="App">
        <h1>TODO 리스트</h1>
        <div>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="할 일을 입력하세요"
            />
            <button onClick={addTask}>추가</button>
        </div>
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              {task.text} <button onClick={() => deleteTask(task.id)}>삭제</button>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  export default Todolist;