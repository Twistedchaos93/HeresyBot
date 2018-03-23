const http = require('http');
const express = require('express');
const ppa = express();
ppa.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
ppa.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

const Discord = require("discord.js");
const client = new Discord.Client();

client.on("ready",() => {
  console.log("Im ready dog");
});

var prefix = "~";
var msgContents;
var swears = ["fuck", "shit", "dammit", "damn", "bitch", "ech"];
var theList = [];
//game vars
var playerCount = 0;
var playerList = [];
var targetList = [];
var joinFlag;
var gameStarted = false;


client.on('message', msg => {
  if(msg.channel.type == "dm"){
     return;
  }
  const Heresy = msg.guild.emojis.find("name", "Heresy");
  const ChristianServer = msg.client.emojis.find("name", "ChristianServer");
  if (msg.author === client.user) return;
  msgContents = msg.content;

// Silly stuff without prefix
  var repliedYet = false;
  if (testList(swears)) {
    msg.channel.send(ChristianServer.toString()+' YOU HECKIN SWORE '+ ChristianServer.toString());
  }
  if(msgContents.toLowerCase().includes("heresy")){
    msg.channel.send('Did somebody say heresy? '+ Heresy.toString());
    repliedYet = true;
  }
  if(msgContents.toLowerCase() === "arrays start at one" || msgContents.toLowerCase() === "arrays start at 1"){
    msg.channel.send("Of course! Why wouldn't they?");
    repliedYet = true;
  }
  if(repliedYet){
   return; 
  }
// Prefix based stuff
  if (msg.content.startsWith(prefix)){
    switch(msgContents){
      case "~test":
        msg.author.send("Hello!");
      break;
      //The List
      case "~addmetothelist":
        theList[msg.author.username] = true;
        msg.channel.send("Confirmed");
      break;
      case "~amionthelist":
        if (theList[msg.author.username]){
          msg.channel.send("Indeed");
        }else{
          msg.channel.send("Nope");
        }
      break;
      case "~removemefromthelist":
        theList[msg.author.username] = false;
        msg.channel.send("Confirmed");
      break;
      //End The List
      case "~playercount":
        msg.channel.send(playerList.length+" players have joined");
      break;
      case "~joingame":
        if(!gameStarted){
        joinFlag = false;
          if(playerList.length !== 0){
            for(var i = 0; i<playerList.length; i++){
              if(msg.author === playerList[i]){
                joinFlag = true;
              }
            }
          }
        if(joinFlag){
            msg.channel.send("You've already joined");
        }else{
          playerList[playerCount] = msg.author;
          playerCount++;
          msg.channel.send("Confirmed");  
        }  
        }else{
          msg.channel.send("Game is in progress"); 
        }
      break;
      case "~leavegame":
        if (!gameStarted){
          if (playerList.length === 0){
            return msg.channel.send("You aren't in the game");
          }
          joinFlag = false;
        var i = -1;
        while(joinFlag == false && i < playerList.length){
          i++;
          if(msg.author === playerList[i]){
            joinFlag = true;
          }
        }
        if(joinFlag){
          //remove from array
          playerList.splice(i,1);
          msg.channel.send("You are no longer in the game");
        }else{
          msg.channel.send("You aren't in the game");
        }
        }else{
         msg.channel.send("Game is in progress"); 
        }
      break;
      case "~gamestart":
        if(inGame(msg.author)){
           startGame();
           msg.channel.send("Game started");
        }else{
          msg.channel.send("Only player can start the game");
        }
      break;
      case "~gameend":
        if (gameStarted){
          if(inGame(msg.author)){

            while (playerList.length !== 0){
            playerList.pop(); 
            }
            gameStarted = false;
            msg.channel.send("Game ended");
          }else{
            msg.channel.send("Only player can start the game");
          }
        }else{
          msg.channel.send("Game is not in progress");
        }
      break;
      case "~imdead":
        if(inGame(msg.author)){
          var newTarget;
          var j;
          var hunter;
          for(j = 0; j<playerList.length; j++){
            if(msg.author == playerList[i]){
              if(j+1 == playerList.length){
                newTarget = 0;
              }else{
                newTarget = j+1;
              }
              if(j === 0){
                hunter = playerList.length-1;
              }else{
                hunter = j-1;
              }
              playerList[hunter].send("Your new target is " + playerList[newTarget]);
              playerList.splice(j, 1);
            }
          }
          msg.channel.send("RIP");
        }else{
          msg.channel.send("You aren't playing");
        }
      break;
      default:
        msg.channel.send("I don't understand");
    }
  }

});

client.login(process.env.TOKEN);

function testList(array){
  for(var i = 0; i<array.length; i++){
    if (msgContents.toLowerCase().includes(array[i])){
      return(true);
    }
  }
  return(false);
}
function startGame(){
  var targetPlaceholder;
    // sorts the playerlist array randomly
    playerList.sort(function(a, b){return 0.5 - Math.random()});
    for(var i = 0; i<playerList.length; i++){
      if(i+1 == playerList.length){
         targetPlaceholder = 0;
      }else{
         targetPlaceholder = i+1;
      }
        playerList[i].send("Your target is " + playerList[targetPlaceholder].username);
      }
      gameStarted = true;  
}
function inGame(player){
  for(var i = 0; i<playerList.length; i++){
    if (player == playerList[i]){
      return(true);
    }
  }
  return(false);
}