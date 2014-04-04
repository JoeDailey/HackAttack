$(document).ready(function(){
	console.log("start");
	ctx=document.getElementById("gameCanvas").getContext("2d");

	canvas = $('#gameCanvas')
	canvas.attr("height", $(window).height());
	canvas.attr("width", $(window).width());
	GAME_WIDTH =  $(window).width();
	GAME_HEIGHT = $(window).height();
	$(window).resize(function(){
		canvas.attr("height", $(window).height());
		canvas.attr("width", $(window).width());
		GAME_WIDTH =  $(window).width();
		GAME_HEIGHT = $(window).height();
	});

	$(document).keydown(function(e){
        if(keysDown.indexOf(e.keyCode)==-1)
        	keysDown.push(e.keyCode);
        return true;
    });
    $(document).keyup(function(e){
        keysDown.splice(keysDown.indexOf(e.keyCode), 1);
        return true;
    });
    $(document).mousedown(function(e){
        if(buttonsDown.indexOf(e.which)==-1)
        	buttonsDown.push(e.which);
        return true;
    });
    $(document).mouseup(function(e){
        buttonsDown.splice(buttonsDown.indexOf(e.which), 1);
        return true;
    });
	document.getElementById("gameCanvas").addEventListener('mousemove', function(evt) {
        var rect = document.getElementById("gameCanvas").getBoundingClientRect();
        mouse = {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        }
    }, false);
    document.oncontextmenu = function(e){
		return false;
	}
	write("./hackAttack", function(){
		write("initiallizing....................................", function(){
			write("Start!", function(){
				setInterval(gameLoop, 60);
				setInterval(paintLoop, 60);
				setInterval(canUpdateLoop, 10);
				setInterval(canPaintLoop, 10);
			});
		});
	});
});

var debug = false;
var ctx;
var keysDown = new Array();
var buttonsDown = new Array();
var mouse;


var canvas;
var GAME_HEIGHT;
var GAME_WIDTH;
var MAX_HACKERS = 100;
var hackers = new Array();
var redBulls = new Array();
var canFire = true;

var shirts =[
				[
					[
						new Image(),
						new Image(),
						new Image(),
						new Image(),
						new Image(),
						new Image(),
						new Image(),
						new Image()
					],
					[
						new Image(),
						new Image(),
						new Image(),
						new Image(),
						new Image(),
						new Image(),
						new Image(),
						new Image()
					]
				],
				[
					[
						new Image(),
						new Image(),
						new Image(),
						new Image(),
						new Image(),
						new Image(),
						new Image(),
						new Image()
					],
					[
						new Image(),
						new Image(),
						new Image(),
						new Image(),
						new Image(),
						new Image(),
						new Image(),
						new Image()
					]
				],
				[
					[
						new Image(),
						new Image(),
						new Image(),
						new Image(),
						new Image(),
						new Image(),
						new Image(),
						new Image()
					],
					[
						new Image(),
						new Image(),
						new Image(),
						new Image(),
						new Image(),
						new Image(),
						new Image(),
						new Image()
					]
				]
			 ];
for (var i = 0; i < shirts.length; i++) {
	for (var j = 0; j < shirts[i].length; j++) {
		for (var k = 0; k < shirts[i][j].length; k++) {
			shirts[i][j][k].src = "img/"+i+"_"+j+"_"+k+".png";
		}
	}
}

var can = new Image();
can.src ="img/can.png";

var main = [new Image(),
			new Image(),
			new Image(),
			new Image(),
			new Image(),
			new Image(),
			new Image(),
			new Image()];

main[0].src = "img/main0.png";
main[1].src = "img/main1.png";
main[2].src = "img/main2.png";
main[3].src = "img/main3.png";
main[4].src = "img/main4.png";
main[5].src = "img/main5.png";
main[6].src = "img/main6.png";
main[7].src = "img/main7.png";

