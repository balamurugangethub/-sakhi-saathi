// ============ Icons: illustrated inline SVG replaces every emoji (no images to download) ============
const ST='stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none"';
const ICONS = {
  lpg:'<path d="M32 3c3 4 7 7 7 12a7 7 0 0 1-14 0c0-2 1-4 3-6 0 2 1 3 2 3 0-3 0-5 2-9z" fill="#f5a524"/><rect x="27" y="20" width="10" height="8" rx="2" fill="#4a2a37"/><rect x="18" y="27" width="28" height="33" rx="10" fill="#3b82c4"/><rect x="18" y="38" width="28" height="6" fill="#fff" opacity=".65"/>',
  gift:'<rect x="10" y="28" width="44" height="30" rx="4" fill="#d6336c"/><rect x="7" y="20" width="50" height="11" rx="4" fill="#ff8fb3"/><rect x="29" y="20" width="6" height="38" fill="#ffd43b"/><ellipse cx="23" cy="14" rx="9" ry="6" fill="#ffd43b"/><ellipse cx="41" cy="14" rx="9" ry="6" fill="#ffd43b"/>',
  cash:'<rect x="4" y="16" width="56" height="32" rx="5" fill="#2f9e44"/><circle cx="32" cy="32" r="10" fill="#d3f9d8"/><text x="32" y="38" font-size="15" font-weight="700" text-anchor="middle" fill="#2f9e44" font-family="sans-serif">₹</text><circle cx="12" cy="32" r="3" fill="#d3f9d8"/><circle cx="52" cy="32" r="3" fill="#d3f9d8"/>',
  mother:'<path d="M32 58C10 42 5 30 5 21a14 14 0 0 1 27-4 14 14 0 0 1 27 4c0 9-5 21-27 37z" fill="#d6336c"/><circle cx="32" cy="30" r="10" fill="#ffe0cc"/><path d="M22 26c2-8 18-8 20 0-6-1-14-1-20 0z" fill="#4a2a37"/><circle cx="28" cy="32" r="1.6" fill="#4a2a37"/><circle cx="36" cy="32" r="1.6" fill="#4a2a37"/><path d="M28.5 36q3.5 3 7 0" stroke="#4a2a37" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
  girl:'<circle cx="12" cy="36" r="7" fill="#4a2a37"/><circle cx="52" cy="36" r="7" fill="#4a2a37"/><circle cx="32" cy="36" r="18" fill="#ffe0cc"/><path d="M14 34a18 18 0 0 1 36 0c-8-2-13-7-15-12-3 6-11 11-21 12z" fill="#4a2a37"/><circle cx="12" cy="29" r="4.5" fill="#d6336c"/><circle cx="52" cy="29" r="4.5" fill="#d6336c"/><circle cx="25" cy="38" r="2" fill="#4a2a37"/><circle cx="39" cy="38" r="2" fill="#4a2a37"/><path d="M27 45q5 4 10 0" stroke="#d6336c" stroke-width="2.4" fill="none" stroke-linecap="round"/>',
  bank:'<polygon points="32,5 59,21 5,21" fill="#3b82c4"/><rect x="11" y="26" width="7" height="22" fill="#dbe9f9"/><rect x="23" y="26" width="7" height="22" fill="#dbe9f9"/><rect x="34" y="26" width="7" height="22" fill="#dbe9f9"/><rect x="46" y="26" width="7" height="22" fill="#dbe9f9"/><rect x="6" y="50" width="52" height="8" rx="2" fill="#4a2a37"/>',
  hospital:'<rect x="6" y="6" width="52" height="52" rx="14" fill="#fff" stroke="#e03131" stroke-width="4"/><path d="M26 15h12v11h11v12H38v11H26V38H15V26h11z" fill="#e03131"/>',
  skill:'<rect x="14" y="12" width="36" height="7" rx="2" fill="#f5a524"/><rect x="14" y="45" width="36" height="7" rx="2" fill="#f5a524"/><rect x="18" y="19" width="28" height="26" fill="#ff8fb3"/><path d="M18 26l28 6M18 34l28 6" stroke="#d6336c" stroke-width="3"/><path d="M48 52l10-34" stroke="#4a2a37" stroke-width="3" stroke-linecap="round"/>',
  id:'<rect x="4" y="12" width="56" height="40" rx="6" fill="#3b82c4"/><circle cx="20" cy="29" r="6" fill="#fff"/><path d="M10 44c2-8 18-8 20 0z" fill="#fff"/><path d="M36 25h18M36 33h18M36 41h12" stroke="#fff" stroke-width="3" stroke-linecap="round"/>',
  book:'<rect x="12" y="5" width="40" height="54" rx="4" fill="#d6336c"/><rect x="17" y="5" width="3" height="54" fill="#a61e4d"/><circle cx="35" cy="26" r="8" fill="#ffd6e4"/><path d="M24 44h22M24 50h14" stroke="#ffd6e4" stroke-width="3" stroke-linecap="round"/>',
  receipt:'<path d="M14 4h36v56l-6-4-6 4-6-4-6 4-6-4-6 4z" fill="#fff" stroke="#4a2a37" stroke-width="3" stroke-linejoin="round"/><path d="M22 18h20M22 28h20M22 38h12" stroke="#4a2a37" stroke-width="3" stroke-linecap="round"/>',
  phone:'<rect x="18" y="4" width="28" height="56" rx="6" fill="#4a2a37"/><rect x="22" y="11" width="20" height="36" rx="2" fill="#bcd4ee"/><circle cx="32" cy="53" r="3" fill="#fff"/>',
  camera:'<path d="M20 14l4-6h16l4 6z" fill="#4a2a37"/><rect x="4" y="14" width="56" height="38" rx="7" fill="#4a2a37"/><circle cx="32" cy="33" r="12" fill="#bcd4ee"/><circle cx="32" cy="33" r="6" fill="#3b82c4"/>',
  cert:'<rect x="6" y="10" width="52" height="38" rx="3" fill="#fff" stroke="#f5a524" stroke-width="3"/><path d="M16 20h32M16 27h22" stroke="#4a2a37" stroke-width="3" stroke-linecap="round"/><circle cx="44" cy="40" r="8" fill="#f5a524"/><path d="M40 46l-3 12 7-4 7 4-3-12z" fill="#d6336c"/>',
  cap:'<polygon points="32,10 61,25 32,40 3,25" fill="#4a2a37"/><path d="M15 33v12c10 9 24 9 34 0V33l-17 9z" fill="#6b4a57"/><path d="M58 27v18" stroke="#f5a524" stroke-width="3"/>',
  flower:'<g fill="#ff8fb3"><circle cx="32" cy="14" r="11"/><circle cx="50" cy="27" r="11"/><circle cx="43" cy="48" r="11"/><circle cx="21" cy="48" r="11"/><circle cx="14" cy="27" r="11"/></g><circle cx="32" cy="32" r="9" fill="#f5a524"/>',
  mic:'<rect x="23" y="5" width="18" height="33" rx="9" fill="currentColor"/><path d="M13 30a19 19 0 0 0 38 0M32 49v10M22 59h20" '+ST+'/>',
  speaker:'<path d="M6 24h12l16-13v42L18 40H6z" fill="currentColor"/><path d="M42 22a14 14 0 0 1 0 20M49 14a25 25 0 0 1 0 36" '+ST+'/>',
  mute:'<path d="M6 24h12l16-13v42L18 40H6z" fill="currentColor"/><path d="M42 24l16 16M58 24L42 40" '+ST+'/>',
  check:'<path d="M12 33l14 14 26-28" stroke="currentColor" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  cross:'<path d="M14 14l36 36M50 14L14 50" stroke="currentColor" stroke-width="9" stroke-linecap="round" fill="none"/>',
  call:'<path d="M17 6c-6 2-10 7-9 14 3 22 19 36 40 38 7 1 12-4 14-9l-13-9-8 6c-8-4-14-10-18-18l6-8z" fill="currentColor"/>',
  home:'<path d="M6 31L32 7l26 24h-8v25H38V40H26v16H14V31z" fill="currentColor"/>',
  back:'<path d="M40 10L18 32l22 22" stroke="currentColor" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
  help:'<circle cx="32" cy="32" r="26" '+ST+'/><path d="M24 25a8 8 0 1 1 11 7c-3 2-3 4-3 7" '+ST+'/><circle cx="32" cy="48" r="3" fill="currentColor"/>',
  again:'<path d="M52 32a20 20 0 1 1-7-15" '+ST+'/><path d="M46 6v14H32" '+ST+'/>',
  globe:'<circle cx="32" cy="32" r="25" '+ST+'/><ellipse cx="32" cy="32" rx="11" ry="25" '+ST+'/><path d="M8 32h48M12 19h40M12 45h40" '+ST+'/>',
  party:'<polygon points="32,4 39,24 60,24 43,37 49,58 32,45 15,58 21,37 4,24 25,24" fill="#f5a524"/>',
  heart:'<path d="M32 56C12 42 6 31 6 22a13 13 0 0 1 26-3 13 13 0 0 1 26 3c0 9-6 20-26 34z" fill="#d6336c"/>',
  doc:'<path d="M14 4h26l12 12v44H14z" fill="#fff" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M22 28h22M22 38h22M22 48h14" '+ST+'/>',
  pin:'<path d="M32 4a18 18 0 0 0-18 18c0 14 18 38 18 38s18-24 18-38A18 18 0 0 0 32 4z" fill="#d6336c"/><circle cx="32" cy="22" r="7" fill="#fff"/>',
  info:'<circle cx="32" cy="32" r="26" fill="#3b82c4"/><circle cx="32" cy="19" r="3.5" fill="#fff"/><path d="M32 29v16" stroke="#fff" stroke-width="6" stroke-linecap="round"/>',
  coin:'<circle cx="32" cy="32" r="26" fill="#f5a524"/><circle cx="32" cy="32" r="19" fill="#ffd43b"/><text x="32" y="40" font-size="22" font-weight="700" text-anchor="middle" fill="#a8650a" font-family="sans-serif">₹</text>',
  play:'<polygon points="16,8 56,32 16,56" fill="currentColor"/>',
  share:'<path d="M32 38V6M18 20L32 6l14 14M14 30v26h36V30" '+ST+'/>',
  down:'<path d="M32 8v42M14 34l18 20 18-20" '+ST+'/>',
  elder:'<circle cx="30" cy="16" r="9" fill="#ffe0cc"/><path d="M20 14c2-9 18-9 20 0-6-3-14-3-20 0z" fill="#bdbdbd"/><path d="M12 58c0-17 6-26 18-26s18 9 18 26z" fill="#d6336c"/><path d="M52 30v28" stroke="#4a2a37" stroke-width="4" stroke-linecap="round"/>',
  group:'<circle cx="12" cy="26" r="6" fill="#ff8fb3"/><path d="M2 50c0-10 4-16 10-16s10 6 10 16z" fill="#ff8fb3"/><circle cx="52" cy="26" r="6" fill="#ff8fb3"/><path d="M42 50c0-10 4-16 10-16s10 6 10 16z" fill="#ff8fb3"/><circle cx="32" cy="18" r="9" fill="#d6336c"/><path d="M16 58c0-14 7-22 16-22s16 8 16 22z" fill="#d6336c"/>',
  user:'<circle cx="32" cy="20" r="11" fill="currentColor"/><path d="M10 58c0-16 10-24 22-24s22 8 22 24z" fill="currentColor"/>',
  trash:'<path d="M10 16h44M24 16V8h16v8M16 16l3 42h26l3-42" '+ST+'/>',
  edit:'<path d="M8 56l4-15L41 12l11 11-29 29z" fill="currentColor"/>'
};
const EMO = {'🌸':'flower','🔊':'speaker','🔇':'mute','🎤':'mic','✅':'check','❌':'cross','🎉':'party','🙏':'heart','📞':'call','🏠':'home','⬅':'back','❓':'help','🔁':'again','🗣':'globe','📄':'doc','📍':'pin','ℹ':'info','💰':'coin','🔥':'lpg','🎁':'gift','💵':'cash','🤰':'mother','👧':'girl','🏦':'bank','🏥':'hospital','🧵':'skill','🪪':'id','🧾':'receipt','📕':'book','📱':'phone','📷':'camera','📜':'cert','🎓':'cap','▶':'play','👇':'down','📤':'share','🌐':'globe','🧓':'elder','👥':'group','👤':'user','🗑':'trash','✏':'edit','🪙':'coin','🏛':'bank'};
const EMO_RE = new RegExp('('+Object.keys(EMO).join('|')+')[\\uFE0F\\u200D]?','gu');
function iconify(root){
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), hits = [];
  for(let n; (n = w.nextNode());){ if(EMO_RE.test(n.nodeValue) && !/^(SCRIPT|STYLE|TEXTAREA|INPUT)$/.test(n.parentNode.nodeName)) hits.push(n); EMO_RE.lastIndex = 0; }
  hits.forEach(n=>{
    const f = document.createDocumentFragment(); let last = 0; const t = n.nodeValue;
    t.replace(EMO_RE,(m,e,i)=>{ f.append(t.slice(last,i)); const sp=document.createElement('span'); sp.className='ic'; sp.setAttribute('aria-hidden','true');
      sp.innerHTML='<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" focusable="false">'+ICONS[EMO[e]]+'</svg>'; f.append(sp); last=i+m.length; return m; });
    f.append(t.slice(last)); n.replaceWith(f);
  });
}
new MutationObserver(()=>iconify(document.getElementById('app'))).observe(document.getElementById('app'),{childList:true,subtree:true,characterData:true});

// ============ helpers ============
const M = (hi,te,ta) => ({hi,te,ta});
const lbl = x => typeof x==='string' ? x : x[lang];

