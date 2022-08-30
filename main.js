//general Vars.
var rows = 6
var collums = 7;
var spacer = 10;
var radius = (getWidth() / collums) / 2 - spacer/2;
var backgroundHeight = radius * collums - 2*radius - 10;
var board;
var background;
var globalElem;
var start_;
var elem = getElementAt(0, 0);
var piece;

var yMultiplier;
var red = true;
var winC = true;
var player;
//the GRID.
var xGrid = 0;
var yGrid = 0;
var gridSet = new Set();
//timers
var timer = 0;
var timer1;
var timer_1 = 0;
var timer_2 = 0;
var active = false;
var redTime;
var yelTime;
var globalTime;
//player selection
var P1;
var P2;
P1 = new Text("P1 ", "15pt Times New Roman");
P2 = new Text(" P2", "15pt Times New Roman");
var keep = getWidth() - P2.getWidth() - 10;
P1.setPosition(10, 130);
P2.setPosition(getWidth() - P2.getWidth() - 10, 130);
P1.setColor(Color.red);
P2.setColor(Color.yellow);


var boardGridPlacement = new Grid(7, 7);

function start(){
    boardGridPlacement.initFromArray([
//          COL   col  col

//       0  1  2  3  4  5  6  
        [0, 0, 0, 0, 0,	0, 0],//0
        [0, 0, 0, 0, 0,	0, 0],//1     Row
        [0, 0, 0, 0, 0,	0, 0],//2     ROW
        [0, 0, 0, 0, 0,	0, 0],//3     ROWS
        [0, 0, 0, 0, 0,	0, 0],//4
        [0, 0, 0, 0, 0,	0, 0],//5
        [3, 4, 3, 3, 3,	4, 3]//6 represents the 'base' of the game, under the board so you can build up
        
        //This represents the game board and where you can play
        
    ]);
    graphix();
    add(P1);
    add(P2);
    redTime = new Text("0" + ":" + "00", "15pt Times New Roman");
    yelTime = new Text("0" + ":" + "00", "15pt Times New Roman");
    globalTime = new Text("0" + ":" + "00", "15pt Times New Roman");
    redTime.setPosition(60, 130);
    yelTime.setPosition(getWidth() - P2.getWidth() - 70, 130);
    globalTime.setPosition(getWidth()/2 - globalTime.getWidth()/2, 130);
    add(redTime);
    add(yelTime);
    add(globalTime)
    setTimer(turnCheck, 0);
    mouseMoveMethod(hover);
    mouseClickMethod(placeTile);
}

function win(winner){
    winC = false;
    stopTimer(timers);
    stopTimer(turnCheck);
    if(winner == 1){
        player = "Red";
        console.log("Red Won get rekt");
    }else if(winner == 2){
        player = "Yellow";
        console.log("Yellow Won get rekt");
    }
    var winTX = new Text(player + " Won!", "30pt Arial");
    if(winner == 1){
        
        winTX.setColor(Color.red);
    }
    winTX.setText(player + " Won!");
    winTX.setPosition(getWidth()/2 - winTX.getWidth()/2, 50);
    
    add(winTX);
}


function placeTile(e){
    xGrid = Math.round((e.getX() - 40) / 54.2);
    yGrid = Math.round((e.getY() - 40) / 59);
    var topCount = 0;
    
    for(var i = 0; i < boardGridPlacement.numCols(); i++){
        
        if(boardGridPlacement.inBounds(i, xGrid) && boardGridPlacement.get(i, xGrid) != 0 && gridSet.contains(globalElem) && winC){
            if(!active){setTimer(timers, 1000);active = true;}
            
//                                              \/ gets the diameter plus space         \/ addes the space above the board because it's not centered about the origin
//                                                                      \/ multiplies by how far down the open space is minus how far down your mouse is.
            var yValueNotBugged = (globalElem.getRadius()*2 + spacer)*(i - yGrid+1) + globalElem.getY();
            piece = getElementAt(e.getX(), yValueNotBugged);
            if(red){
                red = false;
                if(boardGridPlacement.inBounds(i - 1, xGrid)){boardGridPlacement.set(i - 1, xGrid, 1)};
                if(piece != null){
                    checkWin(xGrid, i);
                    
                    return piece.setColor(Color.red);
                    
                }
            }else{
                red = true;
                if(boardGridPlacement.inBounds(i - 1, xGrid)){boardGridPlacement.set(i - 1, xGrid, 2)};
                if(piece != null){
                    checkWin(xGrid, i);
                    
                    return piece.setColor(Color.yellow);
                    
                }
            }
        }
        topCount++;
    }
    
    
}

