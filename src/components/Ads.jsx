import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function Ads({ ads }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const autoPlay = setInterval(() => {
      nextSlide()
    }, 4000)
    return () => clearInterval(autoPlay)
  }, [currentIndex])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % ads.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length)
  }

  return (
    <div className="relative w-full mx-auto mt-8 rounded-2xl overflow-hidden shadow-lg border border-gray-600 bg-gray-900/80 backdrop-blur-xl p-2">
      
      <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden">
        {ads.map((ad, index) => (
          <img
            key={index}
            src={ad.img}
            alt={`Ad ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1200ms] ease-in-out rounded-xl ${
              currentIndex === index
                ? "opacity-100 scale-100 blur-0"
                : "opacity-0 scale-90 blur-sm"
            }`}
          />
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800/80 text-white p-2 rounded-full shadow-md hover:bg-gray-700 transition-all"
      >
        <ChevronLeft size={28} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800/80 text-white p-2 rounded-full shadow-md hover:bg-gray-700 transition-all"
      >
        <ChevronRight size={28} />
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {ads.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-4 h-4 rounded-full cursor-pointer transition-all duration-300 ${
              currentIndex === index
                ? "bg-gradient-to-r from-blue-600 to-indigo-700 scale-110 shadow-md"
                : "bg-gray-500 hover:bg-gray-400"
            }`}
          ></div>
        ))}
      </div>
    </div>
  )
}
