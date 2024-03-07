import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import Document from "../pages/Document";
import User from "../pages/User";

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