// ============ UI strings per language ============
const U = {
  hi:{site:'सरकारी वेबसाइट',siteBtn:'वेबसाइट खोलें',siteNote:'यह सरकारी वेबसाइट है। वापस आने के लिए फ़ोन का बैक बटन दबाइए। अपना OTP या पिन किसी को न बताइए।',share:'WhatsApp पर भेजें',stepBtn:'एक-एक करके सुनें',stepOf:'कदम',nextS:'आगे',bigOn:'बड़े अक्षर',install:'ऐप इंस्टॉल करें',shareHead:'सखी साथी से जानकारी',vOn:'🔊 आवाज़ चालू',vOff:'🔇 आवाज़ बंद',vMsg:'आवाज़ चालू है। अब मैं बोलकर बताऊँगी।',vNone:'इस फ़ोन में हिन्दी आवाज़ नहीं मिली। Settings में Text-to-speech से हिन्दी आवाज़ जोड़ें।',code:'hi-IN',sys:'Hindi',yes:'हाँ',no:'नहीं',listen:'🔊 फिर से सुनें',speak:'🎤 बोलकर जवाब दें',
    pick:'अपनी भाषा चुनिए',skip:'मुख्य भाग पर जाएँ',moreL:'और भाषाएँ…',foot:'सखी साथी · जानकारी सरकारी योजना के नियमों से ली गई है। पक्की जानकारी अपनी आंगनवाड़ी, बैंक या जन सेवा केंद्र पर पूछ लीजिए।',
    homeT:'आपको किस काम में मदद चाहिए?',homeSub:'तस्वीर दबाइए, या बोलकर बताइए',
    homeV:'नमस्ते बहन! मैं सखी साथी हूँ। नीचे तस्वीर दबाइए, या माइक दबाकर बोलिए कि आपको क्या चाहिए। जैसे: गैस सिलेंडर, बैंक खाता, या इलाज।',
    need:'🎤 बोलकर बताइए आपको क्या चाहिए',startBtn:'शुरू करें',
    okT:'बधाई हो! 🎉 आप पात्र हैं',okV:'बधाई हो बहन! आप पात्र हैं।',stepsT:'आगे क्या करें 👇',
    noT:'माफ़ कीजिए 🙏',noV:'माफ़ कीजिए बहन, अभी आप इस योजना के लिए पात्र नहीं हैं। चिंता मत कीजिए, दूसरी योजनाएँ देखिए या आंगनवाड़ी दीदी से पूछिए।',
    docsT:'📄 साथ ले जाएँ',docsL:'आपको ये चीज़ें ले जानी हैं',whereT:'📍 कहाँ जाएँ / क्या करें',infoT:'ℹ️ ज़रूरी बात',
    ask:'❓ कुछ पूछना है?',askV:'आप जो पूछना चाहती हैं, बोलिए।',askT:'अपना सवाल बोलिए',
    home:'🏠 दूसरी सेवा देखें',back:'⬅️ वापस',again:'🔁 फिर से',
    listening:'सुन रही हूँ…',noheard:'सुनाई नहीं दिया। फिर से बोलिए।',thinking:'सोच रही हूँ…',nomic:'इस फ़ोन में बोलने की सुविधा नहीं है। कृपया तस्वीर दबाइए।',
    notfound:'समझ नहीं आया। कृपया नीचे की तस्वीर दबाइए।',
    fb:'इस बारे में अपनी आंगनवाड़ी दीदी से पूछिए, या नीचे के नंबर पर फ़ोन कीजिए।',
    docRe:/कागज|दस्तावेज|डॉक्यूमेंट|क्या ले|क्या-क्या/,whereRe:/कहाँ|कहां|कैसे|फ़ॉर्म|फॉर्म|आवेदन|क्या करना/,moneyRe:/पैसे|रुपये|रुपए|कितना|किस्त|फायदा|लाभ|मिलेगा/,
    yesRe:/हाँ|हां|हा\b|जी|ठीक|सही|yes|yeah/i,noRe:/नहीं|नही|ना\b|no\b/i},
  ta:{site:'அரசு இணையதளம்',siteBtn:'இணையதளத்தைத் திற',siteNote:'இது அரசு இணையதளம். திரும்பி வர போனின் பேக் பொத்தானை அழுத்துங்கள். உங்கள் OTP அல்லது பின்னை யாருக்கும் சொல்லாதீர்கள்.',share:'WhatsApp இல் பகிருங்கள்',stepBtn:'ஒவ்வொன்றாகக் கேளுங்கள்',stepOf:'படி',nextS:'அடுத்து',bigOn:'பெரிய எழுத்து',install:'ஆப்பை நிறுவுங்கள்',shareHead:'சகி சாத்தி தகவல்',vOn:'🔊 குரல் இயக்கம்',vOff:'🔇 குரல் நிறுத்தம்',vMsg:'குரல் இயக்கத்தில் உள்ளது. இனி நான் பேசிச் சொல்வேன்.',vNone:'இந்த போனில் தமிழ் குரல் இல்லை. Settings இல் Text-to-speech மூலம் தமிழ் குரலைச் சேர்க்கவும்.',code:'ta-IN',sys:'Tamil',yes:'ஆம்',no:'இல்லை',listen:'🔊 மீண்டும் கேளுங்கள்',speak:'🎤 பேசி சொல்லுங்கள்',
    pick:'உங்கள் மொழியைத் தேர்ந்தெடுங்கள்',skip:'முக்கிய பகுதிக்குச் செல்லுங்கள்',moreL:'மேலும் மொழிகள்…',foot:'சகி சாத்தி · தகவல் அரசுத் திட்ட வழிகாட்டுதல்களில் இருந்து எடுக்கப்பட்டது. விவரங்களை உங்கள் அங்கன்வாடி, வங்கி அல்லது இ-சேவை மையத்தில் உறுதி செய்யுங்கள்.',
    homeT:'உங்களுக்கு என்ன உதவி வேண்டும்?',homeSub:'படத்தை அழுத்துங்கள், அல்லது பேசிச் சொல்லுங்கள்',
    homeV:'வணக்கம் அக்கா! நான் சகி சாத்தி. கீழே உள்ள படத்தை அழுத்துங்கள், அல்லது மைக்கை அழுத்தி உங்களுக்கு என்ன வேண்டும் என்று சொல்லுங்கள். உதாரணம்: கேஸ் சிலிண்டர், வங்கிக் கணக்கு, மகளிர் உரிமைத் தொகை.',
    need:'🎤 உங்களுக்கு என்ன வேண்டும் என்று சொல்லுங்கள்',startBtn:'தொடங்குங்கள்',
    okT:'வாழ்த்துகள்! 🎉 நீங்கள் தகுதியானவர்',okV:'வாழ்த்துகள் அக்கா! நீங்கள் தகுதியானவர்.',stepsT:'அடுத்து என்ன செய்வது 👇',
    noT:'மன்னியுங்கள் 🙏',noV:'மன்னியுங்கள் அக்கா, இப்போது இந்தத் திட்டத்துக்கு நீங்கள் தகுதியில்லை. கவலை வேண்டாம், மற்ற திட்டங்களைப் பாருங்கள் அல்லது அங்கன்வாடி பணியாளரிடம் கேளுங்கள்.',
    docsT:'📄 கூட எடுத்துச் செல்லுங்கள்',docsL:'நீங்கள் இவற்றை எடுத்துச் செல்ல வேண்டும்',whereT:'📍 எங்கே போவது / என்ன செய்வது',infoT:'ℹ️ முக்கியமான தகவல்',
    ask:'❓ ஏதாவது கேட்க வேண்டுமா?',askV:'நீங்கள் கேட்க விரும்புவதைச் சொல்லுங்கள்.',askT:'உங்கள் கேள்வியைச் சொல்லுங்கள்',
    home:'🏠 வேறு சேவையைப் பாருங்கள்',back:'⬅️ பின்னால்',again:'🔁 மீண்டும்',
    listening:'கேட்கிறேன்…',noheard:'கேட்கவில்லை. மீண்டும் சொல்லுங்கள்.',thinking:'யோசிக்கிறேன்…',nomic:'இந்த போனில் பேசும் வசதி இல்லை. படத்தை அழுத்துங்கள்.',
    notfound:'புரியவில்லை. கீழே உள்ள படத்தை அழுத்துங்கள்.',
    fb:'இதைப் பற்றி அங்கன்வாடி பணியாளரிடம் கேளுங்கள், அல்லது கீழே உள்ள எண்ணை அழையுங்கள்.',
    docRe:/ஆவண|காகிதம்|என்ன எடுத்து|என்ன கொண்டு/,whereRe:/எங்கே|எங்க|எப்படி|படிவம்|விண்ணப்ப|என்ன செய்ய/,moneyRe:/பணம்|ரூபாய்|எவ்வளவு|தவணை|பலன்|கிடைக்கும்/,
    yesRe:/ஆம்|ஆமா|ஆமாம்|சரி|yes/i,noRe:/இல்லை|இல்ல|வேண்டாம்|no\b/i},
  te:{site:'ప్రభుత్వ వెబ్‌సైట్',siteBtn:'వెబ్‌సైట్ తెరవండి',siteNote:'ఇది ప్రభుత్వ వెబ్‌సైట్. తిరిగి రావడానికి ఫోన్ బ్యాక్ బటన్ నొక్కండి. మీ OTP లేదా పిన్ ఎవరికీ చెప్పకండి.',share:'WhatsApp లో షేర్ చేయండి',stepBtn:'ఒక్కొక్కటిగా వినండి',stepOf:'దశ',nextS:'తరువాత',bigOn:'పెద్ద అక్షరాలు',install:'యాప్ ఇన్‌స్టాల్ చేయండి',shareHead:'సఖి సాథి సమాచారం',vOn:'🔊 వాయిస్ ఆన్',vOff:'🔇 వాయిస్ ఆఫ్',vMsg:'వాయిస్ ఆన్‌లో ఉంది. ఇక నేను మాట్లాడి చెబుతాను.',vNone:'ఈ ఫోన్‌లో తెలుగు వాయిస్ లేదు. Settings లో Text-to-speech ద్వారా తెలుగు వాయిస్ జోడించండి.',code:'te-IN',sys:'Telugu',yes:'అవును',no:'కాదు',listen:'🔊 మళ్ళీ వినండి',speak:'🎤 మాట్లాడి చెప్పండి',
    pick:'మీ భాషను ఎంచుకోండి',skip:'ప్రధాన భాగానికి వెళ్ళండి',moreL:'మరిన్ని భాషలు…',foot:'సఖి సాథి · సమాచారం ప్రభుత్వ పథకాల మార్గదర్శకాల నుండి తీసుకున్నది. వివరాలను మీ అంగన్‌వాడీ, బ్యాంకు లేదా మీసేవ కేంద్రంలో నిర్ధారించుకోండి.',
    homeT:'మీకు ఏ సహాయం కావాలి?',homeSub:'బొమ్మ నొక్కండి, లేదా మాట్లాడి చెప్పండి',
    homeV:'నమస్కారం అక్కా! నేను సఖి సాథిని. కింద బొమ్మ నొక్కండి, లేదా మైక్ నొక్కి మీకు ఏం కావాలో చెప్పండి. ఉదాహరణ: గ్యాస్ సిలిండర్, బ్యాంకు ఖాతా, వైద్యం.',
    need:'🎤 మీకు ఏం కావాలో చెప్పండి',startBtn:'మొదలుపెట్టండి',
    okT:'అభినందనలు! 🎉 మీరు అర్హులు',okV:'అభినందనలు అక్కా! మీరు అర్హులు.',stepsT:'తర్వాత ఏం చేయాలి 👇',
    noT:'క్షమించండి 🙏',noV:'క్షమించండి అక్కా, ఈ పథకానికి మీరు ఇప్పుడు అర్హులు కారు. ఆందోళన వద్దు, ఇతర పథకాలు చూడండి లేదా అంగన్‌వాడీ టీచర్‌ను అడగండి.',
    docsT:'📄 వెంట తీసుకెళ్ళండి',docsL:'మీరు ఇవి తీసుకెళ్ళాలి',whereT:'📍 ఎక్కడికి వెళ్ళాలి / ఏం చేయాలి',infoT:'ℹ️ ముఖ్యమైన విషయం',
    ask:'❓ ఏదైనా అడగాలా?',askV:'మీరు అడగాలనుకున్నది చెప్పండి.',askT:'మీ ప్రశ్న చెప్పండి',
    home:'🏠 ఇతర సేవలు చూడండి',back:'⬅️ వెనక్కి',again:'🔁 మళ్ళీ',
    listening:'వింటున్నాను…',noheard:'వినిపించలేదు. మళ్ళీ చెప్పండి.',thinking:'ఆలోచిస్తున్నాను…',nomic:'ఈ ఫోన్‌లో మాట్లాడే సౌకర్యం లేదు. బొమ్మ నొక్కండి.',
    notfound:'అర్థం కాలేదు. దయచేసి కింద బొమ్మ నొక్కండి.',
    fb:'దీని గురించి అంగన్‌వాడీ టీచర్‌ను అడగండి, లేదా కింది నంబర్‌కు ఫోన్ చేయండి.',
    docRe:/పత్రాలు|కాగితాలు|ఏమి తీసుకె|ఏం తీసుకె/,whereRe:/ఎక్కడ|ఎలా|ఫారం|దరఖాస్తు|ఏం చేయాలి/,moneyRe:/డబ్బు|రూపాయ|ఎంత|విడత|లాభం|వస్తుంది/,
    yesRe:/అవును|ఔను|అవునండి|yes/i,noRe:/కాదు|లేదు|కాదండి|no\b/i},
  en:{site:'Official website',siteBtn:'Open website',siteNote:'This is the government website. Press your phone Back button to return. Never tell anyone your OTP or PIN.',share:'Share on WhatsApp',stepBtn:'Listen step by step',stepOf:'Step',nextS:'Next',bigOn:'Large text',install:'Install app',shareHead:'From Sakhi Saathi',vOn:'🔊 Voice on',vOff:'🔇 Voice off',vMsg:'Voice is on. I will now speak to you.',vNone:'No voice for this language was found on this phone. Please add it in Settings under Text-to-speech.',code:'en-IN',sys:'English',yes:'Yes',no:'No',listen:'🔊 Listen again',speak:'🎤 Answer by speaking',
    pick:'Choose your language',skip:'Skip to main content',moreL:'More languages…',foot:'Sakhi Saathi · Info from official scheme guidelines. Please confirm details at your Anganwadi / bank / e-Sevai centre.',
    homeT:'What help do you need?',homeSub:'Tap a picture, or speak',
    homeV:'Hello sister! I am Sakhi Saathi. Tap a picture below, or press the mic and tell me what you need. For example: gas cylinder, bank account, or treatment.',
    need:'🎤 Say what you need',startBtn:'Start',
    okT:'Congratulations! 🎉 You are eligible',okV:'Congratulations sister! You are eligible.',stepsT:'What to do next 👇',
    noT:'Sorry 🙏',noV:'Sorry sister, you are not eligible for this scheme right now. Do not worry. Look at the other services, or ask your Anganwadi worker.',
    docsT:'📄 Carry with you',docsL:'You need to carry these things',whereT:'📍 Where to go / what to do',infoT:'ℹ️ Important',
    ask:'❓ Want to ask something?',askV:'Please say what you want to ask.',askT:'Say your question',
    home:'🏠 See other services',back:'⬅️ Back',again:'🔁 Again',
    listening:'Listening…',noheard:'I could not hear. Please speak again.',thinking:'Thinking…',nomic:'Speaking is not available on this phone. Please tap a picture.',
    notfound:'I did not understand. Please tap a picture below.',
    fb:'Please ask your Anganwadi worker about this, or call the number below.',
    docRe:/document|paper|carry|bring|what do i need/i,whereRe:/where|how|form|apply|what to do/i,moneyRe:/money|rupee|how much|instal|benefit/i,
    yesRe:/\byes\b|yeah|yep|sure|\bok\b/i,noRe:/\bno\b|nope|\bnot\b/i}
};

