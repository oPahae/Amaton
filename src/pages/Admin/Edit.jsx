import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import axios from "axios"
import { verifyAuth } from "../../middlewares/adminAuth"

export default function EditProd() {
  const router = useRouter()
  const { id } = router.query

  const [prod, setProd] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newImages, setNewImages] = useState([])
  const [cats, setCats] = useState([])
  
  useEffect(() => {
    if (id) fetchProd()
    fetchCategories()
  }, [id])

  const fetchProd = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/prods/getID?id=${id}`)
      setProd(res.data)
      setLoading(false)
    } catch (error) {
      console.error("Erreur lors de la récupération du produit :", error)
    }
  }

  const fetchCategories = async () => {
    const res = await fetch("http://localhost:5000/api/cats/get")
    const data = await res.json()
    setCats(data || [])
  }

  const handleChange = (e) => {
    setProd({ ...prod, [e.target.name]: e.target.value })
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const imageReaders = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
        reader.readAsDataURL(file)
      })
    })

    Promise.all(imageReaders)
      .then((results) => {
        setNewImages([...newImages, ...results])
      })
      .catch((error) => console.error("Erreur de lecture des images :", error))
  }

  const handleImageDelete = (index) => {
    setProd({ ...prod, images: prod.images.filter((_, i) => i !== index) })
  }

  const handleNewImageDelete = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const updatedProd = { ...prod, images: [...prod.images, ...newImages] }

    try {
      await axios.put("http://localhost:5000/api/prods/update", updatedProd, {
        headers: { "Content-Type": "application/json" },
      })
      alert("Produit mis à jour avec succès !")
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error)
    }
  }

  if (loading) return <p>Chargement...</p>
  if (!prod) return <p>Produit introuvable.</p>

  return (
    <div className="mt-4 mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Modifier le produit</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" value={prod.name} onChange={handleChange} placeholder="Nom" className="w-full p-2 border rounded"/>
        <input type="text" name="mark" value={prod.mark} onChange={handleChange} placeholder="Marque" className="w-full p-2 border rounded"/>
        <input type="number" name="price" value={prod.price} onChange={handleChange} placeholder="Prix" className="w-full p-2 border rounded"/>
        <input type="number" name="promo" value={prod.promo} onChange={handleChange} placeholder="Promo (%)" className="w-full p-2 border rounded"/>
        <input type="number" name="stock" value={prod.stock} onChange={handleChange} placeholder="Stock" className="w-full p-2 border rounded"/>

        <select className="p-2 border rounded w-full" value={prod.cat} onChange={(e) => setProd({ ...prod, cat: e.target.value, subcat: "" })} required>
          <option value="">Sélectionner une catégorie</option>
          {cats.map((cat) => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))}
        </select>

        <select className="p-2 border rounded w-full" value={prod.subcat} onChange={(e) => setProd({ ...prod, subcat: e.target.value })} required>
          <option value="">Sélectionner une sous-catégorie</option>
          {cats.find(cat => cat.name === prod.cat)?.subcats.map((subcat, index) => (
            <option key={index} value={subcat.name}>{subcat.name}</option>
          ))}
        </select>

        <input type="text" name="descr" value={prod.descr} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded"/>

        <div>
          <h3 className="font-semibold mb-2">Images actuelles</h3>
          <div className="flex gap-2">
            {prod.images.map((img, index) => (
              <div key={index} className="relative">
                <img src={img} alt="Produit" className="w-20 h-20 object-cover rounded"/>
                <button type="button" onClick={() => handleImageDelete(index)} className="absolute top-0 right-0 bg-red-600 text-white text-xs p-1 rounded">X</button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Ajouter de nouvelles images (max 5)</h3>
          <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="w-full p-2 border rounded"/>
          <div className="flex gap-2 mt-2">
            {newImages.map((img, index) => (
              <div key={index} className="relative">
                <img src={img} alt="Nouvelle Image" className="w-20 h-20 object-cover rounded"/>
                <button type="button" onClick={() => handleNewImageDelete(index)} className="absolute top-0 right-0 bg-red-600 text-white text-xs p-1 rounded">X</button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Mettre à jour</button>
      </form>
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