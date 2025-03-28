import React, { useState, useEffect } from "react"

const Ads = () => {
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchAds()
  }, [])

  const fetchAds = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/ads/get")
      const data = await response.json()
      setAds(data || [])
    } catch (error) {
      console.error("Erreur lors du chargement des pubs :", error)
    }
  }

  const handleAddAd = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = async () => {
      try {
        setLoading(true)
        const response = await fetch("http://localhost:5000/api/ads/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64Image: reader.result }),
        })

        if (response.ok) {
          fetchAds()
        } else {
          console.error("Erreur lors de l'ajout")
        }
      } catch (error) {
        console.error("Erreur lors de l'ajout :", error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleDeleteAd = async (id) => {
    try {
      const response = await fetch("http://localhost:5000/api/ads/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        setAds(ads.filter((ad) => ad._id !== id))
      } else {
        console.error("Erreur lors de la suppression")
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error)
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-full bg-white bg-opacity-90 backdrop-blur-md shadow-2xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📢 Publicités</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {ads.map((ad) => (
            <div key={ad._id} className="relative bg-gray-200 rounded-lg shadow-lg overflow-hidden">
              <img src={ad.img} className="w-full object-cover" />
              <button
                onClick={() => handleDeleteAd(ad._id)}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 shadow-md hover:scale-110 transition-all"
              >
                ❌
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleAddAd}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          {loading &&
            <div className="flex items-center justify-center w-[50px] h-[50px]">
              <img src="/loadingtest.gif" width={36} />
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default Ads