// ============ Schemes (id, keywords, per-language content) ============
const S = [
 { id:'lpg', e:'🔥', kw:/गैस|सिलेंडर|सिलिंडर|gas\b|cylinder|lpg|గ్యాస్|సిలిండర్|கேஸ்|சிலிண்டர்|காஸ்|gais|silend|silind|booking|बुकिंग|புக்கிங்|బుకింగ్/i,
   name:M('गैस सिलेंडर बुक करें','గ్యాస్ సిలిండర్ బుక్ చేయండి','கேஸ் சிலிண்டர் புக் செய்ய'),
   d:M('फ़ोन से घर बैठे सिलेंडर बुक करना सीखिए।','ఫోన్‌తో ఇంట్లోనే సిలిండర్ బుక్ చేయడం నేర్చుకోండి.','போனில் வீட்டிலிருந்தே சிலிண்டர் புக் செய்யக் கற்றுக்கொள்ளுங்கள்.'),
   qs:[],
   docs:[['🔥',M('गैस की किताब या सिलेंडर पर छपा उपभोक्ता नंबर','గ్యాస్ పుస్తకం లేదా సిలిండర్ మీద కన్స్యూమర్ నంబర్','கேஸ் புத்தகம் அல்லது சிலிண்டரில் உள்ள நுகர்வோர் எண்')],
         ['📱',M('गैस एजेंसी में दर्ज मोबाइल नंबर','గ్యాస్ ఏజెన్సీలో నమోదైన మొబైల్ నంబర్','கேஸ் ஏஜென்சியில் பதிவான மொபைல் எண்')],
         ['💵',M('डिलीवरी पर पैसे या UPI','డెలివరీ సమయంలో డబ్బు లేదా UPI','டெலிவரியில் பணம் அல்லது UPI')]],
   where:M('1) अपनी गैस कंपनी का नंबर नीचे से दबाकर फ़ोन कीजिए (सिलेंडर पर जो कंपनी लिखी है)। 2) जो आवाज़ आए उसके कहे अनुसार बटन दबाइए – अपना गैस नंबर या मोबाइल नंबर बताना होगा। 3) एक-दो दिन में सिलेंडर घर आएगा। 4) डिलीवरी पर कोड (OTP) बताइए और रसीद लीजिए।',
           '1) కింద ఉన్న మీ గ్యాస్ కంపెనీ నంబర్ నొక్కి ఫోన్ చేయండి (సిలిండర్ మీద రాసి ఉన్న కంపెనీ). 2) వచ్చే వాయిస్ చెప్పినట్లు బటన్లు నొక్కండి – మీ గ్యాస్ నంబర్ లేదా మొబైల్ నంబర్ చెప్పాలి. 3) ఒకటి రెండు రోజుల్లో సిలిండర్ ఇంటికి వస్తుంది. 4) డెలివరీ సమయంలో కోడ్ (OTP) చెప్పి రసీదు తీసుకోండి.',
           '1) கீழே உள்ள உங்கள் கேஸ் நிறுவன எண்ணை அழுத்தி அழையுங்கள் (சிலிண்டரில் எழுதியுள்ள நிறுவனம்). 2) வரும் குரல் சொல்வது போல் பொத்தான்களை அழுத்துங்கள் – உங்கள் கேஸ் எண் அல்லது மொபைல் எண்ணைச் சொல்ல வேண்டும். 3) ஒன்றிரண்டு நாட்களில் சிலிண்டர் வீட்டுக்கு வரும். 4) டெலிவரியின் போது கோட் (OTP) சொல்லி ரசீது வாங்குங்கள்.'),
   info:M('तय दाम से ज़्यादा पैसे मत दीजिए। गैस की गंध आए तो आग या बिजली का बटन मत छुइए, खिड़की-दरवाज़े खोलिए और 1906 पर फ़ोन कीजिए। नंबर सही है या नहीं, अपनी गैस की किताब या एजेंसी से पूछकर पक्का कीजिए।',
          'నిర్ణయించిన ధర కంటే ఎక్కువ ఇవ్వకండి. గ్యాస్ వాసన వస్తే నిప్పు లేదా కరెంటు స్విచ్ ముట్టుకోకండి, తలుపులు కిటికీలు తెరిచి 1906 కు ఫోన్ చేయండి. నంబర్ సరైనదో కాదో మీ గ్యాస్ పుస్తకం లేదా ఏజెన్సీలో అడిగి నిర్ధారించుకోండి.',
          'நிர்ணயித்த விலையை விட அதிகம் கொடுக்காதீர்கள். கேஸ் வாசனை வந்தால் தீ அல்லது மின்சார சுவிட்சைத் தொடாதீர்கள், கதவு ஜன்னல்களைத் திறந்து 1906 ஐ அழையுங்கள். எண் சரியா என்று உங்கள் கேஸ் புத்தகம் அல்லது ஏஜென்சியில் கேட்டு உறுதி செய்யுங்கள்.'),
   calls:[['Indane','7718955555'],['Bharat Gas','1800224344'],['HP Gas','9222201122'],[M('गैस लीक – आपातकाल','గ్యాస్ లీక్ – అత్యవసరం','கேஸ் கசிவு – அவசரம்'),'1906']],
   f:'Booking an LPG refill: call the IVRS number of your gas company (Indane 7718955555, Bharat Gas 1800224344, HP Gas 9222201122 – confirm on the cylinder/passbook), follow voice prompts using registered mobile or consumer number; delivery in 1-2 days; give delivery OTP and take receipt; do not pay above the fixed price. LPG leak emergency: 1906.' },

 { id:'ujjwala', e:'🎁', kw:/उज्ज्वला|उज्जवला|ujjwala|नया कनेक्शन|मुफ़्त गैस|मुफ्त गैस|కనెక్షన్|ఉజ్వల|இணைப்பு|உஜ்வலா|ujwala|connection|कनेक्सन|कनेक्शन/i,
   name:M('मुफ़्त गैस कनेक्शन (उज्ज्वला)','ఉచిత గ్యాస్ కనెక్షన్ (ఉజ్వల)','இலவச கேஸ் இணைப்பு (உஜ்வலா)'),
   d:M('गरीब परिवार की महिला को मुफ़्त गैस कनेक्शन।','పేద కుటుంబ మహిళకు ఉచిత గ్యాస్ కనెక్షన్.','ஏழைக் குடும்பப் பெண்ணுக்கு இலவச கேஸ் இணைப்பு.'),
   qNo:[0],   // asked positively ("do you already have...?"); "no" is the answer that continues
   qs:[M('क्या आपके घर में पहले से गैस कनेक्शन है?','మీ ఇంట్లో ఇప్పటికే గ్యాస్ కనెక్షన్ ఉందా?','உங்கள் வீட்டில் ஏற்கனவே கேஸ் இணைப்பு உள்ளதா?'),
       M('क्या आपकी उम्र 18 साल से ज़्यादा है और आपके पास राशन कार्ड है (गरीब परिवार)?','మీ వయసు 18 కంటే ఎక్కువా, మీ దగ్గర రేషన్ కార్డు ఉందా (పేద కుటుంబం)?','உங்கள் வயது 18க்கு மேலா, உங்களிடம் ரேஷன் அட்டை உள்ளதா (ஏழைக் குடும்பம்)?')],
   docs:[['🪪',M('आधार कार्ड','ఆధార్ కార్డు','ஆதார் அட்டை')],['🧾',M('राशन कार्ड / BPL कार्ड','రేషన్ కార్డు / BPL కార్డు','ரேஷன் அட்டை / BPL அட்டை')],['🏦',M('बैंक पासबुक','బ్యాంకు పాస్‌బుక్','வங்கிப் புத்தகம்')],['📷',M('एक फ़ोटो','ఒక ఫోటో','ஒரு புகைப்படம்')]],
   where:M('अपने नज़दीकी गैस एजेंसी (डिस्ट्रीब्यूटर) पर जाइए और "उज्ज्वला का फ़ॉर्म" माँगिए। फ़ॉर्म भरकर कागज़ जमा कीजिए। आंगनवाड़ी दीदी या पंचायत से भी मदद मिल सकती है।',
           'మీకు దగ్గరలోని గ్యాస్ ఏజెన్సీకి వెళ్ళి "ఉజ్వల ఫారం" అడగండి. ఫారం నింపి పత్రాలు ఇవ్వండి. అంగన్‌వాడీ టీచర్ లేదా పంచాయతీ కూడా సహాయం చేస్తారు.',
           'அருகிலுள்ள கேஸ் ஏஜென்சிக்குச் சென்று "உஜ்வலா படிவம்" கேளுங்கள். படிவத்தை நிரப்பி ஆவணங்களைக் கொடுங்கள். அங்கன்வாடி பணியாளர் அல்லது பஞ்சாயத்தும் உதவுவார்கள்.'),
   info:M('कनेक्शन मुफ़्त मिलता है और सिलेंडर पर सब्सिडी भी मिल सकती है। कोई एजेंट पैसे माँगे तो मत दीजिए।','కనెక్షన్ ఉచితంగా వస్తుంది, సిలిండర్ మీద సబ్సిడీ కూడా రావచ్చు. ఎవరైనా డబ్బు అడిగితే ఇవ్వకండి.','இணைப்பு இலவசம், சிலிண்டருக்கு மானியமும் கிடைக்கலாம். யாராவது பணம் கேட்டால் கொடுக்காதீர்கள்.'),
   calls:[[M('गैस हेल्पलाइन','గ్యాస్ హెల్ప్‌లైన్','கேஸ் உதவி எண்'),'18002666696']],
   f:'PM Ujjwala Yojana: free LPG connection for adult women (18+) of poor households (BPL/ration card, SC/ST etc.) with no existing LPG connection. Apply at nearest gas agency with Aadhaar, ration/BPL card, bank passbook, photo. Subsidy on refills may apply. Helpline 1800-266-6696.' },

 { id:'urimai', e:'💵', kw:/उरिमई|तमिल|urimai|magalir|ఉరిమై|மகளிர்|உரிமை|हज़ार रुपये महीने|हजार|thousand|ஆயிரம்|వెయ్యి|मगलिर|मगलीर/i,
   name:M('मगलिर उरिमई थोगई ₹1,000 हर महीने (तमिलनाडु)','మగళిర్ ఉరిమై తోగై ₹1,000 నెలకు (తమిళనాడు)','கலைஞர் மகளிர் உரிமைத் தொகை ₹1,000 மாதம்'),
   d:M('तमिलनाडु में परिवार की मुखिया महिला को हर महीने ₹1,000।','తమిళనాడులో కుటుంబ పెద్ద మహిళకు ప్రతి నెల ₹1,000.','தமிழ்நாட்டில் குடும்பத் தலைவிக்கு மாதம் ₹1,000.'),
   qs:[M('क्या आप तमिलनाडु में रहती हैं और अपने परिवार की मुखिया (राशन कार्ड में नाम) हैं?','మీరు తమిళనాడులో ఉంటున్నారా, కుటుంబ పెద్దగా (రేషన్ కార్డులో) ఉన్నారా?','நீங்கள் தமிழ்நாட்டில் வசிக்கிறீர்களா, ரேஷன் அட்டையில் குடும்பத் தலைவியாக உள்ளீர்களா?'),
       M('क्या आपकी उम्र 21 साल या ज़्यादा है?','మీ వయసు 21 లేదా ఎక్కువా?','உங்கள் வயது 21 அல்லது அதற்கு மேலா?'),
       M('क्या परिवार की सालाना आमदनी ₹2.5 लाख से कम है और घर में कोई सरकारी नौकरी वाला या इनकम टैक्स भरने वाला नहीं है?','కుటుంబ వార్షిక ఆదాయం ₹2.5 లక్షల కంటే తక్కువా, ఇంట్లో ప్రభుత్వ ఉద్యోగి లేదా ఆదాయపు పన్ను కట్టేవారు లేరా?','குடும்ப ஆண்டு வருமானம் ₹2.5 லட்சத்துக்குக் குறைவா, வீட்டில் அரசு ஊழியர் அல்லது வருமான வரி செலுத்துபவர் இல்லையா?')],
   docs:[['🧾',M('राशन कार्ड','రేషన్ కార్డు','ரேஷன் அட்டை')],['🪪',M('आधार कार्ड','ఆధార్ కార్డు','ஆதார் அட்டை')],['🏦',M('बैंक पासबुक (आपके नाम की)','బ్యాంకు పాస్‌బుక్ (మీ పేరు మీద)','வங்கிப் புத்தகம் (உங்கள் பெயரில்)')],['📱',M('आधार से जुड़ा मोबाइल नंबर','ఆధార్‌కు లింక్ అయిన మొబైల్ నంబర్','ஆதாருடன் இணைந்த மொபைல் எண்')]],
   where:M('अपने राशन दुकान या ग्राम अधिकारी (VAO) से पूछिए कि आपके इलाके में आवेदन शिविर (कैंप) कब है। वहाँ कागज़ दिखाकर फ़ॉर्म भरवाइए। ई-सेवा केंद्र पर भी पूछ सकती हैं। कोई पैसा नहीं लगता।',
           'మీ రేషన్ షాపు లేదా గ్రామ అధికారి (VAO) ను మీ ప్రాంతంలో దరఖాస్తు శిబిరం ఎప్పుడో అడగండి. అక్కడ పత్రాలు చూపి ఫారం నింపించండి. ఈ-సేవ కేంద్రంలో కూడా అడగవచ్చు. డబ్బు ఖర్చు లేదు.',
           'உங்கள் ரேஷன் கடை அல்லது கிராம நிர்வாக அலுவலரிடம் (VAO) உங்கள் பகுதியில் விண்ணப்ப முகாம் எப்போது என்று கேளுங்கள். அங்கே ஆவணங்களைக் காட்டி படிவம் நிரப்புங்கள். இ-சேவை மையத்திலும் கேட்கலாம். கட்டணம் இல்லை.'),
   info:M('हर महीने ₹1,000 सीधे आपके बैंक खाते में आते हैं। यह योजना तमिलनाडु सरकार की है, इसलिए सिर्फ़ तमिलनाडु के लिए है। आवेदन के लिए कोई पैसा मत दीजिए। नियम बदल सकते हैं, कैंप पर पक्का पूछ लीजिए।',
          'ప్రతి నెల ₹1,000 నేరుగా మీ బ్యాంకు ఖాతాలో వస్తాయి. ఇది తమిళనాడు ప్రభుత్వ పథకం, తమిళనాడు వారికి మాత్రమే. దరఖాస్తుకు డబ్బు ఇవ్వకండి. నియమాలు మారవచ్చు, శిబిరంలో నిర్ధారించుకోండి.',
          'ஒவ்வொரு மாதமும் ₹1,000 நேரடியாக உங்கள் வங்கிக் கணக்கில் வரும். இது தமிழ்நாடு அரசுத் திட்டம், தமிழ்நாட்டினருக்கு மட்டும். விண்ணப்பத்துக்குப் பணம் கொடுக்காதீர்கள். விதிகள் மாறலாம், முகாமில் உறுதி செய்யுங்கள்.'),
   calls:[[M('तमिलनाडु हेल्पलाइन','తమిళనాడు హెల్ప్‌లైన్','தமிழ்நாடு உதவி எண்'),'1100']],
   f:'Kalaignar Magalir Urimai Thogai (Tamil Nadu): Rs 1,000 per month directly to bank account of woman head of family (as per ration card), age 21+, annual family income below Rs 2.5 lakh, no govt employee/income-tax payer in family, limits on land and electricity use. Apply at special camps (ask ration shop / VAO) or e-Sevai centre with ration card, Aadhaar, bank passbook, Aadhaar-linked mobile. Free. TN helpline 1100. Rules may change – confirm at camp.' },

 { id:'pmmvy', e:'🤰', kw:/गर्भ|गर्भवती|प्रेग|pregnan|matru|मातृ|మాతృ|గర్భ|கர்ப்ப|தாய்|garbh|gharbh|garbhw|garbhv|garbham|garbhini|pregnant|pregnency|maternity|karppam|karpam|garbam|pirasavam|prasav|baby|बच्चा|bachcha|bachha|మాతృ|பிரசவ/i,
   name:M('गर्भवती माँ को ₹5,000 (मातृ वंदना)','గర్భిణీలకు ₹5,000 (మాతృ వందన)','கர்ப்பிணிக்கு ₹5,000 (மாத்ரு வந்தனா)'),
   d:M('पहले बच्चे पर तीन किस्तों में ₹5,000 सीधे बैंक खाते में।','మొదటి బిడ్డకు మూడు విడతల్లో ₹5,000 నేరుగా బ్యాంకు ఖాతాలో.','முதல் குழந்தைக்கு மூன்று தவணைகளில் ₹5,000 நேரடியாக வங்கிக் கணக்கில்.'),
   qs:[M('क्या आप गर्भवती हैं, या आपका बच्चा 6 महीने से छोटा है?','మీరు గర్భవతా, లేదా మీ బిడ్డ 6 నెలల లోపు వయసా?','நீங்கள் கர்ப்பமாக இருக்கிறீர்களா, அல்லது உங்கள் குழந்தை 6 மாதத்துக்குள் உள்ளதா?'),
       M('क्या यह आपका पहला बच्चा है?','ఇది మీ మొదటి బిడ్డా?','இது உங்கள் முதல் குழந்தையா?'),
       M('क्या आपकी उम्र 19 साल या उससे ज़्यादा है?','మీ వయసు 19 సంవత్సరాలు లేదా ఎక్కువా?','உங்கள் வயது 19 அல்லது அதற்கு மேலா?')],
   docs:[['🪪',M('आधार कार्ड','ఆధార్ కార్డు','ஆதார் அட்டை')],['🏦',M('बैंक पासबुक (आपके नाम की)','బ్యాంకు పాస్‌బుక్ (మీ పేరు మీద)','வங்கிப் புத்தகம் (உங்கள் பெயரில்)')],['📕',M('माँ-बच्चे का कार्ड (MCP)','తల్లి-బిడ్డ కార్డు (MCP)','தாய்-சேய் நல அட்டை (MCP)')],['📱',M('मोबाइल नंबर','మొబైల్ నంబర్','மொபைல் எண்')]],
   where:M('अपने गाँव की आंगनवाड़ी केंद्र या आशा दीदी के पास जाइए और फ़ॉर्म 1-A भरवाइए। कोई पैसा नहीं लगता – यह मुफ़्त है।',
           'మీ ఊరి అంగన్‌వాడీ కేంద్రానికి లేదా ఆశా వర్కర్ దగ్గరికి వెళ్ళి ఫారం 1-A నింపించండి. ఎలాంటి ఖర్చు లేదు – ఉచితం.',
           'உங்கள் ஊர் அங்கன்வாடி மையம் அல்லது ஆஷா பணியாளரிடம் சென்று படிவம் 1-A நிரப்பச் சொல்லுங்கள். கட்டணம் இல்லை – இலவசம்.'),
   info:M('कुल ₹5,000, तीन किस्तों में: ₹1,000 गर्भ दर्ज कराने पर, ₹2,000 छह महीने बाद जाँच कराने पर, ₹2,000 बच्चे का जन्म दर्ज कराने और पहले टीके के बाद।',
          'మొత్తం ₹5,000, మూడు విడతల్లో: గర్భం నమోదుపై ₹1,000, ఆరు నెలల తర్వాత పరీక్షపై ₹2,000, బిడ్డ పుట్టుక నమోదు, మొదటి టీకా తర్వాత ₹2,000.',
          'மொத்தம் ₹5,000, மூன்று தவணைகளில்: கர்ப்பப் பதிவுக்கு ₹1,000, ஆறு மாதத்துக்குப் பிறகு பரிசோதனைக்கு ₹2,000, குழந்தை பிறப்புப் பதிவு மற்றும் முதல் தடுப்பூசிக்குப் பிறகு ₹2,000.'),
   calls:[[M('हेल्पलाइन','హెల్ప్‌లైన్','உதவி எண்'),'7998799804']],
   f:'PM Matru Vandana Yojana (PMMVY): Rs 5,000 in 3 instalments (1,000 on pregnancy registration, 2,000 after 6 months antenatal check, 2,000 after birth registration and first vaccine cycle) for pregnant and lactating women aged 19+, first living child (second child benefit only if girl). Apply with Form 1-A at Anganwadi centre or via ASHA worker; Aadhaar, bank/post-office passbook in her name, MCP card, mobile. Helpline 7998799804.' },

 { id:'sukanya', e:'👧', kw:/सुकन्या|बेटी|बिटिया|बचत|sukanya|daughter|కూతురు|సుకన్య|పొదుపు|மகள்|சுகன்யா|சேமிப்பு|beti|ladki|लड़की|लड़कि|girl|అమ్మాయి|பெண் குழந்தை/i,
   name:M('बेटी के लिए बचत खाता (सुकन्या)','కూతురి కోసం పొదుపు ఖాతా (సుకన్య)','மகளுக்கான சேமிப்புக் கணக்கு (சுகன்யா)'),
   d:M('बेटी की पढ़ाई और शादी के लिए ज़्यादा ब्याज वाला खाता।','కూతురి చదువు, పెళ్లి కోసం ఎక్కువ వడ్డీ ఇచ్చే ఖాతా.','மகளின் படிப்பு, திருமணத்துக்கான அதிக வட்டிக் கணக்கு.'),
   qs:[M('क्या आपकी बेटी की उम्र 10 साल से कम है?','మీ కూతురి వయసు 10 సంవత్సరాల లోపా?','உங்கள் மகளின் வயது 10க்குள்ளா?')],
   docs:[['📜',M('बेटी का जन्म प्रमाण पत्र','కూతురి జనన ధృవపత్రం','மகளின் பிறப்புச் சான்றிதழ்')],['🪪',M('माता या पिता का आधार कार्ड','తల్లి లేదా తండ్రి ఆధార్ కార్డు','தாய் அல்லது தந்தையின் ஆதார் அட்டை')],['📷',M('फ़ोटो और पते का कागज़','ఫోటో, చిరునామా పత్రం','புகைப்படம், முகவரிச் சான்று')],['💵',M('शुरू करने के लिए ₹250','మొదలుపెట్టడానికి ₹250','தொடங்க ₹250')]],
   where:M('अपने नज़दीकी डाकघर (पोस्ट ऑफ़िस) या बैंक जाइए और "सुकन्या समृद्धि खाता" खोलने का फ़ॉर्म माँगिए।',
           'మీకు దగ్గరలోని పోస్టాఫీసు లేదా బ్యాంకుకు వెళ్ళి "సుకన్య సమృద్ధి ఖాతా" ఫారం అడగండి.',
           'அருகிலுள்ள தபால் நிலையம் அல்லது வங்கிக்குச் சென்று "சுகன்யா சம்ரித்தி கணக்கு" படிவம் கேளுங்கள்.'),
   info:M('सिर्फ़ ₹250 से खाता खुलता है, साल में ₹1.5 लाख तक जमा कर सकती हैं। ब्याज सरकार तय करती है और आम बचत से ज़्यादा होता है। बेटी 18 साल की होने पर पढ़ाई के लिए कुछ पैसा निकाल सकती है।',
          'కేవలం ₹250 తో ఖాతా తెరవవచ్చు, సంవత్సరానికి ₹1.5 లక్షల వరకు జమ చేయవచ్చు. వడ్డీ ప్రభుత్వం నిర్ణయిస్తుంది, సాధారణ పొదుపు కంటే ఎక్కువ. కూతురికి 18 ఏళ్ళు వచ్చాక చదువు కోసం కొంత తీసుకోవచ్చు.',
          'வெறும் ₹250 இல் கணக்குத் தொடங்கலாம், ஆண்டுக்கு ₹1.5 லட்சம் வரை செலுத்தலாம். வட்டியை அரசு நிர்ணயிக்கும், சாதாரணச் சேமிப்பை விட அதிகம். மகளுக்கு 18 வயதானதும் படிப்புக்காகச் சிறிது தொகை எடுக்கலாம்.'),
   calls:[[M('डाक विभाग हेल्पलाइन','పోస్టల్ హెల్ప్‌లైన్','அஞ்சல் உதவி எண்'),'18002666868']],
   f:'Sukanya Samriddhi Yojana: savings account for a girl child under 10 years, opened by parent/guardian at a post office or bank. Minimum Rs 250 to open, up to Rs 1.5 lakh per year, government-set interest higher than normal savings; partial withdrawal for education after 18; matures at 21 years. Documents: girl birth certificate, parent Aadhaar, photo, address proof. Postal helpline 1800-266-6868.' },

 { id:'jandhan', e:'🏦', kw:/बैंक|खाता|जन धन|जनधन|bank|account|బ్యాంకు|ఖాతా|வங்கி|கணக்கு|khata|khaata|paisa|पैसा|खाता|account/i,
   name:M('मुफ़्त बैंक खाता (जन धन)','ఉచిత బ్యాంకు ఖాతా (జన్ ధన్)','இலவச வங்கிக் கணக்கு (ஜன் தன்)'),
   d:M('बिना पैसे के अपने नाम पर बैंक खाता – सरकारी पैसे सीधे आपके हाथ में।','డబ్బు లేకుండా మీ పేరున బ్యాంకు ఖాతా – ప్రభుత్వ డబ్బు నేరుగా మీకే.','பணம் இல்லாமல் உங்கள் பெயரில் வங்கிக் கணக்கு – அரசுப் பணம் நேரடியாக உங்களுக்கே.'),
   qNo:[0],
   qs:[M('क्या आपके नाम पर पहले से बैंक खाता है?','మీ పేరు మీద ఇప్పటికే బ్యాంకు ఖాతా ఉందా?','உங்கள் பெயரில் ஏற்கனவே வங்கிக் கணக்கு உள்ளதா?')],
   docs:[['🪪',M('आधार कार्ड (या वोटर कार्ड)','ఆధార్ కార్డు (లేదా ఓటరు కార్డు)','ஆதார் அட்டை (அல்லது வாக்காளர் அட்டை)')],['📷',M('एक फ़ोटो','ఒక ఫోటో','ஒரு புகைப்படம்')],['📱',M('मोबाइल नंबर','మొబైల్ నంబర్','மொபைல் எண்')]],
   where:M('अपने गाँव के नज़दीकी बैंक, बैंक मित्र (CSC) या डाकघर जाइए और कहिए "मुझे जन धन खाता खुलवाना है"। फ़ॉर्म वहीं भरवा देंगे।',
           'మీ ఊరికి దగ్గరలోని బ్యాంకు, బ్యాంక్ మిత్ర (CSC) లేదా పోస్టాఫీసుకు వెళ్ళి "నాకు జన్ ధన్ ఖాతా కావాలి" అని చెప్పండి. ఫారం అక్కడే నింపిస్తారు.',
           'உங்கள் ஊருக்கு அருகிலுள்ள வங்கி, வங்கி மித்ரா (CSC) அல்லது தபால் நிலையத்துக்குச் சென்று "எனக்கு ஜன் தன் கணக்கு வேண்டும்" என்று சொல்லுங்கள். படிவத்தை அங்கேயே நிரப்பித் தருவார்கள்.'),
   info:M('खाते में ₹0 रखना भी चलता है। रुपे डेबिट कार्ड और ₹2 लाख का दुर्घटना बीमा मिलता है। सरकार की सारी योजनाओं का पैसा इसी खाते में आता है।',
          'ఖాతాలో ₹0 ఉన్నా సరిపోతుంది. రూపే డెబిట్ కార్డు, ₹2 లక్షల ప్రమాద బీమా వస్తాయి. ప్రభుత్వ పథకాల డబ్బు ఈ ఖాతాలోకే వస్తుంది.',
          'கணக்கில் ₹0 இருந்தாலும் போதும். ரூபே டெபிட் கார்டு, ₹2 லட்சம் விபத்துக் காப்பீடு கிடைக்கும். அரசுத் திட்டப் பணம் இந்தக் கணக்கிலேயே வரும்.'),
   calls:[[M('जन धन हेल्पलाइन','జన్ ధన్ హెల్ప్‌లైన్','ஜன் தன் உதவி எண்'),'18001800']],
   f:'PM Jan Dhan Yojana: zero-balance bank account in own name with RuPay debit card, Rs 2 lakh accident insurance, direct benefit transfers, overdraft facility after good use. Open at any bank branch, Bank Mitra/CSC or post office with Aadhaar (or other ID), photo, mobile. Helpline 1800-11-0001 / 1800-180-1111.' },

 { id:'ayushman', e:'🏥', kw:/इलाज|अस्पताल|आयुष्मान|दवा|health|hospital|treatment|medical|వైద్య|ఆసుపత్రి|ఆయుష్మాన్|சிகிச்சை|மருத்துவ|ஆயுஷ்மான்|மருத்துவமனை|ilaj|ilaaj|dawai|aspatal|दवाई|अस्पताल|डॉक्टर|doctor/i,
   name:M('₹5 लाख तक मुफ़्त इलाज (आयुष्मान)','₹5 లక్షల వరకు ఉచిత వైద్యం (ఆయుష్మాన్)','₹5 லட்சம் வரை இலவச சிகிச்சை (ஆயுஷ்மான்)'),
   d:M('बड़े अस्पताल में भी परिवार का मुफ़्त इलाज।','పెద్ద ఆసుపత్రిలో కూడా కుటుంబానికి ఉచిత వైద్యం.','பெரிய மருத்துவமனையிலும் குடும்பத்துக்கு இலவச சிகிச்சை.'),
   qs:[M('क्या आपके पास आधार कार्ड और राशन कार्ड है, और परिवार की आमदनी कम है?','మీ దగ్గర ఆధార్, రేషన్ కార్డు ఉన్నాయా, కుటుంబ ఆదాయం తక్కువా?','உங்களிடம் ஆதார், ரேஷன் அட்டை உள்ளதா, குடும்ப வருமானம் குறைவா?')],
   docs:[['🪪',M('आधार कार्ड','ఆధార్ కార్డు','ஆதார் அட்டை')],['🧾',M('राशन कार्ड','రేషన్ కార్డు','ரேஷன் அட்டை')],['📱',M('मोबाइल नंबर','మొబైల్ నంబర్','மொபைல் எண்')]],
   where:M('नज़दीकी सरकारी अस्पताल के "आयुष्मान मित्र" डेस्क या जन सेवा केंद्र (CSC) जाइए। वे आपका नाम जाँचकर मुफ़्त आयुष्मान कार्ड बना देंगे।',
           'దగ్గరలోని ప్రభుత్వ ఆసుపత్రిలో "ఆయుష్మాన్ మిత్ర" డెస్క్ లేదా CSC కి వెళ్ళండి. వారు మీ పేరు చూసి ఉచితంగా ఆయుష్మాన్ కార్డు చేస్తారు.',
           'அருகிலுள்ள அரசு மருத்துவமனையில் "ஆயுஷ்மான் மித்ரா" மேசை அல்லது CSC க்குச் செல்லுங்கள். உங்கள் பெயரைச் சரிபார்த்து இலவசமாக ஆயுஷ்மான் அட்டை செய்து தருவார்கள்.'),
   info:M('एक परिवार को साल में ₹5 लाख तक कैशलेस इलाज मिलता है। कार्ड बनवाने के लिए कोई पैसा नहीं लगता।','ఒక కుటుంబానికి సంవత్సరానికి ₹5 లక్షల వరకు నగదు రహిత వైద్యం. కార్డుకు డబ్బు అవసరం లేదు.','ஒரு குடும்பத்துக்கு ஆண்டுக்கு ₹5 லட்சம் வரை பணமில்லா சிகிச்சை. அட்டைக்குக் கட்டணம் இல்லை.'),
   calls:[[M('आयुष्मान हेल्पलाइन','ఆయుష్మాన్ హెల్ప్‌లైన్','ஆயுஷ்மான் உதவி எண்'),'14555']],
   f:'Ayushman Bharat PM-JAY: cashless treatment up to Rs 5 lakh per family per year at empanelled government and private hospitals for eligible low-income families. Get a free Ayushman card from the Ayushman Mitra desk at a government hospital or a CSC with Aadhaar and ration card. Helpline 14555.' },

 { id:'skill', e:'🧵', kw:/हुनर|सिलाई|ट्रेनिंग|skill|training|काम सीख|నైపుణ్య|కుట్టు|శిక్షణ|தொழில்|பயிற்சி|தையல்|silai|kaam|काम|work|job|नौकरी|வேலை|పని/i,
   name:M('मुफ़्त हुनर सीखें और कमाएँ','ఉచితంగా నైపుణ్యం నేర్చుకోండి','இலவசமாகத் தொழில் கற்று சம்பாதிக்க'),
   d:M('सिलाई, ब्यूटी, कंप्यूटर जैसे कोर्स मुफ़्त, सर्टिफ़िकेट के साथ।','కుట్టుపని, బ్యూటీ, కంప్యూటర్ వంటి కోర్సులు ఉచితం, సర్టిఫికెట్‌తో.','தையல், அழகுக்கலை, கணினி போன்ற படிப்புகள் இலவசம், சான்றிதழுடன்.'),
   qs:[M('क्या आपकी उम्र 18 साल से ज़्यादा है और आप कोई काम सीखकर कमाना चाहती हैं?','మీ వయసు 18 కంటే ఎక్కువా, ఏదైనా పని నేర్చుకుని సంపాదించాలనుకుంటున్నారా?','உங்கள் வயது 18க்கு மேலா, ஏதாவது தொழில் கற்று சம்பாதிக்க விரும்புகிறீர்களா?')],
   docs:[['🪪',M('आधार कार्ड','ఆధార్ కార్డు','ஆதார் அட்டை')],['🏦',M('बैंक पासबुक','బ్యాంకు పాస్‌బుక్','வங்கிப் புத்தகம்')],['📷',M('एक फ़ोटो','ఒక ఫోటో','ஒரு புகைப்படம்')],['🎓',M('पढ़ाई का कागज़ (अगर हो)','చదువు పత్రం (ఉంటే)','படிப்புச் சான்று (இருந்தால்)')]],
   where:M('अपने नज़दीकी "कौशल विकास (Skill India / PMKVY) प्रशिक्षण केंद्र", जन सेवा केंद्र (CSC) या पंचायत में जाकर पूछिए कि कौन सा कोर्स मुफ़्त है।',
           'మీకు దగ్గరలోని "స్కిల్ ఇండియా (PMKVY) శిక్షణ కేంద్రం", CSC లేదా పంచాయతీలో ఏ కోర్సు ఉచితమో అడగండి.',
           'அருகிலுள்ள "ஸ்கில் இந்தியா (PMKVY) பயிற்சி மையம்", CSC அல்லது பஞ்சாயத்தில் எந்தப் படிப்பு இலவசம் என்று கேளுங்கள்.'),
   info:M('कोर्स मुफ़्त है, पूरा होने पर सरकारी सर्टिफ़िकेट मिलता है और नौकरी या अपना काम शुरू करने में मदद मिलती है।','కోర్సు ఉచితం, పూర్తయ్యాక ప్రభుత్వ సర్టిఫికెట్ వస్తుంది, ఉద్యోగం లేదా సొంత పని మొదలుపెట్టడానికి సహాయం దొరుకుతుంది.','படிப்பு இலவசம், முடிந்ததும் அரசுச் சான்றிதழ் கிடைக்கும், வேலை அல்லது சொந்தத் தொழில் தொடங்க உதவி கிடைக்கும்.'),
   calls:[[M('स्किल इंडिया हेल्पलाइन','స్కిల్ ఇండియా హెల్ప్‌లైన్','ஸ்கில் இந்தியா உதவி எண்'),'08800055555']],
   f:'Skill India / PMKVY: free short-term skill training (tailoring, beauty, computer, etc.) with government certificate and placement help. Visit nearest training centre / CSC / panchayat with Aadhaar, bank passbook, photo. Helpline 08800055555.' }
];