var gameLoop = function(){
	//controls--------------------------------------///////---
	for (var i = keysDown.length - 1; i >= 0; i--) {
		switch(keysDown[i]){
        	case 38, 87: Player.Yvel-=8; break;//up
            case 40, 83: Player.Yvel+=8; break;//down
            case 37, 65: Player.Xvel-=8; break;//left
            case 39, 68: Player.Xvel+=8; break;//right
        }
	};

	for (var i = buttonsDown.length - 1; i >= 0; i--) {
		switch(buttonsDown[i]){
			case 1:
					angulate(mouse.x - Player.X, mouse.y - Player.Y, function(ang, mag){
						mag = 8;
						rectulate(ang, mag, function(x, y){
							var bull = newRedBull(Player.X, Player.Y, x, y);
							redBulls.push(bull);
					});
				});
				
			break;
		}
	};
	

	if(hackers.length<100){
		if(Math.random()<(80-hackers.length)/MAX_HACKERS){
			var color = Math.random();
			if(color>.66) color=2;
			else if(color>.33) color=1;
			else color=0;
			var obj;
			if(!!+Math.round(Math.random())){
				var far = Math.round(Math.random()) 
				obj = {
					X:	GAME_WIDTH * far + 30 *(far*2-1),
					Y:	GAME_HEIGHT* Math.random()
				};
			}else{
				var far = Math.round(Math.random())
				obj = {
					X:	GAME_WIDTH*Math.random(),
					Y:	GAME_HEIGHT * far + 30 *(far*2-1)
				};
			}
			if(Player.distance(obj)>250)
				hackers.push(newHacker(obj.X, obj.Y, color));
		}
	}


	Player.update();
	for (var i = hackers.length - 1; i >= 0; i--) {
		hackers[i].update();
	};
}
var paintLoop = function(){
	
	$('#console').html(buttonsDown);
	ctx.clearRect(0,0,GAME_WIDTH, GAME_HEIGHT);
	
	Player.paint();

	for (var i = hackers.length - 1; i >= 0; i--) {
		hackers[i].paint();
	};
	ctx.beginPath();
	ctx.arc(mouse.x,mouse.y,5,0,2*Math.PI);
	ctx.strokeStyle = '#0000ff';
	ctx.stroke();
}
var canPaintLoop = function(){
	for (var x = redBulls.length - 1; x >= 0; x--) {
		if(redBulls[x]!=null) redBulls[x].paint();
	};
}

var canUpdateLoop = function(){
	for (var x = redBulls.length - 1; x >= 0; x--) {
		if(redBulls[x]!=null) redBulls[x].update();
	};
}

