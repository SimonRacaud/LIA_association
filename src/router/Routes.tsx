import { UserType } from "classes/User";
import HomePage from "page/home/HomePage";
import Settings from "page/settings/Settings";
import SignIn from "page/signin/SignIn";
import SignUp from "page/signup/SignUp";

export interface Route {
    path: string,
    element: JSX.Element,
    protected: boolean,
    role?: UserType
}

export const routes: Route[] = [
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
        role: UserType.ADMIN
    },
    {
        path: '/settings',
        element: <Settings />,
        protected: true,
        role: UserType.ADMIN
    },
]