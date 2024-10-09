import { createBrowserRouter } from 'react-router-dom';
import CheckEmailPage from '../pages/CheckEmailPage.js';
import CheckPasswordPage from '../pages/CheckPasswordPage.js';
import Home from '../pages/Home.js';
import RegisterPage from '../pages/RegisterPage.js';
import MessagePage from '../components/MessagePage.js';
import App from '../App.js';
import AuthLayout from '../layout/index.js';
import Forgotepassword from '../components/Forgotepassword.js';

const router = createBrowserRouter([
{
    path: "/",
    element: <App/>,
    children: [
        {
            path: 'register',
            element: <AuthLayout><RegisterPage/></AuthLayout>
        },
        {
            path: 'email',
            element: <AuthLayout><CheckEmailPage/></AuthLayout>
        },
        {
            path: 'password',
            element: <AuthLayout><CheckPasswordPage/></AuthLayout>
        },
        {
            path: 'forgot-password',
            element: <AuthLayout><Forgotepassword/></AuthLayout>
        },
        {
            path: '',
            element: <AuthLayout><Home/></AuthLayout>,
            children: [
                {
                    path: ':userId',
                    element: <MessagePage/>
                }
            ]
        },
    ]
}
])

export default router;