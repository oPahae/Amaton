# 🛒 **Amaton**  

🚀 Plateforme de vente en ligne avec une gestion avancée des produits, commandes et utilisateurs.  

## 📥 Installation & Lancement  

### 1️⃣ **Cloner le projet**  
```bash
git clone https://github.com/oPahae/Amaton.git
cd votre-repo
```

### 2️⃣ **Installer les dépendances**  
```bash
npm install
```

### 3️⃣ **Configurer les variables d'environnement**  
Modifie le fichier `.env` à la racine (Optionel) :  
```
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
EMAIL_SERVICE=your_email_service
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

### 4️⃣ **Démarrer le serveur**  
```bash
npm run dev
```

---

## 🏗 **Fonctionnalités**  

### 🔑 **Authentification & Sécurité**  
- Login, inscription et récupération du mot de passe via email & Google  
- Gestion des sessions avec **Cookie.js** et **JWT**  
- Redirection automatique selon l’état de connexion  

### 🛍 **Fonctionnalités Client**  
- 🔎 **Recherche avancée** (nom, catégorie, description...)  
- 🏷 **Filtres et tri** (par catégorie, prix, promotions...)  
- ⭐ **Consultation d’un produit** (évaluations, commentaires...)  
- 🛒 **Panier** (modification de quantité, validation de commande avec QR-code)  
- 👤 **Profil** (modification des infos et du mot de passe, suppression du compte)  

### 🛠 **Fonctionnalités Admin**  
- 📦 **Gestion des commandes** (validation, annulation avec email et facture PDF)  
- 📊 **Statistiques et analytics** (graphes de ventes, catégories les plus vendues)  
- 🏗 **Gestion des produits, catégories et sous-catégories**  
- 📂 **Importation & exportation des données** (JSON, CSV, Excel, PDF)  
- 📢 **Gestion des publicités & footer**  
- 🔐 **Sécurité et gestion des accès admin**  
