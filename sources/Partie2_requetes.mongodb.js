use('projetBD');

//Question 1. Combien y a-t-il d’utilisateurs dans la base de données ?
db["movielens_users"].countDocuments()

//Question 2. Combien y a-t-il de films dans la base de données ? 
db["movielens_movies"].countDocuments()

//Question 3. Quelle est l’occupation de Clifford Johnathan ? Ecrivez une requête dont la réponse  affiche uniquement 
//son nom et son occupation.
db["movielens_users"].find({ name: "Clifford Johnathan" }, { _id: 0, name: 1, occupation: 1 })


//Question 4. Combien d’utilisateurs ont entre 18 et 30 ans (inclus) ?
db["movielens_users"].find({ $and: [{ age: { $gte: 18 } }, { age: { $lte: 30 } }] })

//Question 5. () Combien d’utilisateurs sont artistes (artist) ou scientifiques (scientist) ?
db["movielens_users"].countDocuments({ $or: [{ occupation: { $regex: "artist", $options: "i" } }, { occupation: { $regex: "scientist", $options: "i" } }] }, { occupation: 1 })

//Question 6. Quelles sont les dix femmes auteurs (writer) les plus âgées ?
db["movielens_users"].find({ gender: "F" }).sort({ age: -1 }).limit(10);

//Question 7. Quelles sont toutes les occupations présentes dans la base de données ?
db["movielens_users"].distinct("occupation");

//Question 8. Insérer un nouvel utilisateur dans la base de données (vous, par exemple). Ne pas inclure pour l’instant le 
// champ movies. 
db["movielens_users"].insertOne({
  _id: 98765,
  name: "Leho Errezarret",
  gender: "F",
  age: "21",
  occupation: "academic/educator"
});

db["movielens_users"].findOneAndDelete({
  name: {
    $regex: "Leho Errezarret",
    $options: "i"
  }
})

//Question  9.  Choisir  un  film  de  la  collection  movies  et  mettre  à  jour l’entrée insérée précédemment en  ajoutant  le 
// champ movies respectant le schéma adopté par les autres entrées. Pour le champ timestamp, utiliser l’heure courante 
// (Voir sur Web)
db["movielens_movies"].insertOne({
  _id: 67890,
  title: "cyperpunk:edgerunner (2022)",
  genres: "Animation|Cyberpunk"
});

db["movielens_users"].updateOne({
  _id: 98765,
}, {
  $set: {
    movies: [{
      _id: 67890,
      rating: 5,
      timestamp: Math.floor(new Date().getTime() / 1000)
    }]
  }
});

db["movielens_users"].find({
  name: {
    $regex: "Leho Errezarret",
    $options: "i"
  }
});

//Question 10. Supprimer l’entrée de la base de données. 
db["movielens_users"].findOneAndDelete({
  name: {
    $regex: "Leho Errezarret",
    $options: "i"
  }
});

//Question  11.  Pour  tous  les  utilisateurs  qui  ont  pour  occupation  "programmer",  changer  cette occupation  en 
// "developer". 
db["movielens_users"].updateMany({
  occupation: {
    $regex: "programmer",
    $options: "i"
  }
}, {
  $set: { occupation: "developer" }
});

db["movielens_users"].find({ occupation: "developer" }, { occupation: 1 });

// Question  12.  Combien  de  films  sont  sortis  dans  les  années  quatre-vingt ? (l’année de sortie est indiquée  entre 
//   parenthèses à la fin du titre de chaque film) 
db["movielens_movies"].countDocuments({
  title: {
    $regex: "\\((198[0-9])\\)$"
  }
});

// Question 13. () Combien de films sont sortis entre 1984 et 1992 ?
db["movielens_movies"].countDocuments({
  title: {
    $regex: "\\((198[4-9]|199[0-2])\\)$"
  }
});

// Question 14. Combien y a-t-il de films d’horreur ?
db["movielens_movies"].countDocuments({
  genres: {
    $regex: "Horror",
    $options: "i"
  }
});

//Question 15. () Combien de films ont pour type à la fois "Musical" et "Romance"?
db["movielens_movies"].countDocuments({
  $and: [{
    genres: {
      $regex: "Musical",
      $options: "i"
    }
  }, {
    genres: {
      $regex: "Romance",
      $options: "i"
    }
  }]
});

//Question 16. Combien d’utilisateurs ont noté le film qui a pour id 1196 (Star Wars: Episode V - The Empire Strikes Back 
// (1980)) ?
db["movielens_users"].countDocuments({
  "movies.movieid": 1196
})

//Question 17. Combien d’utilisateurs ont noté tous les films de la première trilogie Star Wars (id 260, 1196, 1210) 
db["movielens_users"].countDocuments({
  $and: [{
    "movies.movieid": 260
  }, {
    "movies.movieid": 1196
  }, {
    "movies.movieid": 1210
  }
  ]
})

