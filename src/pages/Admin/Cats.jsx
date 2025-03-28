import { useState, useEffect } from "react"
import { verifyAuth } from "../../middlewares/adminAuth"

export default function Cats() {
  const [fetched, setFetched] = useState(false)
  const [categories, setCategories] = useState([])
  const [newCategory, setNewCategory] = useState({ name: "", image: "" })
  const [addingCategory, setAddingCategory] = useState(false)
  const [newSubCategory, setNewSubCategory] = useState({})
  const [addingSubCategory, setAddingSubCategory] = useState({})

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const res = await fetch("http://localhost:5000/api/cats/get")
    const data = await res.json()
    if(res.ok) {
      setCategories(data)
      setFetched(true)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewCategory({ ...newCategory, image: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const addCategory = async () => {
    if (newCategory.name.trim()) {
      await fetch("http://localhost:5000/api/cats/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory.name, img: newCategory.image }),
      })
      setNewCategory({ name: "", image: "" })
      setAddingCategory(false)
      fetchCategories()
      setTimeout(() => {
        console.log(newCategory.image)
      }, 1000)
    }
  }

  const updateCategory = async (id, newName) => {
    await fetch("http://localhost:5000/api/cats/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name: newName }),
    })
    fetchCategories()
  }

  const deleteCategory = async (id) => {
    if (confirm("Voulez-vous vraiment supprimer cette catégorie ?")) {
      await fetch("http://localhost:5000/api/cats/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      fetchCategories()
    }
  }

  const addSubCategory = async (catId) => {
    if (newSubCategory[catId]?.trim()) {
      await fetch("http://localhost:5000/api/cats/subcats/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ catId, name: newSubCategory[catId] }),
      })
      setNewSubCategory({ ...newSubCategory, [catId]: "" })
      setAddingSubCategory({ ...addingSubCategory, [catId]: false })
      fetchCategories()
    }
  }

  const updateSubCategory = async (catId, subcatId, newName) => {
    await fetch("http://localhost:5000/api/cats/subcats/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ catId, subcatId, name: newName }),
    })
    fetchCategories()
  }

  const deleteSubCategory = async (catId, subcatId) => {
    if (confirm("Voulez-vous vraiment supprimer cette sous-catégorie ?")) {
      await fetch("http://localhost:5000/api/cats/subcats/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ catId, subcatId }),
      })
      fetchCategories()
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Catégories</h1>

      <div className="mb-6 text-center flex justify-center">
        <button
          onClick={() => setAddingCategory(true)}
          className="flex gap-2 items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all"
        >
          <img src="/add.png" width={30} /> Ajouter une catégorie
        </button>
      </div>

      {addingCategory && (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
          <input
            type="text"
            placeholder="Nom de la catégorie"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            className="w-full p-2 border rounded-lg mb-2"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 border rounded-lg mb-2"
          />
          {newCategory.image && (
            <img src={newCategory.image} alt="Aperçu" className="w-32 h-32 object-cover rounded-lg mb-2" />
          )}
          <button onClick={addCategory} className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition-all">
            ✅ Confirmer
          </button>
        </div>
      )}

      {fetched ?
        <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat._id} className="bg-white bg-opacity-90 backdrop-blur-md shadow-lg rounded-xl p-5">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">{cat.name}</h2>
              <div className="flex gap-2">
                <button onClick={() => updateCategory(cat._id, prompt("Nouveau nom :", cat.name))} className="hover:scale-110 transition-transform">
                  <img src="/edit.png" width={30} />
                </button>
                <button onClick={() => deleteCategory(cat._id)} className="hover:scale-110 transition-transform">
                  <img src="/delete.png" width={30} />
                </button>
              </div>
            </div><br /><hr />

            <div className="mt-4 space-y-2">
              {cat.subcats.map((sub) => (
                <div key={sub.id} className="flex justify-between items-center pl-4 border-l-4 border-gray-300">
                  <p className="text-gray-700">{sub.name}</p>
                  <div className="flex gap-2">
                    <button onClick={() => updateSubCategory(cat._id, sub.id, prompt("Nouveau nom :", sub.name))} className="hover:scale-110 transition-transform">
                      <img src="/edit.png" width={30} />
                    </button>
                    <button onClick={() => deleteSubCategory(cat._id, sub.id)} className="hover:scale-110 transition-transform">
                      <img src="/delete.png" width={30} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <button
                onClick={() => setAddingSubCategory({ ...addingSubCategory, [cat._id]: true })}
                className="flex gap-2 items-center text-blue-600 hover:scale-105 transition-transform"
              >
                <img src="/add.png" width={30} /> Ajouter une sous-catégorie
              </button>
            </div>

            {addingSubCategory[cat._id] && (
              <div className="bg-gray-100 p-4 rounded-lg shadow-md mt-4">
                <input
                  type="text"
                  placeholder="Nom de la sous-catégorie"
                  value={newSubCategory[cat._id] || ""}
                  onChange={(e) => setNewSubCategory({ ...newSubCategory, [cat._id]: e.target.value })}
                  className="w-full p-2 border rounded-lg mb-2"
                />
                <button onClick={() => addSubCategory(cat._id)} className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition-all">
                  ✅ Confirmer
                </button>
              </div>
            )}
          </div>
        ))}
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