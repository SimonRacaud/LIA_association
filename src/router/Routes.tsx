import HomePage from "page/home/HomePage";
import SignIn from "page/signin/SignIn";
import SignUp from "page/signup/SignUp";

export const routes = [
    {
      path: '/',
      element: <HomePage />,
      protected: true,
    },
    {
        path: '/login',
        element: <SignIn />,
        protected: false,
    },
    {
        path: '/signup',
        element: <SignUp />,
        protected: true,
      },
]