var newHacker = function(x, y, type_of){
	var hackr = {
				isZombie:false,
				zombieTurnTime:Math.random()*20+20,
				zombieAmount:0,
				X:x,
				Y:y,
				MAGVEL:10,
				type:type_of,
				Xvel:1.0,
				Yvel:1.0,
				radius:30,
				flip:0,
				update:function(){
					if(this.isZombie){
						this.X += this.Xvel;
						this.Y += this.Yvel;
						if(Player.X - this.X==0)
							this.X=0.1;
						var ang = Math.atan((Player.Y - this.Y)/(Player.X - this.X));
						if((Player.X - this.X) < 0){
							ang+=Math.PI;
						}
						if(this.Xvel==0)
							this.Xvel=0.1;
						var ang2 = Math.atan(this.Yvel/this.Xvel);
						if(this.Xvel < 0){
							ang2+=Math.PI;
						}
						var angDiff = ang2 - ang;
						var angNew = ang2 - angDiff*0.60;
						this.Xvel = this.MAGVEL*Math.cos(angNew);
						this.Yvel = this.MAGVEL*Math.sin(angNew);
					}else{
						this.zombieAmount++;
						if(this.zombieAmount>=this.zombieTurnTime)
							this.isZombie=true;
					}
				},
				paint:function(){
					this.flip=this.flip+0.3;
					var ang = angulateReturn(this.Xvel, this.Yvel).ang;
					ctx.drawImage(shirts[this.type][Math.floor(this.flip)%2][angleSprite(ang)], this.X - this.radius, this.Y - this.radius);	
					if(debug){
						ctx.moveTo(this.X,this.Y);
						ctx.lineTo(this.X+this.Xvel*10, this.Y+this.Yvel*10);
						ctx.stroke();
					}
				},
				distance:function(object){
					if(object.X != undefined && object.Y != undefined){
						return Math.sqrt((this.X-object.X)*(this.X-object.X) + (this.Y-object.Y)*(this.Y-object.Y));
					}
				},
				colliding:function(objects, callback){
					for (var i = objects.length - 1; i >= 0; i--) {
						if(this.distance(objects[i])<this.radius+objects[i].radius){
							callback(objects[i]);
						}
					};
				}
			};
	return hackr;
}
var numOfBulls = 0;
var newRedBull = function(x, y, xvel, yvel){
	var bull = {
				id:numOfBulls,
				X:x,
				Y:y,
				image:can,
				Xvel:xvel,
				Yvel:yvel,
				painting:false,
				radius:5,
				update:function(){
					if(this.Xvel==0)this.Xvel=0.01;
					var ang = Math.atan(this.Yvel/this.Xvel);
					if(this.Xvel < 0){
						ang+=Math.PI;
					}
					var mag = Math.sqrt((this.Xvel)*(this.Xvel) + (this.Yvel)*(this.Yvel));
					mag += 2;
					this.Xvel = Math.cos(ang)*mag;
					this.Yvel = Math.sin(ang)*mag;
					this.X+=this.Xvel;
					this.Y+=this.Yvel;
					if(this.X+this.radius>GAME_WIDTH || this.X-this.radius<0 || this.Y+this.radius>GAME_HEIGHT || this.Y-this.radius<0){
						for (var i = redBulls.length - 1; i >= 0; i--) {
							if(redBulls[i].id==this.id)
								redBulls.splice(i, 1);
						};
					}
					this.colliding(hackers, function(hacker){
						hackers.splice(hackers.indexOf(hacker), 1);
					});
				},
				paint:function(){
					if(this.distance(Player)>this.radius+Player.radius) this.painting = true;
					if(this.painting==true)
						ctx.drawImage(this.image, this.X, this.Y);
					if(debug){
						ctx.moveTo(this.X,this.Y);
						ctx.lineTo(this.X+this.Xvel*10, this.Y+this.Yvel*10);
						ctx.stroke();
					}
				},
				distance:function(object){
					if(object.X != undefined && object.Y != undefined){
						return Math.sqrt((this.X-object.X)*(this.X-object.X) + (this.Y-object.Y)*(this.Y-object.Y));
					}
				},
				colliding:function(objects, callback){
					for (var i = objects.length - 1; i >= 0; i--) {
						if(this.distance(objects[i])<this.radius+objects[i].radius){
							callback(objects[i]);
						}
					};
				}
			};
			numOfBulls++;
	return bull;
}
var Player = {
	X:900.0,
	Y:400.0,
	MAGVEL:15,
	image:main,
	Xvel:0.0,
	Yvel:0.0,
	radius:40,
	hp:100,
	update:function(){
		angulate(this.Xvel, this.Yvel, function(ang, mag){
			if(mag > Player.MAGVEL){
				mag = Player.MAGVEL;
			}else{
				if(mag < 1) mag = 0;
				else mag-=4;
			}
			rectulate(ang, mag, function(xvelo, yvelo){
				Player.Xvel = xvelo;
				Player.Yvel = yvelo;
				if(Player.X+Player.Xvel+Player.radius>GAME_WIDTH) Player.X=GAME_WIDTH - Player.radius;
				if(Player.X+Player.Xvel-Player.radius<0) Player.X=0 + Player.radius;
				else Player.X+=Player.Xvel;
				if(Player.Y+Player.Yvel+Player.radius>GAME_HEIGHT) Player.Y = GAME_HEIGHT- Player.radius;
				else if(Player.Y+Player.Yvel-Player.radius<0) Player.Y=0 + Player.radius;
				else Player.Y+=Player.Yvel;
			});
		});
		Player.colliding(hackers, function(hacker){

			Player.hp-=10;
			write("Ouch! HP:"+Player.hp, function(){});
			if(Player.hp <= 0){
				write("You Failed, The Hackers got to angsty");
			}
			hackers.splice(hackers.indexOf(hacker), 1);

		});
	},
	paint:function(){
		angulate(mouse.x - Player.X - Player.radius, mouse.y - Player.Y - Player.radius, function(ang, mag){
			ctx.drawImage(Player.image[angleSprite(ang)], Player.X - Player.radius, Player.Y - Player.radius);	
		});

		if(debug){
			ctx.moveTo(this.X,this.Y);
			ctx.lineTo(this.X+this.Xvel*10, this.Y+this.Yvel*10);
			ctx.stroke();
		}
	},
	distance:function(object){
		if(object.X != undefined && object.Y != undefined){
			return Math.sqrt((this.X-object.X)*(this.X-object.X) + (this.Y-object.Y)*(this.Y-object.Y));
		}
	},
	colliding:function(objects, callback){
		for (var i = objects.length - 1; i >= 0; i--) {
			if(this.distance(objects[i])<this.radius+objects[i].radius){
				callback(objects[i]);
			}
		};
	}
};
//Misc-------------------------------------------------//////--
var angulate = function(x, y, callback){//(ang, mag)
	if(x==0)x=0.01;
	var ang = Math.atan(y/x);
		if(x < 0){
			ang+=Math.PI;
		}
	var mag = Math.sqrt((x)*(x) + (y)*(y));
	callback(ang, mag);
}
var angulateReturn = function(x, y){//(ang, mag)
	if(x==0)x=0.01;
	var ang = Math.atan(y/x);
		if(x < 0){
			ang+=Math.PI;
		}
	var mag = Math.sqrt((x)*(x) + (y)*(y));
	return {'ang': ang, 'mag':mag};
}
var rectulate = function(ang, mag, callback){//(xvel, yvel)
	if(mag < 0) mag=0;
	var xvel = Math.cos(ang)*mag;
	var yvel = Math.sin(ang)*mag;
	callback(xvel, yvel);
}
var rectulateReturn = function(ang, mag){//(xvel, yvel)
	if(mag < 0) mag=0;
	var xvel = Math.cos(ang)*mag;
	var yvel = Math.sin(ang)*mag;
	return {x:xvel, y:yvel};
}
var angleSprite = function(ang){
	var sprite = 0;
	if(ang < -3*Math.PI/8 || ang > 11*Math.PI/8) sprite = 0;
	else if(ang >= -3*Math.PI/8 && ang < -1*Math.PI/8) sprite = 1;
	else if(ang >= -1*Math.PI/8 && ang < 1*Math.PI/8) sprite = 2;
	else if(ang >= 1*Math.PI/8 && ang < 3*Math.PI/8) sprite = 3;
	else if(ang >= 3*Math.PI/8 && ang < 5*Math.PI/8) sprite = 4;
	else if(ang >= 5*Math.PI/8 && ang < 7*Math.PI/8) sprite = 5;
	else if(ang >= 7*Math.PI/8 && ang < 9*Math.PI/8) sprite = 6;
	else if(ang >= 9*Math.PI/8 && ang < 11*Math.PI/8) sprite = 7;
	return sprite;
}
var terminal = $('#terminal');
var writeLetter = function(h1, word, callback){
	if(word.length == 0) callback();
	else{
		h1.append(word[0]);
		console.log(word);
		word.splice(0, 1);
		setTimeout(function(){writeLetter(h1, word, callback)}, 10);
	}
}
var write = function(text, callback){
	var h1 = $('<h1>hackAttack@mhacks $ </h1>');
	$('#terminal').append(h1);
	writeLetter(h1, text.split(""), callback);
}

