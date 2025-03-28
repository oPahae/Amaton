import { useState, useEffect } from "react";
import Card from "../components/Card";
import { useRouter } from "next/router";
import { verifyAuth } from "../middlewares/auth";

export default function Results({ session }) {
  const [fetched, setFetched] = useState(false);
  const router = useRouter()
  const { name } = router.query

  // États des filtres
  const [subcat, setsubcat] = useState("");
  const [sorting, setSorting] = useState("alpha-desc");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [promoOnly, setPromoOnly] = useState(false);
  const [prods, setProds] = useState([]);
    
  useEffect(() => {
    fetchProds()
  }, []);
    
  const fetchProds = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/prods/get");
      const data = await response.json();
      if(response.ok) {
        setProds(data);
        setFetched(true)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des pubs :", error);
    }
  };
  const subCategories = [...new Set(prods.map(prod => prod.subcat))];

  // Filtrage des produits
  const filteredProds = prods
  .filter((prod) => {
    return (
      (!subcat || prod.subcat === subcat) &&
      (prod.price >= priceRange[0] && prod.price <= priceRange[1]) &&
      (!promoOnly || prod.promo > 0) &&
      (prod.cat === name)
    );
  })
  .sort((a, b) => {
    if (sorting === "alpha-desc") return a.name.localeCompare(b.name);
    if (sorting === "alpha-asc") return b.name.localeCompare(a.name);
    if (sorting === "date-asc") return new Date(a.date) - new Date(b.date);
    if (sorting === "date-desc") return new Date(b.date) - new Date(a.date);
    if (sorting === "price-asc") return a.price - b.price;
    if (sorting === "price-desc") return b.price - a.price;
    if (sorting === "buys-asc") return a.buys - b.buys;
    if (sorting === "buys-desc") return b.buys - a.buys;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
      <h1 className="text-3xl font-bold text-gray-900 text-center mb-8 drop-shadow-lg">
        {"🛍️ Catégorie : '" + (name || "") + "'"}
      </h1>

      {/* Filtres */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Catégorie */}
          <select className="p-3 border rounded-lg" value={subcat} onChange={(e) => setsubcat(e.target.value)}>
          <option value="">Toutes les sous-catégories</option>
          {subCategories.map((sub, index) => (
              <option key={index} value={sub}>{sub}</option>
          ))}
          </select>

          {/* Sous-catégorie */}
          <select className="p-3 border rounded-lg" value={sorting} onChange={(e) => setSorting(e.target.value)}>
            <option value="alpha-desc">Trier par nom (A-Z)</option>
            <option value="alpha-asc">Trier par nom (Z-A)</option>
            <option value="date-asc">date (plus récent)</option>
            <option value="date-desc">date (plus ancien)</option>
            <option value="price-asc">prix (moins chère)</option>
            <option value="price-desc">prix (plus chère)</option>
            <option value="buys-asc">nombre d'achats (plus petit)</option>
            <option value="buys-desc">nombre d'achats (plus grand)</option>
          </select>

          {/* Prix */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600">Prix: {priceRange[0]}€ - {priceRange[1]}€</label>
            <input
              type="range"
              min="0"
              max="5000"
              step="10"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, Number(e.target.value)])}
              className="cursor-pointer"
            />
          </div>

          {/* Promo */}
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={promoOnly} onChange={(e) => setPromoOnly(e.target.checked)} />
            <span>Promo seulement</span>
          </label>
        </div>
      </div>

      {/* Produits */}
      {fetched ?
        <div className="flex flex-wrap justify-center gap-8">
          {filteredProds.length > 0 ? (
            filteredProds.map((prod) => <Card key={prod._id} prod={prod} />)
          ) : (
            <p className="text-gray-600 text-lg text-center col-span-full">
              Aucun produit trouvé. 😢
            </p>
          )}
        </div>
      :
        <div className="w-full flex items-center justify-center h-[100px]">
          <img src="/loadingtest.gif" width={36} />
        </div>
      }
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  const user = verifyAuth(req, res);

  if (!user) {
    return {
      redirect: {
        destination: "/Login",
        permanent: false,
      },
    };
  }

  return {
    props: { session: { username: user.username, id: user.id } },
  };
}