const EN = {
 lpg:{name:'Book a gas cylinder',d:'Learn to book a cylinder by phone from home.',
  docs:['Gas book or consumer number printed on the cylinder','Mobile number registered with the gas agency','Cash on delivery or UPI'],
  where:'1) Press your gas company number below to call (the company written on your cylinder). 2) Follow the voice and press the buttons it says – you will need your gas number or mobile number. 3) The cylinder will come home in one or two days. 4) At delivery, tell the code (OTP) and take a receipt.',
  info:'Do not pay more than the fixed price. If you smell gas, do not touch fire or electric switches, open doors and windows and call 1906. Check the number with your gas book or agency to be sure.',
  calls:['','','','Gas leak – emergency']},
 ujjwala:{name:'Free gas connection (Ujjwala)',d:'Free gas connection for a woman from a poor family.',
  qs:['Does your home already have a gas connection?','Are you above 18 and do you have a ration card (poor family)?'],
  docs:['Aadhaar card','Ration card / BPL card','Bank passbook','One photo'],
  where:'Go to the nearest gas agency (distributor) and ask for the "Ujjwala form". Fill it and submit your papers. The Anganwadi worker or panchayat can also help.',
  info:'The connection is free and a subsidy on cylinders may also be available. If any agent asks for money, do not pay.',calls:['Gas helpline']},
 urimai:{name:'Magalir Urimai Thogai ₹1,000 every month (Tamil Nadu)',d:'₹1,000 every month for the woman head of the family in Tamil Nadu.',
  qs:['Do you live in Tamil Nadu and are you the head of your family (named on the ration card)?','Are you 21 years or older?','Is your family income below ₹2.5 lakh a year, with no government employee or income-tax payer at home?'],
  docs:['Ration card','Aadhaar card','Bank passbook (in your name)','Mobile number linked to Aadhaar'],
  where:'Ask at your ration shop or Village Administrative Officer (VAO) when the application camp is in your area. Show your papers there and get the form filled. You can also ask at an e-Sevai centre. It costs nothing.',
  info:'₹1,000 comes straight to your bank account every month. This is a Tamil Nadu government scheme, only for Tamil Nadu. Do not pay anyone to apply. Rules can change, so confirm at the camp.',calls:['Tamil Nadu helpline']},
 pmmvy:{name:'₹5,000 for pregnant mothers (Matru Vandana)',d:'₹5,000 in three instalments straight to your bank account for the first child.',
  qs:['Are you pregnant, or is your baby less than 6 months old?','Is this your first child?','Are you 19 years or older?'],
  docs:['Aadhaar card','Bank passbook (in your name)','Mother and child card (MCP)','Mobile number'],
  where:'Go to your village Anganwadi centre or ASHA worker and get Form 1-A filled. It costs nothing – it is free.',
  info:'Total ₹5,000 in three instalments: ₹1,000 on registering the pregnancy, ₹2,000 after a check-up at six months, ₹2,000 after registering the birth and the first vaccine.',calls:['Helpline']},
 sukanya:{name:'Savings account for your daughter (Sukanya)',d:"A higher-interest account for your daughter's education and marriage.",
  qs:['Is your daughter under 10 years old?'],
  docs:["Daughter's birth certificate","Mother's or father's Aadhaar card",'Photo and address proof','₹250 to start'],
  where:'Go to your nearest post office or bank and ask for the "Sukanya Samriddhi account" form.',
  info:'You can open the account with just ₹250 and deposit up to ₹1.5 lakh a year. The government sets the interest, which is higher than normal savings. After the girl turns 18, some money can be taken out for her studies.',calls:['Post office helpline']},
 jandhan:{name:'Free bank account (Jan Dhan)',d:'A bank account in your own name with no money needed – government money comes straight to you.',
  qs:['Do you already have a bank account in your own name?'],
  docs:['Aadhaar card (or voter card)','One photo','Mobile number'],
  where:'Go to the nearest bank, Bank Mitra (CSC) or post office and say "I want to open a Jan Dhan account". They will fill the form there.',
  info:'Keeping ₹0 in the account is fine. You get a RuPay debit card and ₹2 lakh accident insurance. Money from all government schemes comes into this account.',calls:['Jan Dhan helpline']},
 ayushman:{name:'Free treatment up to ₹5 lakh (Ayushman)',d:'Free treatment for the family, even in big hospitals.',
  qs:['Do you have an Aadhaar card and ration card, and is your family income low?'],
  docs:['Aadhaar card','Ration card','Mobile number'],
  where:'Go to the "Ayushman Mitra" desk at the nearest government hospital, or a common service centre (CSC). They will check your name and make a free Ayushman card.',
  info:'One family gets cashless treatment up to ₹5 lakh a year. Making the card costs nothing.',calls:['Ayushman helpline']},
 skill:{name:'Learn a skill free and earn',d:'Free courses like tailoring, beauty and computers, with a certificate.',
  qs:['Are you above 18 and do you want to learn a skill to earn money?'],
  docs:['Aadhaar card','Bank passbook','One photo','Education paper (if you have)'],
  where:'Go to the nearest Skill India (PMKVY) training centre, common service centre (CSC) or panchayat and ask which course is free.',
  info:'The course is free, you get a government certificate when you finish, and help to find a job or start your own work.',calls:['Skill India helpline']}
};
S.forEach(s=>{const e=EN[s.id]; s.name.en=e.name; s.d.en=e.d; s.where.en=e.where; s.info.en=e.info;
  (e.qs||[]).forEach((q,i)=>s.qs[i].en=q); e.docs.forEach((d,i)=>s.docs[i][1].en=d);
  s.calls.forEach((c,i)=>{ if(typeof c[0]!=='string') c[0].en=e.calls[i]; });});


// ============ Profile (stays on this phone only) + more services ============
const M4=(en,hi,te,ta)=>({en,hi,te,ta});
const D={
  aadhaar:['🪪',M4('Aadhaar card','आधार कार्ड','ఆధార్ కార్డు','ஆதார் அட்டை')],
  ration:['🧾',M4('Ration card','राशन कार्ड','రేషన్ కార్డు','ரேஷன் அட்டை')],
  pass:['🏦',M4('Bank passbook (in your name)','बैंक पासबुक (आपके नाम की)','బ్యాంకు పాస్‌బుక్ (మీ పేరు మీద)','வங்கிப் புத்தகம் (உங்கள் பெயரில்)')],
  mobile:['📱',M4('Mobile number','मोबाइल नंबर','మొబైల్ నంబర్','மொபைல் எண்')],
  photo:['📷',M4('One photo','एक फ़ोटो','ఒక ఫోటో','ஒரு புகைப்படம்')]
};
const HELP181=[[M4('Women helpline','महिला हेल्पलाइन','మహిళా హెల్ప్‌లైన్','பெண்கள் உதவி எண்'),'181']];

