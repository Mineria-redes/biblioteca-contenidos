let datos=[];
fetch('contenidos.json')
.then(r=>r.json())
.then(d=>{datos=d; iniciar();});

function iniciar(){
 const temas=[...new Set(datos.flatMap(x=>String(x.tema||'').split(',').map(v=>v.trim()).filter(Boolean)))].sort();
 const formatos=[...new Set(datos.map(x=>x.formato).filter(Boolean))].sort();
 const tonos=[...new Set(datos.map(x=>x.tono).filter(Boolean))].sort();

 temas.forEach(v=>tema.add(new Option(v,v)));
 formatos.forEach(v=>formato.add(new Option(v,v)));
 tonos.forEach(v=>tono.add(new Option(v,v)));

 ['buscar','tema','formato','tono'].forEach(id=>document.getElementById(id).addEventListener('input',render));
 render();
}
function render(){
 const b=buscar.value.toLowerCase();
 const t=tema.value,f=formato.value,to=tono.value;
 const res=datos.filter(x=>
 (!b || JSON.stringify(x).toLowerCase().includes(b)) &&
 (!t || String(x.tema).includes(t)) &&
 (!f || x.formato===f) &&
 (!to || x.tono===to)
 );
 contenedor.innerHTML=res.map(x=>`
 <div class="card">
 <h3>${x.titulo}</h3>
 <div class="tags">${String(x.tema).split(',').map(v=>'<span>'+v.trim()+'</span>').join('')}</div>
 <p><b>Formato:</b> ${x.formato}</p>
 <p><b>Tono:</b> ${x.tono}</p>
 <p><b>Plataforma:</b> ${x.plataforma}</p>
 <p><a href="${x.link}" target="_blank">Ver publicación</a></p>
 </div>`).join('');
}
