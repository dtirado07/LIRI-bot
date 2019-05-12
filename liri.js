var dotenv = require("dotenv").config();

var axios =require("axios");
var moment = require('moment');
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var fs = require("fs");
var exec = require('child_process').exec,child;

var userActions = process.argv[2];
    var singleString=[];
    for (let i = 3;i < process.argv.length;i++) {
        singleString.push(process.argv[i]);
    }
    var input=singleString.join(" ")

switch (userActions) {
    case "concert-this":
        concert();
        break;

        case "spotify-this-song":
        spotify();
        break;

        case "movie-this":
        movie();
        break;

        case "do-what-it-says":
        doitsays();
        break;

        default:
        console.log("Command not valid")
        break;
}

function concert(){
    axios.get("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp")
    .then(function (response) {
        var loadResults="Venue: "+response.data[1].venue.name+
        "\nLocation: "+response.data[1].venue.city+" "+response.data[1].venue.region+
        "\nDate of the event: "+moment(response.data[1].datetime).format("MM/DD/YY");
        console.log(loadResults);loggin(loadResults);
      })
      .catch(function(err) {
        var loadResults="\n\n No results for this \n\n    :(\n\n Try other\n\n";
        console.log(loadResults);loggin(loadResults);
      })

}

function spotify() {
    var spotify = new Spotify(keys.spotify);
    spotify
    .search({ type: 'track', query: input , limit: 1})
    .then(function(response) {
      var loadResults = "Artist(s): "+response.tracks.items[0].album.artists[0].name+
      "\nSong's name: "+response.tracks.items[0].name+
      "\nSpotify's url: "+response.tracks.items[0].album.artists[0].external_urls.spotify+
      "\nAlbum: "+response.tracks.items[0].album.name;
      console.log(loadResults);loggin(loadResults);
    })
    .catch(function(err) {
      console.log("\nNo results here\n:(\ \nYou'd better try this song\n");
      input="the sign";
      spotify();
    });
}

function movie(){
    axios.get("https://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy")
    .then(function (response) {
        var loadResults="*Title: "+response.data.Title+
        "\n*Release Year: "+response.data.Year+
        "\n*IMDB Rate: "+response.data.Rated+
        "\n*Rotten Tomatoes: "+response.data.Ratings[1].Value+
        "\n*Country: "+response.data.Country+
        "\n*Languages: "+response.data.Language+
        "\n*Plot: "+response.data.Plot+
        "\n*Actors: "+response.data.Actors;
        console.log(loadResults);loggin(loadResults);
      })
      .catch(function(err) {
    var loadResults = "If you haven't watched \"Mr. Nobody\" then you should: http://www.imdb.com/title/tt0485947/";
    console.log(loadResults);loggin(loadResults);
      })

}

function doitsays(){
    fs.readFile("random.txt","utf8",function (error, data) {
        if (error){return console.log(error);}
        var dataArr=data.split(",");
        child = exec("node liri.js "+dataArr[0]+" "+dataArr[1],
        function (error, stdout, stderr) {
          console.log('stdout: ' + stdout);
          if (error !== null) {
            console.log('exec error: ' + error);
          }
      });
    })
}

function loggin(result){
    fs.appendFile("log.txt", userActions +" \n\r "+input+" \n\r "+result, function(err) {
        if (err) {
          return console.log(err);
        }
      });
}