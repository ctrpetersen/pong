import { GameObject } from "./gameObject";
import { GameEngine } from "./index";
import { Vector } from "./vector";

export class sideWall implements GameObject{
    public position:Vector;
    public height: number = 0;
    public width:number = 3;
    public gameEngine:GameEngine;
    public lost:boolean = false;
    
    constructor (position, gameEngine:GameEngine)
    {
        this.position = position;
        this.gameEngine = gameEngine;
        this.height = gameEngine.canvasHeight;
    }

    onColliosion(other:GameObject):void{
        this.gameEngine.ball.direction = new Vector(0.7, 1);
        this.gameEngine.ball.position = new Vector(this.gameEngine.canvasWidth/2, this.gameEngine.canvasHeight/2)
        this.lost = true;
        this.gameEngine.score++;
        
    }

    update(time: number) : void{

    }

    draw(ctx:CanvasRenderingContext2D) : void{
        ctx.fillStyle
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height); 
    }
    
}