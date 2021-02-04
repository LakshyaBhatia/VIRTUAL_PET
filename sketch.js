var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var currentTime;
var readState;
var bedroomImage;
var bathroomImage;
var gardenImage;
var GameState;
function preload(){

sadDog=loadImage("Images/Dog.png");
happyDog=loadImage("Images/happy dog.png");
bedroomImage = loadImage("Images/Bed Room.png");
bathroomImage = loadImage("Images/Wash Room.png");
gardenImage = loadImage("Images/Garden.png");

}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);


  foodObj = new Food();
  
  readState = database.ref('GameState');
  readState.on("value",function(data){
    GameState = data.val();
  });

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {



  

    currentTime=hour();
    if(keyDown(UP_ARROW)){
      update("Playing");
      foodObj.garden();
      
    }
    else if(keyDown(DOWN_ARROW)){
      update("Sleeping");
      foodObj.bedroom();

    }
    
    else if(keyDown(LEFT_ARROW)){
      update("Bathing");
      foodObj.bathroom();
      
    }
    else{
      update("Hungry")
      foodObj.display();
    }
 
    if(GameState!="Hungry"){
      feed.hide();
      addFood.hide();
      dog.remove();
    }
    else{
      feed.show();
      addFood.show();
      dog.addImage(sadDog);
    }



 
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    GameState:"Hungry"
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}


function update(state){
  database.ref('/').update({
    GameState:state
  });
}