import { useState } from "react"
import Link from "next/link"
import axios from "axios"
import { verifyAuth } from "../../middlewares/adminAuth"

export default function Login() {
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post("/api/admin/login", { password })
      if(response.status === 200)
        window.location.href = "/Admin"
      else
        alert("Error")
    } catch (err) {
      setError(err.response?.data?.message || "incorrect")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-500 to-purple-600 p-6">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          ADMIN
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-6">
          <label className="block mb-2 text-gray-600">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 text-white font-bold rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:rotate-2 transition"
        >
          {loading ? "Loading..." : "LOGIN"}
        </button>
        <br /><br />

        <Link href="/Admin/Forgot" className="w-full flex justify-center text-violet-600 hover:underline">
          Forgot password?
        </Link>
      </form>
    </div>
  )
}

export async function getServerSideProps({ req, res }) {
  const admin = verifyAuth(req, res)

  if (admin) {
    return {
      redirect: {
        destination: "/Admin",
        permanent: false,
      },
    }
  }

  return { props: { title: '...', content: '...' } }
}