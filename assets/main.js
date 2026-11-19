/* FISME STUDIO — menu mobile, animation d'accueil, formulaires. */
(function(){
var d=document,b=d.body,R=false;
try{R=matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}
function go(){b.classList.add('go')}
/* Menu mobile */
var mb=d.querySelector('.mb'),mn=d.getElementById('mn');
if(mb&&mn){mb.addEventListener('click',function(){var o=mn.classList.toggle('open');mb.setAttribute('aria-expanded',o)})}
/* Accueil : écran de chargement (une fois par session), titre, étoiles */
if(b.classList.contains('home')){
  var ld=d.getElementById('ld'),seen=false;
  try{seen=sessionStorage.getItem('fisme-ld')==='1'}catch(e){}
  if(ld&&!R&&!seen){
    ld.hidden=false;
    setTimeout(function(){ld.style.opacity=0;go();setTimeout(function(){ld.hidden=true},500)},1700);
    try{sessionStorage.setItem('fisme-ld','1')}catch(e){}
  }else{if(ld)ld.hidden=true;go()}
  setTimeout(go,3500);
  var st=d.getElementById('st'),hero=d.querySelector('.hero');
  if(st&&hero&&!R&&matchMedia('(hover:hover)').matches){
    hero.addEventListener('mousemove',function(e){
      var x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;
      st.style.setProperty('--px',(x*-28)+'px');st.style.setProperty('--py',(y*-28)+'px');
    });
  }
}
/* Formulaires : champs conditionnels, préremplissage, envoi */
d.querySelectorAll('form[data-form]').forEach(function(f){
  function sync(){
    f.querySelectorAll('[data-if]').forEach(function(el){
      var p=el.dataset.if.split('='),c=f.querySelector('[name='+p[0]+']:checked'),on=!!c&&c.value===p[1];
      el.hidden=!on;
      el.querySelectorAll('[data-req]').forEach(function(i){i.required=on});
    });
  }
  f.addEventListener('change',sync);
  var map={type:'projet',service:'service'};
  new URLSearchParams(location.search).forEach(function(v,k){
    var n=map[k];if(!n)return;
    var r=f.querySelector('[name='+n+'][value="'+v+'"]');if(r)r.checked=true;
  });
  sync();
  var msg=f.parentNode.querySelector('.msg'),btn=f.querySelector('button[type=submit]');
  function show(t,ok){msg.textContent=t;msg.className='msg '+(ok?'ok':'err');msg.hidden=false;msg.scrollIntoView({behavior:R?'auto':'smooth',block:'center'})}
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var data={type:f.dataset.form};
    new FormData(f).forEach(function(v,k){data[k]=String(v).trim()});
    var label=btn.textContent;btn.disabled=true;btn.textContent='Envoi en cours…';msg.hidden=true;
    fetch('/api/send',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})
      .then(function(r){return r.json().catch(function(){return{ok:false}}).then(function(j){return{ok:r.ok&&j.ok}})})
      .then(function(x){
        if(x.ok){f.reset();sync();show('Merci, votre demande est bien envoyée. Nous revenons vers vous très vite.',true)}
        else{show('L’envoi n’a pas abouti. Réessayez, ou écrivez-nous directement à contact@fisme-studio.com.',false)}
      })
      .catch(function(){show('L’envoi n’a pas abouti. Vérifiez votre connexion ou écrivez-nous à contact@fisme-studio.com.',false)})
      .then(function(){btn.disabled=false;btn.textContent=label});
  });
});
})();