//Question 18. Combien d’utilisateurs ont notés exactement 48 films ? 
db["movielens_users"].countDocuments({
  $and: [
    { "movies.47": { $exists: 1 } },
    { "movies.48": { $exists: 0 } }
  ]
})

//Question 19. Pour chaque utilisateur, créer un champ num_ratings qui indique le nombre de films qu’il a notés.
db["movielens_users"].updateMany({}, [
  {
    $set: {
      num_rating: { $size: "$movies" }
    }
  }
])

db["movielens_users"].updateMany({},
  {
    $unset: {
      num_rating: 0
    }

  }
)

//db["movielens_users"].find({}, {num_rating: 1});

// Question 20. Combien d’utilisateurs ont noté plus de 90 films ? 
db["movielens_users"].find({ num_rating: { $gt: 90 } }, { num_rating: 1, name: 1 });

//Question 21. () Combien de notes ont été soumises après le 1er janvier 2001 ?
let myDate = new Date("2001-01-01");
let mongoDate = myDate.getTime() / 1000;
console.log(mongoDate);
db['movielens_users'].aggregate([
  { $unwind: "$movies" },
  { $match: { "movies.timestamp": { $gt: mongoDate } } },
  { $count: "notes_apres_2001" }
])

//Question 22. Quels sont les trois derniers films notés par Jayson Brad ?
db['movielens_users'].aggregate([
  {
    $match: {
      name: {
        $regex: "Jayson Brad",
        $options: "i"
      }
    }
  },
  {
    $unwind: "$movies"
  },
  {
    $sort: {
      "movies.timestamp": -1
    }
  },
  {
    $project: {
      _id: 0,
      "movies.movieid": 1,
      "movies.rating": 1,
      "movies.timestamp": 1,
    }
  },
  {
    $limit: 3
  }
])

// Question 23. () Obtenez les informations portant uniquement sur Tracy Edward et sa note du film Star Wars: Episode 
// VI - Return of the Jedi, qui a pour id 1210.
db['movielens_users'].aggregate([
  {
    $unwind: "$movies"
  },
  {
    $match: {
      $and: [{
        name: {
          $regex: "Tracy Edward",
          $options: "i"
        }
      }, {
        "movies.movieid": 1210
      }]
    }
  },
  {
    $project: {
      _id: 0,
      "movies.rating": 1
    }
  }
]);

// Question 24. () Combien d’utilisateurs ont donné au film "Untouchables, The" la note de 5.
db['movielens_users'].aggregate([
  {
    $unwind: "$movies"
  },
  {
    $lookup: {
      from: "movielens_movies",
      localField: "movies.movieid",
      foreignField: "_id",
      as: "moviesInfo"
    }
  },
  {
    $match: {
      $and: [
        {
          "moviesInfo.title": {
            $regex: "Untouchables, The",
            $options: "i"
          }
        },
        {
          "movies.rating": 5
        }
      ]
    }
  },
  {
    $count: 'Note_5/5'
  }
])

// Question 25. L’utilisateur Barry Erin vient juste de voir le film Nixon, qui a pour id 14 ; il lui attribue la note de 4. Mettre 
// à jour la base de données pour prendre en compte cette note. N’oubliez pas  que  le  champ  num_rattings  doit 
// représenter le nombre de films notés par un utilisateur.
db['movielens_users'].updateOne(
  {
    name: {
      $regex: "Barry Erin",
      $options: "i"
    }
  },
  {
    $push: {
      movies: {
        movieid: 14,
        rating: 4,
        timestamp: Math.floor(new Date().getTime() / 1000)
      }
    },
    $inc: { num_rating: 1 }
  }
)

// Question 26. L’utilisatrice Marquis Billie n’a en fait pas vu le film "Santa with Muscles", qui a pour id 1311. Supprimer 
// la note entrée par mégarde dans la base de données.
db['movielens_users'].updateOne(
  {
    name: {
      $regex: "Barry Erin",
      $options: "i"
    }
  },
  {
    $pull: {
      movies: {
        movieid: 1311
      }
    },
    $inc: { num_rating: -1 }
  }
)

// Question 27. () Les genres du film "Cinderella" devraient être Animation, Children's et Musical. Modifier en une seule 
// requête le document correspondant pour qu’il contienne ces trois genres sans doublon.
db['movielens_movies'].updateOne(
  {
    title: {
      $regex: "Cinderella \\(1950\\)",
      $options: "i"
    }
  },
  {
    $set: {
      genres: "Animation|Children's|Musical"
    }
  }
)

