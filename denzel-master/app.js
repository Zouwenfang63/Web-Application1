const Express =require ("express");
const BodyParser =require  ("body-parser");
const Mongoose = require ("mongoose");
const imdb =require ("./src/imdb");
const schema = require ("./graphql");
const graphqlHTTP = require  ("express-graphql");

const DENZEL_IMDB_ID = "nm0000243";
const CONNECTION_URL =
  "mongodb+srv://user:user@denzel-hpwjd.mongodb.net/test?retryWrites=true";
const DATABASE_NAME = "MovieDenzel";

var app = Express();

Mongoose.connect(`${CONNECTION_URL}`, {
  dbName: `${DATABASE_NAME}`,
  useNewUrlParser: true
});

const db = Mongoose.connection;

db.on("error", error =>
  console.log(`Failed to connect to DB.\n ${error}`)
).once("open", () => console.log("Connected to DB. "));

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World..");
});

//----------------------GRAPHQL-----------------

app.use("/graphql", graphqlHTTP(()=>({
  schema,graphiql : true, pretty : true
})))

//--------------------------------------------

app.listen(3000, () => {
  console.log("3000 :");
});

const Style = Mongoose.model("movie", {
  link: String,
  id: String,
  metascore: Number,
  poster: String,
  rating: Number,
  synopsis: String,
  title: String,
  votes: Number,
  year: Number,
  review: String
});

const StyleReview = Mongoose.model("review", {
  movieID: String,
  comment: String,
  date: String
});





async function reviewsMovie(theMovie) {
  let reviews = await StyleReview.find({ movieID: theMovie.id });
  //console.log(reviews);
  return reviews;
}

// GET /movies/populate
// Populate the database with all the Denzel's movies from IMDb.
// You could use the src/imdb.js ready-to-use exported function.

app.get("/movies/populate", async (request, response) => {
  try {
    const movieList = await imdb(DENZEL_IMDB_ID);
    await movieList.map(async movie => {
      var style = new Style(movie);
      await style.save();
    });

    response.send(`${movieList.length} movies added to ${DATABASE_NAME}`);
  } catch (error) {
    response.status(500).send(error);
  }
});

// GET /movies
// Fetch a random must-watch movie.

app.get("/movies", async (request, response) => {
  try {
    //console.log("here")
    let movieWithMetascoreGte70 = await Style.find({
      metascore: { $gte: 70}
    }).exec();
    if (!movieWithMetascoreGte70) {
      throw new Error("err");
    }
    const theMovie =
      movieWithMetascoreGte70[
        Math.floor(Math.random() * movieWithMetascoreGte70.length)
      ];

    var reviews = await reviewsMovie(theMovie);

    response.send({ theMovie, reviews });
  } catch (error) {
    response.status(500).send(error);
  }
});

// GET /movies/search
// Search for Denzel's movies.

// This endpoint accepts the following optional query string parameters:

// limit - number of movies to return (default: 5)
// metascore - filter by metascore (default: 0)
// The results array should be sorted by metascore in descending way.

app.get("/movies/search", async (request, response) => {
  console.log("test");
  try {
    console.log(request.query.metascore);
    var movieSearched = await Style.findOne({
      metascore: { $gte: Number(request.query.metascore) || 0 }
    })
      .sort({ metascore: -1 })
      .limit(Number(request.query.limit) || 5)
      .exec();

    var reviews = await reviewsMovie(movieSearched);

    response.send({ movieSearched, reviews });
  } catch (error) {
    response.status(500).send(error);
  }
});

// GET /movies/:id
// Fetch a specific movie.

app.get("/movies/:id", async (request, response) => {
  try {
    var movieSearched = await Style.findOne({ id: request.params.id }).exec();

    // console.log(movieSearched)
    // console.log(StyleReview.find({ movieID: "tt2671706" }).comment)

    var reviews = await reviewsMovie(movieSearched);
    //console.log(reviews);
    
    response.send({ movieSearched, reviews });
  } catch (error) {
    response.status(500).send(error);
  }
});

// POST /movies/:id
// Save a watched date and a review.
// This endpoint accepts the following post parameters:
// date - the watched date
// review - the personal review

app.post("/movies/:id", async (request, response) => {
  try {
    var newReview = new StyleReview({
      movieID: request.params.id,
      comment: request.body.review,
      date: request.body.date
    });

    await newReview.save();
    response.send(`New review for the movie id : ${newReview.movieID}added`);
  } catch (error) {
    response.status(500).send(error);
  }
});



//-------------TUTO------------------------------

// var database, collection;

// app.listen(9292, () => {
//     MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
//         if(error) {
//             throw error;
//         }
//         database = client.db(DATABASE_NAME);
//         collection = database.collection("people");
//         console.log("Connected to `" + DATABASE_NAME + "`!");
//     });
// });

/*app.post("/person", (request, response) => {
    collection.insert(request.body, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result.result);
    });
});

app.get("/people", (request, response) => {
    collection.find({}).toArray((error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

app.get("/person/:id", (request, response) => {
    collection.findOne({ "_id": new ObjectId(request.params.id) }, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});*/

//---------------------ENDTUTO----------------------
