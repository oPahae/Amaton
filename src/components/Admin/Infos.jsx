import { useEffect, useState } from "react"

export default function FooterSettings() {
  const [footerData, setFooterData] = useState({
    tel: "",
    email: "",
    about: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    github: "",
    cih: "",
    paypal: "",
    website: "",
  })
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/infos/get")
        if (!response.ok) throw new Error("Erreur lors du chargement des données")
  
        const data = await response.json()
        
        setFooterData(data && Object.keys(data).length > 0 ? data : {
          tel: "",
          email: "",
          about: "",
          facebook: "",
          instagram: "",
          linkedin: "",
          github: "",
          cih: "",
          paypal: "",
          website: "",
        })
  
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
  
    fetchFooterData()
  }, [])  

  const handleChange = (e) => {
    setFooterData({ ...footerData, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/infos/set", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(footerData),
      })

      if (!response.ok) throw new Error("Erreur lors de la sauvegarde des données")

      setIsEditing(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-full bg-white bg-opacity-90 backdrop-blur-md shadow-2xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Informations du Footer
        </h1>

        {loading ? (
          <div className="w-full flex items-center justify-center h-[100px]">
            <img src="/loadingtest.gif" width={36} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(footerData).map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <label className="text-gray-700 font-semibold capitalize">{key}</label>
                <input
                  type="text"
                  name={key}
                  value={value}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
                    isEditing ? "bg-white" : "bg-gray-200"
                  }`}
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-center space-x-4">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-white px-6 py-3 rounded-xl shadow-md hover:bg-yellow-600 transition-all"
            >
              Modifier ✏
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-green-700 transition-all"
            >
              Enregistrer ✅
            </button>
          )}
        </div>
      </div>
    </div>
  )
}