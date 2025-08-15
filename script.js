const COMPANY = {
  name: 'ООО «Метта Груп»',
  phoneE164: '+374XXXXXXXXX',
  phoneDisplay: '+374 XX XXX XX XX',
  whatsapp: '374XXXXXXXXX',
  telegram: 'mettagroup',
  addressText: 'Ереван, уточнить адрес/локацию завода'
};
const PRICES = {
  concreteBase: 30000,
  rent: { mixer10: 25000, pumpPerM3: 2500, pumpMin: 80000, crane25Day: 120000, dump20: 30000 },
  materials: { basalt: 5400, dust: 4500 }
};
const nf = new Intl.NumberFormat('ru-RU');
const $ = (s,scope=document)=>scope.querySelector(s);
const $$ = (s,scope=document)=>scope.querySelectorAll(s);

function setContacts(){
  $('#callTop').href = `tel:${COMPANY.phoneE164}`;
  $('#telTop').textContent = COMPANY.phoneDisplay;
  $('#telText').href = `tel:${COMPANY.phoneE164}`;
  $('#telText').textContent = COMPANY.phoneDisplay;
  $('#waLink').href = `https://wa.me/${COMPANY.whatsapp}`;
  $('#tgLink').href = `https://t.me/${COMPANY.telegram}`;
  $('#addrText').textContent = COMPANY.addressText;
  $('#year').textContent = new Date().getFullYear();
}
function updateCalc(){
  const volume = parseFloat($('#volume')?.value || '0');
  const pricePer = PRICES.concreteBase;
  if($('#pricePer')) $('#pricePer').textContent = `${nf.format(pricePer)} ֏/м³`;
  if($('#total')) $('#total').textContent = `${nf.format(Math.round(pricePer * volume))} ֏`;
}
function prefillAndScroll(service){
  const volume = parseFloat($('#volume')?.value || '0');
  const total = Math.round(PRICES.concreteBase * volume);
  if($('#fService')) $('#fService').value = service;
  if(service==='бетон' && $('#fQty')) $('#fQty').value = `${volume} м³ (≈ ${nf.format(total)} ֏)`;
  $('#lead')?.scrollIntoView({behavior:'smooth'});
}
function buildMessage(){
  const name = $('#fName')?.value.trim() || '';
  const phone = $('#fPhone')?.value.trim() || '';
  const service = $('#fService')?.value || '';
  const qty = $('#fQty')?.value.trim() || '';
  const address = $('#fAddress')?.value.trim() || '';
  const note = $('#fNote')?.value.trim() || '';
  const params = new URLSearchParams(location.search);
  const utms = [];
  ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(k=>{ const v=params.get(k); if(v) utms.push(`${k}=${v}`); });
  const utmLine = utms.length ? `\nUTM: ${utms.join(' | ')}` : '';
  const msg = `Заявка с сайта Метта Груп\n`+(name?`Имя: ${name}\n`:``)+(phone?`Телефон: ${phone}\n`:``)+`Услуга: ${service}\n`+(qty?`Кол-во/объём: ${qty}\n`:``)+(address?`Адрес: ${address}\n`:``)+(note?`Комментарий: ${note}\n`:``)+`${utmLine}`;
  return encodeURIComponent(msg);
}
function sendWhatsApp(){ window.open(`https://wa.me/${COMPANY.whatsapp}?text=${buildMessage()}`,'_blank'); }
function sendTelegram(){
  const msg = buildMessage(); const u=COMPANY.telegram; let url;
  if(u && u !== 'share'){ url = `https://t.me/${u}`; alert('Откроется Telegram. Вставьте сообщение из буфера.'); navigator.clipboard.writeText(decodeURIComponent(msg.replaceAll('%0A','\n'))); }
  else{ url = `https://t.me/share/url?url=&text=${msg}`; }
  window.open(url,'_blank');
}
function setupReveal(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; if(reduce) return;
  const targets = [...$$('.reveal')];
  const io = new IntersectionObserver((es)=>{ es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('on'); io.unobserve(e.target); } }); },{threshold:.14, rootMargin:'0px 0px -10% 0px'});
  targets.forEach(el=>io.observe(el));
}
document.addEventListener('DOMContentLoaded', ()=>{ setContacts(); updateCalc(); setupReveal(); });