import { GameObject } from "./gameObject";
import { Framerate } from "./framerate";
import { Vector } from "./vector";
import { Player } from "./player";
import { Ball } from "./ball";
import { Computer } from "./computer";
import axios from "axios";
import { sideWall } from "./sideWall";

var url = "http://highscorepong.azurewebsites.net/api/highscore/";
var highscoresList = document.getElementById("highscoresList");
var scoreSpan = document.getElementById("scoreSpan");
var highscoresArr = [];



function UpdateHighscores():void{
    axios.get(url)
    .then(function (response){
        response.data.forEach(highscoreEntry => {
            var score:string = highscoreEntry;

            var scoreNumber:number = Number(score.slice(6));

            highscoresArr.push({
                id: score.slice(0,1),
                name: score.slice(2,5),
                score: scoreNumber
            })
        });
        var sortedScores = highscoresArr.slice(0);
        sortedScores.sort(function(a,b) {
            return b.score - a.score;
        });
        sortedScores.forEach(score => {
            var element = document.createElement("li");
            element.innerHTML = score.name + " " +  score.score;
            highscoresList.appendChild(element);
        });
    });
}


export class GameEngine
{
    public score:number = 0;
    // items in the game
    public ball:Ball;
    public player1:Player;
    public computer:Computer;
    public sideWallPlayer:sideWall;
    public sideWallEnemy:sideWall;
 
    // canvas info
    public canvasWidth:number;
    public canvasHeight:number;

    // keep track of key states
    public aKey:boolean;
    public qKey:boolean;

    private canvas:HTMLCanvasElement;
    private ctx:CanvasRenderingContext2D;
    
    // array with all gameobjects in the game - If you want more objects in the game add them to this array!
    public objects:GameObject[] = new Array<GameObject>();

    // kepp track of time between loops
    private date: Date = new Date();
    private timeZero: number = this.date.getTime();
    private timeNow: number;

    constructor()
    {
        this.canvas = <HTMLCanvasElement> document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;

        // listen for keyboard input
        document.addEventListener('keyup', this.keyUp.bind(this));
        document.addEventListener('keydown', this.keyDown.bind(this));
        
        this.player1 = new Player(new Vector(20,10), this);
        this.objects.push(this.player1);

        this.computer = new Computer(new Vector(260, 10), this);
        this.objects.push(this.computer);

        this.ball = new Ball(new Vector(this.canvasWidth/2, this.canvasHeight/2), this);
        this.objects.push(this.ball);

        this.sideWallPlayer = new sideWall(new Vector(0,0), this);
        this.objects.push(this.sideWallPlayer);   
        this.sideWallEnemy = new sideWall(new Vector(this.canvasWidth-3,0), this);
        this.objects.push(this.sideWallEnemy); 

        this.gameLoop();
    }

    // keyboard event
    private keyDown(event:KeyboardEvent): void
    {
        if (event.repeat) {return};
        switch (event.key) {
            case "a":
                this.aKey = true;
                break;
            case "q":
                this.qKey = true;
        }
    }

    // keyboard event
    private keyUp(event: KeyboardEvent): void
    {
        switch (event.key) {
            case "a":
                this.aKey=false;
                break;
            case "q":
                this.qKey=false;
                break;
        }   
    } 
    
    // a very good explanation of how rectangular collision works: https://silentmatt.com/rectangle-intersection/
    private Collide(a:GameObject, b:GameObject): boolean {
        if (a.position.x < (b.position.x+b.width) &&
            (a.position.x+a.width) > b.position.x &&
            a.position.y < (b.position.y+a.height) &&
            a.position.y+b.height > b.position.y)
            {
                return true;
            }
        
    }

    // the main game loop
    private gameLoop()
    {
        // clear the screen in every update
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

        this.date = new Date();
        this.timeNow = this.date.getTime()
        var time = this.timeNow-this.timeZero;
        this.timeZero=this.timeNow;

        // run throght all objects
        this.objects.forEach(element => {
            //all objects are testeted for collisions on all objects
            this.objects.forEach(other => {  
                if (element !== other)
                {
                    if (this.Collide(element, other))
                    {
                        element.onColliosion(other);
                    }
                }
            });
            
            //every element is updated
            element.update(time);

            // every element is drawn on canvas
            element.draw(this.ctx);
        });

        if (this.sideWallPlayer.lost == false){
            window.requestAnimationFrame(this.gameLoop.bind(this));
        }

        scoreSpan.innerHTML = this.score.toString();
    }
}

//start gameengine
new GameEngine();
UpdateHighscores();

