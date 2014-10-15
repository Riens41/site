/*! racer 28/03/2014 */
define(["lib/stats","lib/dom","lib/utils"],function(Stats,DOM,Util){var Game;return Game={run:function(opts){Game.loadImgs(opts.imgs,function(image){var canvas,dt,frame,gdt,last,now,render,stats,step,update;opts.ready(image),Game.setKeyListener(opts.keys),canvas=opts.canvas,update=opts.update,render=opts.render,step=opts.step,stats=opts.stats,now=null,last=Util.timestamp(),dt=0,gdt=0,(frame=function(){for(now=Util.timestamp(),dt=Math.min(1,(now-last)/1e3),gdt+=dt;gdt>step;)gdt-=step,update(step);render(),stats.update(),last=now,requestAnimationFrame(frame,canvas)})()})},loadImgs:function(names,callback){var count,i,name,onload,result,_i,_len;for(result=[],count=names.length,onload=function(){0===--count&&callback(result)},i=_i=0,_len=names.length;_len>_i;i=_i+=1)name=names[i],result[i]=document.createElement("img"),DOM.on(result[_i],"load",onload),result[i].src="images/"+name+".png"},setKeyListener:function(keys){var onKey;onKey=function(keyCode,mode){var i,item,_results;for(i=0,_results=[];i<keys.length;)item=keys[i],item.mode=item.mode||"up",(item.key===keyCode||item.keys&&item.keys.indexOf(keyCode)>=0)&&item.mode===mode&&item.action.call(),_results.push(i++);return _results},DOM.on(document,"keydown",function(ev){return onKey(ev.keyCode,"down")}),DOM.on(document,"keyup",function(ev){return onKey(ev.keyCode,"up")})},stats:function(parentId,id){var msg,result,value;return result=new Stats,result.domElement.id=id||"stats",DOM.get(parentId).appendChild(result.domElement),msg=document.createElement("div"),msg.style.cssText="border: 2px solid gray; padding: 5px; margin-top: 5px; text-align: left; font-size: 1.15em; text-align:right;",msg.innerHTML="Your canvas performance is",DOM.get(parentId).appendChild(msg),value=document.createElement("span"),value.innerHTML="...",msg.appendChild(value),setInterval(function(){var color,fps,ok;return fps=result.current(),ok=fps>50?"good":30>fps?"bad":"ok",color=fps>50?"green":30>fps?"red":"gray",value.innerHTML=ok,value.style.color=color,msg.style.borderColor=color},5e3),result},playMusic:function(){var music;music=DOM.get("music"),music.loop=!0,music.volume=.05,music.muted=DOM.storage.muted===!0,music.play(),DOM.toggleClassName("mute","on",music.muted),DOM.on("mute","click",function(){return DOM.storage.muted=music.muted=!music.muted,DOM.toggleClassName("mute","on",music.muted)})}}});