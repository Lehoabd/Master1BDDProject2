use('projetBD');

//Question 1. Combien y a-t-il d’utilisateurs dans la base de données ?
//db["movielens_users"].countDocuments()
//6040

//Question 2. Combien y a-t-il de films dans la base de données ? 
//db["movielens_movies"].countDocuments()
//3883

//Question 3. Quelle est l’occupation de Clifford Johnathan ? Ecrivez une requête dont la réponse  affiche uniquement 
//son nom et son occupation.
//db["movielens_users"].find({name : "Clifford Johnathan"}, {_id:0, name:1, occupation:1})
/*
{
  name: 'Clifford Johnathan',
  occupation: 'technician/engineer'
}
*/

//Question 4. Combien d’utilisateurs ont entre 18 et 30 ans (inclus) ?
//db["movielens_users"].find({$and:[{age:{$gte:18}},{age:{$lte:30}}]})
//2365 entrées

//Question 5. () Combien d’utilisateurs sont artistes (artist) ou scientifiques (scientist) ?
//db["movielens_users"].countDocuments({$or :[{occupation : { $regex: "artist", $options: "i" }}, {occupation : { $regex: "scientist", $options: "i" }}]}, {occupation : 1})
//411

//Question 6. Quelles sont les dix femmes auteurs (writer) les plus âgées ?
//db["movielens_users"].find({gender : "F"}).sort({age : -1}).limit(10);

//Question 7. Quelles sont toutes les occupations présentes dans la base de données ?
//db["movielens_users"].distinct("occupation");

//Question 8. Insérer un nouvel utilisateur dans la base de données (vous, par exemple). Ne pas inclure pour l’instant le 
// champ movies. 
// db["movielens_users"].insertOne({
//   _id : 98765,
//   name : "Leho Errezarret",
//   gender : "F",
//   age : "21",
//   occupation : "academic/educator"
// });

// // db["movielens_users"].findOneAndDelete({
// //   name : {
// //     $regex: "Leho Errezarret",
// //     $options : "i"
// //   }
// // })

//Question  9.  Choisir  un  film  de  la  collection  movies  et  mettre  à  jour l’entrée insérée précédemment en  ajoutant  le 
// champ movies respectant le schéma adopté par les autres entrées. Pour le champ timestamp, utiliser l’heure courante 
// (Voir sur Web
// db["movielens_movies"].insertOne({
//   _id : 67890,
//   title : "cyperpunk:edgerunner (2022)",
//   genres : "Animation|Cyberpunk"
// });

db["movielens_users"].updateOne({
  _id: 98765,
},{
  $set: {
    movies : [{
      _id : 67890,
      rating : 5,
      timestamp : new Date().getTime()/1000
    }]
  }
});

// db["movielens_users"].find({
//   name : {
//     $regex: "Leho Errezarret",
//     $options : "i"
//   }
// });

//Question 10. Supprimer l’entrée de la base de données. 
// db["movielens_users"].findOneAndDelete({
//   name : {
//     $regex: "Leho Errezarret",
//     $options : "i"
//   }
// });

//Question  11.  Pour  tous  les  utilisateurs  qui  ont  pour  occupation  "programmer",  changer  cette occupation  en 
// "developer". 
// db["movielens_users"].updateMany({
//     occupation : {
//     $regex: "programmer",
//     $options : "i"
//   }
// },{
//   $set:{occupation : "developer"}
// });

// db["movielens_users"].find({occupation : "developer"},{occupation : 1});

// Question  12.  Combien  de  films  sont  sortis  dans  les  années  quatre-vingt ? (l’année de sortie est indiquée  entre 
//   parenthèses à la fin du titre de chaque film) 
// db["movielens_movies"].countDocuments({
//   title: {
//     $regex: "\\((198[0-9])\\)$"
//   }
// });

// Question 13. () Combien de films sont sortis entre 1984 et 1992 ?
// db["movielens_movies"].countDocuments({
//   title: {
//     $regex: "\\((198[4-9]|199[0-2])\\)$"
//   }
// });

// Question 14. Combien y a-t-il de films d’horreur ?
// db["movielens_movies"].countDocuments({
//   genres: {
//     $regex: "Horror",
//     $options: "i"
//   }
// });

//Question 15. () Combien de films ont pour type à la fois "Musical" et "Romance"?
// db["movielens_movies"].countDocuments({
//   $and:[{genres: {
//     $regex: "Musical",
//     $options: "i"
//   }},{genres: {
//     $regex: "Romance",
//     $options: "i"
//   }}]
// });

//Question 16. Combien d’utilisateurs ont noté le film qui a pour id 1196 (Star Wars: Episode V - The Empire Strikes Back 
// (1980)) ?
// db["movielens_users"].countDocuments({
//   "movies.movieid": 1196
// })

//Question 17. Combien d’utilisateurs ont noté tous les films de la première trilogie Star Wars (id 260, 1196, 1210) 
// db["movielens_users"].countDocuments({
//   $and: [{
//     "movies.movieid": 260
//   }, {
//     "movies.movieid": 1196
//   }, {
//     "movies.movieid": 1210
//   }
//   ]
// })

//Question 18. Combien d’utilisateurs ont notés exactement 48 films ? 
// db["movielens_users"].countDocuments({
//   $and: [
//     {"movies.47": {$exists : 1}},
//     {"movies.48": {$exists : 0}}
//   ]
// })

//Question 19. Pour chaque utilisateur, créer un champ num_ratings qui indique le nombre de films qu’il a notés.
// db["movielens_users"].updateMany({},[
//   {
//     $set: {
//       num_rating: {$size: "$movies"}
//     }
//   }
// ])

// db["movielens_users"].updateMany({},
//   {
//     $unset: {
//       num_rating: 0
//     }

//   }
// )

//db["movielens_users"].find({}, {num_rating: 1});

// Question 20. Combien d’utilisateurs ont noté plus de 90 films ? 
// db["movielens_users"].find({num_rating: {$gt: 90}}, {num_rating: 1, name: 1});

//Question 21. () Combien de notes ont été soumises après le 1er janvier 2001 ?

//db["movielens_users"].find();

let myDate = new Date("2001-01-01");
let mongoDate = myDate.getTime() / 1000;
console.log(mongoDate);
db.movielens_users.aggregate([
  {
    $project: {
      _id: 1,
      name: 1,
      movies: {
        $filter: {
          input: "$movies",
          as: "movie",
          cond: { $gt: ["$$movie.timestamp", mongoDate] }
        }
      }
    }
  }
]);