function timers(){
    timer++
    if(timer1){
        timer_1++
    }else{
        timer_2++
    }
}
function turnCheck(){
    var minutesG = Math.floor(timer / 60);
    var minutesR = Math.floor(timer_1 / 60);
    var minutesY = Math.floor(timer_2 / 60);
    //stuff for the timers, just telling when to anex a 0
    var secondsG = timer % 60;
    var secondsR = timer_1 % 60;
    var secondsY = timer_2 % 60;
    if(secondsG * 10 < 100){
        var zero = "0"
    }else{
        var zero = "";
    }
    if(secondsR * 10 < 100){
        var zeroR = "0"
    }else{
        var zeroR = "";
    }
    if(secondsY * 10 < 100){
        var zeroY = "0"
    }else{
        var zeroY = "";
    }
    globalTime.setText(minutesG + ":" + zero + secondsG);
    redTime.setText(minutesR + ":" + zeroR + secondsR);
    yelTime.setText(minutesY + ":" + zeroY + secondsY);
    if(red){
        P1.setText("P1 *");
        P2.setText("P2");
        P2.setPosition(keep, P2.getY());
        timer1 = true;
    }else{
        P2.setText("* P2");
        P2.setPosition(keep - 15, P2.getY());
        P1.setText("P1");
        timer1 = false;
    }
    
    
    
}

