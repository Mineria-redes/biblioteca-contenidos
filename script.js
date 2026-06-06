
const colors=['#CE2834','#FF1569','#1796FF','#FF9248','#FFC533','#B75AFF','#FF97E9','#03F3FF','#600F1E','#5631F4','#80A563','#D6FF64','#FF5F2E'];
const tc=c=>{let h=c.slice(1);let r=parseInt(h.substr(0,2),16),g=parseInt(h.substr(2,2),16),b=parseInt(h.substr(4,2),16);return ((r*299+g*587+b*114)/1000)>150?'#111':'#fff'};

let data=[];
let temas=new Set(), tonos=new Set(), plats=new Set();

fetch('contenidos.json').then(r=>r.json()).then(d=>{
 data=d.sort((a,b)=>a.titulo.localeCompare(b.titulo));
 build();
 render();
});

function build(){
 const temaVals=[...new Set(data.flatMap(x=>String(x.tema).split(',').map(v=>v.trim()).filter(Boolean)))].sort();
 const tonoVals=[...new Set(data.map(x=>x.tono).filter(Boolean))].sort();
 const platVals=[...new Set(data.map(x=>x.plataforma).filter(Boolean))].sort();

 makeChecks('temaBox',temaVals,temas);
 makeChecks('tonoBox',tonoVals,tonos);
 makeChecks('platBox',platVals,plats);

 buscar.oninput=render;
 limpiar.onclick=(e)=>{
   e.preventDefault();
   temas.clear(); tonos.clear(); plats.clear();
   document.querySelectorAll('input[type=checkbox]').forEach(c=>c.checked=false);
   buscar.value='';
   render();
 };
}

function makeChecks(id,values,setObj){
 document.getElementById(id).innerHTML=values.map(v=>`<label class="opt"><input type="checkbox" value="${v}"> ${v}</label>`).join('');
 document.querySelectorAll('#'+id+' input').forEach(el=>{
   el.onchange=()=>{
     el.checked ? setObj.add(el.value) : setObj.delete(el.value);
     render();
   };
 });
}

function render(){
 const q=buscar.value.toLowerCase();

 const res=data.filter(x=>
   (!temas.size || [...temas].some(t=>String(x.tema).includes(t))) &&
   (!tonos.size || tonos.has(x.tono)) &&
   (!plats.size || plats.has(x.plataforma)) &&
   JSON.stringify(x).toLowerCase().includes(q)
 );

 activos.innerHTML=[...temas,...tonos,...plats].map(v=>`<span class="chip">${v}</span>`).join('');
 contador.innerHTML=`${res.length} resultados`;

 contenedor.innerHTML=res.map(x=>{
   const tags=String(x.tema).split(',').map((t,i)=>{
      const c=colors[i%colors.length];
      return `<span class="tag" style="background:${c};color:${tc(c)}">${t.trim()}</span>`;
   }).join('');

   return `<div class="card">
      <h3>${x.titulo}</h3>
      <div>${tags}</div>
      <div class="meta">${x.plataforma} · ${x.formato}</div>
      <div class="tono">${x.tono}</div>
      <a class="link" href="${x.link}" target="_blank">Ver publicación</a>
      <div class="info"><button onclick='showInfo(${JSON.stringify(x).replace(/'/g,"&#39;")})'>Más información</button></div>
   </div>`;
 }).join('');
}

function showInfo(x){
 modal.style.display='block';
 detalle.innerHTML=`
 <h2>${x.titulo}</h2>
 <p><b>Temas:</b> ${x.tema}</p>
 <p><b>Formato:</b> ${x.formato}</p>
 <p><b>Tono:</b> ${x.tono}</p>
 <p><b>Plataforma:</b> ${x.plataforma}</p>
 <p><b>Nota:</b><br>${x.nota || 'Sin nota'}</p>`;
}

cerrar.onclick=()=>modal.style.display='none';
window.onclick=(e)=>{if(e.target===modal) modal.style.display='none';}
