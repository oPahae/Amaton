import { useEffect, useState } from "react";
import { verifyAuth } from "../middlewares/auth";

export default function Profile({ session }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newUsername, setNewUsername] = useState(username);
  const [newEmail, setNewEmail] = useState(email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogout = async () => {
    const res = await fetch('/api/auth/logout', { method: 'POST' });
    if (res.ok) {
      window.location.href = '/Login'
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const res = await fetch(`http://localhost:5000/api/user/getInfos?id=${session.id}`);
      if (res.ok) {
        const data = await res.json();
        setUsername(data.username);
        setEmail(data.email);
        setNewUsername(data.username);
        setNewEmail(data.email);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateProfile = async () => {
    const res = await fetch("http://localhost:5000/api/user/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: session.id, username: newUsername, email: newEmail }),
    });
  
    if (res.ok) {
      alert("Profil mis à jour !");
      setUsername(newUsername);
      setEmail(newEmail);
    } else {
      alert("Erreur lors de la mise à jour");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      return alert("Les mots de passe ne correspondent pas");
    }
  
    const res = await fetch("http://localhost:5000/api/user/psswd", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: session.id, currentPassword, newPassword }),
    });
  
    if (res.ok) {
      alert("Mot de passe mis à jour !");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      alert(res.status == 401 ? "Mot de passe actuel incorrect" : "Une erreur est souvenue, ressayez plus tard")
    }
  };  

  const handleDeleteAccount = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer votre compte ?")) return;
    const res = await fetch(`http://localhost:5000/api/user/drop?id=${session.id}`);
    if(res.ok)
      handleLogout()
  };

  return (
    <div className="w-full mx-auto px-4 sm:px-8 lg:px-16 py-10 bg-gray-100">
      
      {/* Section Profil */}
      <div className="flex justify-between lg:flex-row sm:flex-col bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mon Profil</h2>
          <p className="text-gray-700"><strong>Nom d'utilisateur :</strong> {username}</p>
          <p className="text-gray-700"><strong>Email :</strong> {email}</p>
        </div>
        <button
            className="flex self-end items-center justify-center w-[180px] h-[60px] px-6 py-3 mt-6 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 text-left shadow-md"
            onClick={handleLogout}
          >
            <img
              src="/logout.png"
              alt="Logout"
              className="h-5 w-5 mr-3"
            />
            <span className="text-base font-medium">Logout</span>
          </button>
      </div>

      {/* Section Modifier le profil */}
      <div className="flex flex-col mt-6 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Modifier le Profil</h2>
        <div className="w-full flex gap-2 lg:flex-row sm:flex-col">
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            className="w-full border p-2 rounded-md mb-3"
            placeholder="Nouveau nom d'utilisateur"
          />
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full border p-2 rounded-md mb-3"
            placeholder="Nouvel email"
          />
        </div>
        <button
          onClick={handleUpdateProfile}
          className="w-[180px] self-end bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-semibold"
        >
          Mettre à jour
        </button>
      </div>

      {/* Section Modifier le mot de passe */}
      <div className="flex flex-col mt-6 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Modifier le Mot de Passe</h2>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full border p-2 rounded-md mb-3"
          placeholder="Mot de passe actuel"
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border p-2 rounded-md mb-3"
          placeholder="Nouveau mot de passe"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border p-2 rounded-md mb-3"
          placeholder="Confirmer le mot de passe"
        />
        <button
          onClick={handleChangePassword}
          className="w-[220px] self-end bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg font-semibold"
        >
          Modifier le mot de passe
        </button>
      </div>

      {/* Section Supprimer le compte */}
      <div className="flex flex-col mt-6 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-2xl font-semibold mb-4 text-red-600">Supprimer le Compte</h2>
        <p className="text-gray-600 mb-4">Attention, cette action est irréversible.</p>
        <button
          onClick={handleDeleteAccount}
          className="w-[220px] self-end bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg font-semibold"
        >
          Supprimer mon compte
        </button>
      </div>

    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  const user = verifyAuth(req, res);

  if (!user) {
    return {
      redirect: {
        destination: "/Login",
        permanent: false,
      },
    };
  }

  return {
    props: { session: { username: user.username, id: user.id } },
  };
}