function checkWin(x, y){
    
    for(var i = 0; i <= 4; i++){
        //console.log(i);
        checkLeft(x - 3 + i, y - 1);
        checkRight(x + 3 - i, y - 1);
        checkDown(x, y + 3 - i);
        check_NW(x - 3 + i, y - 4 + i);
        check_NE(x + 4 - i, y - 4 + i);
        check_SE(x + 3 - i, y + 3 - i);
        check_SW(x - 3 + i, y + 3 - i);
        
    }
}
function checkLeft(x, y){
    
    if(boardGridPlacement.inBounds(y, x)){
        
        var $1 = boardGridPlacement.get(y, x+3);
        var $2 = boardGridPlacement.get(y, x+2);
        var $3 = boardGridPlacement.get(y, x+1);
        var $4 = boardGridPlacement.get(y, x);
        //console.log($1 + ", " + $2 + ", " + $3 + ", " + $4 + ":L");
        if($1 == $2 && $2 == $3 && $3 == $4 && $4 == 1 || $4 == 2 && $1 == $2 && $2 == $3 && $3 == $4){
            win($1);
        }
    }
}
function checkRight(x, y){
    
    
        if(boardGridPlacement.inBounds(y, x)){
        var $1 = boardGridPlacement.get(y, x-3);
        var $2 = boardGridPlacement.get(y, x-2);
        var $3 = boardGridPlacement.get(y, x-1);
        var $4 = boardGridPlacement.get(y, x);
        //console.log($1 + ", " + $2 + ", " + $3 + ", " + $4+":R");
        if($1 == $2 && $2 == $3 && $3 == $4 && $1 == 1 || $1 == 2 && $1 == $2 && $2 == $3 && $3 == $4){
            win($1);
        }
    
    }
}
function checkDown(x, y){
    
    
        if(boardGridPlacement.inBounds(y-1, x) && boardGridPlacement.inBounds(y-2, x) && boardGridPlacement.inBounds(y-3, x) && boardGridPlacement.inBounds(y-4, x)){
        var $1 = boardGridPlacement.get(y-4, x);
        var $2 = boardGridPlacement.get(y-3, x);
        var $3 = boardGridPlacement.get(y-2, x);
        var $4 = boardGridPlacement.get(y-1, x);
        //console.log($1 + ", " + $2 + ", " + $3 + ", " + $4+":D");
        if($1 == $2 && $2 == $3 && $3 == $4 && $1 == 1 || $1 == 2 && $1 == $2 && $2 == $3 && $3 == $4){
            win($1);
        }
    }
}
function check_NW(x, y){
    
    
        if(boardGridPlacement.inBounds(y, x) && boardGridPlacement.inBounds(y+1, x+1) && boardGridPlacement.inBounds(y+2, x+2) && boardGridPlacement.inBounds(y+3, x+3)){
        var $1 = boardGridPlacement.get(y+3, x+3);
        var $2 = boardGridPlacement.get(y+2, x+2);
        var $3 = boardGridPlacement.get(y+1, x+1);
        var $4 = boardGridPlacement.get(y, x);
        //console.log($1 + ", " + $2 + ", " + $3 + ", " + $4+":NW");
        if($1 == $2 && $2 == $3 && $3 == $4 && $1 == 1 || $1 == 2 && $1 == $2 && $2 == $3 && $3 == $4){
            win($1);
        }
        
    }
    
}
function check_NE(x, y){
    
    
        if(boardGridPlacement.inBounds(y, x-1) && boardGridPlacement.inBounds(y+1, x-2) && boardGridPlacement.inBounds(y+2, x-3) && boardGridPlacement.inBounds(y+3, x-4)){
        var $1 = boardGridPlacement.get(y+3, x-4);
        var $2 = boardGridPlacement.get(y+2, x-3);
        var $3 = boardGridPlacement.get(y+1, x-2);
        var $4 = boardGridPlacement.get(y, x-1);
        //console.log($1 + ", " + $2 + ", " + $3 + ", " + $4+":NE");
        if($1 == $2 && $2 == $3 && $3 == $4 && $1 == 1 || $1 == 2 && $1 == $2 && $2 == $3 && $3 == $4){
            win($1);
        }
        
    }
}
function check_SE(x, y){
        if(boardGridPlacement.inBounds(y-1, x) && boardGridPlacement.inBounds(y-2, x-1) && boardGridPlacement.inBounds(y-3, x-2) && boardGridPlacement.inBounds(y-4, x-3)){
        var $1 = boardGridPlacement.get(y-4, x-3);
        var $2 = boardGridPlacement.get(y-3, x-2);
        var $3 = boardGridPlacement.get(y-2, x-1);
        var $4 = boardGridPlacement.get(y-1, x);
        //console.log($1 + ", " + $2 + ", " + $3 + ", " + $4+":SE");
        if($1 == $2 && $2 == $3 && $3 == $4 && $1 == 1 || $1 == 2 && $1 == $2 && $2 == $3 && $3 == $4){
            win($1);
        }
        
    }
}
function check_SW(x, y){
        if(boardGridPlacement.inBounds(y-1, x) && boardGridPlacement.inBounds(y-2, x+1) && boardGridPlacement.inBounds(y-3, x+2) && boardGridPlacement.inBounds(y-4, x+3)){
        var $1 = boardGridPlacement.get(y-4, x+3);
        var $2 = boardGridPlacement.get(y-3, x+2);
        var $3 = boardGridPlacement.get(y-2, x+1);
        var $4 = boardGridPlacement.get(y-1, x);
        //console.log($1 + ", " + $2 + ", " + $3 + ", " + $4+":SW");
        if($1 == $2 && $2 == $3 && $3 == $4 && $1 == 1 || $1 == 2 && $1 == $2 && $2 == $3 && $3 == $4){
            win($1);
        }
    }
    
}

function hover(e){
    yGrid = Math.round((e.getY() - 40) / 59);
    xGrid = Math.round((e.getX() - 39) / 54.2);
    globalElem = getElementAt(e.getX(), e.getY());
}

function graphix(){
    background = new Rectangle(getWidth(), getHeight());
    background.setPosition(0, backgroundHeight);
    background.setColor("#43A9F4");
    add(background);
    drawGrid(collums, 1, 0);
    drawGrid(collums, 1, 1);
    drawGrid(collums, 1, 2);
    drawGrid(collums, 1, 3);
    drawGrid(collums, 1, 4);
    drawGrid(collums, 1, 5);
    drawGrid(collums, 1, 6);
}
function drawGrid(collums, height, width){
    height = 1;
    for(var i = 0; i < collums - 1; i++){
        //Puts all position into a set so they can all be detected easily.
        gridSet.add(board = new Circle(radius));
        board.setPosition(radius+(spacer * width)+radius*2 * width + spacer/2, getHeight() - (radius*2 * height) + radius - (spacer * height));
        board.setColor(Color.white);
        add(board);
        height++;
    }
}
