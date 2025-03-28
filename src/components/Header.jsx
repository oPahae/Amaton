import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const seachTermRef = useRef("")


  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === "Enter" && searchTerm != "") window.location.href = `/Results?keys=${seachTermRef.current.replace(" ", "+")}` }
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])
  useEffect(() => {
    seachTermRef.current = searchTerm
  }, [searchTerm])

  return (
    <header className="h-[80px] bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-xl fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center p-3">
          <Link href="/" className="flex items-center space-x-3 group">
            <Image
              src="/logoA.png"
              alt="Logo"
              width={60}
              height={60}
              className="drop-shadow-lg"
            />
            <span className="hidden lg:block text-white text-3xl font-bold tracking-wide drop-shadow-lg animate-pulse">
              Amaton
            </span>
          </Link>

          <div className="flex-1 mx-4">
            <div className="relative">
              <input
                ref={seachTermRef}
                type="text"
                placeholder="🔍 Rechercher..."
                className="w-full px-5 py-3 border border-transparent rounded-full shadow-md focus:ring-4 focus:ring-yellow-500 focus:outline-none transition-all text-gray-800 bg-white bg-opacity-90 backdrop-blur-md placeholder-gray-500"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <Link href={`/Results?keys=${searchTerm.replace(" ", "+")}`} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-400 text-white px-4 py-2 rounded-full hover:bg-yellow-500 transition-all shadow-md hover:scale-110">
                🔎
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-6">
            <Link href="/Profile" className="flex items-center space-x-2 text-white text-lg font-medium hover:text-yellow-300 transition-all transform hover:scale-110">
              <img src="/client.png" width={28} />
              <span>Profile</span>
            </Link>
            <Link href="/Cart" className="flex items-center space-x-2 text-white text-lg font-medium hover:text-yellow-300 transition-all transform hover:scale-110">
              <img src="/shop.png" width={28} />
              <span>Panier</span>
            </Link>
          </div>

          <button
            className="lg:hidden text-white text-3xl hover:text-yellow-300 transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-white bg-opacity-90 backdrop-blur-xl shadow-2xl py-5 px-8 flex flex-col space-y-5 rounded-b-xl animate-slide-down">
          <Link href="/Profile" className="flex items-center space-x-3 text-gray-800 text-lg font-medium hover:text-blue-500 transition-all transform hover:scale-110">
            <img src="/client.png" width={28} />
            <span>Profile</span>
          </Link>
          <Link href="/Cart" className="flex items-center space-x-3 text-gray-800 text-lg font-medium hover:text-blue-500 transition-all transform hover:scale-110">
            <img src="/shop.png" width={28} />
            <span>Panier</span>
          </Link>
        </div>
      )}
    </header>
  )
}
