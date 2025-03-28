import { useState, useEffect } from "react"
import Card from "@/components/Admin/Card"
import axios from "axios"
import { verifyAuth } from "../../middlewares/adminAuth"

export default function Prods() {
  const [fetched, setFetched] = useState(false)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [sorting, setSorting] = useState("alpha-desc")
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [promoOnly, setPromoOnly] = useState(false)
  const [prods, setProds] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [images, setImages] = useState([])
  const [categories, setCategories] = useState([])
  const [newProd, setNewProd] = useState({
    name: "",
    mark: "",
    price: "",
    promo: 0,
    stock: "",
    cat: "",
    subcat: "",
    descr: ""
  })

  useEffect(() => {
    fetchProds()
    fetchCategories()
  }, [])

  const fetchProds = async () => {
    const res = await fetch("http://localhost:5000/api/prods/get")
    const data = await res.json()
    if(res.ok) {
      setProds(data || [])
      setFetched(true)
    }
  }

  const fetchCategories = async () => {
    const res = await fetch("http://localhost:5000/api/cats/get")
    const data = await res.json()
    setCategories(data || [])
  }

  const handleAddProd = async (e) => {
    e.preventDefault()
    const formData = {
      ...newProd,
      images,
    }

    try {
      const reponse = await axios.post("http://localhost:5000/api/prods/add", formData, {
        headers: { "Content-Type": "application/json" },
      })
      if (reponse.status == 201)
        fetchProds()
    } catch (error) {
      console.error("Erreur :", error.response?.data || error.message)
    }
  }

  const handleImageUpload = (files) => {
    const newImages = []
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader()
      reader.readAsDataURL(files[i])
      reader.onload = () => {
        newImages.push(reader.result)
        if (newImages.length === files.length) {
          setImages((prev) => [...prev, ...newImages])
        }
      }
      reader.onerror = (error) => console.error("Erreur de lecture du fichier :", error)
    }
  }

  const filteredProds = prods
    .filter((prod) => {
      return (
        (!category || prod.cat === category) &&
        prod.price >= priceRange[0] &&
        prod.price <= priceRange[1] &&
        (!promoOnly || prod.promo > 0) &&
        prod.name.toLowerCase().includes(search.toLowerCase())
      )
    })
    .sort((a, b) => {
      if (sorting === "alpha-desc") return a.name.localeCompare(b.name)
      if (sorting === "alpha-asc") return b.name.localeCompare(a.name)
      if (sorting === "date-desc") return new Date(a.date) - new Date(b.date)
      if (sorting === "date-asc") return new Date(b.date) - new Date(a.date)
      if (sorting === "price-asc") return a.price - b.price
      if (sorting === "price-desc") return b.price - a.price
      return 0
    })

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-6"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Fermer le formulaire" : "Ajouter un produit"}
      </button>

      {showForm && (
        <form className="bg-gray-100 p-6 rounded-lg shadow-md mb-10 space-y-4" onSubmit={handleAddProd}>
          <input type="text" placeholder="Nom" required className="p-2 border rounded w-full" onChange={(e) => setNewProd({ ...newProd, name: e.target.value })} />
          <input type="text" placeholder="Marque" required className="p-2 border rounded w-full" onChange={(e) => setNewProd({ ...newProd, mark: e.target.value })} />
          <input type="number" placeholder="Prix" required className="p-2 border rounded w-full" onChange={(e) => setNewProd({ ...newProd, price: e.target.value })} />
          <input type="number" placeholder="Promo (%)" className="p-2 border rounded w-full" onChange={(e) => setNewProd({ ...newProd, promo: e.target.value })} />
          <input type="number" placeholder="Stock" required className="p-2 border rounded w-full" onChange={(e) => setNewProd({ ...newProd, stock: e.target.value })} />
          
          <select className="p-2 border rounded w-full" value={newProd.cat} onChange={(e) => setNewProd({ ...newProd, cat: e.target.value, subcat: "" })} required>
            <option value="">Sélectionner une catégorie</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>

          <select className="p-2 border rounded w-full" value={newProd.subcat} onChange={(e) => setNewProd({ ...newProd, subcat: e.target.value })} required>
            <option value="">Sélectionner une sous-catégorie</option>
            {categories.find(cat => cat.name === newProd.cat)?.subcats.map((subcat, index) => (
              <option key={index} value={subcat.name}>{subcat.name}</option>
            ))}
          </select>

          <textarea type="text" placeholder="Description" required className="p-2 border rounded w-full" onChange={(e) => setNewProd({ ...newProd, descr: e.target.value })} />
          <input type="file" multiple accept="image/*" className="p-2 border rounded w-full" onChange={(e) => handleImageUpload(e.target.files)} />

          <div className="flex gap-2 mt-2">
            {images.map((img, idx) => (
              <img key={idx} src={img} alt={`Upload ${idx}`} className="w-16 h-16 object-cover rounded-lg" />
            ))}
          </div>

          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg">
            Ajouter
          </button>
        </form>
      )}

      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-10">
        <input
          type="text"
          placeholder="🔍 Rechercher un produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 mb-6 border rounded-lg shadow-md text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <select className="p-3 border rounded-lg" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <select className="p-3 border rounded-lg" value={sorting} onChange={(e) => setSorting(e.target.value)}>
            <option value="alpha-desc">Trier par nom (A-Z)</option>
            <option value="alpha-asc">Trier par nom (Z-A)</option>
            <option value="date-asc">date (plus récent)</option>
            <option value="date-desc">date (plus ancien)</option>
            <option value="price-asc">Prix (moins cher)</option>
            <option value="price-desc">Prix (plus cher)</option>
          </select>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600">Prix: {priceRange[0]}€ - {priceRange[1]}€</label>
            <input type="range" min="0" max="5000" value={priceRange[1]} onChange={(e) => setPriceRange([0, Number(e.target.value)])} className="cursor-pointer" />
          </div>
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={promoOnly} onChange={(e) => setPromoOnly(e.target.checked)} />
            <span>Promo seulement</span>
          </label>
        </div>
      </div>

      {fetched ?
        <div className="flex flex-wrap justify-center gap-8">
          {filteredProds.length > 0 ? filteredProds.map((prod) => <Card key={prod._id} prod={prod} />) : <p className="text-gray-600 text-lg text-center col-span-full">Aucun produit trouvé. 😢</p>}
        </div>
      :
        <div className="w-full flex items-center justify-center h-[100px]">
          <img src="/loadingtest.gif" width={36} />
        </div>  
      }
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