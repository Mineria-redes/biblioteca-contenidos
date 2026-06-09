const colors=["#CE2834","#FF1569","#1796FF","#FF9248","#FFC533"];const tc=c=>"#fff";let data=[];let temas=new Set(),tonos=new Set(),plats=new Set();
fetch("contenidos.json").then(r=>r.json()).then(d=>{data=d.sort((a,b)=>a.titulo.localeCompare(b.titulo));build();render();});
function splitVals(v){return String(v||"").split(",").map(x=>x.trim()).filter(Boolean);}
function build(){make('temaBox',[...new Set(data.flatMap(x=>splitVals(x.tema)))].sort(),temas);make('tonoBox',[...new Set(data.flatMap(x=>splitVals(x.tono)))].sort(),tonos);make('platBox',[...new Set(data.flatMap(x=>splitVals(x.plataforma)))].sort(),plats);
document.querySelectorAll('.dropbtn').forEach(b=>b.onclick=(e)=>{e.stopPropagation();document.getElementById(b.dataset.target).classList.toggle('open')});
document.addEventListener('click',()=>document.querySelectorAll('.menu').forEach(m=>m.classList.remove('open')));document.querySelectorAll('.menu').forEach(m=>m.addEventListener('click',e=>e.stopPropagation()));
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.menu').forEach(m=>m.classList.remove('open'))});
buscar.oninput=render;limpiar.onclick=(e)=>{e.preventDefault();[temas,tonos,plats].forEach(s=>s.clear());document.querySelectorAll('input[type=checkbox]').forEach(c=>c.checked=false);render();}}
function make(id,arr,setObj){document.getElementById(id).innerHTML=arr.map(v=>`<label><input type=checkbox value="${v}"> ${v}</label><br>`).join('');document.querySelectorAll('#'+id+' input').forEach(i=>i.onchange=()=>{i.checked?setObj.add(i.value):setObj.delete(i.value);render();});}
function hasAny(field,setObj){if(!setObj.size)return true;let vals=splitVals(field);return [...setObj].some(v=>vals.includes(v));}
function render(){let q=buscar.value.toLowerCase();let r=data.filter(x=>hasAny(x.tema,temas)&&hasAny(x.tono,tonos)&&hasAny(x.plataforma,plats)&&JSON.stringify(x).toLowerCase().includes(q));
activos.innerHTML=[...temas,...tonos,...plats].map(v=>`<span class=chip>${v} <button onclick="removeFilter('${v}')">✕</button></span>`).join('');
contador.textContent=r.length+' contenidos';
contenedor.innerHTML=r.map(x=>`<div class=card><h3>${x.titulo}</h3>${splitVals(x.tema).map((t,i)=>`<span class=tag style="background:${colors[i%colors.length]};color:white">${t}</span>`).join('')}<p>${splitVals(x.plataforma).join(' · ')} · ${x.formato}</p><p>${splitVals(x.tono).join(' · ')}</p><a href="${x.link}" target=_blank>Ver publicación</a><div class="moreinfo" onclick='showInfo(${JSON.stringify(x).replace(/'/g,"&#39;")})'>Más información</div></div></div>`).join('')}
function removeFilter(v){[temas,tonos,plats].forEach(s=>s.delete(v));document.querySelectorAll('input[type=checkbox]').forEach(c=>{if(c.value===v)c.checked=false});render();}
function showInfo(x){modal.style.display='block';detalle.innerHTML=`<h2>${x.titulo}</h2><p>${x.nota||''}</p>`} cerrar.onclick=()=>modal.style.display='none';