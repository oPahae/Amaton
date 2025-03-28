import Link from "next/link"
import Image from "next/image"
import { useEffect } from "react"

export default function Cats({ cats }) {
  return (
    <div className="mx-0 w-full h-[96%] mb-2 overflow-y-scroll">
      <div className="flex flex-col gap-3">
        {cats.length > 0 ? (
          cats.map((cat) => (
            <Link key={cat._id} href={`/Cat?name=${cat.name && cat.name.replaceAll(" ", "+")}`} className="group">
              <div className="flex items-center gap-4 bg-white w-full shadow-md rounded-lg p-4 hover:shadow-lg transition-all duration-300 cursor-pointer">
                
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={cat.img}
                    alt={cat.name}
                    layout="fill"
                    objectFit="contain"
                    className="drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                <div className="flex flex-col">
                  <p className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-all">
                    {cat.name}
                  </p>
                  
                  {cat.subcats && cat.subcats.length > 0 && (
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 flex flex-wrap gap-2">
                      {cat.subcats.map((subcat, index) => (
                        <span key={index} className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-md text-xs">
                          {subcat.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-300 text-lg text-center">
            Aucune catégorie trouvée. 😢
          </p>
        )}
      </div>
    </div>
  )
}
