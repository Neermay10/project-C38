var PLAY = 1;
var END = 0;
var gameState = PLAY;

var aarush, aarush_running, aarush_fly;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1;

var score;

var gameOverImg,restartImg;
var jumpSound , checkPointSound, dieSound;

localStorage["HighestScore"] = 0;


function preload(){
  aarush_running = loadAnimation("runner0.png","runner1.png","runner0.png");
  aarush_fly = loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png","sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);//600,200
  
  aarush = createSprite(200,windowHeight - 80,20,50);
  aarush.addAnimation("running", aarush_running);
  aarush.addAnimation("fly" ,aarush_fly);
  aarush.scale = 0.5;
  
  ground = createSprite(-200,windowHeight - 20,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
   gameOver = createSprite(aarush.x,windowHeight/2);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(aarush.x,windowHeight/2 + 40);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,windowHeight - 10,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  //console.log("Hello" + 5);
  
  aarush.setCollider("circle",0,40,43);
 // aarush.debug = true
  
  score = 0;
  
}

function draw() {
  
  background("black");
  //displaying score
  text("Score: "+ score, windowWidth - 75,50);

  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score 
  }
  
  camera.position.x = aarush.x;
  camera.position.y = windowHeight/2;
  
  
  if(gameState === PLAY){
    gameOver.visible = false;
    restart.visible = false;
    //move the ground
    ground.velocityX = -6;
    //scoring
    if(frameCount%5 === 0){
      score = score + 1;
     }
    
    if(score%100 === 0 && score > 0){
      checkPointSound.play();
    }
    
    if (ground.x < 0){
      ground.x = ground.width*1/3;
    }
    
    //jump when the space key is pressed
    if(touches.length > 0 || keyDown("space") && aarush.y >= windowHeight -60) {
      aarush.velocityY = -13;
      jumpSound.play();
      touches=[];
    }
    
    if(keyDown("space") && aarush.y <= height-40){
      //change the aarush  animation
      aarush.changeAnimation("fly", aarush_fly); 
      aarush.setCollider("circle",0,0,30);
      aarush.scale = 0.7;
    }
    
    if(aarush.isTouching(ground)){
      aarush.changeAnimation("running", aarush_running); 
      aarush.setCollider("circle",0,40,43);
      aarush.scale = 0.5; 
    }
    
    //add gravity
    aarush.velocityY = aarush.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(aarush)){
      //aarush.velocityY = -13
      gameState = END;
      dieSound.play();
    }
    if(frameCount%5 === 0){
      speedChange();
    }
    /*if(keyDown(RIGHT_ARROW)){
      aarush.x = aarush.x + 5;
      invisibleGround.x = invisibleGround.x + 5 ;
    }*/

  }
   else if (gameState === END) {
     //console.log("hey")
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      aarush.velocityY = 0
     
       
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     
     if(mousePressedOver(restart) || keyDown("space") || touches.length>0) {
      reset();
      touches=[];
    }
   }
 
  //stop aarush from falling down
  aarush.collide(invisibleGround);
  
  text("HI Score " + localStorage["HighestScore"],width-150,50);
  
  drawSprites();
}


function reset(){
  gameState = PLAY;
  score = 0;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  aarush.changeAnimation("running", aarush_running);
  aarush.x = 200;
  invisibleGround.x = 400 ;
}

function spawnObstacles(){
 if (frameCount % 80 === 0){
   var obstacle = createSprite(windowWidth + 10, windowHeight-45,10,40);
   obstacle.velocityX = -6;
   //console.log(aarush.depth);
    obstacle.addImage(obstacle1);
    //obstacle.debug = true;
    obstacle.setCollider("circle",-6,0,270)

   
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.15;
    obstacle.lifetime = windowWidth/obstacle.velocityX;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 80 === 0) {
     cloud = createSprite(windowWidth + 10,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = windowWidth/cloud.velocityX;
    
    //adjust the depth
    cloud.depth = aarush.depth = ground.depth;
    aarush.depth = aarush.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

function speedChange(){
  obstaclesGroup.setVeloctiyXEach = obstaclesGroup.setVeloctiyXEach - 1
  cloudsGroup.setVeloctiyXEach = cloudsGroup.setVeloctiyXEach - 1
  ground.velocityX = ground.velocityX - 1
}