const NEW_SCHEMES=[
 { id:'balance', e:'🪙', basic:true, kw:/balance|बैलेंस|बैलेन्स|कितने पैसे|खाते में कितने|missed call|मिस्ड|இருப்பு|பேலன்ஸ்|బ్యాలెన్స్|ఖాతాలో ఎంత/i,
   name:M4('Check bank balance','बैंक में पैसे देखें (बैलेंस)','బ్యాంకులో డబ్బు చూడండి (బ్యాలెన్స్)','வங்கியில் பணம் பார்க்க (இருப்பு)'),
   d:M4('See how much money is in your account with one missed call.','एक मिस्ड कॉल से जानिए खाते में कितने पैसे हैं।','ఒక మిస్డ్ కాల్‌తో ఖాతాలో ఎంత డబ్బు ఉందో తెలుసుకోండి.','ஒரு மிஸ்டு கால் மூலம் கணக்கில் எவ்வளவு பணம் உள்ளது என்று பாருங்கள்.'),
   qs:[],
   docs:[D.mobile,['🏦',M4('Your bank name (see your passbook)','आपके बैंक का नाम (पासबुक में देखें)','మీ బ్యాంకు పేరు (పాస్‌బుక్‌లో చూడండి)','உங்கள் வங்கியின் பெயர் (வங்கிப் புத்தகத்தில் பாருங்கள்)')]],
   where:M4('1) Press your bank number below, from the same mobile number registered with the bank. 2) The call cuts by itself – this is a missed call and it costs nothing. 3) In a few seconds an SMS arrives with your balance. 4) Or dial *99# on any phone and choose balance.',
            '1) नीचे अपने बैंक का नंबर दबाइए – उसी मोबाइल से जो बैंक में दर्ज है। 2) फ़ोन अपने आप कट जाएगा – यह मिस्ड कॉल है, इसमें पैसे नहीं लगते। 3) कुछ सेकंड में SMS में आपका बैलेंस आ जाएगा। 4) या किसी भी फ़ोन से *99# डायल करके बैलेंस चुनिए।',
            '1) కింద మీ బ్యాంకు నంబర్ నొక్కండి – బ్యాంకులో నమోదైన అదే మొబైల్ నుండి. 2) కాల్ దానంతట అదే కట్ అవుతుంది – ఇది మిస్డ్ కాల్, డబ్బు ఖర్చు కాదు. 3) కొన్ని సెకన్లలో SMS లో మీ బ్యాలెన్స్ వస్తుంది. 4) లేదా ఏ ఫోన్‌లోనైనా *99# డయల్ చేసి బ్యాలెన్స్ ఎంచుకోండి.',
            '1) கீழே உங்கள் வங்கி எண்ணை அழுத்துங்கள் – வங்கியில் பதிவான அதே மொபைலிலிருந்து. 2) அழைப்பு தானாகவே கட் ஆகும் – இது மிஸ்டு கால், கட்டணம் இல்லை. 3) சில வினாடிகளில் SMS இல் உங்கள் இருப்பு வரும். 4) அல்லது எந்த போனிலும் *99# அழுத்தி இருப்பைத் தேர்ந்தெடுங்கள்.'),
   info:M4('The bank never asks for your OTP, PIN or card number on the phone. Never tell anyone. If your bank is not listed, the number is on the back of your ATM card or in your passbook.',
           'बैंक कभी फ़ोन पर OTP, पिन या कार्ड नंबर नहीं माँगता – किसी को मत बताइए। आपका बैंक यहाँ न दिखे तो नंबर ATM कार्ड के पीछे या पासबुक में लिखा होता है।',
           'బ్యాంకు ఎప్పుడూ ఫోన్‌లో OTP, పిన్ లేదా కార్డు నంబర్ అడగదు – ఎవరికీ చెప్పకండి. మీ బ్యాంకు ఇక్కడ లేకపోతే నంబర్ ATM కార్డు వెనుక లేదా పాస్‌బుక్‌లో ఉంటుంది.',
           'வங்கி ஒருபோதும் போனில் OTP, பின் அல்லது கார்டு எண்ணைக் கேட்காது – யாருக்கும் சொல்லாதீர்கள். உங்கள் வங்கி இங்கே இல்லையென்றால் எண் ATM கார்டின் பின்புறம் அல்லது வங்கிப் புத்தகத்தில் இருக்கும்.'),
   calls:[['SBI','9223766666'],['Bank of Baroda','8468001111'],['Canara Bank','09015483483'],['Union Bank','09223008586'],[M4('Any phone menu','எந்த போனிலும்','ఏ ఫోన్‌లోనైనా','எந்த போனிலும்'),'*99#']],
   f:'Check bank balance: give a missed call from your bank-registered mobile (SBI 9223766666, Bank of Baroda 8468001111, Canara 09015483483, Union Bank 09223008586) and an SMS with the balance arrives; or dial *99# and choose balance. Banks never ask for OTP, PIN or card number. Confirm the number on your passbook/ATM card.' },

 { id:'widow', e:'🧓', kw:/विधवा|पेंशन|pension|widow|వితంతు|పింఛన్|ఫింఛన్|விதவை|ஓய்வூதியம்/i,
   name:M4('Monthly pension for widows','विधवा पेंशन (हर महीने)','వితంతు పింఛన్ (ప్రతి నెల)','விதவை ஓய்வூதியம் (மாதம்தோறும்)'),
   d:M4('Monthly money for poor widows aged 40 and above.','गरीब विधवाओं (40 साल या ज़्यादा) को हर महीने पैसा।','40 ఏళ్లు పైబడిన పేద వితంతువులకు ప్రతి నెల డబ్బు.','40 வயதுக்கு மேற்பட்ட ஏழை விதவைகளுக்கு மாதம்தோறும் பணம்.'),
   qs:[M4('Are you a widow?','क्या आप विधवा हैं?','మీరు వితంతువా?','நீங்கள் கணவரை இழந்தவரா?'),
       M4('Are you 40 years or older?','क्या आपकी उम्र 40 साल या ज़्यादा है?','మీ వయసు 40 లేదా ఎక్కువా?','உங்கள் வயது 40 அல்லது அதற்கு மேலா?'),
       M4('Is your family poor (BPL or poor-family ration card)?','क्या आपका परिवार गरीब है (BPL या गरीब परिवार का राशन कार्ड)?','మీ కుటుంబం పేదదా (BPL లేదా పేద కుటుంబ రేషన్ కార్డు)?','உங்கள் குடும்பம் ஏழையா (BPL அல்லது ஏழைக் குடும்ப ரேஷன் அட்டை)?')],
   docs:[D.aadhaar,['📜',M4('Husband death certificate','पति का मृत्यु प्रमाण पत्र','భర్త మరణ ధృవపత్రం','கணவரின் இறப்புச் சான்றிதழ்')],D.ration,D.pass],
   where:M4('Go to your Gram Panchayat, block or tehsil office, ward office or Social Welfare office and ask for the "widow pension (NSAP)" form. Submit your papers. The village secretary can help you fill it.',
            'अपनी ग्राम पंचायत, ब्लॉक या तहसील दफ़्तर, वार्ड ऑफ़िस या समाज कल्याण विभाग जाइए और "विधवा पेंशन (NSAP)" का फ़ॉर्म माँगिए। कागज़ जमा कीजिए। पंचायत सचिव फ़ॉर्म भरने में मदद करेंगे।',
            'మీ గ్రామ పంచాయతీ, బ్లాక్ లేదా తహసీల్ కార్యాలయం, వార్డు ఆఫీసు లేదా సామాజిక సంక్షేమ శాఖకు వెళ్ళి "వితంతు పింఛన్ (NSAP)" ఫారం అడగండి. పత్రాలు ఇవ్వండి. పంచాయతీ కార్యదర్శి ఫారం నింపడంలో సహాయం చేస్తారు.',
            'உங்கள் கிராம பஞ்சாயத்து, வட்டார அல்லது தாலுகா அலுவலகம், வார்டு அலுவலகம் அல்லது சமூக நலத் துறைக்குச் சென்று "விதவை ஓய்வூதியம் (NSAP)" படிவம் கேளுங்கள். ஆவணங்களைக் கொடுங்கள். படிவம் நிரப்ப பஞ்சாயத்துச் செயலர் உதவுவார்.'),
   info:M4('The pension comes every month to your bank account. The central part is small (about ₹300) and your state adds more, so the amount is different in each state. Confirm locally.',
           'पेंशन हर महीने सीधे बैंक खाते में आती है। केंद्र का हिस्सा कम है (लगभग ₹300) और राज्य सरकार जोड़ती है, इसलिए रकम हर राज्य में अलग है। स्थानीय दफ़्तर में पक्का कर लीजिए।',
           'పింఛన్ ప్రతి నెల నేరుగా బ్యాంకు ఖాతాలో వస్తుంది. కేంద్ర వాటా తక్కువ (సుమారు ₹300), రాష్ట్రం కలుపుతుంది, కాబట్టి మొత్తం రాష్ట్రాన్ని బట్టి మారుతుంది. స్థానికంగా నిర్ధారించుకోండి.',
           'ஓய்வூதியம் ஒவ்வொரு மாதமும் நேரடியாக வங்கிக் கணக்கில் வரும். மத்திய அரசின் பங்கு சிறியது (சுமார் ₹300), மாநில அரசு கூடுதலாகச் சேர்க்கும், எனவே தொகை மாநிலத்துக்கு மாநிலம் மாறும். உள்ளூரில் உறுதி செய்யுங்கள்.'),
   calls:HELP181,
   f:'Widow pension (NSAP / Indira Gandhi National Widow Pension Scheme): monthly pension to poor (BPL) widows aged 40+; central share about Rs 300, states add more. Apply at Gram Panchayat / block / ward / social welfare office with Aadhaar, husband death certificate, ration/BPL card, bank passbook. Women helpline 181.' },

 { id:'scholarship', e:'🎓', kw:/छात्रवृत्ति|स्कॉलरशिप|scholarship|స్కాలర్|உதவித்தொகை|ஸ்காலர்/i,
   name:M4('Scholarship for girls who study','पढ़ने वाली बेटी के लिए छात्रवृत्ति','చదువుతున్న అమ్మాయికి స్కాలర్‌షిప్','படிக்கும் மகளுக்கு உதவித்தொகை'),
   d:M4('Money for school or college fees for girls from SC, ST, OBC or minority families.','SC, ST, OBC या अल्पसंख्यक परिवार की बेटी की स्कूल-कॉलेज की पढ़ाई के लिए पैसा।','SC, ST, OBC లేదా మైనారిటీ కుటుంబాల అమ్మాయిల చదువుకు డబ్బు.','SC, ST, OBC அல்லது சிறுபான்மைக் குடும்பப் பெண்களின் பள்ளி, கல்லூரிப் படிப்புக்குப் பணம்.'),
   qs:[M4('Is a girl in your family studying in a school or college?','क्या आपके परिवार की कोई बेटी स्कूल या कॉलेज में पढ़ रही है?','మీ కుటుంబంలో అమ్మాయి స్కూల్ లేదా కాలేజీలో చదువుతోందా?','உங்கள் குடும்பத்தில் பெண் பள்ளி அல்லது கல்லூரியில் படிக்கிறாரா?'),
       M4('Is your family income low (usually below ₹2.5 lakh a year)?','क्या परिवार की आमदनी कम है (आम तौर पर साल में ₹2.5 लाख से कम)?','కుటుంబ ఆదాయం తక్కువా (సాధారణంగా సంవత్సరానికి ₹2.5 లక్షల లోపు)?','குடும்ப வருமானம் குறைவா (பொதுவாக ஆண்டுக்கு ₹2.5 லட்சத்துக்குள்)?')],
   docs:[D.aadhaar,['📜',M4('Caste or minority certificate','जाति या अल्पसंख्यक प्रमाण पत्र','కుల లేదా మైనారిటీ ధృవపత్రం','சாதி அல்லது சிறுபான்மைச் சான்றிதழ்')],['🧾',M4('Income certificate','आय प्रमाण पत्र','ఆదాయ ధృవపత్రం','வருமானச் சான்றிதழ்')],['🎓',M4('Marksheet, fee receipt and student bank passbook','मार्कशीट, फ़ीस रसीद और छात्रा की बैंक पासबुक','మార్క్‌షీట్, ఫీజు రసీదు, విద్యార్థిని బ్యాంకు పాస్‌బుక్','மதிப்பெண் பட்டியல், கட்டண ரசீது, மாணவியின் வங்கிப் புத்தகம்')]],
   where:M4('Ask the school or college office to help you apply, or go to a common service centre (CSC). Applications are made on the National Scholarship Portal (scholarships.gov.in) every year before the last date.',
            'स्कूल या कॉलेज के दफ़्तर से आवेदन में मदद माँगिए, या जन सेवा केंद्र (CSC) जाइए। आवेदन हर साल अंतिम तारीख से पहले नेशनल स्कॉलरशिप पोर्टल (scholarships.gov.in) पर होता है।',
            'దరఖాస్తుకు సహాయం కోసం స్కూల్ లేదా కాలేజీ ఆఫీసును అడగండి, లేదా కామన్ సర్వీస్ సెంటర్ (CSC) కు వెళ్ళండి. ప్రతి సంవత్సరం చివరి తేదీలోపు నేషనల్ స్కాలర్‌షిప్ పోర్టల్ (scholarships.gov.in) లో దరఖాస్తు చేయాలి.',
            'விண்ணப்பிக்க உதவிக்கு பள்ளி அல்லது கல்லூரி அலுவலகத்தைக் கேளுங்கள், அல்லது பொது சேவை மையத்துக்கு (CSC) செல்லுங்கள். ஒவ்வொரு ஆண்டும் கடைசி தேதிக்கு முன் தேசிய உதவித்தொகை இணையதளத்தில் (scholarships.gov.in) விண்ணப்பிக்க வேண்டும்.'),
   info:M4('The amount depends on the class and the scheme. Money goes to the student bank account. Do not pay anyone to apply. Your state may also have its own scholarships – ask at school.',
           'रकम कक्षा और योजना पर निर्भर करती है। पैसा छात्रा के बैंक खाते में आता है। आवेदन के लिए किसी को पैसे मत दीजिए। आपके राज्य की अपनी छात्रवृत्तियाँ भी हो सकती हैं – स्कूल में पूछिए।',
           'మొత్తం తరగతి, పథకాన్ని బట్టి ఉంటుంది. డబ్బు విద్యార్థిని బ్యాంకు ఖాతాలో వస్తుంది. దరఖాస్తుకు ఎవరికీ డబ్బు ఇవ్వకండి. మీ రాష్ట్రానికి సొంత స్కాలర్‌షిప్‌లు కూడా ఉండవచ్చు – స్కూల్‌లో అడగండి.',
           'தொகை வகுப்பு, திட்டத்தைப் பொறுத்தது. பணம் மாணவியின் வங்கிக் கணக்கில் வரும். விண்ணப்பிக்க யாருக்கும் பணம் கொடுக்காதீர்கள். உங்கள் மாநிலத்துக்கு சொந்த உதவித்தொகைகளும் இருக்கலாம் – பள்ளியில் கேளுங்கள்.'),
   calls:[[M4('Scholarship portal helpline','உதவித்தொகை உதவி எண்','స్కాలర్‌షిప్ హెల్ప్‌లైన్','உதவித்தொகை உதவி எண்'),'01206619540']].map(c=>c).concat(HELP181),
   f:'National Scholarship Portal (scholarships.gov.in): pre-matric/post-matric and merit scholarships for SC, ST, OBC and minority students, usually family income below Rs 2.5 lakh; apply every year via school/college or CSC with Aadhaar, caste/minority and income certificates, marksheet, fee receipt, student bank passbook. Money goes to student bank account. Many states have extra scholarships.' },

 { id:'shg', e:'👥', kw:/समूह|shg|self help|लखपति|lakhpati|संघం|సంఘం|లక్‌పతి|குழு|லக்பதி|savings group|बचत समूह/i,
   name:M4('Join a women savings group (Lakhpati Didi)','महिला बचत समूह से जुड़ें (लखपति दीदी)','మహిళా పొదుపు సంఘంలో చేరండి (లక్‌పతి దీదీ)','மகளிர் சேமிப்புக் குழுவில் சேருங்கள் (லக்பதி தீதி)'),
   d:M4('Save together, get low-interest loans and training to start your own work.','साथ मिलकर बचत कीजिए, कम ब्याज पर लोन और अपना काम शुरू करने की ट्रेनिंग पाइए।','కలిసి పొదుపు చేయండి, తక్కువ వడ్డీకి రుణం, సొంత పని మొదలుపెట్టడానికి శిక్షణ పొందండి.','சேர்ந்து சேமியுங்கள், குறைந்த வட்டியில் கடன், சொந்தத் தொழில் தொடங்கப் பயிற்சி பெறுங்கள்.'),
   qs:[M4('Do you live in a village?','क्या आप गाँव में रहती हैं?','మీరు గ్రామంలో ఉంటారా?','நீங்கள் கிராமத்தில் வசிக்கிறீர்களா?'),
       M4('Do you want to join a group of women to save money and earn?','क्या आप महिलाओं के समूह से जुड़कर बचत करना और कमाना चाहती हैं?','మహిళల సంఘంలో చేరి పొదుపు చేసి సంపాదించాలనుకుంటున్నారా?','பெண்கள் குழுவில் சேர்ந்து சேமித்து சம்பாதிக்க விரும்புகிறீர்களா?')],
   docs:[D.aadhaar,D.pass,D.photo,D.mobile],
   where:M4('Ask at your Gram Panchayat, block office or Anganwadi about the "Self Help Group (SHG)" under the National Rural Livelihoods Mission (Aajeevika). Join a group of 10 to 20 women who meet and save every week.',
            'अपनी ग्राम पंचायत, ब्लॉक दफ़्तर या आंगनवाड़ी में राष्ट्रीय ग्रामीण आजीविका मिशन (आजीविका) के "स्वयं सहायता समूह (SHG)" के बारे में पूछिए। 10 से 20 महिलाओं के समूह से जुड़िए जो हर हफ़्ते मिलकर बचत करती हैं।',
            'మీ గ్రామ పంచాయతీ, బ్లాక్ ఆఫీసు లేదా అంగన్‌వాడీలో జాతీయ గ్రామీణ జీవనోపాధి మిషన్ (ఆజీవిక) కింద "స్వయం సహాయక సంఘం (SHG)" గురించి అడగండి. ప్రతి వారం కలిసి పొదుపు చేసే 10 నుండి 20 మంది మహిళల సంఘంలో చేరండి.',
            'உங்கள் கிராம பஞ்சாயத்து, வட்டார அலுவலகம் அல்லது அங்கன்வாடியில் தேசிய ஊரக வாழ்வாதார இயக்கத்தின் (ஆஜீவிகா) "சுய உதவிக் குழு (SHG)" பற்றிக் கேளுங்கள். ஒவ்வொரு வாரமும் சந்தித்துச் சேமிக்கும் 10 முதல் 20 பெண்கள் குழுவில் சேருங்கள்.'),
   info:M4('Each woman saves a small amount every week. The group opens a bank account and gets loans at low interest, and training to start work. The aim of Lakhpati Didi is to earn at least ₹1 lakh every year.',
           'हर महिला हर हफ़्ते थोड़ी बचत करती है। समूह बैंक खाता खोलता है, कम ब्याज पर लोन और काम शुरू करने की ट्रेनिंग मिलती है। लखपति दीदी का लक्ष्य हर साल कम से कम ₹1 लाख कमाना है।',
           'ప్రతి మహిళ ప్రతి వారం కొంచెం పొదుపు చేస్తుంది. సంఘం బ్యాంకు ఖాతా తెరుస్తుంది, తక్కువ వడ్డీకి రుణం, పని మొదలుపెట్టడానికి శిక్షణ దొరుకుతాయి. లక్‌పతి దీదీ లక్ష్యం ప్రతి సంవత్సరం కనీసం ₹1 లక్ష సంపాదించడం.',
           'ஒவ்வொரு பெண்ணும் ஒவ்வொரு வாரமும் சிறிது சேமிக்கிறார். குழு வங்கிக் கணக்கு தொடங்கி, குறைந்த வட்டியில் கடன், தொழில் தொடங்கப் பயிற்சி பெறுகிறது. லக்பதி தீதியின் இலக்கு ஆண்டுக்கு குறைந்தது ₹1 லட்சம் சம்பாதிப்பது.'),
   calls:HELP181,
   f:'Self Help Groups under DAY-NRLM (Aajeevika) and the Lakhpati Didi goal: rural women form groups of 10-20, save weekly, get bank loans at low interest and training, aim to earn at least Rs 1 lakh a year. Ask at Gram Panchayat / block office / Anganwadi.' }
];
// Basic services come first in the list; the rest follow
S.splice(1,0,NEW_SCHEMES[0]); S.push(NEW_SCHEMES[1],NEW_SCHEMES[2],NEW_SCHEMES[3]);
S.find(x=>x.id==='lpg').basic = true; S.find(x=>x.id==='jandhan').basic = true;

// ----- State monthly-cash schemes, built from one template per language -----
const STATES=[
 ['AN','Andaman & Nicobar','अंडमान और निकोबार','அந்தமான் நிக்கோபார்','అండమాన్ నికోబార్'],['AP','Andhra Pradesh','आंध्र प्रदेश','ஆந்திரப் பிரதேசம்','ఆంధ్రప్రదేశ్'],
 ['AR','Arunachal Pradesh','अरुणाचल प्रदेश','அருணாசலப் பிரதேசம்','అరుణాచల్ ప్రదేశ్'],['AS','Assam','असम','அசாம்','అస్సాం'],
 ['BR','Bihar','बिहार','பீகார்','బీహార్'],['CH','Chandigarh','चंडीगढ़','சண்டிகர்','చండీగఢ్'],
 ['CG','Chhattisgarh','छत्तीसगढ़','சத்தீஸ்கர்','ఛత్తీస్‌గఢ్'],['DN','Dadra, Nagar Haveli, Daman & Diu','दादरा नगर हवेली, दमन और दीव','தாத்ரா நகர் ஹவேலி, டாமன் டையூ','దాద్రా నగర్ హవేలీ, డామన్ డయ్యూ'],
 ['DL','Delhi','दिल्ली','டெல்லி','ఢిల్లీ'],['GA','Goa','गोवा','கோவா','గోవా'],
 ['GJ','Gujarat','गुजरात','குஜராத்','గుజరాత్'],['HR','Haryana','हरियाणा','ஹரியானா','హరియాణా'],
 ['HP','Himachal Pradesh','हिमाचल प्रदेश','இமாசலப் பிரதேசம்','హిమాచల్ ప్రదేశ్'],['JK','Jammu & Kashmir','जम्मू और कश्मीर','ஜம்மு காஷ்மீர்','జమ్మూ కశ్మీర్'],
 ['JH','Jharkhand','झारखंड','ஜார்க்கண்ட்','జార్ఖండ్'],['KA','Karnataka','कर्नाटक','கர்நாடகம்','కర్ణాటక'],
 ['KL','Kerala','केरल','கேரளம்','కేరళ'],['LA','Ladakh','लद्दाख','லடாக்','లద్దాఖ్'],
 ['LD','Lakshadweep','लक्षद्वीप','லட்சத்தீவு','లక్షద్వీప్'],['MP','Madhya Pradesh','मध्य प्रदेश','மத்தியப் பிரதேசம்','మధ్యప్రదేశ్'],
 ['MH','Maharashtra','महाराष्ट्र','மகாராஷ்டிரம்','మహారాష్ట్ర'],['MN','Manipur','मणिपुर','மணிப்பூர்','మణిపూర్'],
 ['ML','Meghalaya','मेघालय','மேகாலயா','మేఘాలయ'],['MZ','Mizoram','मिज़ोरम','மிசோரம்','మిజోరం'],
 ['NL','Nagaland','नागालैंड','நாகாலாந்து','నాగాలాండ్'],['OD','Odisha','ओडिशा','ஒடிசா','ఒడిశా'],
 ['PY','Puducherry','पुदुचेरी','புதுச்சேரி','పుదుచ్చేరి'],['PB','Punjab','पंजाब','பஞ்சாப்','పంజాబ్'],
 ['RJ','Rajasthan','राजस्थान','ராஜஸ்தான்','రాజస్థాన్'],['SK','Sikkim','सिक्किम','சிக்கிம்','సిక్కిం'],
 ['TN','Tamil Nadu','तमिलनाडु','தமிழ்நாடு','తమిళనాడు'],['TG','Telangana','तेलंगाना','தெலங்கானா','తెలంగాణ'],
 ['TR','Tripura','त्रिपुरा','திரிபுரா','త్రిపుర'],['UP','Uttar Pradesh','उत्तर प्रदेश','உத்தரப் பிரதேசம்','ఉత్తరప్రదేశ్'],
 ['UK','Uttarakhand','उत्तराखंड','உத்தராகண்ட்','ఉత్తరాఖండ్'],['WB','West Bengal','पश्चिम बंगाल','மேற்கு வங்கம்','పశ్చిమ బెంగాల్']
];
const SIDX={en:1,hi:2,ta:3,te:4};
const stName=(c,l)=>{ const r=STATES.find(x=>x[0]===c); return r? r[SIDX[l]] : ''; };

