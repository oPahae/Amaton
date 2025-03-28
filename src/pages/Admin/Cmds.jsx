import { useState, useEffect } from "react"
import { verifyAuth } from "../../middlewares/adminAuth"

export default function Cmds() {
  const [fetched, setFetched] = useState(false)
  const [cmds, setCmds] = useState([])
  const [history, setHistory] = useState([])
  const [activeTab, setActiveTab] = useState("commandes")
  const [cancelReason, setCancelReason] = useState({})
  const [showCancelOptions, setShowCancelOptions] = useState({})

  useEffect(() => {
    fetchCmds()
  }, [])

  const fetchCmds = async () => {
    const res = await fetch("http://localhost:5000/api/cmds/get")
    const data = await res.json()
    if(res.ok) {
      setCmds(data.reverse())
      setFetched(true)
    }
  }

  const fetchHistory = async () => {
    const res = await fetch("http://localhost:5000/api/cmds/history")
    const data = await res.json()
    setHistory(data || [])
    console.log(data)
  }

  const validateOrder = async (cmd) => {
    const response = await fetch("http://localhost:5000/api/cmds/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: cmd._id }),
    })

    if(!response.ok) {
      alert(response.status == 400 ? "Stock insuffisant" : "Produit ou commande introuvables")
    }

    else {
      fetchCmds()
      await fetch("http://localhost:5000/api/cmds/mail/validation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cmd }),
      })
    }
  }

  const cancelOrder = async (id, email, infos) => {
    if (cancelReason[id]) {
      const response = await fetch("http://localhost:5000/api/cmds/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

    if(!response.ok) {
      alert(response.status == 400 ? "Une erreur est survenue" : "Produit ou commande introuvables")
    }

    else {
      fetchCmds()
      setCmds(cmds.filter((cmd) => cmd._id !== id))
      await fetch("http://localhost:5000/api/cmds/mail/annulation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, raison: cancelReason, infos }),
      })
    }
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex justify-center gap-6 mb-6">
        <button
          onClick={() => setActiveTab("commandes")}
          className={`px-4 py-2 rounded-lg font-bold transition-all ${
            activeTab === "commandes" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          Commandes
        </button>
        <button
          onClick={() => {
            setActiveTab("historique")
            fetchHistory()
          }}
          className={`px-4 py-2 rounded-lg font-bold transition-all ${
            activeTab === "historique" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          Historique
        </button>
      </div>

      {activeTab === "commandes" ? (
        <div className="space-y-6">
          {cmds.map((cmd) => (
            <div key={cmd._id} className="bg-white bg-opacity-90 backdrop-blur-md shadow-lg rounded-xl p-5">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{cmd.user.username}</h2>
                  <p className="text-gray-600 text-sm">{new Date(cmd.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  <p className="text-blue-600 font-medium">
                    ({cmd.user.email}) • {cmd.user.cmdsCount} commandes
                  </p>
                </div>
              </div>

              <details className="mt-4 bg-gray-100 p-3 rounded-lg shadow-md">
                <summary className="cursor-pointer text-blue-600 font-medium">📦 Voir les produits</summary>
                <ul className="mt-2 space-y-2">
                  {cmd.prods.map((prod) => (
                    <li key={prod.product._id} className="flex justify-between items-center border-b pb-1 text-gray-800">
                      <span>
                        {prod.product.name} ({prod.product.mark}) <b className="text-green-500">× {prod.qtt}</b> (Stock: {prod.product.stock})
                      </span>
                      <span className="font-bold">{(prod.product.price * prod.qtt * (1 - prod.product.promo/100).toFixed(2))} MAD</span>
                    </li>
                  ))}
                </ul>
              </details>
              <br />
              <b>Total: <i>{cmd.total} MAD</i></b>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => validateOrder(cmd)}
                  className="flex gap-2 items-center bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition-all"
                >
                  <img src="/true.png" width={20} /> Valider
                </button>
                <button
                  onClick={() => setShowCancelOptions({ ...showCancelOptions, [cmd._id]: !showCancelOptions[cmd._id] })}
                  className="flex gap-2 items-center bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition-all"
                >
                  <img src="/false.png" width={20} /> Annuler
                </button>
              </div>

              {showCancelOptions[cmd._id] && (
                <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-md">
                  <select
                    className="w-full p-2 border rounded-lg mb-2"
                    value={cancelReason[cmd._id] || ""}
                    onChange={(e) => setCancelReason({ ...cancelReason, [cmd._id]: e.target.value })}
                  >
                    <option value="">Sélectionnez une raison</option>
                    <option value="Rupture de stock">Rupture de stock</option>
                    <option value="Erreur de prix">Erreur de prix</option>
                    <option value="Autre">Autre</option>
                  </select>
                  <button
                    onClick={() => cancelOrder(cmd._id, cmd.user.email, cmd)}
                    className="flex gap-2 items-center bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition-all"
                  >
                    Confirmer l'annulation
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {history.map((his) => (
            <div key={his._id} className="bg-gray-100 shadow-md rounded-xl p-5">
              <h2 className="text-xl font-semibold">{his.user && his.user.username}</h2>
              <p className="text-sm text-gray-600">{his.date.substring(0, 21)}</p>
              <p className="text-sm text-gray-600">{his.code}</p>
              <details className="mt-3">
                <summary className="cursor-pointer text-blue-600">📦 Voir les produits</summary>
                <ul className="mt-2 space-y-2">
                  {his.prods.map((prod) => (
                    <li key={prod.id} className="border-b pb-1 flex justify-between">
                      <span>
                        {prod.name} ({prod.mark}) × {prod.qtt}
                      </span>
                      <span className="font-bold">{(prod.price * prod.qtt * (1 - prod.promo/100)).toFixed(2)} MAD</span>
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          ))}
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