import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import App from '../App';
import { SignUp,SignIn, Admin, Student, Teacher, NotFound, Posts, Products } from '../pages';
import { Groups } from '../pages/groups/groups';
const Router = () => {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path='/' element = {<App/>}>   
                {/* SiginIN and SingUp Routes  */}
                <Route index element={<SignIn/>}/>
                <Route path='sign-up' element={<SignUp/>}/>
                {/* Admin Layout */}
                <Route path='admin' element={<Admin/>}>
                    <Route path='groups' element={<Groups/>}/>,
                    <Route path='students' element={<Student/>}/>,
                    <Route path='products' element={<Products/>}/>,
                    <Route path='posts' element={<Posts/>}></Route>
                </Route>
                {/* Student Layout */}
                <Route path='student' element={<Student/>}>
                
                </Route>

                {/* Teacher Layout */}
                <Route path='teacher' element={<Teacher/>}>
                </Route>
                <Route path='*' element={<NotFound/>}/>
            </Route>
        )
    )
  return <RouterProvider router={router}/>
};

export default Router;
