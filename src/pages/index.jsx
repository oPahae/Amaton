import { useEffect, useState } from "react";
import Ads from "@/components/Ads";
import Cats from "@/components/Cats";
import Slider from "@/components/Slider";

export default function Home() {
  const [fetchedAds, setFetchedAds] = useState(false)
  const [fetchedCats, setFetchedCats] = useState(false)
  const [fetchedProds, setFetchedProds] = useState(false)

  const [ads, setAds] = useState([]);
  const [cats, setCats] = useState([]);
  const [prods, setProds] = useState([]);

  const fetchAds = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/ads/get");
      const data = await response.json();
      if(response.ok) {
        setAds(data || []);
        setFetchedAds(true)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des pubs :", error);
    }
  };

  const fetchCats = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/cats/get");
      const data = await response.json();
      if(response.ok) {
        setCats(data || []);
        setFetchedCats(true)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des cats :", error);
    }
  }

  const fetchProds = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/prods/get");
      const data = await response.json();
      if(response.ok) {
        setProds(data || []);
        setFetchedProds(true)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des prods :", error);
    }
  }

  useEffect(() => {
    fetchAds()
    fetchCats()
    fetchProds()
  }, []);

  return (
    <div className="w-full flex flex-col mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Section Publicités */}
      {fetchedAds && fetchedCats && fetchedProds ?
        <>
          <div className="flex flex-col-reverse lg:flex-row gap-3 lg:max-h-[500px]">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold">🏷️ Catégories</h2>
              <Cats cats={cats} />
            </div>
            <Ads ads={ads} />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">🛍️ Produits populaires</h2>
            <Slider prods={[...prods].sort((a, b) => b.buys - a.buys)} />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">⏲ Les plus récents</h2>
            <Slider prods={[...prods].sort((a, b) => new Date(b.date) - new Date(a.date))} />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">🔥 Promotions</h2>
            <Slider prods={[...prods].sort((a, b) => b.promo - a.promo)} />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">💕 Les plus aimés</h2>
            <Slider prods={[...prods].sort((a, b) => b.rating - a.rating)} />
          </div>
        </>
        :
        <div className="w-full flex items-center justify-center h-[200px]">
          <img src="/loadingtest.gif" width={36} />
        </div>
      }
    </div>
  );
}