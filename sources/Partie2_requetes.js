//Question 1. Combien y a-t-il d’utilisateurs dans la base de données ?
db["movielens_users"].countDocuments()
//6040

//Question 2. Combien y a-t-il de films dans la base de données ? 
db["movielens_movies"].countDocuments()
//3883

//Question 3. Quelle est l’occupation de Clifford Johnathan ? Ecrivez une requête dont la réponse  affiche uniquement 
//son nom et son occupation.
db["movielens_users"].find({name : "Clifford Johnathan"}, {_id:0, name:1, occupation:1})
/*
{
  name: 'Clifford Johnathan',
  occupation: 'technician/engineer'
}
*/

//Question 4. Combien d’utilisateurs ont entre 18 et 30 ans (inclus) ?
db["movielens_users"].find({$and:[{age:{$gte:18}},{age:{$lte:30}}]})
//2365 entrées

//Question 5. () Combien d’utilisateurs sont artistes (artist) ou scientifiques (scientist) ?