const CASH={
 MH:{n:'Mukhyamantri Majhi Ladki Bahin Yojana',a:'₹1,500',per:'m',lo:21,hi:65,k:'inc',kw:/ladki bahin|लाड़की बहन|लाडकी बहीण|लाडकी बहिण|माझी लाडकी/i},
 KA:{n:'Gruha Lakshmi',a:'₹2,000',per:'m',lo:18,hi:100,k:'head',kw:/gruha lakshmi|गृह लक्ष्मी|గృహలక్ష్మి|கிருஹ லட்சுமி|gruhalakshmi/i},
 WB:{n:'Annapurna Bhandar (earlier Lakshmir Bhandar)',a:'₹3,000',per:'m',lo:25,hi:60,k:'none',kw:/annapurna|अन्नपूर्णा|অন্নপূর্ণা|lakshmir|लक्ष्मीर|lokkhir|laxmir/i},
 MP:{n:'Ladli Behna Yojana',a:'₹1,250+',per:'m',lo:21,hi:60,k:'inc',kw:/ladli behna|लाडली बहना|लाड़ली बहना|ladli behena/i},
 OD:{n:'Subhadra Yojana',a:'₹10,000',per:'y',lo:21,hi:60,k:'none',kw:/subhadra|सुभद्रा|సుభద్ర|சுபத்ரா/i}
};
const CT={
 en:{per:{m:'every month',y:'every year'},d:(t,st,pr)=>`${t.a} ${pr} for eligible women of ${st}.`,qA:t=>`Are you between ${t.lo} and ${t.hi} years old?`,qO:t=>`Are you ${t.lo} years or older?`,
     qI:'Is your family income low (the scheme has an income limit, usually about ₹2.5 lakh a year)?',qH:'Are you the woman head of the family (named as head on the ration card)?',
     where:t=>`Ask your Anganwadi worker, Gram Panchayat or ward office when and where applications for "${t.n}" are taken (camp, app or website). Take the papers listed above. It is free – do not pay anyone.`,
     info:(t,pr)=>`${t.a} ${pr} comes straight to your bank account (keep it linked with Aadhaar). Amount and rules can change, so confirm locally.`},
 hi:{per:{m:'हर महीने',y:'हर साल'},d:(t,st,pr)=>`${st} की पात्र महिलाओं को ${pr} ${t.a}।`,qA:t=>`क्या आपकी उम्र ${t.lo} से ${t.hi} साल के बीच है?`,qO:t=>`क्या आपकी उम्र ${t.lo} साल या ज़्यादा है?`,
     qI:'क्या परिवार की आमदनी कम है (योजना में आमदनी की सीमा होती है, आम तौर पर साल में लगभग ₹2.5 लाख)?',qH:'क्या आप परिवार की मुखिया महिला हैं (राशन कार्ड में मुखिया के रूप में नाम)?',
     where:t=>`अपनी आंगनवाड़ी दीदी, ग्राम पंचायत या वार्ड कार्यालय से पूछिए कि "${t.n}" का आवेदन कब और कहाँ होता है (कैंप, ऐप या वेबसाइट)। ऊपर लिखे कागज़ साथ ले जाइए। यह मुफ़्त है – किसी को पैसे मत दीजिए।`,
     info:(t,pr)=>`${t.a} ${pr} सीधे आपके बैंक खाते में आते हैं (खाते को आधार से जुड़ा रखिए)। रकम और नियम बदल सकते हैं, इसलिए स्थानीय दफ़्तर में पक्का कर लीजिए।`},
 te:{per:{m:'ప్రతి నెల',y:'ప్రతి సంవత్సరం'},d:(t,st,pr)=>`${st} లోని అర్హులైన మహిళలకు ${pr} ${t.a}.`,qA:t=>`మీ వయసు ${t.lo} నుండి ${t.hi} సంవత్సరాల మధ్య ఉందా?`,qO:t=>`మీ వయసు ${t.lo} లేదా ఎక్కువా?`,
     qI:'కుటుంబ ఆదాయం తక్కువా (పథకానికి ఆదాయ పరిమితి ఉంటుంది, సాధారణంగా సంవత్సరానికి సుమారు ₹2.5 లక్షలు)?',qH:'మీరు కుటుంబ పెద్ద మహిళా (రేషన్ కార్డులో పెద్దగా పేరు)?',
     where:t=>`"${t.n}" దరఖాస్తు ఎప్పుడు, ఎక్కడ తీసుకుంటారో (శిబిరం, యాప్ లేదా వెబ్‌సైట్) మీ అంగన్‌వాడీ టీచర్, గ్రామ పంచాయతీ లేదా వార్డు కార్యాలయంలో అడగండి. పైన చెప్పిన పత్రాలు తీసుకెళ్ళండి. ఇది ఉచితం – ఎవరికీ డబ్బు ఇవ్వకండి.`,
     info:(t,pr)=>`${t.a} ${pr} నేరుగా మీ బ్యాంకు ఖాతాలో వస్తాయి (ఖాతాను ఆధార్‌తో లింక్ చేసి ఉంచండి). మొత్తం, నియమాలు మారవచ్చు, స్థానికంగా నిర్ధారించుకోండి.`},
 ta:{per:{m:'மாதம்தோறும்',y:'ஆண்டுதோறும்'},d:(t,st,pr)=>`${st} பகுதியில் தகுதியான பெண்களுக்கு ${pr} ${t.a}.`,qA:t=>`உங்கள் வயது ${t.lo} முதல் ${t.hi} வரை உள்ளதா?`,qO:t=>`உங்கள் வயது ${t.lo} அல்லது அதற்கு மேலா?`,
     qI:'குடும்ப வருமானம் குறைவா (திட்டத்துக்கு வருமான வரம்பு உண்டு, பொதுவாக ஆண்டுக்கு சுமார் ₹2.5 லட்சம்)?',qH:'நீங்கள் குடும்பத் தலைவியா (ரேஷன் அட்டையில் தலைவராகப் பெயர்)?',
     where:t=>`"${t.n}" விண்ணப்பம் எப்போது, எங்கே பெறப்படுகிறது (முகாம், ஆப் அல்லது இணையதளம்) என்று அங்கன்வாடி பணியாளர், கிராம பஞ்சாயத்து அல்லது வார்டு அலுவலகத்தில் கேளுங்கள். மேலே உள்ள ஆவணங்களை எடுத்துச் செல்லுங்கள். இது இலவசம் – யாருக்கும் பணம் கொடுக்காதீர்கள்.`,
     info:(t,pr)=>`${t.a} ${pr} நேரடியாக உங்கள் வங்கிக் கணக்கில் வரும் (கணக்கை ஆதாருடன் இணைத்து வைத்திருங்கள்). தொகையும் விதிகளும் மாறலாம், உள்ளூரில் உறுதி செய்யுங்கள்.`}
};
const L4=['en','hi','te','ta'];
const FIT={};
const ageR=a=>({u18:[0,17],a18:[18,20],a21:[21,39],a40:[40,59],a60:[60,120]})[a]||[0,120];
Object.keys(CASH).forEach(code=>{
  const t=CASH[code], by=f=>{const o={}; L4.forEach(l=>o[l]=f(l)); return o;};
  const qs=[ by(l=> t.hi>=100? CT[l].qO(t) : CT[l].qA(t)) ];
  if(t.k==='inc') qs.push(by(l=>CT[l].qI)); if(t.k==='head') qs.push(by(l=>CT[l].qH));
  S.push({id:'cash_'+code,e:'💵',stateOnly:true,kw:t.kw,
    name:by(l=>`${t.n}: ${t.a}`), d:by(l=>CT[l].d(t,stName(code,l),CT[l].per[t.per])), qs,
    docs:[D.aadhaar,D.ration,D.pass,D.mobile],
    where:by(l=>CT[l].where(t)), info:by(l=>CT[l].info(t,CT[l].per[t.per])), calls:HELP181,
    f:`${t.n} (${stName(code,'en')}): ${t.a} ${CT.en.per[t.per]} for women aged ${t.lo}-${t.hi}. Apply via Anganwadi / Gram Panchayat / ward office or the state portal with Aadhaar, ration card, Aadhaar-linked bank passbook. Rules and amounts can change; confirm locally. Women helpline 181.`});
  FIT['cash_'+code]=p=>p.state===code && ageR(p.age)[1]>=t.lo && ageR(p.age)[0]<=t.hi;
});
Object.assign(FIT,{
  lpg:()=>true, balance:()=>true, jandhan:()=>true,
  ujjwala:p=>p.poor!=='no' && ageR(p.age)[1]>=18,
  urimai:p=>!p.state||p.state==='TN',
  pmmvy:p=>p.preg!=='no' && ageR(p.age)[1]>=19 && p.age!=='a60',
  sukanya:p=>p.daughter!=='no',
  ayushman:p=>p.poor!=='no',
  skill:p=>ageR(p.age)[1]>=18 && ageR(p.age)[0]<=45,
  widow:p=>(p.marital===undefined||p.marital==='widow') && ageR(p.age)[1]>=40 && p.poor!=='no',
  scholarship:p=>p.student!=='no' && ageR(p.age)[0]<=40 && (['SC','ST','OBC'].includes(p.cat)||p.minority==='yes'||(p.cat===undefined&&p.minority===undefined)),
  shg:p=>p.area!=='urban' && p.poor!=='no' && ageR(p.age)[1]>=18
});
/** Official websites (HTTPS, government or the gas companies' own booking sites). */
const LINKS={
  lpg:[['Indane (IndianOil)','https://cx.indianoil.in'],['Bharat Gas','https://my.ebharatgas.com'],['HP Gas','https://myhpgas.in']],
  balance:[['NPCI *99#','https://www.npci.org.in']],
  jandhan:[['pmjdy.gov.in','https://pmjdy.gov.in']],
  ujjwala:[['pmuy.gov.in','https://www.pmuy.gov.in']],
  urimai:[['kmut.tn.gov.in','https://kmut.tn.gov.in']],
  pmmvy:[['pmmvy.wcd.gov.in','https://pmmvy.wcd.gov.in']],
  sukanya:[['India Post','https://www.indiapost.gov.in']],
  ayushman:[['pmjay.gov.in','https://pmjay.gov.in']],
  skill:[['skillindiadigital.gov.in','https://www.skillindiadigital.gov.in']],
  widow:[['nsap.nic.in','https://nsap.nic.in']],
  scholarship:[['scholarships.gov.in','https://scholarships.gov.in']],
  shg:[['aajeevika.gov.in','https://aajeevika.gov.in']],
  cash_MH:[['ladakibahin.maharashtra.gov.in','https://ladakibahin.maharashtra.gov.in']],
  cash_KA:[['Seva Sindhu','https://sevasindhugs.karnataka.gov.in']],
  cash_WB:[['socialsecurity.wb.gov.in','https://socialsecurity.wb.gov.in']],
  cash_MP:[['cmladlibahna.mp.gov.in','https://cmladlibahna.mp.gov.in']],
  cash_OD:[['subhadra.odisha.gov.in','https://subhadra.odisha.gov.in']]
};
S.forEach(x=>{ x.links = LINKS[x.id] || []; });
const fit=(s,p)=>{ const f=FIT[s.id]; try{ return f? f(p) : true; }catch(e){ return true; } };

// ----- Profile UI strings -----
const PU={
 en:{title:'My profile',priv:'Your answers stay only on this phone. They are never sent or saved anywhere else. You can skip any question and delete everything any time.',start:'Start',skip:"Don't want to say",skipQ:'Skip',next:'Next',done:'Done',
   basicT:'Basic services – no profile needed',forYou:'Schemes for you',popularT:'Popular schemes',mk:'Make my profile',mkSub:'Answer a few questions to see schemes made for you (optional)',edit:'Edit profile',del:'Delete my data',
   stateQ:'Which state do you live in?',distQ:'Which district? (optional)',distPh:'District name',saved:'Profile saved. See the schemes made for you.',mine:'My profile',none:'No scheme matches yet. Ask at your Panchayat or Anganwadi.',sayState:'🎤 Say your state'},
 hi:{title:'मेरी प्रोफ़ाइल',priv:'आपके जवाब सिर्फ़ इसी फ़ोन में रहेंगे। इन्हें कहीं भेजा या रखा नहीं जाता। आप किसी भी सवाल को छोड़ सकती हैं और कभी भी सब मिटा सकती हैं।',start:'शुरू करें',skip:'बताना नहीं चाहती',skipQ:'छोड़ें',next:'आगे',done:'पूरा हुआ',
   basicT:'आम सेवाएँ – प्रोफ़ाइल की ज़रूरत नहीं',forYou:'आपके लिए योजनाएँ',popularT:'लोकप्रिय योजनाएँ',mk:'अपनी प्रोफ़ाइल बनाएँ',mkSub:'कुछ सवालों के जवाब दीजिए और अपने लिए योजनाएँ देखिए (ज़रूरी नहीं)',edit:'प्रोफ़ाइल बदलें',del:'मेरी जानकारी मिटाएँ',
   stateQ:'आप किस राज्य में रहती हैं?',distQ:'कौन सा ज़िला? (ज़रूरी नहीं)',distPh:'ज़िले का नाम',saved:'प्रोफ़ाइल सेव हो गई। अपने लिए योजनाएँ देखिए।',mine:'मेरी प्रोफ़ाइल',none:'अभी कोई योजना नहीं मिली। पंचायत या आंगनवाड़ी में पूछिए।',sayState:'🎤 राज्य का नाम बोलिए'},
 ta:{title:'என் சுயவிவரம்',priv:'உங்கள் பதில்கள் இந்த போனிலேயே இருக்கும். வேறு எங்கும் அனுப்பப்படாது, சேமிக்கப்படாது. எந்தக் கேள்வியையும் தவிர்க்கலாம், எப்போது வேண்டுமானாலும் அழிக்கலாம்.',start:'தொடங்குங்கள்',skip:'சொல்ல விரும்பவில்லை',skipQ:'தவிர்',next:'அடுத்து',done:'முடிந்தது',
   basicT:'அடிப்படைச் சேவைகள் – சுயவிவரம் தேவையில்லை',forYou:'உங்களுக்கான திட்டங்கள்',popularT:'பிரபலமான திட்டங்கள்',mk:'என் சுயவிவரத்தை உருவாக்கு',mkSub:'சில கேள்விகளுக்குப் பதில் சொல்லி உங்களுக்கான திட்டங்களைப் பாருங்கள் (விருப்பம்)',edit:'சுயவிவரத்தை மாற்று',del:'என் தகவலை அழி',
   stateQ:'நீங்கள் எந்த மாநிலத்தில் வசிக்கிறீர்கள்?',distQ:'எந்த மாவட்டம்? (விருப்பம்)',distPh:'மாவட்டப் பெயர்',saved:'சுயவிவரம் சேமிக்கப்பட்டது. உங்களுக்கான திட்டங்களைப் பாருங்கள்.',mine:'என் சுயவிவரம்',none:'இன்னும் பொருந்தும் திட்டம் இல்லை. பஞ்சாயத்து அல்லது அங்கன்வாடியில் கேளுங்கள்.',sayState:'🎤 மாநிலத்தின் பெயரைச் சொல்லுங்கள்'},
 te:{title:'నా ప్రొఫైల్',priv:'మీ సమాధానాలు ఈ ఫోన్‌లోనే ఉంటాయి. వేరే ఎక్కడికీ పంపబడవు, నిల్వ చేయబడవు. ఏ ప్రశ్ననైనా వదిలేయవచ్చు, ఎప్పుడైనా తొలగించవచ్చు.',start:'మొదలుపెట్టండి',skip:'చెప్పదలచుకోలేదు',skipQ:'వదిలేయి',next:'తరువాత',done:'పూర్తయింది',
   basicT:'ప్రాథమిక సేవలు – ప్రొఫైల్ అవసరం లేదు',forYou:'మీ కోసం పథకాలు',popularT:'ప్రసిద్ధ పథకాలు',mk:'నా ప్రొఫైల్ చేయండి',mkSub:'కొన్ని ప్రశ్నలకు సమాధానం ఇచ్చి మీ కోసం పథకాలు చూడండి (ఐచ్ఛికం)',edit:'ప్రొఫైల్ మార్చండి',del:'నా సమాచారం తొలగించు',
   stateQ:'మీరు ఏ రాష్ట్రంలో ఉంటారు?',distQ:'ఏ జిల్లా? (ఐచ్ఛికం)',distPh:'జిల్లా పేరు',saved:'ప్రొఫైల్ సేవ్ అయింది. మీ కోసం పథకాలు చూడండి.',mine:'నా ప్రొఫైల్',none:'ఇంకా సరిపోయే పథకం లేదు. పంచాయతీ లేదా అంగన్‌వాడీలో అడగండి.',sayState:'🎤 రాష్ట్రం పేరు చెప్పండి'}
};
const YN=(k,en,hi,te,ta)=>({k,q:M4(en,hi,te,ta),o:[['yes',null],['no',null]]});
const PQ=[
 {k:'age',q:M4('How old are you?','आपकी उम्र कितनी है?','మీ వయసు ఎంత?','உங்கள் வயது என்ன?'),
  o:[['u18',M4('Under 18','18 साल से कम','18 లోపు','18க்குக் கீழ்')],['a18',M4('18 to 20','18 से 20 साल','18 నుండి 20','18 முதல் 20')],['a21',M4('21 to 39','21 से 39 साल','21 నుండి 39','21 முதல் 39')],['a40',M4('40 to 59','40 से 59 साल','40 నుండి 59','40 முதல் 59')],['a60',M4('60 or more','60 साल या ज़्यादा','60 లేదా ఎక్కువ','60 அல்லது மேல்')]]},
 {k:'marital',q:M4('Are you married, unmarried or a widow?','आप शादीशुदा हैं, अविवाहित हैं या विधवा?','మీరు వివాహితా, అవివాహితా, లేక వితంతువా?','நீங்கள் திருமணமானவரா, திருமணமாகாதவரா, அல்லது கணவரை இழந்தவரா?'),
  o:[['married',M4('Married','शादीशुदा','వివాహిత','திருமணமானவர்')],['single',M4('Unmarried','अविवाहित','అవివాహిత','திருமணமாகாதவர்')],['widow',M4('Widow','विधवा','వితంతువు','கணவரை இழந்தவர்')]]},
 {k:'cat',q:M4('Which category is your family? (This helps find scholarships and benefits.)','आपका परिवार किस वर्ग में आता है? (इससे छात्रवृत्ति और लाभ ढूँढने में मदद मिलती है)','మీ కుటుంబం ఏ వర్గం? (స్కాలర్‌షిప్‌లు, పథకాలు కనుగొనడానికి ఉపయోగపడుతుంది)','உங்கள் குடும்பம் எந்தப் பிரிவு? (உதவித்தொகை, நலத்திட்டங்களைக் கண்டறிய உதவும்)'),
  o:[['GEN',M4('General','सामान्य','జనరల్','பொது')],['OBC',M4('OBC','OBC','OBC','OBC')],['SC',M4('SC','SC','SC','SC')],['ST',M4('ST','ST','ST','ST')]]},
 YN('minority','Does your family belong to a minority religion (Muslim, Christian, Sikh, Buddhist, Jain or Parsi)?','क्या आपका परिवार अल्पसंख्यक धर्म (मुस्लिम, ईसाई, सिख, बौद्ध, जैन या पारसी) का है?','మీ కుటుంబం మైనారిటీ మతానికి (ముస్లిం, క్రైస్తవ, సిక్కు, బౌద్ధ, జైన, పార్సీ) చెందినదా?','உங்கள் குடும்பம் சிறுபான்மை மதத்தைச் (முஸ்லிம், கிறிஸ்தவம், சீக்கியம், பௌத்தம், சமணம், பார்சி) சேர்ந்ததா?'),
 YN('poor','Does your family have a ration card for poor families (BPL / AAY / priority)?','क्या आपके पास गरीब परिवार का राशन कार्ड (BPL / अंत्योदय / प्राथमिकता) है?','మీ దగ్గర పేద కుటుంబాల రేషన్ కార్డు (BPL / AAY / ప్రాధాన్యత) ఉందా?','உங்களிடம் ஏழைக் குடும்பத்துக்கான ரேஷன் அட்டை (BPL / AAY / முன்னுரிமை) உள்ளதா?'),
 {k:'area',q:M4('Do you live in a village or a city?','आप गाँव में रहती हैं या शहर में?','మీరు గ్రామంలో ఉంటారా, పట్టణంలోనా?','நீங்கள் கிராமத்தில் வசிக்கிறீர்களா, நகரத்திலா?'),
  o:[['rural',M4('Village','गाँव','గ్రామం','கிராமம்')],['urban',M4('City / town','शहर','పట్టణం','நகரம்')]]},
 YN('preg','Are you pregnant, or is your baby under 6 months old?','क्या आप गर्भवती हैं, या आपका बच्चा 6 महीने से छोटा है?','మీరు గర్భవతా, లేదా మీ బిడ్డ 6 నెలల లోపు వయసా?','நீங்கள் கர்ப்பமாக இருக்கிறீர்களா, அல்லது உங்கள் குழந்தை 6 மாதத்துக்குள் உள்ளதா?'),
 YN('daughter','Do you have a daughter under 10 years old?','क्या आपकी 10 साल से छोटी बेटी है?','మీకు 10 సంవత్సరాల లోపు కూతురు ఉందా?','உங்களுக்கு 10 வயதுக்குள் மகள் இருக்கிறாளா?'),
 YN('student','Is a girl in your family studying in a school or college?','क्या आपके परिवार की कोई बेटी स्कूल या कॉलेज में पढ़ रही है?','మీ కుటుంబంలో అమ్మాయి స్కూల్ లేదా కాలేజీలో చదువుతోందా?','உங்கள் குடும்பத்தில் பெண் பள்ளி அல்லது கல்லூரியில் படிக்கிறாரா?')
];
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
let profile=null; try{ profile=JSON.parse(localStorage.getItem('profile')||'null'); }catch(e){ profile=null; }
const saveProfile=()=>{ try{ localStorage.setItem('profile', profile? JSON.stringify(profile):''); }catch(e){} };
let draft={}, pstep=0, inProfile=false;

