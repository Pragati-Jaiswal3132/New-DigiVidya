import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';

import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Dashboard from './pages/admin/Dashboard';
import Courses from './pages/admin/Courses';
import AllCourses from './pages/AllCouses'; // ✅ If your file is named AllCouses.jsx, keep this
import AddCourses from './pages/admin/AddCourses';
import CreateCourse from './pages/admin/CreateCourse';
import CreateLecture from './pages/admin/CreateLecture';
import EditLecture from './pages/admin/EditLecture';
import Assignments from './pages/admin/Assignments';
import AssignmentSubmissions from './pages/admin/AssignmentSubmissions';
import StudentAssignment from './pages/StudentAssignment';
import ViewCourse from './pages/ViewCourse';
import EnrolledCourse from './pages/EnrolledCourse';
import ViewLecture from './pages/ViewLecture';
import SearchWithAi from './pages/SearchWithAi';

import ScrollToTop from './components/ScrollToTop';

// ✅ Custom hooks (corrected usage)
import useCurrentUser from './customHooks/GetCurrentUser';
import useCourseData from './customHooks/useCourseData';
import useCreatorCourseData from './customHooks/useCreatorCourseData';
import useAllReviews from './customHooks/GetAllReviews';

// ✅ Vite proxy base
export const serverUrl = "";

function App() {
  // ✅ Redux user state
  const { userData } = useSelector(state => state.user);

  // ✅ Global data fetch hooks
  useCurrentUser();
  useCourseData();
  useCreatorCourseData();
  useAllReviews();

  return (
    <>
      <ToastContainer />
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to='/' />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />

        {/* Authenticated Student Routes */}
        <Route path='/profile' element={userData ? <Profile /> : <Navigate to='/signup' />} />
        <Route path='/editprofile' element={userData ? <EditProfile /> : <Navigate to='/signup' />} />
        <Route path='/allcourses' element={userData ? <AllCourses /> : <Navigate to='/signup' />} />
        <Route path='/viewcourse/:courseId' element={userData ? <ViewCourse /> : <Navigate to='/signup' />} />
        <Route path='/enrolledcourses' element={userData ? <EnrolledCourse /> : <Navigate to='/signup' />} />
        <Route path='/viewlecture/:courseId' element={userData ? <ViewLecture /> : <Navigate to='/signup' />} />
        <Route path='/searchwithai' element={userData ? <SearchWithAi /> : <Navigate to='/signup' />} />
        <Route path='/course/:courseId/assignments' element={userData ? <StudentAssignment /> : <Navigate to='/signup' />} />

        {/* Educator Routes */}
        <Route path='/dashboard' element={userData?.role === 'educator' ? <Dashboard /> : <Navigate to='/signup' />} />
        <Route path='/courses' element={userData?.role === 'educator' ? <Courses /> : <Navigate to='/signup' />} />
        <Route path='/addcourses/:courseId' element={userData?.role === 'educator' ? <AddCourses /> : <Navigate to='/signup' />} />
        <Route path='/createcourses' element={userData?.role === 'educator' ? <CreateCourse /> : <Navigate to='/signup' />} />
        <Route path='/createlecture/:courseId' element={userData?.role === 'educator' ? <CreateLecture /> : <Navigate to='/signup' />} />
        <Route path='/editlecture/:courseId/:lectureId' element={userData?.role === 'educator' ? <EditLecture /> : <Navigate to='/signup' />} />
        <Route path='/assignments/:courseId' element={userData?.role === 'educator' ? <Assignments /> : <Navigate to='/signup' />} />
        <Route path='/assignments/:courseId/:assignmentId' element={userData?.role === 'educator' ? <AssignmentSubmissions /> : <Navigate to='/signup' />} />

        {/* Fallback */}
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </>
  );
}

export default App;
