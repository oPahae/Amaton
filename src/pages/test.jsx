import { useState, useEffect } from "react";
import axios from "axios";
import { verifyAuth } from "../middlewares/auth";

export default function Prods({ session }) {
  const produits = [
    {
        name: "Sweat à capuche Death Note",
        mark: "Uniqlo",
        price: 39,
        promo: 0,
        stock: 120,
        cat: "Vêtements",
        subcat: "Sweatshirts à capuche",
        descr: "Ce sweat à capuche noir est orné d'un design emblématique inspiré de l'anime Death Note. Fabriqué à partir de coton doux et respirant, il offre un confort optimal pour un usage quotidien. Le logo graphique ajoute une touche unique pour les fans de l'anime culte."
    },
    {
        name: "Sweat à capuche Breaking Bad",
        mark: "H&M",
        price: 42,
        promo: 5,
        stock: 75,
        cat: "Vêtements",
        subcat: "Sweatshirts à capuche",
        descr: "Inspiré de la série légendaire Breaking Bad, ce sweat à capuche noir arbore les éléments chimiques emblématiques du tableau périodique formant le titre. Conçu en coton et polyester de haute qualité, il est parfait pour les fans cherchant à afficher leur amour pour la série tout en restant confortable."
    },
    {
        name: "Ensemble Adidas enfant",
        mark: "Adidas",
        price: 49,
        promo: 10,
        stock: 60,
        cat: "Vêtements",
        subcat: "T-shirts",
        descr: "Cet ensemble Adidas pour enfant comprend un t-shirt bleu vif avec le logo Adidas classique et un short noir assorti. Fabriqué dans un tissu léger et respirant, il offre une grande liberté de mouvement pour les activités sportives et quotidiennes. Les bandes iconiques Adidas ajoutent une touche sportive élégante."
    },
    {
        name: "Pantalon rose élégant",
        mark: "Zara",
        price: 35,
        promo: 0,
        stock: 40,
        cat: "Vêtements",
        subcat: "Pantallons",
        descr: "Un pantalon rose pastel conçu pour un look moderne et élégant. Doté d'une ceinture assortie et de plis sur le devant, il s'adapte parfaitement aux tenues formelles et décontractées. Le tissu fluide offre un confort exceptionnel tout en rehaussant votre silhouette."
    },
    {
        name: "Sweat à capuche noir simple",
        mark: "Nike",
        price: 44,
        promo: 5,
        stock: 90,
        cat: "Vêtements",
        subcat: "Sweatshirts à capuche",
        descr: "Un sweat à capuche noir minimaliste avec un design épuré et un petit logo discret sur la poitrine. Idéal pour ceux qui recherchent un style simple mais sophistiqué, il est fabriqué en tissu doux pour garantir chaleur et confort au quotidien."
    },
    {
        name: "Sweat à capuche Palestine",
        mark: "Puma",
        price: 39,
        promo: 0,
        stock: 50,
        cat: "Vêtements",
        subcat: "Sweatshirts à capuche",
        descr: "Ce sweat à capuche noir arbore un design patriotique mettant en avant le drapeau palestinien dans un style artistique. Fabriqué en matériaux de haute qualité, il offre une coupe confortable et un message puissant pour ceux qui souhaitent exprimer leur solidarité."
    },
    {
        name: "Sweat à capuche Attack on Titan",
        mark: "MangaStyle",
        price: 54,
        promo: 10,
        stock: 35,
        cat: "Vêtements",
        subcat: "Sweatshirts à capuche",
        descr: "Pour les fans de l'anime Attack on Titan, ce sweat à capuche bicolore bleu et blanc est un incontournable. Il arbore l'emblème du Bataillon d'Exploration sur la poitrine et est conçu en coton mélangé pour un confort exceptionnel. Idéal pour les journées fraîches et pour montrer votre passion pour l'univers de l'anime."
    },
    {
        name: "Casquette Death Note",
        mark: "New Era",
        price: 29,
        promo: 0,
        stock: 150,
        cat: "Vêtements",
        subcat: "Capuchons",
        descr: "Cette casquette noire de haute qualité est ornée des logos de Death Note et de la célèbre lettre 'L'. Fabriquée avec un ajustement parfait et un tissu résistant, elle est idéale pour les amateurs de l'anime qui souhaitent compléter leur tenue avec style."
    },
    {
      name: "Sneakers confortables en tissu noir",
      mark: "Nike",
      price: 45,
      promo: 5,
      stock: 120,
      cat: "Vêtements",
      subcat: "Chaussures",
      descr: "Ces sneakers noirs en tissu respirant sont conçus pour offrir un confort optimal. Leur semelle blanche en caoutchouc antidérapant assure une bonne adhérence sur toutes les surfaces. Parfaites pour une utilisation quotidienne ou pour des activités sportives légères, elles allient style et fonctionnalité."
    },
    {
      name: "T-shirt blanc Converse avec logo",
      mark: "Converse",
      price: 30,
      promo: 0,
      stock: 85,
      cat: "Vêtements",
      subcat: "T-shirts",
      descr: "Ce T-shirt en coton de haute qualité arbore un logo iconique noir imprimé à l'avant. Légèrement ajusté, il offre une coupe moderne idéale pour compléter un look décontracté ou urbain. Facile à assortir avec n'importe quelle tenue, il est un incontournable pour les amateurs de mode simple et efficace."
    },
    {
      name: "Chaussures en cuir marron classique",
      mark: "Clarks",
      price: 75,
      promo: 10,
      stock: 50,
      cat: "Vêtements",
      subcat: "Chaussures",
      descr: "Ces chaussures en cuir marron élégant sont parfaites pour les occasions formelles ou pour un usage quotidien. La finition soignée et les lacets assortis ajoutent une touche de raffinement, tandis que la semelle intérieure matelassée offre un confort durable, même pendant de longues heures."
    },
    {
      name: "Baskets en daim beige",
      mark: "Puma",
      price: 70,
      promo: 0,
      stock: 60,
      cat: "Vêtements",
      subcat: "Chaussures",
      descr: "Fabriquées en daim de haute qualité, ces baskets beige allient style et praticité. La doublure intérieure respirante garde vos pieds au frais, tandis que la semelle extérieure en caoutchouc souple garantit un confort optimal. Idéal pour un look casual chic ou des sorties décontractées."
    },
    {
      name: "Baskets sportives bleues Under Armour",
      mark: "Under Armour",
      price: 90,
      promo: 15,
      stock: 100,
      cat: "Sports",
      subcat: "Chaussures",
      descr: "Ces baskets sportives bleues sont conçues pour maximiser la performance. Dotées d'une semelle amortissante pour absorber les chocs, elles offrent un excellent soutien pendant vos entraînements. Fabriquées en tissu respirant, elles sont légères et confortables, idéales pour les activités sportives intenses."
    },
    {
      name: "Manteau beige à col en fourrure",
      mark: "Zara",
      price: 120,
      promo: 0,
      stock: 40,
      cat: "Vêtements",
      subcat: "Capuchons",
      descr: "Ce manteau beige élégant avec col en fourrure synthétique offre une combinaison parfaite de style et de fonctionnalité. La doublure matelassée noire ajoute une couche supplémentaire de chaleur, tandis que les détails comme les poches pratiques et la fermeture éclair robuste complètent son design sophistiqué."
    },
    {
      name: "Veste de sport Under Armour",
      mark: "Under Armour",
      price: 85,
      promo: 10,
      stock: 75,
      cat: "Vêtements",
      subcat: "Sweatshirts à capuche",
      descr: "Conçue pour les amateurs de sport, cette veste combine fonctionnalité et style. Son tissu flexible et respirant permet une liberté de mouvement totale. Parfaite pour vos séances d'entraînement ou pour un look sportif décontracté, elle offre une protection optimale contre le froid léger."
    },
    {
      name: "Blouson bomber bordeaux",
      mark: "Adidas",
      price: 70,
      promo: 5,
      stock: 65,
      cat: "Vêtements",
      subcat: "Capuchons",
      descr: "Ce blouson bomber bordeaux est parfait pour un look urbain moderne. Avec une coupe ajustée et des détails comme les poches pratiques et une fermeture éclair robuste, il est à la fois tendance et fonctionnel. Fabriqué en tissu durable, il est conçu pour durer et pour vous garder à l'aise toute la journée."
    },
    {
      name: "Veste camouflage imperméable",
      mark: "The North Face",
      price: 110,
      promo: 0,
      stock: 55,
      cat: "Vêtements",
      subcat: "Capuchons",
      descr: "Cette veste imperméable au motif camouflage est idéale pour les amateurs d'activités en plein air. Dotée d'une capuche intégrée et de nombreuses poches pratiques, elle vous protège efficacement contre les intempéries tout en offrant un look robuste et tendance."
    },
    {
      name: "Baskets légères en maille beige et orange",
      mark: "Asics",
      price: 50,
      promo: 0,
      stock: 90,
      cat: "Vêtements",
      subcat: "Chaussures",
      descr: "Ces baskets en maille beige sont parfaites pour un usage quotidien. Les détails orange ajoutent une touche de dynamisme, tandis que la semelle légère et flexible garantit un confort exceptionnel. Idéales pour marcher ou pour un style décontracté, elles s'adaptent à toutes les occasions."
    },
    {
      name: "Porte-clés Breaking Bad",
      mark: "TAFREE",
      price: 9.99,
      promo: 0,
      stock: 100,
      cat: "Accessoires",
      subcat: "Portes-clés",
      descr: "Un porte-clés élégant avec le logo de la célèbre série Breaking Bad. Fabriqué en métal robuste avec une finition brillante, parfait pour les fans de la série. Léger et durable, il est idéal pour garder vos clés en sécurité avec style.",
    },
    {
      name: "Collier AOT",
      mark: "AnimeShop",
      price: 14.99,
      promo: 0,
      stock: 50,
      cat: "Accessoires",
      subcat: "Colliers",
      descr: "Collier avec le symbole du bataillon d'exploration de l'Attaque des Titans. Ce collier en métal émaillé est parfait pour les fans d'anime. Il est livré avec une chaîne noire ajustable et une qualité de fabrication exceptionnelle.",
    },
    {
      name: "Chaussures vertes Vans",
      mark: "Vans",
      price: 74.99,
      promo: 10,
      stock: 30,
      cat: "Vêtements",
      subcat: "Chaussures",
      descr: "Chaussures Vans en toile verte avec des détails en noir et blanc. Confortables, résistantes et parfaites pour un usage quotidien. La semelle antidérapante garantit une excellente adhérence, tandis que leur design intemporel en fait un incontournable.",
    },
    {
      name: "Sweatshirt à capuche noir",
      mark: "H&M",
      price: 34.99,
      promo: 0,
      stock: 60,
      cat: "Vêtements",
      subcat: "Sweatshirts à capuche",
      descr: "Sweatshirt noir unisexe avec capuche et poche kangourou. Fabriqué en coton doux et respirant, idéal pour les journées fraîches ou pour un look décontracté. Facile à assortir avec différents styles vestimentaires.",
    },
    {
      name: "T-shirt Adidas bleu",
      mark: "Adidas",
      price: 24.99,
      promo: 5,
      stock: 80,
      cat: "Vêtements",
      subcat: "T-shirts",
      descr: "T-shirt bleu avec le logo classique d'Adidas. Conçu en coton de haute qualité, il offre confort et durabilité. Idéal pour le sport ou un usage quotidien grâce à son design simple mais élégant.",
    },
    {
      name: "Chaussures de football Joma",
      mark: "Joma",
      price: 49.99,
      promo: 15,
      stock: 40,
      cat: "Sports",
      subcat: "Chaussures",
      descr: "Chaussures de football de la marque Joma, conçues pour une performance optimale sur terrain synthétique. Leur design ergonomique et leurs matériaux de qualité assurent un confort maximal et une grande durabilité.",
    },
    {
      name: "Ballon de football Molten",
      mark: "Molten",
      price: 19.99,
      promo: 0,
      stock: 100,
      cat: "Sports",
      subcat: "Ballons",
      descr: "Ballon de football Molten conçu pour une utilisation intensive. Sa surface texturée et son design vibrant garantissent un excellent contrôle et une bonne visibilité sur le terrain.",
    },
    {
      name: "Cartable Bleu 3 en 1",
      mark: "Samsonite",
      price: 35.99,
      promo: 10,
      stock: 20,
      cat: "Ecole",
      subcat: "Cartables",
      descr: "Un cartable polyvalent et élégant avec un design 3 en 1 comprenant un sac à dos, une sacoche, et une trousse assortie. Fabriqué en tissu imperméable de haute qualité, il offre une grande capacité de rangement et des poches multiples pour organiser vos affaires scolaires. Idéal pour les étudiants et les élèves."
    },
    {
      name: "Cartable Gris 3 en 1",
      mark: "Eastpak",
      price: 39.99,
      promo: 15,
      stock: 15,
      cat: "Ecole",
      subcat: "Cartables",
      descr: "Ce cartable moderne et pratique inclut un sac à dos, une sacoche, et une trousse assortie. Il est fabriqué avec des matériaux résistants à l'usure et offre un confort optimal grâce à ses bretelles rembourrées. Parfait pour transporter vos livres et fournitures scolaires avec style."
    },
    {
      name: "Surligneurs Pastel (4 pièces)",
      mark: "Deli",
      price: 4.99,
      promo: 0,
      stock: 50,
      cat: "Ecole",
      subcat: "Stylos",
      descr: "Ensemble de surligneurs aux couleurs pastel douces, parfaits pour mettre en valeur vos notes et documents. Avec une pointe biseautée offrant une largeur d'écriture de 1 à 5 mm, ces surligneurs sont idéaux pour une utilisation à l'école, au bureau ou à la maison."
    },
    {
      name: "Stylos Surligneurs Macaron (4 couleurs)",
      mark: "Stabilo",
      price: 5.49,
      promo: 5,
      stock: 40,
      cat: "Ecole",
      subcat: "Stylos",
      descr: "Ces stylos surligneurs au design compact et aux couleurs macaron sont parfaits pour les étudiants. Dotés d'une pointe de haute qualité, ils permettent un surlignage précis sans bavure. Un must-have pour vos fournitures scolaires."
    },
    {
      name: "Stylos Bille Noir (12 pièces)",
      mark: "Deli",
      price: 8.99,
      promo: 10,
      stock: 100,
      cat: "Ecole",
      subcat: "Stylos",
      descr: "Boîte de 12 stylos bille avec encre noire de haute qualité. Dotés d'une pointe fine de 0,7 mm, ces stylos garantissent une écriture fluide et précise. Idéal pour une utilisation quotidienne à l'école ou au bureau."
    },
    {
      name: "Ensemble Stylo et Porte-mine en Coffret",
      mark: "Parker",
      price: 24.99,
      promo: 20,
      stock: 10,
      cat: "Ecole",
      subcat: "Stylos",
      descr: "Coffret élégant contenant un stylo et un porte-mine en métal, parfait pour offrir ou pour un usage personnel. Leur design raffiné et leur écriture fluide en font un choix incontournable pour les professionnels et les étudiants."
    },
    {
      name: "Ensemble de Stylos à Pointe Fine (8 pièces)",
      mark: "Kissbury",
      price: 12.49,
      promo: 5,
      stock: 25,
      cat: "Ecole",
      subcat: "Stylos",
      descr: "Ensemble de 8 stylos à pointe fine offrant des largeurs variées, idéaux pour le dessin, la prise de notes, ou la calligraphie. Leur encre noire à séchage rapide évite les bavures et garantit une écriture nette et précise."
    },
    {
      name: "Sac à dos de sport Scott",
      mark: "Scott",
      price: 59.99,
      promo: 10,
      stock: 12,
      cat: "Sports",
      subcat: "Chaussures",
      descr: "Un sac à dos de sport polyvalent et durable, conçu pour transporter vos équipements sportifs en toute sécurité. Avec un grand compartiment principal et des poches latérales, ce sac offre une organisation optimale pour vos affaires."
    },
    {
      name: "PC Gamer i5 10400F",
      mark: "XTREM",
      price: 950,
      promo: 10,
      stock: 15,
      cat: "Eléctroniques",
      subcat: "Ordinateurs",
      descr: "Ordinateur de bureau puissant équipé d'un processeur Intel i5 10400F 2,9 GHz, 16 Go de mémoire DDR4, un SSD NVMe de 512 Go et une carte graphique NVIDIA RTX 3060. Parfait pour les gamers et les professionnels exigeants.",
    },
    {
      name: "Manette Gaming",
      mark: "Logitech",
      price: 45,
      promo: 5,
      stock: 50,
      cat: "Eléctroniques",
      subcat: "Accessoires",
      descr: "Manette ergonomique avec boutons rétroéclairés, sticks analogiques ultra-précis et une compatibilité multiplateforme pour une expérience de jeu optimale.",
    },
    {
      name: "Souris Razer DeathAdder Essential",
      mark: "Razer",
      price: 40,
      promo: 0,
      stock: 100,
      cat: "Eléctroniques",
      subcat: "Souris",
      descr: "Souris gaming légendaire avec capteur optique de précision, design ergonomique et rétroéclairage RGB personnalisable. Idéale pour les compétitions de jeu.",
    },
    {
      name: "Souris Xtrike Me GM-203",
      mark: "Xtrike Me",
      price: 25,
      promo: 10,
      stock: 60,
      cat: "Eléctroniques",
      subcat: "Souris",
      descr: "Souris gaming avec design lumineux RGB, 6 boutons programmables et un capteur de haute précision. Parfaite pour les amateurs de jeux.",
    },
    {
      name: "Souris Linax GM-212",
      mark: "Linax",
      price: 30,
      promo: 5,
      stock: 40,
      cat: "Eléctroniques",
      subcat: "Souris",
      descr: "Souris gaming 7D avec rétroéclairage RGB, design robuste et capteur haute résolution pour des performances de jeu optimales.",
    },
    {
      name: "Pack Clavier et Souris Jedel Gaming",
      mark: "Jedel",
      price: 60,
      promo: 15,
      stock: 25,
      cat: "Eléctroniques",
      subcat: "Claviers",
      descr: "Pack gaming comprenant un clavier mécanique RGB et une souris haute précision. Idéal pour les gamers souhaitant une configuration complète.",
    },
    {
      name: "PC Gamer HP GTX",
      mark: "HP",
      price: 800,
      promo: 8,
      stock: 10,
      cat: "Eléctroniques",
      subcat: "Ordinateurs",
      descr: "PC gamer équipé d'un processeur Intel Core i5, 16 Go de RAM, un disque dur de 500 Go et une carte graphique GTX. Livré avec 3 jeux installés : Call of Duty, Fortnite et GTA V.",
    },
    {
      name: "Ordinateur Portable HP Victus",
      mark: "HP",
      price: 1200,
      promo: 12,
      stock: 20,
      cat: "Eléctroniques",
      subcat: "Ordinateurs",
      descr: "Laptop performant avec écran Full HD, processeur dernière génération et une carte graphique dédiée pour le gaming et la productivité.",
    },
    {
      name: "Casque Gaming Xtrike Me",
      mark: "Xtrike Me",
      price: 70,
      promo: 5,
      stock: 30,
      cat: "Eléctroniques",
      subcat: "Casques",
      descr: "Casque gamer 7.1 avec son surround Dolby, microphone intégré et design RGB pour une immersion totale.",
    },
    {
      name: "Casque Gaming Onikuma K16",
      mark: "Onikuma",
      price: 65,
      promo: 10,
      stock: 50,
      cat: "Eléctroniques",
      subcat: "Casques",
      descr: "Casque de jeu avec son surround 7.1, microphone haute définition et coussinets confortables pour des sessions prolongées.",
    },
  ];

  const handleAdd = async () => {
    for(let i=0; i<produits.length; i++) {
      try {
        await axios.post("http://localhost:5000/api/prods/add", produits[i], {
          headers: { "Content-Type": "application/json" },
        })
      } catch (error) {
        console.error("Erreur :", error.response?.data || error.message);
      }
    }
  }

  const [prods, setProds] = useState([])

  useEffect(() => {
      fetchProds()
    }, []);
      
    const fetchProds = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/prods/get");
        const data = await response.json();
        if(response.ok) {
          setProds(data || [])
        }
      } catch (error) {
        console.error("Erreur lors du chargement des pubs :", error);
      }
    };

    const calcTotal = () => {
      let total = 0
      for(let i=0; i<prods.length; i++)
        total += prods[i].price * Math.floor(Math.random() * (10 - 1) + 1)
      return total
    }

    class Prod {
      product = null
      constructor(id) {
        this.product = id
      }
      qtt = Math.floor(Math.random() * (10 - 1) + 1)
    }

    const getProds = () => {
      let T = []
      for(let i=0; i<prods.length; i++) {
        T.push(new Prod(prods[i]._id))
      }
      return T
    }

  const handleCmd = async () => {
    try {
      const response = await fetch("/api/test/addd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: session.id,
          prods: getProds(),
          total: calcTotal(),
          code: Math.random().toString(36).substring(2, 11).toUpperCase(),
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

  const updateStock = async () => {
    try {
      const response = await fetch("/api/test/stock", {
        method: "PUT",
      });
  
      if (!response.ok) {
        throw new Error("Erreur lors de l'exécution de l'API");
      }
  
      const data = await response.json();
      console.log("Réponse de l'API :", data);
    } catch (error) {
      console.error("Erreur :", error);
    }
  };

  const handleSubmit = async () => {
    let formData = {
      email: "admin@gmail.com",
      password: "1111"
    }
    try {
      const response = await axios.post("http://localhost:5000/api/admin/register", formData);
      alert(response.ok ? "OK" : "ERR")
    } catch (err) {
      console.log(err.response?.data?.message || "An error occurred.");
    }
  };

  const deleteAllProducts = async () => {
    try {
      const response = await fetch('/api/deleteAll', { method: 'DELETE' });
  
      const data = await response.json();
      if (response.ok) {
        alert(`Succès : ${data.deletedCount} produit(s) supprimé(s)`);
      } else {
        alert(`Erreur : ${data.message}`);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
    }
  };  

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-6" onClick={deleteAllProducts}>
        slm hh
      </button>
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  const user = verifyAuth(req, res);

  if (!user) {
    return {
      props: { session: { username: null, id: null } },
    };
  }

  return {
    props: { session: { username: user.username, id: user.id } },
  };
}