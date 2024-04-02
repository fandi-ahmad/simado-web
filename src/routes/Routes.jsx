import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import Document from "../pages/Document";
import User from "../pages/User";
import StudyYear from "../pages/student/StudyYear";
import ClassName from "../pages/student/ClassName";
import Student from "../pages/student/Student";
import StudentRaporByClass from "../pages/student/StudentRaporByClass";
import { GetUserLogin } from "../api/auth";
import { useEffect, useState } from "react";
import { useGlobalState } from "../state/state";

const Middleware = ({ element: Element, ...rest }) => {
  const navigate = useNavigate()
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userIdLogin, setUserIdLogin] = useGlobalState('userIdLogin')
  const [usernameLogin, setUsernameLogin] = useGlobalState('usernameLogin')
  const [userRoleLogin, setUserRoleLogin] = useGlobalState('userRoleLogin')
  const path = location.pathname

  useEffect(() => {
    const getUserLogin = async () => {
      try {
        const result = await GetUserLogin()

        if (result.data) {
          setUserIdLogin(result.data.id)
          setUsernameLogin(result.data.username)
          setUserRoleLogin(result.data.role)
        }

        if (path == '/user' && result.data.role == 'staff') {
          navigate('/')
        }

        if (result.status === 200) {
          setIsUserLoggedIn(true);
          if (path == '/login') navigate('/')
        } else {
          setIsUserLoggedIn(false);
          if (path !== '/login') navigate('/login');
        }

      } catch (error) {
        
      }
    }

    getUserLogin()
  }, [navigate])

  if (!isUserLoggedIn && path !== '/login') {
    return null;
  }

  return <Element {...rest} />
};

export const RoutesTemplate = () => {

  const allRoutes = [
    {
      path: '/',
      element: Dashboard,
      requiresMiddleware: true
    },
    {
      path: '/profile',
      element: Profile,
      requiresMiddleware: true
    },
    {
      path: '/document',
      element: Document,
      requiresMiddleware: true
    },
    {
      path: '/document/:id',
      element: Document,
      requiresMiddleware: true
    },
    {
      path: '/data/student',
      element: Student,
      requiresMiddleware: true
    },
    {
      path: '/data/student/:id_entry_year',
      element: Student,
      requiresMiddleware: true
    },
    {
      path: '/rapor/study-year',
      element: StudyYear,
      requiresMiddleware: true
    },
    {
      path: '/rapor/study-year/:id_study_year/class',
      element: ClassName,
      requiresMiddleware: true
    },
    {
      path: '/rapor/study-year/:id_study_year/class/:id_class_name',
      element: StudentRaporByClass,
      requiresMiddleware: true
    },
    {
      path: '/user',
      element: User,
      requiresMiddleware: true
    },
    {
      path: '/login',
      element: Login,
      requiresMiddleware: true
    }
  ]

  return (
    <BrowserRouter>
      <Routes>
        {allRoutes.map((route) => (
          <Route
            path={route.path}
            element={route.requiresMiddleware ? <Middleware element={route.element} /> : route.element}
            key={route.path}
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesTemplate;