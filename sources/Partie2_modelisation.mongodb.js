//Modelisation 1)
//Implémentation proposé dans le devoir
let implementation1 = [

    //movie
    {
        "_id": 1,
        "title": "Toy Story (1995)",
        "genres": "animation|children|comedy"
    },

    //user
    {
        "_id": 6038,
        "name": "Yaeko Hassan",
        "gender": "F",
        "age": 95,
        "occupation": "academic/educator",
        "movies": [
            {
                "movieid": 1419,
                "rating": 4,
                "timestamp": 956714815
            },
            {
                "movieid": 920,
                "rating": 3,
                "timestamp": 956706827
            }
        ]
    }
]

//Implémentation proposé par le groupe de projet

    //movie
    {
        "_id": 1,
        "title": "Toy Story (1995)",
        "genres": [
            {
                "genreName" : "animation"
            },
            {
                "genreName" : "children"
            },
            {
                "genreName" : "comedy"
            },
        ]
    },

    //user
    {
        "_id": 6038,
        "firstName": "Yaeko",
        "lastName": "Hassan",
        "gender": "F",
        "dateNaiss": new Date("2000-01-01"),
        "occupation": "academic/educator",
        "movies": [
            {
                "movieid": 1419,
                "rating": 4,
                "timestamp": 956714815
            },
            {
                "movieid": 920,
                "rating": 3,
                "timestamp": 956706827
            }
        ]
    }
]

/*
Implémentation 1

Avantages :

    Simple et léger.

    Rapide à lire/écrire.

    Moins verbeux.

Inconvénients :

    Peu flexible (genres en string).

    Recherche difficile.

    Pas évolutif (ex: âge figé).



Implémentation 2

Avantages :

    Plus structuré et évolutif.

    Requêtes plus puissantes (ex: sur genres).

    Données plus précises (ex: date de naissance).

Inconvénients :

    Plus verbeux.

    Légèrement plus complexe.

    Potentielle sur-modélisation.
*/

//Modelisation 2)

/*


******************
*IMPLEMENTATION 1*
******************

CREATE TABLE movies (
    movie_id INT PRIMARY KEY,
    title VARCHAR NOT NULL,
    genres VARCHAR
);

CREATE TABLE users (
    user_id INT PRIMARY KEY,
    name VARCHAR NOT NULL,
    gender CHAR(1) CHECK (gender IN ('M', 'F')),
    age INT CHECK (age >= 0),
    occupation VARCHAR
);

CREATE TABLE ratings (
    user_id INT,
    movie_id INT,
    rating INT CHECK (rating BETWEEN 0 AND 5),
    timestamp BIGINT,
    PRIMARY KEY (user_id, movie_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
);


******************
*IMPLEMENTATION 2*
******************

CREATE TABLE movies (
    movie_id INT PRIMARY KEY,
    title VARCHAR NOT NULL
);

CREATE TABLE genres (
    genre_id INT PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL
);

CREATE TABLE movie_genres (
    movie_id INT,
    genre_id INT,
    PRIMARY KEY (movie_id, genre_id),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id),
    FOREIGN KEY (genre_id) REFERENCES genres(genre_id)
);

CREATE TABLE users (
    user_id INT PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    gender CHAR(1) CHECK (gender IN ('M', 'F')),
    birth_date DATE NOT NULL,
    occupation VARCHAR
);

CREATE TABLE ratings (
    user_id INT,
    movie_id INT,
    rating INT CHECK (rating BETWEEN 0 AND 5),
    timestamp BIGINT,
    PRIMARY KEY (user_id, movie_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id)
);


*/