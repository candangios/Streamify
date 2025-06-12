import React from 'react'
import { Navigate, Route, Routes } from 'react-router'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import CallPage from './pages/CallPage'
import Chatpage from './pages/Chatpage'
import OnboardingPage from './pages/OnboardingPage'
import NotificationPage from './pages/NotificationPage'
import { Toaster } from 'react-hot-toast'
import PageLoader from './components/PageLoader'
import useAuthUser from './hooks/useAuthUser'
import Layout from './components/Layout'
import { useThemeStore } from './store/useThemeStore'

function App() {

  const { isLoading, authUser } = useAuthUser()
  const isAuthenticated = Boolean(authUser)
  const isOnboarded = authUser?.isOnboarded

  const { theme } = useThemeStore()
  if (isLoading) {
    return (
      <div>
        <PageLoader />
      </div>
    )
  }
  return (
    <div className='h-screen' data-theme={theme}>
      <Routes>
        <Route path='/' element={isAuthenticated && isOnboarded ?
          <Layout showSidebar={true}>
            <HomePage />
          </Layout>
          :
          <Navigate to={!isAuthenticated ? '/login' : '/onboarding'} />}
        />
        <Route path='/signup' element={!isAuthenticated ? <SignUpPage /> : <Navigate to='/' />} />
        <Route path='/login' element={!isAuthenticated ? <LoginPage /> : <Navigate to={!isOnboarded ? '/onboarding' : '/'} />} />
        <Route path='/notifications' element={isAuthenticated && isOnboarded ? (
          <Layout showSidebar={true}>
            <NotificationPage />
          </Layout>
        ) : <Navigate to={!isAuthenticated ? '/login' : '/onboarding'} />} />
        <Route path='/call' element={isAuthenticated ? < CallPage /> : <Navigate to='/' />} />
        <Route path='/chat' element={isAuthenticated ? <Chatpage /> : <Navigate to='/' />} />
        <Route path='/onboarding' element={isAuthenticated && !isOnboarded ? <OnboardingPage /> : <Navigate to={isAuthenticated ? '/' : '/login'} />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App