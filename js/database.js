(function(){
const KEY='minhaVidaFinanceira_v1';
function read(){try{const data=JSON.parse(localStorage.getItem(KEY))||{months:{}};Object.values(data.months||{}).forEach(month=>{month.carry=0});return data}catch(e){return{months:{}}}}
function write(data,notify=true){localStorage.setItem(KEY,JSON.stringify(data));if(notify)window.dispatchEvent(new Event('finance-data-changed'))}
function key(y,m){return y+'-'+String(m+1).padStart(2,'0')}
function total(month){return (month.entries||[]).reduce((sum,e)=>sum+(e.type==='debt'?1:-1)*Number(e.amount||0),0)}
function getMonth(y,m){
 const data=read(),k=key(y,m);
 if(!data.months[k]){
  const earlier=Object.keys(data.months).filter(existing=>existing<k).sort();
  const previous=earlier.length?data.months[earlier[earlier.length-1]]:null;
  data.months[k]={carry:0,entries:[]};
  write(data,false);
 }
 return data.months[k];
}
function saveMonth(y,m,month){
 const data=read(),k=key(y,m);
 data.months[k]=month;
 Object.values(data.months).forEach(current=>{current.carry=0});
 write(data);
}
function all(){return read().months}
function saveReserve(reserve){const data=read();data.reserve=reserve;write(data)}
function clearAll(){localStorage.removeItem(KEY)}
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
  merged.months[k]={carry:0,entries:[...entries.values()]};
 });

 const rr=remote&&remote.reserve||{},lr=local&&local.reserve||{};
 const selected=Number(lr.updatedAt||0)>=Number(rr.updatedAt||0)?lr:rr;
 const deposits=new Map();
 [...(rr.deposits||[]),...(lr.deposits||[])].forEach((item,i)=>deposits.set(item.id||('reserve-'+i+'-'+item.date+'-'+item.amount),item));
 merged.reserve={monthlyGoal:Number(selected.monthlyGoal)||0,updatedAt:Number(selected.updatedAt)||0,deposits:[...deposits.values()]};
 return merged;
}
window.Database={key,getMonth,saveMonth,all,saveReserve,importData,replaceData,read,mergeData,clearAll};
})();