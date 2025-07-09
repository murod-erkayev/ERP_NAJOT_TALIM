import { lazy } from "react";
const SignIn = lazy(()=> import("./auth/sign-in"))
const SignUp = lazy(()=> import("./auth/sign-up"))
const Admin = lazy(()=> import("./admin-layout/admin-layout"))
const StudentLayout = lazy(()=> import("./student-layout/student-layout"))
const Teacher = lazy(()=> import("./teacher-layout/teacher-layout"))
const Posts = lazy(()=> import("./posts/post"))
const NotFound = lazy(()=> import("./not-found/notFound"))
const Products = lazy(()=> import("./products/products"))
const LayoutProtect = lazy(()=> import("./protect-route/layout-protect"))
const LoginProtect = lazy(()=> import("./protect-route/login"))
export {
    SignIn,
    SignUp,
    Admin,
    StudentLayout,
    Teacher,
    NotFound,
    Posts,
    Products,
    LayoutProtect,
    LoginProtect
}