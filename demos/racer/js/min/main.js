/*! racer 28/03/2014 */
define(["lib/dom","lib/utils","lib/debugger","lib/render","lib/game","lib/stats","settings/key","settings/background","settings/colors"],function(DOM,Util,Debugger,Render,Game,Stats,KEY,BACKGROUND,COLORS){var accel,background,breaking,camDepth,camHeight,canvas,ctx,decel,drawDistance,fieldOfView,findSegment,fogDensity,fps,height,keyFaster,keyLeft,keyRight,keySlower,lanes,maxSpeed,offRoadDecel,offRoadLimit,playerX,playerZ,position,render,reset,resetRoad,resolution,roadWidth,rumbleLength,segmentLength,segments,speed,sprites,stats,step,trackLength,update,width;fps=60,step=1/fps,width=1024,height=768,segments=[],stats=Game.stats("fps"),canvas=DOM.get("canvas"),ctx=canvas.getContext("2d"),background=null,sprites=null,resolution=null,roadWidth=2e3,segmentLength=200,rumbleLength=3,trackLength=null,lanes=3,fieldOfView=100,camHeight=1e3,camDepth=null,drawDistance=300,playerX=0,playerZ=null,fogDensity=5,position=0,speed=0,maxSpeed=segmentLength/step,accel=maxSpeed/5,breaking=-maxSpeed,decel=-maxSpeed/5,offRoadDecel=-maxSpeed/2,offRoadLimit=maxSpeed/4,keyLeft=!1,keyRight=!1,keyFaster=!1,keySlower=!1,update=function(dt){var dx;position=Util.increase(position,dt*speed,trackLength),dx=2*dt*(speed/maxSpeed),keyLeft?playerX-=dx:keyRight&&(playerX+=dx),speed=keyFaster?Util.accelerate(speed,accel,dt):keySlower?Util.accelerate(speed,breaking,dt):Util.accelerate(speed,decel,dt),(-1>playerX||playerX>1)&&speed>offRoadLimit&&(speed=Util.accelerate(speed,offRoadDecel,dt)),playerX=Util.limit(playerX,-2,2),speed=Util.limit(speed,0,maxSpeed)},render=function(){var baseSegment,maxy,n,segment;for(baseSegment=findSegment(position),maxy=height,ctx.clearRect(0,0,width,height),Render.background(ctx,background,width,height,BACKGROUND.SKY),Render.background(ctx,background,width,height,BACKGROUND.HILLS),Render.background(ctx,background,width,height,BACKGROUND.TREES),n=0,segment=null;drawDistance>n;)segment=segments[(baseSegment.index+n)%segments.length],segment.looped=segment.index<baseSegment.index,segment.fog=Util.exponentialFog(n/drawDistance,fogDensity),Util.project(segment.p1,playerX*roadWidth,camHeight,position-(segment.looped?trackLength:0),camDepth,width,height,roadWidth),Util.project(segment.p2,playerX*roadWidth,camHeight,position-(segment.looped?trackLength:0),camDepth,width,height,roadWidth),segment.p1.camera.z<=camDepth||segment.p2.screen.y>=maxy?n++:(Render.segment(ctx,width,lanes,segment.p1.screen.x,segment.p1.screen.y,segment.p1.screen.w,segment.p2.screen.x,segment.p2.screen.y,segment.p2.screen.w,segment.fog,segment.color),maxy=segment.p2.screen.y);Render.player(ctx,width,height,resolution,roadWidth,sprites,speed/maxSpeed,camDepth/playerZ,width/2,height,speed*(keyLeft?-1:keyRight?1:0),0)},resetRoad=function(){var n,nRumble;for(segments=[],n=0,nRumble=0;500>n;)segments.push({index:n,p1:{world:{z:n*segmentLength},camera:{},screen:{}},p2:{world:{z:(n+1)*segmentLength},camera:{},screen:{}},color:Math.floor(n/rumbleLength)%2?COLORS.DARK:COLORS.LIGHT}),n++;for(segments[findSegment(playerZ).index+2].color=COLORS.START,segments[findSegment(playerZ).index+3].color=COLORS.START;rumbleLength>nRumble;)segments[segments.length-1-nRumble].color=COLORS.FINISH,nRumble++;trackLength=segments.length*segmentLength},findSegment=function(z){return segments[Math.floor(z/segmentLength)%segments.length]},Game.run({canvas:canvas,render:render,update:update,stats:stats,step:step,imgs:["background","sprites"],keys:[{keys:[KEY.LEFT,KEY.A],mode:"down",action:function(){keyLeft=!0}},{keys:[KEY.RIGHT,KEY.D],mode:"down",action:function(){keyRight=!0}},{keys:[KEY.UP,KEY.W],mode:"down",action:function(){keyFaster=!0}},{keys:[KEY.DOWN,KEY.S],mode:"down",action:function(){keySlower=!0}},{keys:[KEY.LEFT,KEY.A],mode:"up",action:function(){keyLeft=!1}},{keys:[KEY.RIGHT,KEY.D],mode:"up",action:function(){keyRight=!1}},{keys:[KEY.UP,KEY.W],mode:"up",action:function(){keyFaster=!1}},{keys:[KEY.DOWN,KEY.S],mode:"up",action:function(){keySlower=!1}}],ready:function(images){background=images[0],sprites=images[1],reset()}}),reset=function(opts){var options;options=opts||{},canvas.width=width=Util.toInt(options.width,width),canvas.height=height=Util.toInt(options.height,height),lanes=Util.toInt(options.lanes,lanes),roadWidth=Util.toInt(options.roadWidth,roadWidth),camHeight=Util.toInt(options.camHeight,camHeight),drawDistance=Util.toInt(options.drawDistance,drawDistance),fogDensity=Util.toInt(options.fogDensity,fogDensity),fieldOfView=Util.toInt(options.fieldOfView,fieldOfView),segmentLength=Util.toInt(options.segmentLength,segmentLength),rumbleLength=Util.toInt(options.rumbleLength,rumbleLength),camDepth=1/Math.tan(fieldOfView/2*Math.PI/180),playerZ=camHeight*camDepth,resolution=height/480,(0===segments.length||options.segmentLength||options.rumbleLength)&&resetRoad()}});