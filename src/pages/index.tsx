import { lazy } from "react";
const SignIn = lazy(()=> import("./auth/sign-in"))
const SignUp = lazy(()=> import("./auth/sign-up"))
const Admin = lazy(()=> import("./admin-layout/admin-layout"))
const Student = lazy(()=> import("./student-layout/student-layout"))
const Teacher = lazy(()=> import("./teacher-layout/teacher-layout"))
const Posts = lazy(()=> import("./posts/post"))
const NotFound = lazy(()=> import("./not-found/notFound"))
const Products = lazy(()=> import("./products/products"))
export {
    SignIn,
    SignUp,
    Admin,
    Student,
    Teacher,
    NotFound,
    Posts,
    Products
}