// Question 28. () Modifier la collection users en y ajoutant un champs movies.movieref qui contient une DBRef vers le 
// film concerné.
db['movielens_users'].find().forEach(function (user) {
  user.movies.forEach(function (movie) {
    movie.movieref = DBRef("movielens_movies", movie.movieid);
  });
  db['movielens_users'].updateOne(
    { _id: user._id },
    { $set: { movies: user.movies } }
  );
});

// Question 31, 33.  Chercher le nom des  dix femmes  qui ont  noté un film le  plus récemment. Notez que  si l’on ajoute la 
// fonction explain() à la fin de la requête, on obtient des informations sur son exécution. 
db['movielens_users'].aggregate([
  { $match: { gender: "F" } },
  {
    $addFields: {
      lastRatingTime: { $max: "$movies.timestamp" }
    }
  },
  { $sort: { lastRatingTime: -1 } },
  { $limit: 10 },
  { $project: { _id: 0, name: 1, lastRatingTime: 1 } }
]).explain("executionStats")

// Question 32. Créer un index sur les champs gender et movies.date. 
db['movielens_users'].createIndex({ gender: 1, "movies.timestamp": -1 })

// Question 34. Montrer combien de films ont été produits durant chaque année des années 90 ; ordonner les résultats 
// de l’année la plus à la moins fructueuse. 
db['movielens_movies'].aggregate([
  {
    $project: {
      title: 1,
      year: {
        $toInt: {
          $arrayElemAt: [
            {
              $getField:
              {
                input:
                {
                  $regexFind:
                    { input: "$title", regex: /\((\d{4})\)$/ }
                },
                field: "captures"
              }
            },
            0
          ]
        }
      }
    }
  },
  {
    $match: {
      $and: [
        { year: { $gte: 1990 } },
        { year: { $lt: 2000 } }
      ]
    }
  },
  {
    $group: {
      _id: "$year",
      QteFilms: {
        $sum: 1
      }
    }
  },
  {
    $sort: {
      QteFilms: -1
    }
  }
])

//Question 35. Quelle est la note moyenne du film Pulp Fiction, qui a pour id 296 ?
db['movielens_users'].aggregate([
  {
    $unwind: "$movies"
  },
  {
    $match: {
      "movies.movieid": 296
    }
  },
  {
    $group: {
      _id: "$movies.movieid",
      note_moyenne: {
        $avg: "$movies.rating"
      }
    }
  }
])

// Question 36. En une seule requête, retourner pour chaque utilisateur son id, son nom, les notes maximale, minimale 
// et moyenne qu’il a données, et ordonner le résultat par note moyenne croissante.
db['movielens_users'].aggregate([
  {
    $unwind: "$movies"
  },
  {
    $group: {
      _id: "$_id",
      name: { $first: "$name" },
      note_minimum: {
        $min: "$movies.rating"
      },
      note_maximum: {
        $max: "$movies.rating"
      },
      note_moyenne: {
        $avg: "$movies.rating"
      },
    }
  },
  {
    $sort: {
      note_moyenne: 1
    }
  }
])

//Question 37. () Quel est le mois au cours duquel le plus de notes ont été attribuées ?
db['movielens_users'].aggregate([
  { $unwind: "$movies" },
  {
    $project: {
      timestamp: { $toDate: { $multiply: ["$movies.timestamp", 1000] } } // convertir UNIX en date
    }
  },
  {
    $group: {
      _id: {
        year: { $year: "$timestamp" },
        month: { $month: "$timestamp" }
      },
      total_ratings: { $sum: 1 }
    }
  },
  { $sort: { total_ratings: -1 } },
  { $limit: 1 }
]);



// Question 38. () Créer une nouvelle collection join qui associe à chaque film son _id, son titre, ses genres, son année et 
// toutes les notes qui lui ont été attribuées. 
db['movielens_users'].aggregate([
  { $unwind: "$movies" },
  {
    $lookup: {
      from: "movielens_movies",
      localField: "movies.movieid",
      foreignField: "_id",
      as: "movie_info"
    }
  },
  { $unwind: "$movie_info" },
  {
    $project: {
      movie_id: "$movie_info._id",
      title: "$movie_info.title",
      genres: "$movie_info.genres",
      year: {
        $toInt: {
          $arrayElemAt: [
            {
              $getField:
              {
                input:
                {
                  $regexFind:
                    { input: "$movie_info.title", regex: /\((\d{4})\)$/ }
                },
                field: "captures"
              }
            },
            0
          ]
        }
      },
      rating: "$movies.rating",
      user_id: "$_id"
    }
  },
  {
    $group: {
      _id: "$movie_id",
      title: { $first: "$title" },
      genres: { $first: "$genres" },
      year: { $first: "$year" },
      ratings: {
        $push: {
          user_id: "$user_id",
          rating: "$rating"
        }
      }
    }
  }
]);