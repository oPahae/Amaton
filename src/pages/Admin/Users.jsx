import { useState, useEffect } from "react"
import axios from "axios"
import { verifyAuth } from "../../middlewares/adminAuth"

export default function Users() {
  const [fetched, setFetched] = useState(false)
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState("")
  const [deleteUserId, setDeleteUserId] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user/getAll")
      const data = await res.json()
      if(res.ok) {
        setUsers(data.reverse() || [])
        setFetched(true)
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error)
    }
  }

  const confirmDelete = (userId) => {
    setDeleteUserId(userId)
  }

  const cancelDelete = () => {
    setDeleteUserId(null)
  }

  const handleDelete = async () => {
    try {
      await axios.post("http://localhost:5000/api/user/drop", { id: deleteUserId })
      setUsers(users.filter((user) => user._id !== deleteUserId))
      setDeleteUserId(null)
    } catch (error) {
      console.error("Erreur lors de la suppression :", error)
    }
  }

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 relative">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Utilisateurs</h1>

      <input
        type="text"
        placeholder="🔍 Rechercher un utilisateur..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 mb-6 border rounded-lg shadow-md text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
      />

      {fetched ?
        <div className="space-y-6">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user._id} className="bg-white bg-opacity-90 backdrop-blur-md shadow-lg rounded-xl p-5">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{user.username}</h2>
                    <p className="text-gray-600 text-sm">{user.email}</p>
                    <p className="text-blue-600 font-medium">Commandes : {user.cmdsCount}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => confirmDelete(user._id)} className="hover:scale-110 transition-transform">
                      <img src="/delete.png" width={30} />
                    </button>
                  </div>
                </div>

                <details className="mt-4 bg-gray-100 p-3 rounded-lg shadow-md">
                  <summary className="cursor-pointer text-blue-600 font-medium">🛒 Voir le panier</summary>
                  <ul className="mt-2 space-y-2">
                    {user.cart.map((item) => (
                      <li key={item._id} className="flex justify-between items-center border-b pb-1 text-gray-800">
                        <span>{item.name} × {item.qtt}</span>
                        <span className="font-bold">{(item.price * item.qtt).toFixed(2)} MAD</span>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Aucun utilisateur trouvé.</p>
          )}
        </div>
      :
        <div className="w-full flex items-center justify-center h-[100px]">
          <img src="/loadingtest.gif" width={36} />
        </div>
      }
      {deleteUserId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-semibold text-gray-900">Confirmer la suppression</h2>
            <p className="text-gray-700 my-4">Voulez-vous vraiment supprimer cet utilisateur ?</p>
            <div className="flex justify-end gap-4">
              <button onClick={cancelDelete} className="px-4 py-2 bg-gray-300 rounded-lg">Annuler</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg">Supprimer</button>
            </div>
          </div>
        </div>
      )}
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