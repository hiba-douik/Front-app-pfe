"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Get the redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || "/dashboard"

  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!credentials.email) {
      newErrors.email = "Email est requis"
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = "Format email invalide"
    }

    if (!credentials.password) {
      newErrors.password = "Mot de passe est requis"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) return

    try {
      setIsSubmitting(true)
      await login(credentials)
      navigate(from, { replace: true })
    } catch (error) {
      setErrors({
        general: error.message || "Échec de connexion. Veuillez réessayer.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">Connexion</h2>
        </div>

        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{errors.general}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={credentials.email}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  errors.email ? "border-red-300" : "border-gray-300 dark:border-gray-600"
                } placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Email"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={credentials.password}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-3 py-2 border ${
                  errors.password ? "border-red-300" : "border-gray-300 dark:border-gray-600"
                } placeholder-gray-500 text-gray-900 dark:text-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                placeholder="Mot de passe"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                Se souvenir de moi
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                Mot de passe oublié?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : null}
              Se connecter
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Pas encore de compte?{" "}
              <Link to="/auth/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                S'inscrire
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
