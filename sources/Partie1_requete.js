// Requete a - Récupérer tous les produits
db["produits"].find()

// Requete b - Récupérer le premier produit
db["produits"].findOne()

// Requete c1 - Trouver l'id du Thinkpad
const thinkpad = db["produits"].findOne({ "nom": "Thinkpad X230" })
const thinkpadId = thinkpad._id

// Requete c2 - Récupérer ce produit avec son id
db["produits"].findOne({ "_id": thinkpadId })

// Requete d - Récupérer les produits dont le prix est supérieur à 13723 DA
db["produits"].find({ "prix": { $gt: 13723 } })

// Requete e - Récupérer le premier produit ayant le champ ultrabook à true
db["produits"].findOne({ "ultrabook": true })

// Requete f - Récupérer le premier produit dont le nom contient Macbook
db["produits"].findOne({ "nom": /Macbook/ })

// Requete g - Récupérer les produits dont le nom commence par Macbook
db["produits"].find({ "nom": /^Macbook/ })

// Requete h - Supprimer les deux produits dont le fabricant est Apple
db["produits"].deleteMany({ "fabriquant": "Apple" })

// Requete i1 - Trouver d'abord l'id du Thinkpad
const thinkpadToDelete = db["produits"].findOne({ "nom": "Thinkpad X230" })
const thinkpadIdToDelete = thinkpadToDelete._id

// Requete i2 - Supprimer le Lenovo X230 en utilisant uniquement son id
db["produits"].deleteOne({ "_id": thinkpadIdToDelete })