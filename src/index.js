import React, { useState,useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import axios from "axios";
import TodoItem from "./components/todoItem";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  //useEffect ( callback, Array ) ** Auto 
  useEffect(()=>{
    getAllTodo();
  },[])
  

  //API : 1 Get all todo
  async function getAllTodo() {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/todos"
      );
      setTodos(response.data.slice(0, 11));
    } catch (error) {
      console.log(error);
    }
  }

  //API : 2 Create Todo
  const handleChangeTodo = (event) => {
    setNewTodo(event.target.value);
  };
  // ## React State => Server State
  const createTodo = async () => {
    const data = { title: newTodo, complete: false };
    try {
      let response = await axios.post(
        `https://jsonplaceholder.typicode.com/todos`,
        data
      );
      // console.log(response.status, response.data)
      setTodos([response.data, ...todos]);
      setNewTodo("");
    } catch (error) {
      console.log(error);
    }
  };
  //API : 3 Delete Todo
  const deleteTodo = async (todoId) => {
    console.group("try to delete todoID :", todoId);
    if (!todoId) return;
    try {
      //  React State => Server
      await axios.delete(
        `https://jsonplaceholder.typicode.com/todos/${todoId}`
      );

      // Server => React [OK]
      console.log("Delete success");

      // React State  => UI
      // # 1
      // const newTodoList = [...todos];
      // const foundedIndex = newTodoList.findIndex((todo) => todo.id === todoId);
      // if (foundedIndex !== -1) {
      //   newTodoList.splice(foundedIndex, 1);
      //   setTodos(newTodoList);
      // }

      // # 2
      setTodos((prev) => prev.filter((todo) => todo.id !== todoId));
    } catch (error) {
      console.log(error);
    }
  };

  //API : 4 Update Todo
  const updateTodo = async (todoId, updateTodo) => {
    try {
      // console.log('Update todo', todoId,updateTodo)
      const response = await axios.patch(
        `https://jsonplaceholder.typicode.com/todos/${todoId}`,
        updateTodo
      );

      // console.log(response.data);

      //Imperative Way
      // const updateTodoList = [...todos];
      // const foundIndex = updateTodoList.findIndex((todo) => todo.id === todoId);
      // if (foundIndex !== -1) {
      //   updateTodoList[foundIndex] = response.data;
      //   setTodos(updateTodoList);
      // }

      // Functional Programming
      setTodos((prev) =>
        prev.reduce((acc, todo) => {
          // if (todo.id !== todoId){
          //   acc.push(todo)
          // }else acc.push(response.data)
          acc.push(todo.id === todoId ? response.data : todo);
          return acc;
        }, [])
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="app">
      <div className="todo">
        <header className="todo__add">
          <h1>
            TodoList
            {/* <button onClick={getAllTodo}>FETCH</button> */}
          </h1>
          <input onChange={handleChangeTodo} value={newTodo} />
          <button onClick={createTodo}>add</button>
        </header>
        <ul className="todo__list">
          {todos.map((todo) => (
            <TodoItem
              todo={todo}
              deleteTodo={deleteTodo}
              updateTodo={updateTodo}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
