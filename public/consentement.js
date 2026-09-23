/* Bandeau de consentement et mesure d'audience.
   Repris du code qui tournait sur Systeme.io, à une différence près :
   Google Analytics n'est plus chargé avant le choix du visiteur. */
(function(){
  'use strict';
  if (window.__CAI_COOKIES__) return;
  window.__CAI_COOKIES__ = true;

  var CFG = { ga: 'G-BP8TYV5L0C', memoire: 182, page: '/politique-de-cookies/' };
  var CLE = 'cai_consent_v1';
  var etat = null;

  function lire(){
    try{
      var o = JSON.parse(localStorage.getItem(CLE));
      if (!o || !o.t) return null;
      if (Date.now() - o.t > CFG.memoire * 864e5) return null;
      return o;
    }catch(e){ return null; }
  }
  function ecrire(o){
    o.t = Date.now();
    etat = o;
    try{ localStorage.setItem(CLE, JSON.stringify(o)); }catch(e){}
  }
  etat = lire();

  var RX = /(youtube\.com|youtube-nocookie\.com|youtu\.be|player\.vimeo\.com|dailymotion\.com)/i;
  var bloquees = [];
  function videoOk(){ return !!(etat && etat.video); }

  function bloquer(f, src){
    if (f.__cai || !src || !RX.test(src)) return false;
    f.__cai = true;
    f.setAttribute('data-cai-src', src);
    f.style.display = 'none';
    bloquees.push(f);
    return true;
  }

  try{
    var proto = HTMLIFrameElement.prototype;
    var d = Object.getOwnPropertyDescriptor(proto, 'src');
    if (d && d.set){
      Object.defineProperty(proto, 'src', {
        configurable: true,
        enumerable: d.enumerable,
        get: function(){ var g = this.getAttribute('data-cai-src'); return g ? g : d.get.call(this); },
        set: function(v){
          if (!videoOk() && v && RX.test(String(v))){ bloquer(this, String(v)); return; }
          d.set.call(this, v);
        }
      });
      var mettre = proto.setAttribute;
      proto.setAttribute = function(n, v){
        if (String(n).toLowerCase() === 'src' && !videoOk() && v && RX.test(String(v))){ bloquer(this, String(v)); return; }
        return mettre.call(this, n, v);
      };
      window.__caiRendre = function(f, s){ d.set.call(f, s); };
    }
  }catch(e){}

  function neutraliser(f){
    if (videoOk() || f.__cai) return;
    var src = f.getAttribute('src') || f.getAttribute('data-src') || '';
    if (!bloquer(f, src)) return;
    try{ f.removeAttribute('src'); }catch(e){}
  }

  function balayer(n){
    if (!n || n.nodeType !== 1) return;
    if (n.tagName === 'IFRAME') neutraliser(n);
    else if (n.querySelectorAll){
      var l = n.querySelectorAll('iframe');
      for (var i = 0; i < l.length; i++) neutraliser(l[i]);
    }
  }

  function poserCartes(){
    if (videoOk() || !document.body) return;
    for (var i = 0; i < bloquees.length; i++){
      var f = bloquees[i];
      if (f.__caiCarte || !f.parentNode) continue;
      f.__caiCarte = true;
      var src = f.getAttribute('data-cai-src') || '';
      var lien = src.indexOf('//') === 0 ? 'https:' + src : src;
      var c = document.createElement('div');
      c.className = 'cai-video-att';
      c.setAttribute('data-cai-carte', '1');
      c.innerHTML =
        '<strong>Cette vid&eacute;o attend votre accord</strong>' +
        '<p>Elle est h&eacute;berg&eacute;e par un service ext&eacute;rieur qui d&eacute;pose ses propres ' +
        'traceurs d&egrave;s son affichage. Elle ne se charge donc pas tant que vous ne l\'avez pas autoris&eacute;e.</p>' +
        '<button type="button" class="cai-ck-b oui" data-aqc="video">Afficher la vid&eacute;o</button> ' +
        '<a class="cai-ck-b lien" href="' + lien.replace(/"/g, '&quot;') +
        '" target="_blank" rel="noopener nofollow">Ouvrir dans un nouvel onglet</a>';
      f.parentNode.insertBefore(c, f);
    }
  }

  function libererVideos(){
    var cartes = document.querySelectorAll('[data-cai-carte]');
    for (var i = 0; i < cartes.length; i++) cartes[i].remove();
    for (var j = 0; j < bloquees.length; j++){
      var f = bloquees[j];
      var s = f.getAttribute('data-cai-src');
      if (!s) continue;
      f.removeAttribute('data-cai-src');
      f.style.display = '';
      if (window.__caiRendre) window.__caiRendre(f, s); else f.setAttribute('src', s);
    }
    bloquees = [];
  }

  balayer(document.documentElement);
  new MutationObserver(function(muts){
    for (var i = 0; i < muts.length; i++){
      var a = muts[i].addedNodes;
      for (var j = 0; j < a.length; j++) balayer(a[j]);
    }
    poserCartes();
  }).observe(document.documentElement, {childList:true, subtree:true});

  var pose = { mesure:false };
  function poserMesure(){
    if (pose.mesure || !CFG.ga) return;
    pose.mesure = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + CFG.ga;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', CFG.ga, { anonymize_ip:true, cookie_expires:15552000 });
  }

  function appliquer(){
    if (!etat) return;
    if (etat.mesure) poserMesure();
    if (etat.video) libererVideos();
  }

  var banniere = null, panneau = null, rendeur = null;
  function fermerBanniere(){ if (banniere){ banniere.remove(); banniere = null; } }
  function fermerPanneau(){
    if (panneau){ panneau.remove(); panneau = null; }
    if (rendeur && rendeur.focus){ try{ rendeur.focus(); }catch(e){} }
  }
  function enregistrer(o){ ecrire(o); fermerBanniere(); fermerPanneau(); appliquer(); }

  function montrerBanniere(){
    if (banniere || !document.body) return;
    banniere = document.createElement('div');
    banniere.id = 'cai-banniere';
    banniere.setAttribute('role', 'dialog');
    banniere.setAttribute('aria-label', 'Choix des cookies');
    banniere.innerHTML =
      '<h2>Un mot sur les cookies</h2>' +
      '<p>Ce site mesure son audience pour savoir quelles pages vous sont utiles, et peut afficher ' +
      'des vid&eacute;os h&eacute;berg&eacute;es par des services ext&eacute;rieurs. Rien de tout cela ne ' +
      'se d&eacute;clenche sans votre accord, et refuser ne vous prive d\'aucun contenu. ' +
      '<a href="' + CFG.page + '">Voir le d&eacute;tail</a>.</p>' +
      '<div class="cai-ck-actions">' +
        '<button type="button" class="cai-ck-b oui" data-aqc="tout">Tout accepter</button>' +
        '<button type="button" class="cai-ck-b" data-aqc="rien">Tout refuser</button>' +
        '<button type="button" class="cai-ck-b lien" data-aqc="choisir">Je choisis</button>' +
      '</div>';
    document.body.appendChild(banniere);
  }

  function montrerPanneau(){
    if (panneau || !document.body) return;
    rendeur = document.activeElement;
    var e = etat || {};
    panneau = document.createElement('div');
    panneau.id = 'cai-panneau';
    panneau.setAttribute('role', 'dialog');
    panneau.setAttribute('aria-modal', 'true');
    panneau.setAttribute('aria-label', 'Gerer mes cookies');
    panneau.innerHTML =
      '<div class="cai-ck-carte">' +
        '<h2>G&eacute;rer mes cookies</h2>' +
        '<p>Vous d&eacute;cidez cat&eacute;gorie par cat&eacute;gorie. Votre choix est conserv&eacute; ' +
        'six mois, et vous pouvez revenir ici quand vous voulez.</p>' +
        '<div class="cai-ck-ligne">' +
          '<div class="cai-ck-inter fige">' +
            '<input type="checkbox" id="cai-nec" checked disabled><label for="cai-nec"></label>' +
          '</div>' +
          '<div><h3>N&eacute;cessaires</h3><p>Faire fonctionner les pages, s&eacute;curiser la navigation ' +
          'et m&eacute;moriser ce choix. Sans eux, le site ne fonctionne plus.</p></div>' +
        '</div>' +
        '<div class="cai-ck-ligne">' +
          '<div class="cai-ck-inter">' +
            '<input type="checkbox" id="cai-mesure"' + (e.mesure ? ' checked' : '') + '><label for="cai-mesure"></label>' +
          '</div>' +
          '<div><h3>Mesure d\'audience</h3><p>Google Analytics, avec adresse IP anonymis&eacute;e. ' +
          'Savoir quelles pages sont lues et lesquelles sont abandonn&eacute;es, pour corriger ce qui ne va pas.</p></div>' +
        '</div>' +
        '<div class="cai-ck-ligne">' +
          '<div class="cai-ck-inter">' +
            '<input type="checkbox" id="cai-video"' + (e.video ? ' checked' : '') + '><label for="cai-video"></label>' +
          '</div>' +
          '<div><h3>Vid&eacute;os ext&eacute;rieures</h3><p>Les vid&eacute;os YouTube ou Vimeo int&eacute;gr&eacute;es ' +
          '&agrave; certains articles. Elles d&eacute;posent leurs propres traceurs d&egrave;s leur affichage.</p></div>' +
        '</div>' +
        '<div class="cai-ck-pied">' +
          '<button type="button" class="cai-ck-b oui" data-aqc="garder">Enregistrer mes choix</button>' +
          '<button type="button" class="cai-ck-b" data-aqc="tout">Tout accepter</button>' +
          '<button type="button" class="cai-ck-b lien" data-aqc="rien">Tout refuser</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(panneau);
    var carte = panneau.querySelector('.cai-ck-carte');
    if (carte){
      carte.setAttribute('tabindex', '-1');
      try{ carte.focus({preventScroll:true}); }catch(e){ carte.focus(); }
      carte.scrollTop = 0;
    }
  }

  document.addEventListener('click', function(ev){
    var c = ev.target && ev.target.closest ? ev.target.closest('[data-aqc]') : null;
    if (c){
      var q = c.getAttribute('data-aqc');
      if (q === 'tout'){ ev.preventDefault(); return enregistrer({mesure:true, video:true}); }
      if (q === 'rien'){ ev.preventDefault(); return enregistrer({mesure:false, video:false}); }
      if (q === 'choisir'){ ev.preventDefault(); fermerBanniere(); return montrerPanneau(); }
      if (q === 'video'){
        ev.preventDefault();
        var a = etat || {mesure:false};
        return enregistrer({mesure:!!a.mesure, video:true});
      }
      if (q === 'garder'){
        ev.preventDefault();
        var g = function(id){ var n = document.getElementById(id); return !!(n && n.checked); };
        return enregistrer({mesure:g('cai-mesure'), video:g('cai-video')});
      }
    }
    var l = ev.target && ev.target.closest ? ev.target.closest('a, button, [role="link"], .cai-cookies-link') : null;
    if (l && !l.hasAttribute('data-aqc')){
      var h = (l.getAttribute && l.getAttribute('href')) || '';
      var t = (l.textContent || '').trim().toLowerCase();
      if (t.normalize) t = t.normalize('NFD').replace(/[̀-ͯ]/g, '');
      if (h.indexOf('#cookies') !== -1 ||
          (l.className && String(l.className).indexOf('cai-cookies-link') !== -1) ||
          (t.length < 40 && t.indexOf('gerer mes cookies') !== -1)){
        ev.preventDefault();
        fermerBanniere();
        montrerPanneau();
      }
    }
  }, true);

  document.addEventListener('keydown', function(ev){
    if (ev.key === 'Escape' && panneau) fermerPanneau();
  });

  function demarrer(){
    balayer(document.body);
    poserCartes();
    appliquer();
    if ((location.hash || '').toLowerCase() === '#cookies'){ montrerPanneau(); return; }
    if (!etat) montrerBanniere();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer);
  else demarrer();

  window.caiCookies = {
    ouvrir: function(){ fermerBanniere(); montrerPanneau(); },
    etat: function(){ return etat; }
  };
})();
