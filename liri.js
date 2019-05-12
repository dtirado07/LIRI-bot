var dotenv = require("dotenv").config();

var axios =require("axios");
var moment = require('moment');
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var fs = require("fs");
var exec = require('child_process').exec,child;

var userActions = process.argv[2];
/// check convert the inputs into a single string
    var temp=[];
    for (let i = 3;i < process.argv.length;i++) {
        temp.push(process.argv[i]);
    }
    var input=temp.join(" ")
//-------------------------------------------

//cases
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

//functions

function spotify() {
    var spotify = new Spotify(keys.spotify);
    spotify
    .search({ type: 'track', query: input , limit: 1})
    .then(function(data) {
      var string = "Artist(s): "+data.tracks.items[0].album.artists[0].name+
      "\nSong's name: "+data.tracks.items[0].name+
      "\nSpotify's url: "+data.tracks.items[0].album.artists[0].external_urls.spotify+
      "\nAlbum: "+data.tracks.items[0].album.name;
      console.log(string);loggin(string);
    })
    .catch(function(err) {
      console.log("\nNo results here\n:(\ \nYou'd better try this song\n");
      input="the sign ace of base";
      spotify();
    });
}

function concert(){
    axios.get("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp")
    .then(function (response) {
        var string="venue name: "+response.data[1].venue.name+
        "\nLocation: "+response.data[1].venue.city+" "+response.data[1].venue.region+
        "\nDate of the event: "+moment(response.data[1].datetime).format("MM/DD/YY");
        console.log(string);loggin(string);
      })
      .catch(function (error) {
        var string="\n\n No results for this \n\n    :(\n\n Try other\n\n";
        console.log(string);loggin(string);
      })

}

function movie(){
    axios.get("https://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy")
    .then(function (response) {
        // handle success

        var string="*Title: "+response.data.Title+
        "\n*Release Year: "+response.data.Year+
        "\n*IMDB Rate: "+response.data.Rated+
        "\n*Rotten Tomatoes: "+response.data.Ratings[1].Value+
        "\n*Country: "+response.data.Country+
        "\n*Languages: "+response.data.Language+
        "\n*Plot: "+response.data.Plot+
        "\n*Actors: "+response.data.Actors;
        console.log(string);loggin(string);
      })
      .catch(function (error) {
    var string = "If you haven't watched \"Mr. Nobody\" then you should:\nhttp://www.imdb.com/title/tt0485947/";
    console.log(string);loggin(string);
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