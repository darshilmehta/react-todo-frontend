import React, { useState, useEffect } from 'react';
import pb from '../pocketbase';

function Todo() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');

  useEffect(() => {
    if (!pb.authStore.isValid) {
      window.location.href = '/login';
    }
    setIsAuthenticated(true);
  }, []);

  const fetchTodos = async () => {
    try {
      if (!pb.authStore.isValid) {
        return;
      }
      const records = await pb.collection('todos').getList(1, 50, {
        filter: `user = "${pb.authStore.model.id}"`,
      });
      setTodos(records.items);
    } catch (error) {
      window.alert('Internal Server Error');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTodos();
    }
  }, [isAuthenticated]);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!pb.authStore.isValid) {
      alert('Please login to add todos');
      return;
    }
    try {
      const newTodo = await pb.collection('todos').create({
        content: task,
        user: pb.authStore.model.id,
        done: false,
      });
      setTodos([...todos, newTodo]);
      setTask('');
    } catch (error) {
      window.alert('Internal Server Error');
    }
  };

  const updateTodoStatus = async (id, done) => {
    try {
      await pb.collection('todos').update(id, { done });
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? { ...todo, done } : todo))
      );
    } catch (error) {
      window.alert('Internal Server Error');
    }
  };

  if (isAuthenticated)
    return (
      <div>
        <div style={{ height: '100px' }}>
          <button
            onClick={() => {
              pb.authStore.clear();
              window.location.href = '/login';
            }}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
        <h2 style={{ textAlign: 'center' }}>
          Hello {pb.authStore.model.email}
        </h2>
        <h4 style={{ textAlign: 'center' }}>Your Todos</h4>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <form onSubmit={addTodo} style={{ marginBottom: '20px' }}>
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="New Task"
              style={{ border: '2px solid black', borderRadius: '5px' }}
            />
            <button
              type="submit"
              style={{
                borderRadius: '5px',
                border: '1px solid black',
                padding: '5px',
                marginLeft: '10px',
              }}
            >
              Add
            </button>
          </form>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {todos
              .sort((a, b) => a.done - b.done)
              .map((todo) => (
                <div
                  key={todo.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '10px',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={todo.done}
                    onChange={() => updateTodoStatus(todo.id, !todo.done)}
                  />
                  <span
                    style={{
                      textDecoration: todo.done ? 'line-through' : 'none',
                      marginLeft: '10px',
                      cursor: 'pointer',
                    }}
                    onClick={() => updateTodoStatus(todo.id, !todo.done)}
                  >
                    {todo.content}
                  </span>
                </div>
              ))}
          </ul>
        </div>
      </div>
    );
}

export default Todo;
