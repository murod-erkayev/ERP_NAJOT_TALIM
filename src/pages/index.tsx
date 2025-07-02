import { lazy } from "react";
const SignIn = lazy(()=> import("./auth/sign-in"))
const SignUp = lazy(()=> import("./auth/sign-up"))
export {
    SignIn,
    SignUp
}