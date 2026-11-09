(function(){
const URL='https://tmhroqjzofnyvmqrukti.supabase.co';
const KEY='sb_publishable_67-9Wv12QKqds11BhKwCIw_lbdKeIPY';
const TABLE='user_finance_data',SESSION_KEY='mvf_supabase_session';
const DELETE_FUNCTION='/functions/v1/dynamic-service';
const $=id=>document.getElementById(id);
let session=null,busy=false,timer=null;
function status(message){$('cloudStatus').textContent=message}
function saveSession(value){if(value&&value.expires_in&&!value.expires_at)value.expires_at=Math.floor(Date.now()/1000)+Number(value.expires_in);session=value;if(value)localStorage.setItem(SESSION_KEY,JSON.stringify(value));else localStorage.removeItem(SESSION_KEY);renderAuth()}
function renderAuth(){
 const logged=!!(session&&session.access_token);
 $('cloudForm').hidden=logged||!$('cloudForm').dataset.open;
 $('cloudOpenBtn').hidden=logged;
 $('cloudLogoutBtn').hidden=!logged;
 $('cloudDeleteBtn').hidden=!logged;
 $('cloudTitle').textContent=logged?'Conta: '+((session.user&&session.user.email)||'conectada'):'Sincronizar aparelhos';
 $('cloudOpenBtn').textContent='Conectar';
 if(logged)status('Conta conectada. Seus dados serão sincronizados.');
}
async function request(path,options={},token){
 const headers={'apikey':KEY,'Content-Type':'application/json',...(options.headers||{})};
 if(token)headers.Authorization='Bearer '+token;
 const response=await fetch(URL+path,{...options,headers});
 const body=await response.text();let data=null;try{data=body?JSON.parse(body):null}catch(e){}
 if(!response.ok)throw new Error(data&&(data.msg||data.message||data.error_description||data.error)||'Falha na comunicação com a nuvem ('+response.status+').');
 return data;
}
async function refresh(){
 if(!session||!session.refresh_token)return false;
 try{const next=await request('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:JSON.stringify({refresh_token:session.refresh_token})});saveSession(next);return true}catch(e){saveSession(null);return false}
}
async function validSession(){
 if(!session)return false;
 if(session.expires_at&&session.expires_at>Date.now()/1000+60)return true;
 return refresh();
}
async function cloudData(){
 const rows=await request('/rest/v1/'+TABLE+'?select=data&limit=1',{method:'GET'},session.access_token);
 return rows&&rows.length?rows[0].data:null;
}
async function upload(data){
 await request('/rest/v1/'+TABLE+'?on_conflict=user_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({user_id:session.user.id,data,updated_at:new Date().toISOString()})},session.access_token);
}
async function synchronize(){
 if(busy||!session||!navigator.onLine)return;
 busy=true;status('Sincronizando seus dados...');
 try{
  if(!await validSession())throw new Error('Sua sessão expirou. Entre novamente.');
  const local=Database.read(),remote=await cloudData();
  const merged=Database.mergeData(remote||{months:{}},local);
  Database.replaceData(merged);
  await upload(merged);
  status('Sincronizado. Seus aparelhos estão atualizados.');
  window.dispatchEvent(new Event('finance-cloud-updated'));
 }catch(e){status('Não foi possível sincronizar: '+e.message)}
 finally{busy=false}
}
async function authenticate(mode){
 const email=$('cloudEmail').value.trim(),password=$('cloudPassword').value;
 if(!email||password.length<6){status('Informe um e-mail e uma senha com pelo menos 6 caracteres.');return}
 const button=mode==='signup'?$ ('cloudSignupBtn'):$('cloudLoginBtn');
 button.disabled=true;status(mode==='signup'?'Criando sua conta...':'Entrando...');
 try{
  const result=await request(mode==='signup'?'/auth/v1/signup':'/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email,password})});
  if(!result||!result.access_token){
   status('Conta criada. Confirme o e-mail enviado pelo Supabase e depois entre aqui.');
   return;
  }
  saveSession(result);$('cloudForm').dataset.open='';$('cloudForm').hidden=true;
  await synchronize();
 }catch(e){status(e.message)}
 finally{button.disabled=false}
}
$('cloudOpenBtn').addEventListener('click',()=>{$('cloudForm').dataset.open='1';$('cloudForm').hidden=false;$('cloudEmail').focus()});
$('cloudCancelBtn').addEventListener('click',()=>{$('cloudForm').dataset.open='';$('cloudForm').hidden=true});
$('cloudForm').addEventListener('submit',e=>{e.preventDefault();authenticate('login')});
$('cloudSignupBtn').addEventListener('click',()=>authenticate('signup'));
$('cloudLogoutBtn').addEventListener('click',()=>{saveSession(null);status('Saiu da conta. Os dados continuam salvos neste aparelho.')});
$('cloudDeleteBtn').addEventListener('click',deleteAccount);
async function deleteAccount(){
 if(!session||!session.access_token)return;
 const confirmed=confirm('ATENÇÃO: esta ação é permanente. Sua conta, os dados sincronizados na nuvem e todos os lançamentos, pagamentos, dívidas e valores da Reserva salvos neste aparelho serão apagados. Deseja continuar?');
 if(!confirmed)return;
 const button=$('cloudDeleteBtn');button.disabled=true;button.textContent='Excluindo conta...';status('Excluindo sua conta e seus dados...');
 try{
  await request(DELETE_FUNCTION,{method:'POST',body:JSON.stringify({})},session.access_token);
  Database.clearAll();saveSession(null);status('Conta e dados excluídos com sucesso.');
  window.dispatchEvent(new Event('finance-data-changed'));
  alert('Sua conta e todos os dados financeiros locais e da nuvem foram excluídos.');
  location.reload();
 }catch(e){status('Não foi possível excluir a conta: '+e.message);alert('Não foi possível concluir a exclusão. Nenhum dado local foi apagado. '+e.message)}
 finally{button.disabled=false;button.textContent='Excluir minha conta e meus dados'}
}
window.addEventListener('finance-data-changed',()=>{if(session){clearTimeout(timer);timer=setTimeout(synchronize,900)}});
window.addEventListener('online',synchronize);
window.addEventListener('finance-cloud-updated',()=>{});
try{session=JSON.parse(localStorage.getItem(SESSION_KEY)||'null')}catch(e){session=null}
renderAuth();
if(session){status('Verificando conexão...');synchronize()}
})();