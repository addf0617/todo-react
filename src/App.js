import Todo from "./components/Todo";
import From from "./From";
import FilterButton from "./components/FilterButton";
import { useState } from "react";
import { nanoid } from "nanoid";

//以下兩個物件之所以宣告在app之外，是因為每次app重新渲染時都會重新計算這些常量
//但無論應用程式做甚麼，這些資料都不會改變，所以放在app外面
const FILTER_MAP = {
  ALL: () => true,
  Active: (task) => !task.completed,
  completed: (task) => task.completed,
};
//將FLITER_MAP所有屬姓名組成新陣列並回傳FILTER_NAMES
const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
  const [tasks, setTasks] = useState(props.tasks);
  const [filter, setFilter] = useState("All");
  const tasklist = tasks
    .filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo
        id={task.id}
        name={task.name}
        completed={task.completed}
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    ));
  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      name={name}
      key={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));
  const tasksNoun = tasklist.length !== 1 ? "tasks" : "task";
  const headingText = `${tasklist.length} ${tasksNoun} remaining`;

  function toggleTaskCompleted(id) {
    // 使用map歷遍所有task，當id相等時，將completed改為反向，不相等時直接回傳，以此組成updatedTasks
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        //使用object spread來組成新物件
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function addTask(name) {
    const newTask = { id: `todo-${nanoid()}`, name, completed: false };
    setTasks([...tasks, newTask]);
  }

  function deleteTask(id) {
    //filter會將陣列所有元素傳入callback中，並將所有回傳值組成新陣列
    const remainTask = tasks.filter((task) => task.id !== id);
    setTasks(remainTask);
  }

  function editTask(id, newName) {
    const editTaskList = tasks.map((task) => {
      //找到符合id的task，將name改為newName
      if (task.id === id) {
        return { ...task, name: newName };
      }
      //如果沒有被編輯直接回傳
      return task;
    });
    setTasks(editTaskList);
  }

  return (
    <div className="todoapp stack-large">
      <h1>TodoMatic</h1>
      <From addTask={addTask} />
      <div className="filters btn-group stack-exception">{filterList}</div>
      <h2 id="list-heading">{headingText}</h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {tasklist}
      </ul>
    </div>
  );
}

export default App;
