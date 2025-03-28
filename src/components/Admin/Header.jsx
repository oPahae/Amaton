import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [fetched, setFetched] = useState(false)
  const [cmds, setCmds] = useState([])

  useEffect(() => {
    fetchCmds()
  }, [])

  const fetchCmds = async () => {
    const res = await fetch("http://localhost:5000/api/cmds/get")
    const data = await res.json()
    if(res.ok) {
      setCmds(data.reverse())
      setFetched(true)
    }
  }

  return (
    <header className="h-[80px] bg-gradient-to-r from-blue-700 via-blue-800 to-blue-900 shadow-xl fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center py-3">
          
          <div className="flex items-center space-x-3 group">
            <Image
              src="/logoA.png"
              alt="Logo"
              width={60}
              height={60}
              className="drop-shadow-lg transform group-hover:scale-110 transition-all duration-300"
            />
          </div>

          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/Admin/" className="flex gap-2 text-white text-lg font-medium hover:text-yellow-300 transition-all transform hover:scale-110">
              <img src="/settings.png" width={28} /> Général
            </Link>
            <Link href="/Admin/Prods" className="flex gap-2 text-white text-lg font-medium hover:text-yellow-300 transition-all transform hover:scale-110">
              <img src="/product.png" width={28} /> Produits
            </Link>
            <Link href="/Admin/Cats" className="flex gap-2 text-white text-lg font-medium hover:text-yellow-300 transition-all transform hover:scale-110">
              <img src="/category.png" width={28} /> Catégories
            </Link>
            <Link href="/Admin/Users" className="flex gap-2 text-white text-lg font-medium hover:text-yellow-300 transition-all transform hover:scale-110">
              <img src="/users.png" width={28} /> Utilisateurs
            </Link>
            <Link href="/Admin/Cmds" className="flex gap-2 text-white text-lg font-medium hover:text-yellow-300 transition-all transform hover:scale-110">
              <img src="/order.png" width={28} /> Commandes
              {cmds.length > 0 && <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-sm text-white">{cmds.length}</div>}
            </Link>
            <Link href="/Admin/Feedbacks" className="flex gap-2 text-white text-lg font-medium hover:text-yellow-300 transition-all transform hover:scale-110">
              <img src="/feedback.png" width={28} /> Avis
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

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white bg-opacity-90 backdrop-blur-xl shadow-2xl py-5 px-8 flex flex-col space-y-5 rounded-b-xl animate-slide-down">
          <Link href="/Admin/" className="flex gap-2 text-gray-800 text-lg font-medium hover:text-blue-500 transition-all transform hover:scale-105">
            <img src="/settings.png" width={28} /> Général
          </Link>
          <Link href="/Admin/Prods" className="flex gap-2 text-gray-800 text-lg font-medium hover:text-blue-500 transition-all transform hover:scale-105">
            <img src="/product.png" width={28} /> Produits
          </Link>
          <Link href="/Admin/Cats" className="flex gap-2 text-gray-800 text-lg font-medium hover:text-blue-500 transition-all transform hover:scale-105">
            <img src="/category.png" width={28} /> Catégories
          </Link>
          <Link href="/Admin/Users" className="flex gap-2 text-gray-800 text-lg font-medium hover:text-blue-500 transition-all transform hover:scale-105">
            <img src="/users.png" width={28} /> Utilisateurs
          </Link>
          <Link href="/Admin/Cmds" className="flex gap-2 text-gray-800 text-lg font-medium hover:text-blue-500 transition-all transform hover:scale-105">
            <img src="/order.png" width={28} /> Commandes
            {cmds.length > 0 && <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-sm text-white">{cmds.length}</div>}
          </Link>
          <Link href="/Admin/Feedbacks" className="flex gap-2 text-gray-800 text-lg font-medium hover:text-blue-500 transition-all transform hover:scale-105">
            <img src="/feedback.png" width={28} /> Avis
          </Link>
        </div>
      )}
    </header>
  )
}
