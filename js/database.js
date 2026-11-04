(function(){
const KEY='minhaVidaFinanceira_v1';
function read(){try{return JSON.parse(localStorage.getItem(KEY))||{months:{}}}catch(e){return{months:{}}}}
function write(data,notify=true){localStorage.setItem(KEY,JSON.stringify(data));if(notify)window.dispatchEvent(new Event('finance-data-changed'))}
function key(y,m){return y+'-'+String(m+1).padStart(2,'0')}
function total(month){return (Number(month.carry)||0)+(month.entries||[]).reduce((sum,e)=>sum+(e.type==='debt'?1:-1)*Number(e.amount||0),0)}
function getMonth(y,m){
 const data=read(),k=key(y,m);
 if(!data.months[k]){
  const earlier=Object.keys(data.months).filter(existing=>existing<k).sort();
  const previous=earlier.length?data.months[earlier[earlier.length-1]]:null;
  data.months[k]={carry:previous?total(previous):0,entries:[]};
  write(data,false);
 }
 return data.months[k];
}
function saveMonth(y,m,month){
 const data=read(),k=key(y,m);
 data.months[k]=month;
 const keys=Object.keys(data.months).sort();
 let previous=null;
 keys.forEach((monthKey,index)=>{
  const current=data.months[monthKey];
  if(index>0)current.carry=total(previous);
  previous=current;
 });
 write(data);
}
function all(){return read().months}
function importData(data){if(!data||!data.months||typeof data.months!=='object')throw new Error('Arquivo de backup inválido.');write(data)}
function replaceData(data){if(!data||!data.months||typeof data.months!=='object')throw new Error('Dados financeiros inválidos.');write(data,false)}
function mergeData(remote,local){
 const merged={months:{}};
 const keys=new Set([...Object.keys(remote&&remote.months||{}),...Object.keys(local&&local.months||{})]);
 [...keys].sort().forEach(k=>{
  const a=remote&&remote.months&&remote.months[k]||{},b=local&&local.months&&local.months[k]||{};
  const entries=new Map();
  [...(a.entries||[]),...(b.entries||[])].forEach((entry,i)=>{
   const id=entry.id||('legacy-'+k+'-'+i+'-'+String(entry.description||'')+'-'+String(entry.amount||''));
   entries.set(id,entry);
  });
  merged.months[k]={carry:Number(b.carry??a.carry)||0,entries:[...entries.values()]};
 });
 let previous=null;
 Object.keys(merged.months).sort().forEach((k,i)=>{
  const current=merged.months[k];
  if(i>0)current.carry=total(previous);
  previous=current;
 });
 return merged;
}
window.Database={key,getMonth,saveMonth,all,importData,replaceData,read,mergeData};
})();