// ============ State ============
let lang = 'hi', cur = null, step = 0, eligible = true, recog = null;
const $ = s => document.querySelector(s);
const main = $('#main');
const T = () => U[lang];
const store = { get:k=>{try{return localStorage.getItem(k)}catch(e){return null}}, set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}} };

// ============ Voice out ============
let API = { ai:false }, speechToken = 0, audioEl = null;
const ttsUrls = new Map();
const note = m => { const n=$('#vnote'); if(n) n.textContent = m || ''; };
function stopSpeech(){
  speechToken++;
  try{ speechSynthesis.cancel(); }catch(e){}
  if(audioEl){ try{ audioEl.pause(); }catch(e){} audioEl = null; }
}
function speakLocal(text, v){
  try{ const u = new SpeechSynthesisUtterance(text); u.lang = T().code; u.rate = 0.9; if(v) u.voice = v; speechSynthesis.speak(u); }catch(e){}
}
/** Speak with a device voice for this language when one exists; otherwise ask the server for Gemini text-to-speech. */
async function say(text){
  stopSpeech(); const my = speechToken;
  let vs = [], v = null;
  try{
    vs = speechSynthesis.getVoices(); const code = T().code.toLowerCase();
    v = vs.find(x=>x.lang.replace('_','-').toLowerCase()===code) || vs.find(x=>x.lang.toLowerCase().startsWith(lang));
  }catch(e){}
  if(v){ note(''); speakLocal(text, v); return; }
  if(API.ai){
    try{
      note(T().thinking);
      const k = lang+'|'+text; let url = ttsUrls.get(k);
      if(!url){
        const r = await fetch('/api/tts',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:text.slice(0,1500),lang})});
        if(!r.ok) throw new Error('tts');
        url = URL.createObjectURL(await r.blob()); ttsUrls.set(k,url);
        if(ttsUrls.size>30){ const old = ttsUrls.keys().next().value; URL.revokeObjectURL(ttsUrls.get(old)); ttsUrls.delete(old); }
      }
      if(my!==speechToken) return;
      audioEl = new Audio(url); await audioEl.play(); note('');
      return;
    }catch(e){ note(''); }
  }
  if(my!==speechToken) return;
  if(vs.length && lang!=='en') note(T().vNone); else speakLocal(text, null);
}

// Many users cannot read, so voice is ON unless she (or a helper) turned it off. Nothing speaks before her
// first tap (choosing a language), which browsers also require before speech; the 🔊 Listen buttons always work.
let voiceOn = store.get('voice')!=='0', tapped = false;
['click','keydown'].forEach(t=>document.addEventListener(t, ()=>{ tapped = true; }, {capture:true}));
const autoSay = text => { if(voiceOn && tapped) say(text); };
function paintVoice(){
  const b=$('#vt'); b.textContent = voiceOn ? T().vOn : T().vOff; b.setAttribute('aria-pressed', String(voiceOn));
}
function toggleVoice(){
  voiceOn = !voiceOn; store.set('voice', voiceOn?'1':'0'); paintVoice();
  stopSpeech();
  if(voiceOn) say(T().vMsg); else $('#vnote').textContent='';
}

// ============ Voice in ============
const VM = {
  hi:{denied:'माइक की अनुमति नहीं मिली। ब्राउज़र में माइक को "Allow" कीजिए, फिर दोबारा दबाइए।',net:'बोलने के लिए इंटरनेट चाहिए। इंटरनेट चालू कीजिए।',nomic:'फ़ोन में माइक नहीं मिला।',busy:'माइक अभी दूसरे ऐप में चल रहा है।'},
  ta:{denied:'மைக் அனுமதி கிடைக்கவில்லை. உலாவியில் மைக்கை "Allow" செய்து மீண்டும் அழுத்துங்கள்.',net:'பேசுவதற்கு இணையம் தேவை. இணையத்தை இயக்குங்கள்.',nomic:'இந்த போனில் மைக் இல்லை.',busy:'மைக் வேறு ஆப்பில் பயன்பாட்டில் உள்ளது.'},
  te:{denied:'మైక్ అనుమతి లభించలేదు. బ్రౌజర్‌లో మైక్‌ను "Allow" చేసి మళ్ళీ నొక్కండి.',net:'మాట్లాడటానికి ఇంటర్నెట్ కావాలి. ఇంటర్నెట్ ఆన్ చేయండి.',nomic:'ఈ ఫోన్‌లో మైక్ దొరకలేదు.',busy:'మైక్ మరో యాప్‌లో వాడుతున్నారు.'},
  en:{denied:'Microphone permission was blocked. Please tap "Allow" for the microphone in your browser, then press again.',net:'Speech needs internet. Please switch on internet.',nomic:'No microphone found on this phone.',busy:'The microphone is being used by another app.'}
};
/**
 * Listens once. onText(finalText) on success; onFail(message) exactly once on failure;
 * onInterim(text) shows live words so she can see she is being heard.
 */
function listen(onText, onFail, onInterim){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SR){ onFail(T().nomic); return; }
  stopSpeech();
  try{ if(recog) recog.abort(); }catch(e){}
  let done = false, retriedEn = false;
  const finish = (fn, arg) => { if(done) return; done = true; document.querySelectorAll('.mic').forEach(b=>b.classList.remove('rec')); fn(arg); };
  const start = code => {
    const r = recog = new SR(); r.lang = code; r.interimResults = true; r.maxAlternatives = 3; r.continuous = false;
    let heard = '';
    r.onresult = e => {
      let text = '', final = false;
      for(let i=e.resultIndex;i<e.results.length;i++){ text += e.results[i][0].transcript; if(e.results[i].isFinal) final = true; }
      heard = text;
      if(final){ const alts=[...e.results[e.results.length-1]].map(a=>a.transcript); finish(onText, alts.join(' | ')); }
      else if(onInterim) onInterim(text);
    };
    r.onerror = e => {
      const m = VM[lang]||VM.en;
      if(e.error==='language-not-supported' && !retriedEn){ retriedEn = true; start('en-IN'); return; }
      if(e.error==='not-allowed' || e.error==='service-not-allowed') finish(onFail, m.denied);
      else if(e.error==='network') finish(onFail, m.net);
      else if(e.error==='audio-capture') finish(onFail, m.nomic);
      else if(e.error==='aborted') { done = true; }
      else finish(onFail, T().noheard);
    };
    r.onend = () => { if(heard && !done) finish(onText, heard); else finish(onFail, T().noheard); };
    try{ r.start(); }catch(err){ finish(onFail, (VM[lang]||VM.en).busy); }
  };
  start(T().code);
}

// ============ Server API (Gemini key lives on the server, never in the browser) ============
async function api(path, body){
  const r = await fetch(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  if(!r.ok) throw new Error(path+' '+r.status);
  return r.json();
}

// ============ More languages: translated on demand by Gemini (via the server) and cached on the device ============
const EXTRA=[['bn','বাংলা','bn-IN','Bengali'],['mr','मराठी','mr-IN','Marathi'],['gu','ગુજરાતી','gu-IN','Gujarati'],['kn','ಕನ್ನಡ','kn-IN','Kannada'],['ml','മലയാളം','ml-IN','Malayalam'],['pa','ਪੰਜਾਬੀ','pa-IN','Punjabi'],['or','ଓଡ଼ିଆ','or-IN','Odia']];
const YN_WORDS={bn:['হ্যাঁ|হ্যা|জি','না|নেই|নয়'],mr:['होय|हो|हॉ','नाही|नको'],gu:['હા|જી','ના|નહીં|નથી'],kn:['ಹೌದು|ಹೂ','ಇಲ್ಲ|ಬೇಡ'],ml:['അതെ|ആം|ശരി','ഇല്ല|വേണ്ട'],pa:['ਹਾਂ|ਜੀ','ਨਹੀਂ|ਨਾ'],or:['ହଁ|ହୁଁ','ନାହିଁ|ନା']};
function collectTranslatable(){
  const objs = new Set();
  const walk = x => { if(Array.isArray(x)) x.forEach(walk); else if(x && typeof x==='object' && !(x instanceof RegExp)){ if(typeof x.en==='string') objs.add(x); else Object.values(x).forEach(walk); } };
  walk(S); walk(PQ);
  const uKeys = Object.keys(U.en).filter(k=>typeof U.en[k]==='string' && k!=='code' && k!=='sys');
  const pKeys = Object.keys(PU.en).filter(k=>typeof PU.en[k]==='string');
  const texts = new Set();
  objs.forEach(o=>texts.add(o.en)); uKeys.forEach(k=>texts.add(U.en[k])); pKeys.forEach(k=>texts.add(PU.en[k])); STATES.forEach(r=>texts.add(r[1]));
  return { objs, uKeys, pKeys, texts:[...texts] };
}
function applyTranslation(l, map, col){
  col.objs.forEach(o=>{ o[l] = map[o.en] || o.en; });
  const x = EXTRA.find(e=>e[0]===l), u = {...U.en};
  col.uKeys.forEach(k=>{ u[k] = map[U.en[k]] || U.en[k]; });
  u.code = x[2]; u.sys = x[3];
  const yn = YN_WORDS[l];
  if(yn){ u.yesRe = new RegExp(U.en.yesRe.source+'|'+yn[0],'i'); u.noRe = new RegExp(U.en.noRe.source+'|'+yn[1],'i'); }
  U[l] = u;
  const pu = {...PU.en}; col.pKeys.forEach(k=>{ pu[k] = map[PU.en[k]] || PU.en[k]; }); PU[l] = pu;
  const idx = Object.keys(SIDX).length+1; SIDX[l] = idx;
  STATES.forEach(r=>{ r[idx] = map[r[1]] || r[1]; });
}
async function ensureLang(l, onProgress){
  if(U[l]) return;
  const key = 'tr_'+l+'_v1', col = collectTranslatable();
  let map = null; try{ map = JSON.parse(store.get(key)||'null'); }catch(e){}
  map = map || {};
  const todo = col.texts.filter(t=>!(t in map));
  if(todo.length){
    const batches = []; for(let i=0;i<todo.length;i+=40) batches.push(todo.slice(i,i+40));
    let done = 0;
    for(const b of batches){ const r = await api('/api/translate',{lang:l,strings:b}); b.forEach((t,i)=>{ map[t] = r.strings[i]; }); if(onProgress) onProgress(++done,batches.length); }
    store.set(key, JSON.stringify(map));
  }
  applyTranslation(l, map, col);
}
async function chooseLang(l){
  if(!U[l]){
    const x = EXTRA.find(e=>e[0]===l);
    main.innerHTML = `<div class="card"><div class="emoji">🗣️</div><div class="big">${esc(x[1])}</div><div class="sub" id="trp" role="status">Translating…</div></div>`;
    try{ await ensureLang(l,(d,n)=>{ const p=$('#trp'); if(p) p.textContent='Translating… '+d+'/'+n; }); }
    catch(e){
      main.innerHTML = `<div class="card"><div class="big">Could not load ${esc(x[3])}</div><div class="sub">This language needs internet and the AI server. Please choose Hindi, Tamil, Telugu or English.</div><button class="btn pink" id="back2">English</button></div>`;
      $('#back2').onclick = ()=>{ setLang('en'); home(); }; return;
    }
  }
  setLang(l); cur ? flow() : (inProfile ? profScreen() : home());
}

// ============ Render ============
const sayTexts = [];
const listenBtn = text => `<button class="btn listen" data-say="${sayTexts.push(text)-1}">${T().listen}</button>`;
document.addEventListener('click', e => { const b = e.target.closest('[data-say]'); if(b) say(sayTexts[+b.dataset.say]); });
function dots(){
  const el = $('#dots');
  if(!cur){ el.innerHTML=''; return; }
  const n = cur.qs.length + 1;
  el.innerHTML = Array.from({length:n},(_,i)=>`<div class="dot ${i<=step?'on':''}"></div>`).join('');
}
// ============ Screens and the phone Back button ============
// Every screen is a browser history entry, so the phone's Back button goes to the previous screen
// instead of closing the app. Each new screen starts at the top, and focus moves to its heading so
// screen readers announce it.
let restoring = false;
function screen(st){
  if(!restoring){
    const now = history.state;
    if(!now) history.replaceState(st, '');
    else if(JSON.stringify(now)!==JSON.stringify(st)) history.pushState(st, '');
  }
  queueMicrotask(()=>{
    try{ if(window.scrollY) window.scrollTo(0,0); }catch(e){}
    const h = main.querySelector('h1, .big') || main;
    if(h!==main) h.setAttribute('tabindex','-1');
    try{ h.focus({preventScroll:true}); }catch(e){}
  });
}
addEventListener('popstate', e => {
  const st = e.state; if(!st) return;
  stopSpeech(); try{ if(recog) recog.abort(); }catch(err){}
  const s = st.id && S.find(x=>x.id===st.id);
  restoring = true;
  try{
    if(st.v==='lang') langScreen();
    else if(st.v==='prof'){ pstep = st.p; inProfile = true; cur = null; profScreen(); }
    else if(s && st.v==='q'){ cur = s; step = st.step; eligible = true; flow(); }
    else if(s && st.v==='res'){ cur = s; eligible = st.ok; result(); }
    else if(s && st.v==='steps'){ cur = s; eligible = true; stepScreen(st.i); }
    else if(s && st.v==='ask'){ cur = s; eligible = true; askScreen(); }
    else home();
  } finally { restoring = false; }
});

function setLang(l){
  lang = l; store.set('lang',l); document.documentElement.lang = l;
  document.querySelectorAll('.lang[data-l]').forEach(x=>{ x.classList.toggle('on',x.dataset.l===l); x.setAttribute('aria-pressed', String(x.dataset.l===l)); });
  const mo=$('#more'); if(mo){ mo.value = EXTRA.some(e=>e[0]===l) ? l : ''; if(mo.options[0]) mo.options[0].textContent = T().moreL; }
  $('.skip').textContent = T().skip; $('#foot').textContent = T().foot;
  paintVoice(); stopSpeech(); note('');
  if(typeof paintBig==='function') paintBig();
  const ib=$('#inst'); if(ib) ib.textContent = T().install;
}

const ART={lpg:['#1a56c7','#5b9bff'],balance:['#0b8a78','#4cc9b0'],jandhan:['#3949ab','#8c9eff'],ayushman:['#c62828','#ff8a80'],ujjwala:['#e8590c','#ffa94d'],pmmvy:['#c2185b','#f48fb1'],sukanya:['#8e24aa','#d29be0'],urimai:['#2e7d32','#86d08a'],skill:['#00838f','#4dd0e1'],widow:['#546e7a','#9db4c0'],scholarship:['#5e35b1','#a48ae0'],shg:['#00796b','#5fc7b9']};
const artOf=id=>ART[id]||ART.urimai;
/** Flat-illustration scene: sun, layered hills, a soft shadow and the service's own illustration. */
function sceneSvg(s){
  const ic = ICONS[EMO[s.e]] || ICONS.flower;
  return `<svg class="scene" viewBox="0 0 200 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
    <circle cx="160" cy="46" r="28" fill="#fff" opacity=".2"/><circle cx="160" cy="46" r="15" fill="#fff" opacity=".3"/>
    <path d="M0 150Q50 118 100 138T200 128V250H0Z" fill="#000" opacity=".1"/>
    <path d="M0 176Q60 150 112 168T200 158V250H0Z" fill="#000" opacity=".14"/>
    <ellipse cx="100" cy="152" rx="48" ry="8" fill="#000" opacity=".2"/>
    <g transform="translate(40 34) scale(1.9)">${ic}</g>
    <circle cx="28" cy="42" r="5" fill="#fff" opacity=".45"/><circle cx="50" cy="22" r="3" fill="#fff" opacity=".4"/><circle cx="178" cy="112" r="4" fill="#fff" opacity=".35"/><circle cx="22" cy="118" r="3" fill="#fff" opacity=".3"/>
  </svg>`;
}
const tileHtml = s => { const g=artOf(s.id); return `<button class="tile" data-id="${s.id}" style="--g1:${g[0]};--g2:${g[1]}">${sceneSvg(s)}<span class="t">${s.name[lang]}</span></button>`; };
const HERO_ART = `<svg class="heroart" viewBox="0 0 300 300" aria-hidden="true" focusable="false">
  <circle cx="150" cy="150" r="136" fill="#fde7f0"/><circle cx="236" cy="70" r="22" fill="#f5a524"/>
  <circle cx="58" cy="98" r="9" fill="#f48fb1"/><circle cx="84" cy="52" r="5" fill="#c2185b" opacity=".5"/><circle cx="262" cy="188" r="6" fill="#c2185b" opacity=".4"/>
  <path d="M70 296c0-62 34-104 80-104s80 42 80 104z" fill="#c2185b"/>
  <path d="M150 192c30 14 52 46 46 104h-30c6-48-6-74-16-86z" fill="#f48fb1"/>
  <path d="M112 204q38-24 76 0l-4 22q-34-14-68 0z" fill="#f5a524"/>
  <rect x="141" y="168" width="18" height="26" rx="8" fill="#d9a083"/>
  <circle cx="150" cy="140" r="31" fill="#f0b999"/>
  <path d="M118 138c-4-44 68-44 64 0-8-20-56-20-64 0z" fill="#2b1b22"/><circle cx="150" cy="96" r="13" fill="#2b1b22"/>
  <circle cx="150" cy="128" r="2.6" fill="#d93025"/><circle cx="138" cy="141" r="2.4" fill="#2b1b22"/><circle cx="162" cy="141" r="2.4" fill="#2b1b22"/>
  <path d="M141 153q9 8 18 0" stroke="#a33" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  <path d="M186 226c26 2 40-22 36-56" stroke="#f0b999" stroke-width="15" fill="none" stroke-linecap="round"/>
  <rect x="208" y="118" width="32" height="56" rx="7" fill="#2b1b22"/><rect x="212" y="124" width="24" height="40" rx="3" fill="#bcd4ee"/>
  <rect x="221" y="136" width="6" height="12" rx="3" fill="#c2185b"/><path d="M217 146a7 7 0 0 0 14 0M224 153v4" stroke="#c2185b" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M248 126q10 10 0 22M256 118q16 18 0 38" stroke="#c2185b" stroke-width="4" fill="none" stroke-linecap="round"/>
</svg>`;

function langScreen(){
  cur = null; inProfile = false; dots(); screen({v:'lang'});
  const LG=[['hi','हि','हिन्दी',['#c2185b','#f48fb1']],['ta','த','தமிழ்',['#1a56c7','#5b9bff']],['te','తె','తెలుగు',['#2e7d32','#86d08a']],['en','Aa','English',['#e8590c','#ffa94d']]];
  main.innerHTML = `<section class="hero" style="display:block;margin:0 auto;text-align:center"><div class="over">Sakhi Saathi · सखी साथी</div><h1>भाषा चुनिए · மொழி · భాష · Language</h1></section>
    <div class="grid" style="max-width:620px;margin:10px auto 0">${LG.map(l=>`<button class="tile" data-l="${l[0]}" style="--g1:${l[3][0]};--g2:${l[3][1]}"><span class="e" style="font-size:36px;font-weight:700;color:${l[3][0]}">${l[1]}</span><span class="t" style="font-size:22px">${l[2]}</span></button>`).join('')}</div>`;
  if(API.ai) main.insertAdjacentHTML('beforeend', `<div class="xlangs">${EXTRA.map(e=>`<button class="chip" data-x="${e[0]}">${e[1]}</button>`).join('')}</div>`);
  main.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>{ setLang(b.dataset.l); home(); });
  main.querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>chooseLang(b.dataset.x));
}

