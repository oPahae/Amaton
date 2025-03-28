import { useState, useEffect } from "react"
import { Star, Delete, ChevronLeft, ChevronRight, Tag, Box, Calendar, TrendingUp } from "react-feather"
import { verifyAuth } from "../../middlewares/adminAuth"
import { useRouter } from "next/router"

export default function Prod() {
  const router = useRouter()
  const { id } = router.query
  
  const [product, setProduct] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [reviews, setReviews] = useState([])

  const [found, setFound] = useState(false)

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/prods/getID?id=${id}`)
        .then((res) => res.json())
        .then((data) => {
          if(data == {})
            setFound(false)
          setProduct(data)
          setReviews(data.cmnts || [])
        })
        .catch((err) => console.error("Erreur lors du chargement du produit :", err))
    }
  }, [id])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % product.images.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  if (!product) return (
    <div className="w-full flex items-center justify-center h-[200px]">
      <img src="/loadingtest.gif" width={36} />
    </div>
  )

  const handleDelete = async (cmntID) => {
    try {
      const response = await fetch(`http://localhost:5000/api/prods/deleteCmnt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prodID: id, cmntID })
      })
      if(response.ok) {
        alert("Commentaire supprimé")
      }
    } catch (error) {
      console.log("Error: " + error)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="grid md:grid-cols-2 gap-6 bg-white shadow-md rounded-lg p-6">
        <div className="relative w-full overflow-hidden rounded-lg max-h-[500px]">
          <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {product.images.map((img, index) => (
              <img key={index} src={img} alt={`Image ${index + 1}`} className="w-full flex-shrink-0" />
            ))}
          </div>
          <button onClick={handlePrev} className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-75 hover:opacity-100">
            <ChevronLeft size={20} />
          </button>
          <button onClick={handleNext} className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full opacity-75 hover:opacity-100">
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
            {product.images.map((_, index) => (
              <div key={index} className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-white" : "bg-gray-400"}`}></div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-gray-500 flex items-center"><Tag size={18} className="mr-2" />{product.mark}</p>
          <p className="text-xl font-semibold text-green-600">{(product.price * (1 - product.promo/100))} MAD {product.promo > 0 && <span className="text-red-500 line-through text-lg ml-2">{product.price} MAD</span>}</p>
          
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={i < Math.round(product.rating) ? "text-yellow-500" : "text-gray-300"} />
            ))}
            <span className="ml-2 text-gray-600 text-sm">({product.cmnts.length} avis)</span>
          </div>

          <p className="text-gray-600 flex items-center"><Box size={18} className="mr-2" />Stock: {product.stock}</p>
          <p className="text-gray-600 flex items-center"><TrendingUp size={18} className="mr-2" />Achat(s): {product.buys}</p>
          <p className="text-gray-600 flex items-center"><Calendar size={18} className="mr-2" />Ajouté le: {new Date(product.date).toLocaleDateString()}</p>
          <p className="text-gray-700 text-sm break-words">{product.descr}</p>
        </div>
      </div>

      <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold">Avis des utilisateurs</h2>
        <div className="mt-4 space-y-2">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white p-3 rounded-lg shadow flex justify-between">
              <div>
                <p className="font-bold">{review.user && review.user.username}</p>
                <p className="text-sm">{review.content}</p>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={i < review.rating ? "text-yellow-500" : "text-gray-300"} size={14} />
                  ))}
                </div>
              </div>
              <img onClick={e => handleDelete(review._id)} src="/delete.png" width={30} className="cursor-pointer object-contain" />
            </div>
          ))}
        </div>
      </div>
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