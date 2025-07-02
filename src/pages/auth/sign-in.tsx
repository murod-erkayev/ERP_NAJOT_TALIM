import { useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { authService } from "@service/auth.service"
import loginImage from "../../assets/photo_2025-07-02_18-26-01.jpg"

const SignInSchema = Yup.object({
  email: Yup.string()
    .email("Emailni to‘g‘ri formatda kiriting")
    .required("Email kiritish majburiy"),
  password: Yup.string()
    .min(6, "Kamida 6 ta belgi bo‘lishi kerak")
    .max(12, "Eng ko‘pi 12 ta belgi bo‘lsin")
    .required("Parol kiritish majburiy"),
})

export const SignIn = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true)
    setError("")
    try {
      const res = await authService.sigIn(values)
      return res
    } catch (err) {
      console.log("Email yoki Password Hato");
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex w-1/2 bg-[#FAF9F3] items-center justify-center">
        <img src={loginImage} alt="Login rasm" className="w-3/4 h-auto" />
      </div>
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-8">
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={SignInSchema}
          onSubmit={handleSubmit}
        >
          <Form className="w-full max-w-md">
            <h2 className="text-3xl font-semibold mb-6">Kirish</h2>

            <Field
              name="email"
              type="email"
              placeholder="Email"
              className="w-full mb-2 px-4 py-2 border border-gray-300 rounded bg-blue-50"
            />
            <ErrorMessage name="email" component="div" className="text-red-500 text-sm mb-2" />
              <Field
                name="password"
                type="password"
                placeholder="Parol"
                className="w-full mb-2 px-4 py-2 border border-gray-300 rounded bg-blue-50"
              />
            <ErrorMessage name="password" component="div" className="text-red-500 text-sm mb-2" />

            {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded text-white ${
                loading ? "bg-gray-400" : "bg-[#BB8B54] hover:bg-[#a37444]"
              }`}
            >
              {loading ? "Yuklanmoqda..." : "Kirish"}
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  )
}

export default SignIn
