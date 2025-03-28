import { useState } from "react";
import { verifyAuth } from "../middlewares/auth";

export default function Feedback({ session }) {
  const [content, setContent] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setMsg("❌ Le message ne peut pas être vide.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/feedbacks/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: session.id, content })
      });      
      if(res.ok) {
        setMsg("✅ Votre avis a été envoyé avec succès !");
        setContent("");
        setTimeout(() => {
          setMsg("")
        }, 1000);
      }
    } catch (error) {
      console.error("Error: " + error)
    }
  };

  return (
    <div className="max-w-lg mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">📝 Donnez votre avis</h1>

      <form onSubmit={handleSubmit} className="bg-white bg-opacity-90 backdrop-blur-md shadow-lg rounded-xl p-5">
        {/* Champ de texte */}
        <textarea
          className="w-full p-3 border rounded-lg shadow-inner text-gray-700 focus:ring-2 focus:ring-blue-500"
          placeholder="Écrivez votre message ici..."
          rows="4"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

        {/* Message de confirmation ou d'erreur */}
        {msg && <p className="mt-3 text-center text-sm font-semibold">{msg}</p>}

        {/* Bouton d'envoi */}
        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 text-white font-bold py-2 rounded-lg shadow-md hover:scale-105 transition-all"
        >
          🚀 Envoyer
        </button>
      </form>
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