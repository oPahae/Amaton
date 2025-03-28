import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function Footer() {
  const router = useRouter()
  const [footer, setFooter] = useState({})
  const footerInit = { tel: "", email: "", about: "", facebook: "", instagram: "", linkedin: "", github: "", cih: "", paypal: "", website: "" }

  useEffect(() => {
    fetchFooter()
  }, [])

  const fetchFooter =  async () => {
    try {
      const res = await fetch("http://localhost:5000/api/infos/get")
      const data = await res.json()
      if(res.ok) {
        setFooter(data || footerInit)
      }
    } catch (error) {
      console.error("Error: " + error)
    }
  }

  return (
    <footer className="w-full bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">📞 Contactez-nous</h3>
            <p className="flex items-center space-x-3">
              <Image src="/phone.png" alt="Téléphone" width={20} height={20} />
              <span>{footer.tel}</span>
            </p>
            <p className="flex items-center space-x-3 mt-2">
              <Image src="/email.png" alt="Email" width={20} height={20} />
              <span>{footer.email}</span>
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">ℹ️ À propos</h3>
            <p className="text-gray-400 text-sm">
              {footer.about}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">🌍 Suivez-nous</h3>
            <div className="flex space-x-4">
              <Image onClick={e => window.location.href = footer.facebookfacebook}
                src="/facebook.png" alt="Facebook" width={30} height={30} className="cursor-pointer hover:scale-110 transition" />
              <Image onClick={e => window.location.href = footer.instagram}
                src="/instagram.png" alt="Instagram" width={30} height={30} className="cursor-pointer hover:scale-110 transition" />
              <Image onClick={e => window.location.href = footer.linkedin}
                src="/linkedin.png" alt="LinkedIn" width={30} height={30} className="cursor-pointer hover:scale-110 transition" />
              <Image onClick={e => window.location.href = footer.github}
                src="/github.png" alt="Twitter" width={30} height={30} className="cursor-pointer hover:scale-110 transition" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">💳 Modes de paiement</h3>
            <div className="flex space-x-3">
              <Image src="/cihbank.png" title={footer.cih} width={90} height={25} className="cursor-pointer" />
              <Image src="/paypal.png" title={footer.paypal} width={40} height={25} className="cursor-pointer" />
            </div>
          </div>

        </div>

        <div className="mt-10 border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} {footer.website}. Tous droits réservés.</p>
          {!router.pathname.startsWith("/Admin") &&
            <Link href={"/Feedback"} className="mt-4 sm:mt-0 bg-yellow-500 text-gray-900 font-semibold px-6 py-2 rounded-full shadow-md hover:bg-yellow-600 transition">
              ✍️ Donner votre avis
            </Link>
          }
        </div>
      </div>
    </footer>
  )
}