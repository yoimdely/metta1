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
  $('#topTel')?.setAttribute('href', `tel:${COMPANY.phoneE164}`);
  $('#topTel') && ($('#topTel').textContent = COMPANY.phoneDisplay);
  $('#ctaCall')?.setAttribute('href', `tel:${COMPANY.phoneE164}`);
  $('#telText2')?.setAttribute('href', `tel:${COMPANY.phoneE164}`);
  $('#telText2') && ($('#telText2').textContent = COMPANY.phoneDisplay);
  $('#waLink')?.setAttribute('href', `https://wa.me/${COMPANY.whatsapp}`);
  $('#tgLink')?.setAttribute('href', `https://t.me/${COMPANY.telegram}`);
  $('#addrText') && ($('#addrText').textContent = COMPANY.addressText);
  $('#year') && ($('#year').textContent = new Date().getFullYear());
}

function updateCalc(){
  const volume = parseFloat($('#volume')?.value || '0');
  const per = PRICES.concreteBase;
  const total = Math.round(per * volume);
  $('#pricePer') && ($('#pricePer').textContent = `${nf.format(per)} ֏/м³`);
  $('#total') && ($('#total').textContent = `${nf.format(total)} ֏`);
  return { volume, total };
}

function prefillAndScroll(service){
  const { volume, total } = updateCalc();
  $('#fService') && ($('#fService').value = service);
  if(service === 'бетон' && $('#fQty')) $('#fQty').value = `${volume} м³ (≈ ${nf.format(total)} ֏)`;
  $('#lead')?.scrollIntoView({behavior:'smooth'});
}

function buildMessage(){
  const name = $('#fName')?.value.trim() || '';
  const phone = $('#fPhone')?.value.trim() || '';
  const service = $('#fService')?.value || '';
  const qty = $('#fQty')?.value.trim() || '';
  const address = $('#fAddress')?.value.trim() || '';
  const note = $('#fNote')?.value.trim() || '';
  const qs = new URLSearchParams(location.search);
  const utm = [];
  ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(k=>{ const v = qs.get(k); if(v) utm.push(`${k}=${v}`); });
  const utmLine = utm.length ? `\nUTM: ${utm.join(' | ')}` : '';
  const text = `Заявка с сайта Метта Груп\n` +
               (name?`Имя: ${name}\n`:'') +
               (phone?`Телефон: ${phone}\n`:'') +
               `Услуга: ${service}\n` +
               (qty?`Кол-во/объём: ${qty}\n`:'') +
               (address?`Адрес: ${address}\n`:'') +
               (note?`Комментарий: ${note}\n`:'') +
               utmLine;
  return encodeURIComponent(text);
}

function sendWhatsApp(){
  window.open(`https://wa.me/${COMPANY.whatsapp}?text=${buildMessage()}`,'_blank');
}
function sendTelegram(){
  const msg = buildMessage();
  const u = COMPANY.telegram;
  if(u && u !== 'share'){
    alert('Откроется Telegram. Вставьте сообщение из буфера.');
    navigator.clipboard.writeText(decodeURIComponent(msg.replaceAll('%0A','\n')));
    window.open(`https://t.me/${u}`,'_blank');
  }else{
    window.open(`https://t.me/share/url?url=&text=${msg}`,'_blank');
  }
}

/* Reveal on scroll */
function setupReveal(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('on'); io.unobserve(e.target); }
    });
  }, {threshold:.12, rootMargin:'0px 0px -10% 0px'});
  [...$$('.reveal')].forEach(el=>io.observe(el));
}

/* Smooth anchors */
function smoothAnchors(){
  $$('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const id = a.getAttribute('href');
      if(id && id.length>1 && $(id)){ e.preventDefault(); $(id).scrollIntoView({behavior:'smooth'}); }
    });
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  setContacts();
  updateCalc();
  setupReveal();
  smoothAnchors();
  $('#volume')?.addEventListener('input', updateCalc);
});
