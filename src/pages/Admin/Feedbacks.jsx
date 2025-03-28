import { useEffect, useState } from "react"
import { verifyAuth } from "../../middlewares/adminAuth"

export default function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState([])
  
  useEffect(async() => {
    try {
      const response = await fetch("http://localhost:5000/api/feedbacks/get")
      const data = await response.json()
      if(response.ok) {
        data.map((f) => {
          f.date = f.date.substring(0, 16).replace("T", " ")
        })
        setFeedbacks(data.reverse() || [])
      }
    } catch (error) {
      console.error("Erreur: " + error)
    }
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">📩 Feedbacks des utilisateurs</h1>

      <div className="space-y-6">
        {feedbacks.map((feedback) => (
          <div key={feedback.id} className="bg-white bg-opacity-90 backdrop-blur-md shadow-lg rounded-xl p-5">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{feedback.user.username}</h2>
                <p className="text-blue-600 text-sm">{feedback.user.email}</p>
              </div>
              <span className="text-gray-500 text-sm">{feedback.date}</span>
            </div>
            <p className="mt-3 text-gray-700 text-sm bg-gray-100 p-3 rounded-lg shadow-inner">{feedback.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export async function getServerSideProps({ req, res }) {
  const admin = verifyAuth(req, res)

  if (!admin) {
    return {
      redirect: {
        destination: "/Admin/Login",
        permanent: false,
      },
    }
  }
  return {
    props: { session: { role: "admin" } },
  }
}