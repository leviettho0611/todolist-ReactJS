import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import './App.css';

function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editedTaskText, setEditedTaskText] = useState(''); // State để lưu trữ giá trị công việc đang được sửa
  
  

   //Load danh sách công việc từ local storage khi ứng dụng khởi động
   useEffect(() => {
    // console.log(1);
    //đổi dạng local về dạng thường và lay trong Local ra
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks) {
      
      //
      setTasks(storedTasks);
    }else{
      return [];
    }
  }, []);
  
  useEffect(() => {
    // console.log(2);
    //từ dạng thường chuyển sang dạng local và thêm vào local
    
    if(tasks.length === 0) return;
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const onAddTask = (e) => {
    e.preventDefault();
    if (task.trim() !== '') {
      const newTask = { id: Date.now(), text: task }; // Create a task object with id
      setTasks([...tasks, newTask]);
      setTask('');
    }
  }
  
  // Sửa task 
  const onEditTask = (id,event) => {
    event.preventDefault();
    const taskToEdit = tasks.find((taskItem) => taskItem.id === id);
    if (taskToEdit) {
      // Khi người dùng nhấn nút Sửa, set trạng thái editMode thành ID của công việc đang được sửa
      setEditMode(id);
      setEditedTaskText(taskToEdit.text); // Đặt giá trị công việc đang được sửa
    }
  };

  const onSaveTask = (id, newTaskText) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, text: newTaskText };
      }
      return task;
    });
    setTasks(updatedTasks);
    setEditMode(null);
  };


  const onDeleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
  };
  const handleTaskCheckboxChange = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };
  const handleClearCompleted = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));
  };
  const handleCompleteAll = () => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => ({ ...task, completed: true }))
    );
  };
  return (
    <div className="container">
    <div className='todo-app'> 
      
        <h1  style={{
          fontSize: '3rem',
          fontWeight: '600',
          marginBottom: '1rem',
          lineHeight: '1em',
          textTransform: 'lowercase',
          textAlign: 'center',
          padding: '10px 0',
          lineHeight: '1.5em',
        }}>Todo List</h1>
      
        <div className='row'>
          <input
            type="text"
            name="task"
            placeholder="Add your todo"
            
            onChange={(e) => setTask(e.target.value)}
          />
          <button onClick={onAddTask}>Add</button>
          
        </div>
        <div className="mid">
          <i className="fas fa-check-double"></i>
          <p id="complete-all" onClick={handleCompleteAll}>
            Complete all tasks
          </p>
          <p id="clear-all" onClick={handleClearCompleted}>
            Delete comp tasks
          </p>
        </div>
        
        <div className='row'>
        <ul id="list">
          {tasks.map((taskItem) => (
            <li key={taskItem.id}>
              <input
                type="checkbox"
                id={`task-${taskItem.id}`}
                data-id={taskItem.id}
                className="custom-checkbox"
                checked={taskItem.completed}
                onChange={() => handleTaskCheckboxChange(taskItem.id)}
               
              />
              {/* <label htmlFor={`task-${taskItem.id}`}>{taskItem.text}</label> */}
              {editMode === taskItem.id ? ( // Kiểm tra trạng thái sửa để hiển thị input và nút Save
                <>
                <input
                  type="text"
                  name="task"
                  value={editedTaskText} // Sử dụng giá trị công việc đang được sửa
                  onChange={(e) => setEditedTaskText(e.target.value)} // Cập nhật giá trị công việc đang được sửa
                />
                <button onClick={() => onSaveTask(taskItem.id, editedTaskText)}>Save</button>
              </>
              ) : (
                <>
                  <label
                            htmlFor={`task-${taskItem.id}`}
                            className={taskItem.completed ? 'completed' : ''}
                          >
                            {taskItem.text}
                  </label>
                  <img className="edit" src="https://cdn-icons-png.flaticon.com/128/1159/1159633.png" onClick={(e) => onEditTask(taskItem.id,e)}/> 
                  <img className="delete" src="https://cdn-icons-png.flaticon.com/128/3096/3096673.png"  onClick={() => onDeleteTask(taskItem.id)}/>
                </>
              )}
              {/* <img className="edit" src="https://cdn-icons-png.flaticon.com/128/1159/1159633.png" onClick={(e) => onEditTask(taskItem.id,e)}/> 
                  <img className="delete" src="https://cdn-icons-png.flaticon.com/128/3096/3096673.png"  onClick={() => onDeleteTask(taskItem.id)}/> */}
            </li>
          ))}
        </ul>
          {/* <ul id="list">
            {tasks.map((taskItem) => (
              <li key={taskItem.id}>
              {editMode === taskItem.id ? ( // Kiểm tra trạng thái sửa để hiển thị input và nút Save
                <>
                <input
                  type="text"
                  name="task"
                  value={editedTaskText} // Sử dụng giá trị công việc đang được sửa
                  onChange={(e) => setEditedTaskText(e.target.value)} // Cập nhật giá trị công việc đang được sửa
                />
                <button onClick={() => onSaveTask(taskItem.id, editedTaskText)}>Save</button>
              </>
              ) : (
                <>
                  {taskItem.text} 
                  <img className="edit" src="https://cdn-icons-png.flaticon.com/128/1159/1159633.png" onClick={(e) => onEditTask(taskItem.id,e)}/> 
                  <img className="delete" src="https://cdn-icons-png.flaticon.com/128/3096/3096673.png"  onClick={() => onDeleteTask(taskItem.id)}/>
                </>
              )}
            </li>
            ))}
          </ul> */}
        </div>
      
      
      </div>
    </div>
  );
}

export default App;
