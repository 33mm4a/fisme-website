// Cloudflare Pages Function : POST /api/send
// Reçoit les formulaires FirstLook et Devis, envoie un e-mail via Resend.
// Variables à définir dans Cloudflare (voir LISEZ-MOI.md) : RESEND_API_KEY (obligatoire), TO_EMAIL, FROM_EMAIL (optionnelles).
const LABELS={nom:'Prénom et nom',email:'E-mail',projet:'Projet',entreprise:'Entreprise',site:'Site web',service:'Service',precision:'Précision (sur mesure)',infos:'Informations complémentaires'};
const NAMES={creation:'Création',refonte:'Refonte','sur-mesure':'Sur mesure'};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const json=(status,body)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});

export async function onRequestPost({request,env}){
  let b;
  try{b=await request.json()}catch(e){return json(400,{ok:false,error:'bad_request'})}
  if(b.hp)return json(200,{ok:true}); // champ piège rempli par les robots : on ne fait rien
  const type=b.type;
  const required=type==='firstlook'?['nom','email','projet']:type==='devis'?['nom','email','entreprise','service']:null;
  if(!required)return json(400,{ok:false,error:'unknown_form'});
  const v={};
  for(const k of Object.keys(LABELS))v[k]=String(b[k]??'').trim().slice(0,4000);
  for(const k of required)if(!v[k])return json(400,{ok:false,error:'missing_'+k});
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email))return json(400,{ok:false,error:'bad_email'});
  if(type==='firstlook'&&v.projet==='refonte'&&!v.entreprise)return json(400,{ok:false,error:'missing_entreprise'});
  if(type==='devis'&&v.service==='sur-mesure'&&!v.precision)return json(400,{ok:false,error:'missing_precision'});
  if(!env.RESEND_API_KEY)return json(500,{ok:false,error:'not_configured'});

  const label=type==='firstlook'?'FirstLook':'Devis';
  const what=NAMES[v.service||v.projet]||v.service||v.projet;
  const subject=`[${label}] ${v.entreprise||v.nom} — ${what}`;
  const rows=Object.keys(LABELS).filter(k=>v[k]);
  const text=rows.map(k=>`${LABELS[k]} : ${k==='projet'||k==='service'?NAMES[v[k]]||v[k]:v[k]}`).join('\n');
  const html='<table cellpadding="8" style="font-family:Arial,sans-serif;font-size:15px;border-collapse:collapse">'+
    rows.map(k=>`<tr><td style="font-weight:bold;vertical-align:top">${LABELS[k]}</td><td>${esc(k==='projet'||k==='service'?NAMES[v[k]]||v[k]:v[k]).replace(/\n/g,'<br>')}</td></tr>`).join('')+'</table>';

  const r=await fetch('https://api.resend.com/emails',{
    method:'POST',
    headers:{'Authorization':'Bearer '+env.RESEND_API_KEY,'Content-Type':'application/json'},
    body:JSON.stringify({
      from:env.FROM_EMAIL||'FISME STUDIO <contact@fisme-studio.com>',
      to:[env.TO_EMAIL||'contact@fisme-studio.com'],
      reply_to:v.email,subject,html,text
    })
  });
  if(!r.ok)return json(502,{ok:false,error:'mail_failed'});
  return json(200,{ok:true});
}
export const onRequest=()=>json(405,{ok:false,error:'method_not_allowed'});
