import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import Document from "../pages/Document";
import User from "../pages/User";
import StudyYear from "../pages/student/StudyYear";
import ClassName from "../pages/student/ClassName";
import Student from "../pages/student/Student";
import StudentRaporByClass from "../pages/student/StudentRaporByClass";

export const RoutesTemplate = () => {

  const allRoutes = [
    {
      path: '/',
      element: <Dashboard/>,
      name: 'dashboard'
    },
    {
      path: '/profile',
      element: <Profile/>
    },
    {
      path: '/document',
      element: <Document/>
    },
    {
      path: '/document/:id',
      element: <Document/>
    },
    {
      path: '/data/student',
      element: <Student/>
    },
    {
      path: '/data/student/:id_entry_year',
      element: <Student/>
    },
    {
      path: '/rapor/study-year',
      element: <StudyYear/>
    },
    {
      path: '/rapor/study-year/:id_study_year/class',
      element: <ClassName/>
    },
    {
      path: '/rapor/study-year/:id_study_year/class/:id_class_name',
      element: <StudentRaporByClass/>
    },
    {
      path: '/user',
      element: <User/>
    },
    {
      path: '/login',
      element: <Login/>
    }
  ]

  return (
    <BrowserRouter>
      <Routes>
        {allRoutes.map((route) => (
          <Route path={route.path} element={route.element} key={route.path} />
        ))}
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesTemplate;