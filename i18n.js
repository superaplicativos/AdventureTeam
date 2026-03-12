(function(){
  const supported = ['pt','en','de','es','it','fr','ja'];
  const localeMap = {pt:'pt-BR',en:'en-US',de:'de-DE',es:'es-ES',it:'it-IT',fr:'fr-FR',ja:'ja-JP'};
  const labels = {
    nav: {pt:'PT',en:'EN',de:'DE',es:'ES',it:'IT',fr:'FR',ja:'JP'},
    mobile: {pt:'PT-BR',en:'EN',de:'DE',es:'ES',it:'IT',fr:'FR',ja:'JP'},
    footer: {pt:'PT',en:'EN',de:'DE',es:'ES',it:'IT',fr:'FR',ja:'JP'}
  };

  function norm(value){
    if(!value) return 'pt';
    const v = String(value).toLowerCase();
    if(v.startsWith('pt')) return 'pt';
    if(v.startsWith('en')) return 'en';
    if(v.startsWith('de')) return 'de';
    if(v.startsWith('es')) return 'es';
    if(v.startsWith('it')) return 'it';
    if(v.startsWith('fr')) return 'fr';
    if(v.startsWith('ja')) return 'ja';
    return 'pt';
  }

  function detectLanguage(){
    const saved = localStorage.getItem('site_lang');
    if(saved && supported.includes(saved)) return saved;
    const list = Array.isArray(navigator.languages) && navigator.languages.length ? navigator.languages : [navigator.language || 'pt-BR'];
    for(const item of list){
      const lang = norm(item);
      if(supported.includes(lang)) return lang;
    }
    return 'pt';
  }

  function renderLanguageLinks(){
    const nav = document.querySelectorAll('.nav-langs');
    nav.forEach(container=>{
      container.innerHTML = supported.map(lang=>`<a href="#" data-lang-switch="1" data-lang="${lang}">${labels.nav[lang]}</a>`).join('');
    });
    const mobile = document.querySelectorAll('.mobile-langs');
    mobile.forEach(container=>{
      container.innerHTML = supported.map(lang=>`<a href="#" data-lang-switch="1" data-lang="${lang}">${labels.mobile[lang]}</a>`).join('');
    });
    const footer = document.querySelectorAll('.footer-bottom-langs');
    footer.forEach(container=>{
      container.innerHTML = supported.map(lang=>`<a href="#" data-lang-switch="1" data-lang="${lang}">${labels.footer[lang]}</a>`).join('');
    });
  }

  function setActive(lang){
    document.querySelectorAll('[data-lang-switch]').forEach(el=>{
      if(el.getAttribute('data-lang') === lang) el.classList.add('on');
      else el.classList.remove('on');
    });
    document.documentElement.lang = localeMap[lang] || 'pt-BR';
  }

  function applyLanguage(lang, persist){
    const valid = supported.includes(lang) ? lang : 'pt';
    if(persist !== false) localStorage.setItem('site_lang', valid);
    setActive(valid);
    if(typeof window.applyPageTranslations === 'function'){
      window.applyPageTranslations(valid);
    }
  }

  function bindSwitch(){
    document.addEventListener('click', (event)=>{
      const link = event.target.closest('[data-lang-switch]');
      if(!link) return;
      event.preventDefault();
      applyLanguage(link.getAttribute('data-lang'));
    });
  }

  function init(){
    renderLanguageLinks();
    bindSwitch();
    const lang = detectLanguage();
    applyLanguage(lang, false);
    window.siteI18n = {
      setLanguage: (lang)=>applyLanguage(lang, true),
      getLanguage: ()=>localStorage.getItem('site_lang') || lang,
      applyCurrentLanguage: ()=>applyLanguage(localStorage.getItem('site_lang') || lang, false)
    };
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
