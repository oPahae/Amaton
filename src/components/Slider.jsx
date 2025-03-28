import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Card from "./Card"

const Slider = ({ prods }) => {
  const sliderRef = useRef(null)

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 250
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="relative w-full mx-auto mt-8 overflow-hidden px-4">
      <div
        ref={sliderRef}
        className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide py-3"
      >
        {prods.map((prod, index) => (
          <div
            key={index}
            className="min-w-[250px] transition-transform duration-300 hover:scale-105"
          >
            <Card prod={prod} />
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll("left")}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-900/80 text-white p-2 rounded-full shadow-md hover:bg-gray-700 transition-all"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={() => scroll("right")}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-900/80 text-white p-2 rounded-full shadow-md hover:bg-gray-700 transition-all"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  )
}

export default Slider
