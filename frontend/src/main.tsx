import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import './i18n' // Initialize i18n before app loads
import ErrorBoundary from './ErrorBoundary'
import Layout  from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Predict from './pages/Predict'
import History from './pages/History'
import ChatPage from './pages/ChatPage'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import AdminUsers from './pages/AdminUsers'
import AdminPredictions from './pages/AdminPredictions'
import AdminFeedback from './pages/AdminFeedback'
import Developer from './pages/Developer'

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/predict', element: <Predict /> },
      { path: '/history', element: <History /> },
      { path: '/chat', element: <ChatPage /> },
      { path: '/profile', element: <Profile /> },
      { path: '/developer', element: <Developer /> },
      { path: '/admin', element: <Admin /> },
      { path: '/admin/users', element: <AdminUsers /> },
      { path: '/admin/predictions', element: <AdminPredictions /> },
      { path: '/admin/feedback', element: <AdminFeedback /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </React.StrictMode>,
)
