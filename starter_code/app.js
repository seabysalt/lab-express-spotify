const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:
// Remember to insert your credentials here
const clientId = 'e093e58013044697ba81b99af2b2d9f9',
    clientSecret = 'fb209ab4ed734a1582c56ba41c216f17';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

hbs.registerPartials(__dirname + "/views/partials");


// setting the spotify-api goes here:



// the routes go here:

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/artists/", (req, res) => {
  const query = req.query.query
  spotifyApi
    .searchArtists(query)
    .then(data => {
      const items = data.body.artists.items
      
      // items is an array
      res.render("artists", { items, query });
      // {items} is shortcut for {items: items}
       // old: res.render("artists", { artistsList: artists });
    }).catch(err => {
      res.send(err)
    })
});

app.get("/albums/:artistsId/:albumName", (req, res) => {
  const artistsId = req.params.artistsId;
  const albumName = req.params.albumName;

  // const artist = artists.find(el => el.artistsId.toLowerCase() === artistsId);

  // res.render("artist", { artist });
  spotifyApi
  .getArtistAlbums(artistsId)
  .then(data => {
    const items = data.body.items;
    res.render('albums', { items, albumName })
    // res.send(data);
  })
  .catch(err => {
    res.send(err);
  });

});

app.get("/tracks/:albumId", (req, res) => {
  const albumId = req.params.albumId;

  spotifyApi
    .getAlbumTracks(albumId)
    .then(data => {
      const items = data.body.items;

      res.render("tracks", { items });
    })
    .catch(err => {
      res.send(err);
    });
});


app.listen(3001, () => console.log("My Spotify project running on port 3001 🎧 🥁 🎸 🔊"));
