import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import App from '../App';
import { SignUp,SignIn, Admin, StudentLayout, Teacher, NotFound, Courses, Products, LoginProtect, LayoutProtect, Worker, Branches } from '../pages';
import { Groups } from '../pages/groups/groups';
const Router = () => {
    const router = createBrowserRouter(
      createRoutesFromElements(
        <Route path="/" element={<App />}>
          {/* SiginIN and SingUp Routes  */}
          <Route
            index
            element={
              <LoginProtect>
                <SignIn />
              </LoginProtect>
            }
          />
          <Route path="sign-up" element={<SignUp />} />
          {/* Admin Layout */}
          <Route
            path="admin"
            element={
              <LayoutProtect>
                <Admin />
              </LayoutProtect>
            }>
            <Route index element={<Groups />} />,
            <Route path="students" element={<StudentLayout />} />,
            <Route path="branches" element={<Branches />} />,
            <Route path="courses" element={<Courses />}></Route>
            <Route path="teachers" element={<Teacher/>}></Route>
          </Route>
          {/* Student Layout */}
          <Route path="student" element={<StudentLayout />}></Route>

          {/* Teacher Layout */}
          <Route path="teachers" element={<Teacher />}></Route>
          <Route path="/worker" element={<Worker />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      )
    );
  return <RouterProvider router={router}/>
};

export default Router;
