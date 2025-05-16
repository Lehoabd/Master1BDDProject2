// use('tourPedia')

// Requete exemple sans correction 
mapFunction = function () {
    emit(this.category, 1);
};
reduceFunction = function (key, values) {
    return Array.sum(values);
};
queryParam = { "query": {}, "out": { "inline": true } };
db.paris.mapReduce(mapFunction, reduceFunction, queryParam);



// Requete exemple après correction (Inline doit être à 1 et non true)
mapFunction = function () {
    emit(this.category, 1);
};
reduceFunction = function (key, values) {
    return Array.sum(values);
};
queryParam = { query: {}, out: { inline: 1 } };
db.paris.mapReduce(mapFunction, reduceFunction, queryParam);



// a. Pour chaque catégorie, donner le nombre de services en français (utiliser la taille d’une liste en javascript ”services.fr.length”) ;
mapFunction = function () {
    let nb = 0;
    if (this.services && this.services.fr && Array.isArray(this.services.fr)) {
        nb = this.services.fr.length;
    }
    emit(this.category, nb);
};

reduceFunction = function (key, values) {
    return Array.sum(values);
};

queryParam = { query: {}, out: { inline: 1 } };

let result = db.paris.mapReduce(mapFunction, reduceFunction, queryParam);
printjson(result);



// b. Pour chaque catégorie, donner le nombre de mots pour les commentaires en français ;
mapFunction = function () {
    let nbMots = 0;
    if (Array.isArray(this.reviews)) {
        this.reviews.forEach(function (review) {
            if (review.language === "fr") {
                nbMots += review.wordsCount;
            }
        });
    }
    emit(this.category, nbMots);
};

reduceFunction = function (key, values) {
    return Array.sum(values);
};

queryParam = { query: {}, out: { inline: 1 } };

let result = db.paris.mapReduce(mapFunction, reduceFunction, queryParam);
printjson(result);



// c. Pour chaque ”type” de contact (s’il existe), donner le nombre de lieux associés ;
mapFunction = function () {
    if (this.contact && typeof this.contact === "object") {
        for (let key in this.contact) {
            if (this.contact[key]) {
                emit(key, 1);
            }
        }
    }
};

reduceFunction = function (key, values) {
    return Array.sum(values);
};

queryParam = { query: {}, out: { inline: 1 } };

let result = db.paris.mapReduce(mapFunction, reduceFunction, queryParam);
printjson(result);



// d. Donner le nombre de lieux pour chaque ”nombre moyen de mots” par lieu (moyenne de reviews.wordsCount), pour les messages Facebook. Arrondir la moyenne à l’inférieur (Math.floor() ) ;
mapFunction = function () {
    if (Array.isArray(this.reviews)) {
        let total = 0;
        let count = 0;
        this.reviews.forEach(function (review) {
            if (review.source === "Facebook") {
                total += review.wordsCount;
                count += 1;
            }
        });
        if (count > 0) {
            let moyenne = Math.floor(total / count);
            emit(moyenne, 1);
        }
    }
};

reduceFunction = function (key, values) {
    return Array.sum(values);
};

queryParam = { query: {}, out: { inline: 1 } };

let result = db.paris.mapReduce(mapFunction, reduceFunction, queryParam);
printjson(result);



// e. Pour chaque source de commentaire, donner le nombre moyen de mots ;
mapFunction = function () {
    if (Array.isArray(this.reviews)) {
        this.reviews.forEach(function (review) {
            if (review.source && typeof review.wordsCount === "number") {
                emit(review.source, { totalWords: review.wordsCount, count: 1 });
            }
        });
    }
};

reduceFunction = function (key, values) {
    let result = { totalWords: 0, count: 0 };
    values.forEach(function (val) {
        result.totalWords += val.totalWords;
        result.count += val.count;
    });
    return result;
};

finalizeFunction = function (key, reducedValue) {
    return Math.floor(reducedValue.totalWords / reducedValue.count);
};

queryParam = {
    query: {},
    out: { inline: 1 },
    finalize: finalizeFunction
};

let result = db.paris.mapReduce(mapFunction, reduceFunction, queryParam);
printjson(result);



// g. Même question, mais en produisant la note moyenne (rating), min et max ;
mapFunction = function () {
    if (Array.isArray(this.reviews)) {
        this.reviews.forEach(function (review) {
            if (review.source && typeof review.rating === "number") {
                emit(review.source, {
                    totalRating: review.rating,
                    count: 1,
                    min: review.rating,
                    max: review.rating
                });
            }
        });
    }
};

reduceFunction = function (key, values) {
    let result = { totalRating: 0, count: 0, min: Infinity, max: -Infinity };
    values.forEach(function (val) {
        result.totalRating += val.totalRating;
        result.count += val.count;
        if (val.min < result.min) result.min = val.min;
        if (val.max > result.max) result.max = val.max;
    });
    return result;
};

finalizeFunction = function (key, reducedValue) {
    return {
        avg: Math.floor(reducedValue.totalRating / reducedValue.count),
        min: reducedValue.min,
        max: reducedValue.max
    };
};

queryParam = {
    query: {},
    out: { inline: 1 },
    finalize: finalizeFunction
};

let result = db.paris.mapReduce(mapFunction, reduceFunction, queryParam);

result.results.forEach(function (doc) {
    print("Source :", doc._id);
    print("  Moyenne :", doc.value.avg);
    print("  Min     :", doc.value.min);
    print("  Max     :", doc.value.max);
    print("----------------------------");
});




// h. Pour chaque langue de services, donner la liste distincte des services proposés ;
mapFunction = function () {
    if (Array.isArray(this.reviews)) {
        this.reviews.forEach(function (review) {
            if (review.language && Array.isArray(this.services)) {
                this.services.forEach(function (service) {
                    emit(review.language, service);
                });
            }
        });
    }
};

reduceFunction = function (key, values) {
    return Array.from(new Set(values));
};

queryParam = { query: {}, out: { inline: 1 } };

let result = db.paris.mapReduce(mapFunction, reduceFunction, queryParam);
printjson(result);



// i. Nombre de langues de commentaires différents par type de source ;

mapFunction = function () {
    if (Array.isArray(this.reviews)) {
        this.reviews.forEach(function (review) {
            if (review.source && review.language) {
                emit(review.source, review.language);
            }
        });
    }
};

reduceFunction = function (key, values) {
    return Array.from(new Set(values)).length;
};

queryParam = { query: {}, out: { inline: 1 } };

let result = db.paris.mapReduce(mapFunction, reduceFunction, queryParam);
printjson(result);