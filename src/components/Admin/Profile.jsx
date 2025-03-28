import { useEffect, useState } from "react"

export default function Profile({ session }) {
  const [email, setEmail] = useState("")
  const [newEmail, setNewEmail] = useState(email)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleLogout = async () => {
    const res = await fetch('/api/admin/logout', { method: 'POST' })
    if (res.ok) {
      window.location.href = '/Admin/Login'
    }
  }

  const handleUpdateEmail = async () => {
    const res = await fetch("http://localhost:5000/api/admin/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newEmail }),
    })
  
    if (res.ok) {
      alert("Email mis à jour !")
      setEmail(newEmail)
    } else {
      alert("Erreur lors de la mise à jour")
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      return alert("Les mots de passe ne correspondent pas")
    }
  
    const res = await fetch("http://localhost:5000/api/admin/psswd", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    })
  
    if (res.ok) {
      alert("Mot de passe mis à jour !")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } else {
      alert(res.status == 401 ? "Mot de passe actuel incorrect" : "Une erreur est souvenue, ressayez plus tard")
    }
  }  

  return (
    <div className="w-full mx-auto px-4 sm:px-8 lg:px-16 py-10 bg-gray-100">

      <div className="flex flex-col mt-6 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Modifier l'email</h2>
        <div className="w-full flex gap-2 lg:flex-row sm:flex-col">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full border p-2 rounded-md mb-3"
            placeholder="Nouvel email"
            required
          />
        </div>
        <button
          onClick={handleUpdateEmail}
          className="w-[180px] self-end bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-semibold"
        >
          Mettre à jour
        </button>
      </div>

      <div className="flex flex-col mt-6 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Modifier le Mot de Passe</h2>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full border p-2 rounded-md mb-3"
          placeholder="Mot de passe actuel"
          required
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border p-2 rounded-md mb-3"
          placeholder="Nouveau mot de passe"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border p-2 rounded-md mb-3"
          placeholder="Confirmer le mot de passe"
          required
        />
        <button
          onClick={handleChangePassword}
          className="w-[220px] self-end bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg font-semibold"
        >
          Modifier le mot de passe
        </button>
      </div>

      <button className="flex self-end items-center justify-center w-[180px] h-[60px] px-6 py-3 mt-6 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 text-left shadow-md" onClick={handleLogout}>
        <img src="/logout.png" alt="Logout" className="h-5 w-5 mr-3" />
        <span className="text-base font-medium">Logout</span>
      </button>

    </div>
  )
}