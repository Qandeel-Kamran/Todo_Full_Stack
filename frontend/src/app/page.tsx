'use client';

import React, { useState, FormEvent } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function Home() {
  const {
    user,
    tasks,
    loading,
    error,
    isLoggedIn,
    login,
    register,
    logout,
    addTask,
    toggleTask,
    deleteTask
  } = useAppContext();

  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authData, setAuthData] = useState({ email: '', password: '' });

  const handleAuthSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (authMode === 'login') {
        await login(authData.email, authData.password);
      } else {
        await register(authData.email, authData.password);
        setAuthMode('login'); // Switch to login mode after successful registration
      }
    } catch (err) {
      // Error is already handled by context
    }
  };

  const handleCreateTask = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await addTask(newTask.title, newTask.description);
      setNewTask({ title: '', description: '' });
    } catch (err) {
      // Error is already handled by context
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!isLoggedIn ? (
        /* Authentication Page */
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h1 className="text-2xl font-bold mb-6 text-center">
              {authMode === 'login' ? 'Login to Task App' : 'Create Account'}
            </h1>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-gray-700 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={authData.email}
                  onChange={(e) => setAuthData(Object.assign({}, authData, { email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 bg-white"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-gray-700 font-medium">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={authData.password}
                  onChange={(e) => setAuthData(Object.assign({}, authData, { password: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900 bg-white"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition font-medium"
              >
                {authMode === 'login' ? 'Login' : 'Register'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="text-blue-600 hover:text-blue-800 font-medium transition"
              >
                {authMode === 'login'
                  ? "Don't have an account? Register"
                  : "Already have an account? Login"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Todo Dashboard */
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Task App</h1>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <span className="text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
                Hi, {user?.email}
              </span>
              <button
                onClick={logout}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition font-medium w-full sm:w-auto text-center"
              >
                Logout
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Add Task Form */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask(Object.assign({}, newTask, { title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask(Object.assign({}, newTask, { description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Task
              </button>
            </form>
          </div>

          {/* Task List */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <h2 className="text-xl font-semibold p-6 pb-4">Your Tasks</h2>

            {tasks.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No tasks yet. Add one above!</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {tasks.map((task) => (
                  <li key={task.id} className="p-6 hover:bg-gray-50 transition">
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={async () => {
                          try {
                            await toggleTask(task.id);
                          } catch (err) {
                            // Error is handled by context
                          }
                        }}
                        className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                          {task.title}
                        </h3>

                        {task.description && (
                          <p className={`mt-1 text-gray-600 break-words ${task.completed ? 'line-through' : ''}`}>
                            {task.description}
                          </p>
                        )}

                        <div className="mt-2 text-sm text-gray-500">
                          Created: {new Date(task.created_at).toLocaleString()}
                        </div>
                      </div>

                      <button
                        onClick={async () => {
                          try {
                            await deleteTask(task.id);
                          } catch (err) {
                            // Error is handled by context
                          }
                        }}
                        className="text-red-600 hover:text-red-800 focus:outline-none transition font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}