function profLine(){ return esc(stName(profile.state,lang)) + (profile.district? ', '+esc(profile.district) : ''); }
function home(){
  cur = null; step = 0; inProfile = false; dots(); screen({v:'home'});
  const t = T(), p = PU[lang];
  const basic = S.filter(x=>x.basic);
  const list = S.filter(x=>!x.basic && (profile ? fit(x,profile) : !x.stateOnly));
  const prof = profile
    ? `<div class="pcard"><div><div class="over">${p.mine}</div><div class="pl">${profLine()}</div></div><div class="pbtns"><button class="chip" id="pedit">✏️ ${p.edit}</button><button class="chip" id="pdel">🗑️ ${p.del}</button></div></div>`
    : `<button class="pcta" id="pmk"><span class="pi">👤</span><span class="pt"><b>${p.mk}</b><small>${p.mkSub}</small></span></button>`;
  main.innerHTML = `<section class="hero"><div class="hero-t"><div class="over">सखी साथी · Sakhi Saathi</div><h1>${t.homeT}</h1><p>${t.homeSub}</p>
      <button class="search mic" id="mic" aria-label="${t.need}"><span>${t.need}</span><span class="mb">🎤</span></button>
      <div id="msg" class="sub" role="status" aria-live="polite"></div>
      <button class="chip" id="hl">${t.listen}</button></div>${HERO_ART}</section>
    ${prof}
    <h2 class="sec">${p.basicT}</h2><div class="strip">${basic.map(tileHtml).join('')}</div>
    <h2 class="sec">${profile ? p.forYou : p.popularT}</h2>
    ${list.length ? `<div class="grid">${list.map(tileHtml).join('')}</div>` : `<div class="sub">${p.none}</div>`}`;
  main.querySelectorAll('.tile').forEach(b=>b.onclick=()=>open(b.dataset.id));
  $('#hl').onclick = ()=>say(t.homeV);
  if($('#pmk')) $('#pmk').onclick = ()=>profFlow(false);
  if($('#pedit')) $('#pedit').onclick = ()=>profFlow(true);
  if($('#pdel')) $('#pdel').onclick = ()=>{ profile = null; saveProfile(); home(); };
  $('#mic').onclick = e => { e.currentTarget.classList.add('rec'); $('#msg').textContent=t.listening;
    listen(async txt=>{ $('#msg').textContent='“'+txt.split(' | ')[0]+'”'; await route(txt); }, m=>{ $('#msg').textContent=m; }, w=>{ $('#msg').textContent='“'+w+'”'; }); };
  autoSay(t.homeV);
}

// ---------- Profile wizard: intro → state → district → one question at a time ----------
function profFlow(edit){ draft = edit && profile ? {...profile} : {}; pstep = 0; inProfile = true; cur = null; profScreen(); }
function profScreen(){
  if(pstep >= 3+PQ.length) return profSave();
  screen({v:'prof',p:pstep});
  dots(); const p = PU[lang], t = T(), total = 2 + PQ.length;
  const prog = pstep>0 ? `<div class="note">${pstep} / ${total}</div>` : '';
  if(pstep===0){
    main.innerHTML = `<div class="card"><div class="emoji">👤</div><div class="big">${p.title}</div><div class="sub">${p.priv}</div>${listenBtn(p.priv)}
      <button class="btn yes" id="go">${p.start}</button><button class="btn ghost" id="home">${t.home}</button></div>`;
    $('#go').onclick=()=>{pstep=1;profScreen();}; $('#home').onclick=home; autoSay(p.priv); return;
  }
  if(pstep===1){
    main.innerHTML = `<div class="card">${prog}<div class="big">${p.stateQ}</div>
      <button class="btn pink mic" id="mic">${p.sayState}</button><div id="msg" class="sub" role="status" aria-live="polite"></div>
      <div class="grid1">${STATES.map(r=>`<button class="btn ghost st" data-c="${r[0]}">${r[SIDX[lang]]}</button>`).join('')}</div>
      <button class="btn ghost" id="sk">${p.skipQ}</button></div>`;
    const pick=c=>{ if(c) draft.state=c; else delete draft.state; pstep=2; profScreen(); };
    main.querySelectorAll('.st').forEach(b=>b.onclick=()=>pick(b.dataset.c)); $('#sk').onclick=()=>pick(null);
    $('#mic').onclick = e => { e.currentTarget.classList.add('rec'); $('#msg').textContent=t.listening;
      listen(txt=>{ const low=txt.toLowerCase(); const r=STATES.find(r=>r.slice(1).some(n=>low.includes(n.toLowerCase())) || low.includes(r[0].toLowerCase()+' ') );
        if(r) pick(r[0]); else $('#msg').textContent=t.noheard; }, m=>{ $('#msg').textContent=m; }, w=>{ $('#msg').textContent='“'+w+'”'; }); };
    autoSay(p.stateQ); return;
  }
  if(pstep===2){
    main.innerHTML = `<div class="card">${prog}<div class="big">${p.distQ}</div>
      <input class="inp" id="dist" maxlength="40" autocomplete="off" lang="${lang}" aria-label="${p.distPh}" placeholder="${p.distPh}" value="${esc(draft.district||'')}">
      <button class="btn pink mic" id="mic">${t.speak}</button><div id="msg" class="sub" role="status" aria-live="polite"></div>
      <button class="btn yes" id="nx">${p.next}</button><button class="btn ghost" id="sk">${p.skipQ}</button></div>`;
    const go=v=>{ v=(v||'').trim().slice(0,40); if(v) draft.district=v; else delete draft.district; pstep=3; profScreen(); };
    $('#nx').onclick=()=>go($('#dist').value); $('#sk').onclick=()=>go('');
    $('#mic').onclick = e => { e.currentTarget.classList.add('rec'); $('#msg').textContent=t.listening;
      listen(txt=>{ $('#dist').value=txt.split(' | ')[0]; $('#msg').textContent=''; }, m=>{ $('#msg').textContent=m; }, w=>{ $('#dist').value=w; }); };
    autoSay(p.distQ); return;
  }
  const i = pstep-3;
  if(i >= PQ.length){ return profSave(); }
  const q = PQ[i], qt = q.q[lang];
  const opts = q.o.map(o=>`<button class="btn pink" data-v="${o[0]}">${o[1]? o[1][lang] : (o[0]==='yes'? t.yes : t.no)}</button>`).join('');
  main.innerHTML = `<div class="card">${prog}<div class="big">${qt}</div>${listenBtn(qt)}${opts}<button class="btn ghost" id="sk">${p.skip}</button></div>`;
  const next=v=>{ if(v) draft[q.k]=v; else delete draft[q.k]; pstep++; profScreen(); };
  main.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>next(b.dataset.v)); $('#sk').onclick=()=>next(null);
  autoSay(qt);
}
function profSave(){
  profile = {...draft}; saveProfile(); dots(); screen({v:'saved'});
  const p = PU[lang];
  main.innerHTML = `<div class="card"><div class="emoji">✅</div><div class="big">${p.saved}</div><div class="ans" style="text-align:center">${profile.state? profLine() : '—'}</div>
    <button class="btn yes" id="ok">${p.forYou}</button></div>`;
  $('#ok').onclick = home; autoSay(p.saved);
}

const FUZZ_SKIP=new Set(['free','your','every','month','book','learn','join','with','from','that','this','money','help','need']);
function fuzzyScheme(txt){
  const low = txt.toLowerCase(); let best = null, score = 0;
  S.forEach(x=>{
    const words = String(x.name[lang]||'').toLowerCase().split(/[\s,()\/:–-]+/).filter(w=>w.length>=4 && !FUZZ_SKIP.has(w));
    const n = words.filter(w=>low.includes(w)).length;
    if(n>score){ score = n; best = x; }
  });
  return best;
}
async function route(txt){
  // specific services are matched before broad ones ("daughter", "bank", "gas")
  const specific = x => x.stateOnly || ['balance','widow','scholarship','shg','ujjwala'].includes(x.id);
  let s = [...S.filter(specific), ...S.filter(x=>!specific(x))].find(s=>s.kw.test(txt)) || fuzzyScheme(txt);
  if(!s && API.ai){
    try{ const r = await api('/api/route',{q:txt.split(' | ')[0].slice(0,300), services:S.map(x=>({id:x.id,hint:x.name.en.slice(0,120)}))}); s = S.find(x=>x.id===r.id); }catch(e){}
  }
  if(s) open(s.id); else { $('#msg').textContent = T().notfound; autoSay(T().notfound); }
}

function open(id){ cur = S.find(s=>s.id===id); step = 0; eligible = true; flow(); }

function flow(){
  dots();
  const t = T(), s = cur, n = s.qs.length;
  if(step >= n){ return result(); }
  screen({v:'q',id:s.id,step});
  const q = s.qs[step][lang];
  main.innerHTML = `<div class="card"><div class="emoji">${s.e}</div>
    ${step===0?`<div class="sub"><b>${s.name[lang]}</b></div><div class="sub">${s.d[lang]}</div>`:''}
    <div class="big">${q}</div>${listenBtn(q)}
    <div class="row"><button class="btn yes" id="y">✅ ${t.yes}</button><button class="btn no" id="n">❌ ${t.no}</button></div>
    <button class="btn pink mic" id="mic">${t.speak}</button><div id="msg" class="sub" role="status" aria-live="polite"></div>
    <button class="btn ghost" id="home">${t.home}</button></div>`;
  const want = !(s.qNo||[]).includes(step);   // the answer that keeps her eligible
  const answer = said => { if(said!==want){ eligible=false; return result(); } step++; flow(); };
  $('#y').onclick=()=>answer(true); $('#n').onclick=()=>answer(false); $('#home').onclick=home;
  $('#mic').onclick = e => { e.currentTarget.classList.add('rec'); $('#msg').textContent=t.listening;
    listen(txt=>{ if(t.yesRe.test(txt)&&!t.noRe.test(txt)) answer(true); else if(t.noRe.test(txt)) answer(false); else $('#msg').textContent=t.noheard; },
           m=>{ $('#msg').textContent=m; }); };
  autoSay((step===0 ? s.name[lang]+'. '+s.d[lang]+' ' : '') + q);
}

function callsHtml(s){
  return s.calls.map(c=>`<a class="btn ghost call" href="tel:${encodeURIComponent(c[1])}"><span>📞 ${lbl(c[0])}</span><span>${c[1]}</span></a>`).join('');
}

function shareText(s){
  const t = T(), origin = /^https?:/.test(location.origin) ? location.origin : '';
  return [t.shareHead+': '+s.name[lang], '', t.docsL+':', ...s.docs.map(d=>'• '+d[1][lang]), '', s.where[lang], '', s.info[lang], '', ...s.calls.map(c=>lbl(c[0])+': '+c[1]), ...(s.links||[]).map(l=>l[1]), ...(origin?['',origin]:[])].join('\n');
}
const waUrl = s => 'https://wa.me/?text=' + encodeURIComponent(shareText(s));

/** One short instruction per screen: what to carry, each step of "where to go", then the important note. */
function stepsOf(s){
  const w = s.where[lang];
  const parts = /\d\)/.test(w) ? w.split(/\s*\d\)\s*/).filter(Boolean) : w.split(/(?<=[.।!?])\s+/).filter(Boolean);
  return [T().docsL+': '+s.docs.map(d=>d[1][lang]).join(', '), ...parts, s.info[lang]];
}
function stepScreen(i){
  const t = T(), list = stepsOf(cur); i = Math.max(0, Math.min(i, list.length-1)); const txt = list[i];
  screen({v:'steps',id:cur.id,i});
  main.innerHTML = `<div class="card"><div class="over">${t.stepOf} ${i+1} / ${list.length}</div><div class="big">${esc(txt)}</div>${listenBtn(txt)}
    <div class="row">${i>0 ? `<button class="btn ghost" id="sp">${t.back}</button>` : '<span></span>'}${i<list.length-1 ? `<button class="btn pink" id="sn">${t.nextS}</button>` : `<button class="btn yes" id="sd">${PU[lang].done}</button>`}</div>
    <button class="btn ghost" id="sb">${t.home}</button></div>`;
  if($('#sp')) $('#sp').onclick = ()=>stepScreen(i-1);
  if($('#sn')) $('#sn').onclick = ()=>stepScreen(i+1);
  if($('#sd')) $('#sd').onclick = result;
  $('#sb').onclick = home;
  say(txt);   // she asked to be read to, so speak even if the voice toggle is off
}

function linksHtml(s){
  const L = s.links || []; if(!L.length) return '';
  return `<div class="sub" style="margin-top:14px"><b>🌐 ${T().site}</b></div><div class="ans" style="margin-top:6px">${T().siteNote}</div>`
    + L.map(l=>`<a class="btn site" href="${l[1]}" target="_blank" rel="noopener noreferrer">🌐 ${T().siteBtn}<small>${esc(l[0])}</small></a>`).join('');
}

function result(){
  dots();
  const t = T(), s = cur;
  screen({v:'res',id:s.id,ok:eligible});
  if(!eligible){
    main.innerHTML = `<div class="card"><div class="emoji">🙏</div><div class="big">${t.noT}</div>${listenBtn(t.noV)}
      <button class="btn pink" id="home">${t.home}</button>${callsHtml(s)}</div>`;
    $('#home').onclick = home; autoSay(t.noV); return;
  }
  const docsTxt = s.docs.map(d=>d[1][lang]).join(', ');
  const full = (s.qs.length? t.okV+' ':'') + s.name[lang]+'. '+t.docsL+': '+docsTxt+'. '+s.where[lang]+' '+s.info[lang];
  main.innerHTML = `<div class="card"><div class="emoji">${s.e}</div><div class="big">${s.qs.length? t.okT : t.stepsT}</div><div class="sub"><b>${s.name[lang]}</b></div>
    ${listenBtn(full)}
    <div class="sub"><b>${t.docsT}</b></div>
    <ul class="list">${s.docs.map(d=>`<li><span class="i">${d[0]}</span>${d[1][lang]}</li>`).join('')}</ul>
    <div class="sub"><b>${t.whereT}</b></div><div class="ans">${s.where[lang]}</div>
    <div class="sub" style="margin-top:14px"><b>${t.infoT}</b></div><div class="ans">${s.info[lang]}</div>
    ${callsHtml(s)}
    ${linksHtml(s)}
    <a class="btn yes" id="wa" href="${waUrl(s)}" target="_blank" rel="noopener noreferrer">📤 ${t.share}</a>
    <button class="btn ghost" id="steps">🔊 ${t.stepBtn}</button>
    <button class="btn pink" id="ask">${t.ask}</button>
    <button class="btn ghost" id="home">${t.home}</button></div>`;
  $('#ask').onclick = askScreen; $('#home').onclick = home; $('#steps').onclick = ()=>stepScreen(0);
  autoSay(full);
}

// ============ Ask a question about the current scheme ============
function askScreen(){
  const t = T(); screen({v:'ask',id:cur.id});
  main.innerHTML = `<div class="card"><div class="emoji">🎤</div><div class="big">${t.askT}</div>
    <button class="btn pink mic" id="mic">${t.speak}</button><div id="msg" class="sub" role="status" aria-live="polite"></div><div id="out" aria-live="polite"></div>
    <button class="btn ghost" id="back">${t.back}</button></div>`;
  $('#back').onclick = result;
  $('#mic').onclick = e => { e.currentTarget.classList.add('rec'); $('#msg').textContent=t.listening;
    listen(async q=>{ $('#msg').textContent='“'+q.split(' | ')[0]+'”'; await respond(q.split(' | ')[0]); }, m=>{ $('#msg').textContent=m; autoSay(m); }, w=>{ $('#msg').textContent='“'+w+'”'; }); };
  autoSay(t.askV);
}
async function respond(q){
  const t = T(), s = cur; $('#out').innerHTML = `<div class="ans">${t.thinking}</div>`;
  let a = null;
  if(API.ai){ try{ a = (await api('/api/ask',{q:q.slice(0,300), lang, facts:s.f})).answer; }catch(e){ a = null; } }
  if(!a){
    if(t.docRe.test(q)) a = s.docs.map(d=>d[1][lang]).join(', ');
    else if(t.whereRe.test(q)) a = s.where[lang];
    else if(t.moneyRe.test(q)) a = s.info[lang];
    else a = t.fb + ' ' + s.calls[0][1];
  }
  $('#out').innerHTML = `<div class="ans">${a.replace(/</g,'&lt;')}</div>`; say(a);
}

// ============ Large text (for a helper or weak eyesight) ============
let big = store.get('big')==='1';
function paintBig(){
  document.documentElement.classList.toggle('big', big);
  const b = $('#bt'); b.setAttribute('aria-pressed', String(big)); b.setAttribute('aria-label', T().bigOn); b.title = T().bigOn;
}
$('#bt').onclick = () => { big = !big; store.set('big', big?'1':'0'); paintBig(); };

// ============ Install to home screen (Chrome/Edge/Android) ============
let installEvt = null;
addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; const b=$('#inst'); b.hidden = false; b.textContent = T().install; });
$('#inst').onclick = async () => { if(!installEvt) return; installEvt.prompt(); try{ await installEvt.userChoice; }catch(e){} installEvt = null; $('#inst').hidden = true; };
if('serviceWorker' in navigator && /^https?:/.test(location.protocol)) navigator.serviceWorker.register('/sw.js').catch(()=>{});

// ============ Wiring ============
$('#vt').onclick = toggleVoice;
document.querySelectorAll('.lang[data-l]').forEach(b=>b.onclick=()=>chooseLang(b.dataset.l));
const more = $('#more');
more.innerHTML = '<option value="">'+esc(T().moreL)+'</option>' + EXTRA.map(e=>`<option value="${e[0]}">${e[1]}</option>`).join('');
more.onchange = () => { if(more.value) chooseLang(more.value); };
paintBig();
// A returning user goes straight to the home screen in her language; the header still lets her change it.
const sl = store.get('lang'); if(sl&&U[sl]){ setLang(sl); home(); } else { setLang('hi'); langScreen(); }
fetch('/api/health').then(r=>r.ok?r.json():null).then(j=>{
  API.ai = !!(j && j.ai); more.hidden = !API.ai;
  if(!API.ai) return;
  if(main.querySelector('.tile[data-l]')) langScreen();
  if(sl && EXTRA.some(e=>e[0]===sl) && main.querySelector('.tile[data-l]')) chooseLang(sl);
}).catch(()=>{ more.hidden = true; });
iconify(document.getElementById('app'));
