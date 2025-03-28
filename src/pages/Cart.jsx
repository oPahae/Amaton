import { useState, useEffect, useRef } from "react";
import { ChevronLeft, CheckCircle, Plus, Minus, Home } from "react-feather";
import { gsap } from "gsap";
import Link from "next/link";
import QRCode from "react-qr-code";
import { verifyAuth } from "../middlewares/auth";

export default function Cart({ session }) {
  const [fetched, setFetched] = useState(false);
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState([]);
  const [cmdsCount, setCmdsCount] = useState(0);
  const [orderCode, setOrderCode] = useState("");
  const [enabled, setEnabled] = useState(false)

  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qtt) * (1 - item.promo/100), 0).toFixed(2);
  const contentRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
    );
  }, [step]);

  useEffect(() => {
    if (step === 2) {
      setOrderCode(generateOrderCode());
    }
  }, [step]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/user/getInfos?id=${session.id}`);
        const data = await res.json();
        if (res.ok && data.cart) {
          setCart(data.cart)
          console.log(data.cart)
          setEnabled(data.cart.length == 0 ? false : true)
          setCmdsCount(data.cmdsCount)
          setFetched(true)
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du panier :", error);
      }
    };

    fetchCart();
  }, []);

  const generateOrderCode = () => {
    return Math.random().toString(36).substring(2, 11).toUpperCase();
  };

  const updateQuantity = (name, amount) => {
    setCart(cart.map(item =>
      item.name === name ? { ...item, qtt: Math.max(1, item.qtt + amount) } : item
    ));
  };

  const handleCmd = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/cmds/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: session.id, // Référence ObjectId de l'utilisateur
          prods: cart.map(item => ({
            product: item.id, // Référence ObjectId du produit
            qtt: item.qtt,    // Quantité commandée
          })),
          total: totalPrice,
          code: orderCode, // Code de commande généré
        }),
      });
  
      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de la commande");
      }
  
      console.log("Commande ajoutée avec succès !");
    } catch (error) {
      console.error("Erreur :", error);
    }
  };  

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 flex gap-8">
      {/* Barre de progression verticale */}
      <div className="flex flex-col items-center">
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="flex flex-col items-center">
            <div className={`w-12 h-12 flex items-center justify-center rounded-full text-white font-bold shadow-lg
                ${num <= step ? "bg-blue-600" : "bg-gray-300"}`}>
              {num < step ? <CheckCircle size={24} /> : num}
            </div>
            {num !== 4 && <div className={`w-1 h-16 ${num < step ? "bg-blue-600" : "bg-gray-300"}`}></div>}
          </div>
        ))}
      </div>

      {/* Contenu des étapes avec animation */}
      {fetched ?
        <div ref={contentRef} className="flex-1 bg-white shadow-xl p-8 rounded-lg border">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">🛒 Votre panier</h2>
              {cart.map(item => (
                <div key={item.name} className="flex justify-between items-center border-b py-4">
                  <span className="font-medium">{item.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold">{(item.price * (1 - item.promo/100)).toFixed(2)}€</span>
                    <button onClick={() => updateQuantity(item.name, -1)} className="bg-yellow-400 p-2 rounded-full hover:bg-gray-300">
                      <Minus size={16} />
                    </button>
                    <span className="text-lg">{item.qtt}</span>
                    <button onClick={() => updateQuantity(item.name, 1)} className="bg-yellow-400 p-2 rounded-full hover:bg-gray-300">
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <div className="text-xl font-bold mt-6">Total : {totalPrice}€</div>
              {enabled &&
                <button onClick={() => setStep(2)} className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-500">
                  Passer à la commande
                </button>
              }
            </div>
          )}

          {step === 2 && (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-6">📦 Commande en cours</h2>
              <p className="text-gray-700 mb-4">
                Votre commande a été enregistrée avec succès. Vous recevrez un message avec l'agence la plus proche où vous pourrez récupérer votre commande dès qu'elle sera vérifiée et acceptée.
              </p>
              <div className="bg-gray-100 p-4 rounded-lg inline-block">
                <h3 className="text-lg font-bold">📌 Code de commande :</h3>
                <p className="text-2xl font-mono text-blue-600 mt-2">{orderCode}</p>
              </div>
              <div className="mt-6 flex justify-center">
                <QRCode value={orderCode} size={150} />
              </div>
              <button onClick={() => setStep(3)} className="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-500">
                Suivant
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">📋 Résumé de la commande</h2>
              {cart.map(item => (
                <div key={item.name} className="flex justify-between py-3 border-b">
                  <span>{item.name} <b className="text-[orange]">x{item.qtt}</b></span>
                  <span className="font-semibold">{(item.price * item.qtt * (1 - item.promo/100)).toFixed(2)}€</span>
                </div>
              ))}
              <div className="text-xl font-bold mt-6">Total : {totalPrice}€</div>
              <button onClick={() => { setStep(4); handleCmd() }} className="w-full flex justify-center items-center gap-2 bg-green-600 text-white py-3 rounded-lg mt-6 hover:bg-green-500">
                Valider la commande <CheckCircle size={16} />
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="text-center">
              <CheckCircle size={60} className="text-green-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold">🎉 Commande validée !</h2>
              <p className="text-gray-500 mt-2 text-lg">Merci pour votre achat 🙌</p>
              <Link href="/" className="w-[240px] flex justify-center items-center gap-2 mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg mx-auto hover:bg-blue-500">
                <Home size={20} className="mr-2" /> Retour à l'accueil
              </Link>
            </div>
          )}

          {/* Bouton retour sauf à l'étape 1 */}
          {step > 1 && step < 4 && (
            <button onClick={() => setStep(step - 1)} className="mt-6 hover:underline text-gray-600 flex items-center hover:text-gray-800">
              <ChevronLeft size={16} /> Retour
            </button>
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