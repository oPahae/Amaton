import Image from "next/image"
import { useEffect } from "react"
import { FaShoppingCart, FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa"

export default function Card({ prod }) {
  const isPromo = prod.promo > 0
  const finalPrice = isPromo ? (prod.price * (1 - prod.promo / 100)).toFixed(2) : prod.price.toFixed(2)
  const formattedDate = new Date(prod.date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

  const handleLocation = () => {
    if (prod.stock > 0) window.location.href = `/Prod?id=${prod._id}`
  }

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-500" />)
      } else if (i - 0.5 === rating) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />)
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-400" />)
      }
    }
    return stars
  }

  return (
    <div
      onClick={handleLocation}
      className={`w-[250px] relative bg-white shadow-md rounded-xl p-4 overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1 ${
        prod.stock > 0 ? "cursor-pointer" : "cursor-not-allowed opacity-80"
      }`}
    >
      {isPromo && (
        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-bold shadow-md rounded-br-lg rounded-tl-lg z-10">
          -{prod.promo}%
        </div>
      )}

      <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 text-xs font-bold rounded-lg z-10">
        {prod.mark}
      </div>

      <div className="relative w-full h-44 flex justify-center items-center">
        <Image
          src={prod.images[0]}
          alt={prod.name}
          width={160}
          height={160}
          className="transition-all duration-300 transform group-hover:scale-105"
        />
      </div>

      <div className="mt-3 text-center">
        <h2 className="text-md font-semibold text-gray-900 truncate">{prod.name}</h2>

        <div className="flex justify-center items-center mt-1 text-sm">
          {renderStars(prod.rating)}
          <span className="text-gray-500 text-xs ml-2">({prod.cmnts.length} avis)</span>
        </div>

        <div className="mt-2 flex justify-center items-center gap-2">
          {isPromo && <span className="text-red-500 text-sm line-through">{prod.price.toFixed(2)} MAD</span>}
          <span className="text-lg font-bold text-blue-600">{finalPrice} MAD</span>
        </div>

        <p className="text-xs text-gray-500 mt-1">
          📂 {prod.cat} → {prod.subcat}
        </p>

        {prod.descr && (
          <p className="text-xs text-gray-600 mt-2 line-clamp-2">
            {prod.descr.length > 100 ? prod.descr.slice(0, 100) + "..." : prod.descr}
          </p>
        )}

        <div className="mt-2 flex justify-between items-center text-xs font-semibold">
          <span className={`${prod.stock > 0 ? "text-green-600" : "text-red-600"}`}>
            {prod.stock > 0 ? "✔ En stock" : "❌ Épuisé"}
          </span>
          <span className="text-gray-500 flex items-center">
            <FaShoppingCart className="mr-1" /> {prod.buys} ventes
          </span>
        </div>

        <p className="text-xs text-gray-400 mt-1">🕒 {formattedDate}</p>

        <button
          className={`mt-3 px-4 py-2 w-full text-sm font-bold rounded-lg text-white transition-all ${
            prod.stock > 0 ? "bg-yellow-500 hover:bg-yellow-600 shadow-md hover:shadow-lg" : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={prod.stock <= 0}
        >
          👁 Voir le produit
        </button>
      </div>
    </div>
  )
}
