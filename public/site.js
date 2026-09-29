/* Scripts présents sur toutes les pages du site d'origine.
   Le bandeau de consentement, qui figurait aussi ici, vit dans consentement.js. */

(function(){
  var MOTIFS = ['thomasgio.fr', 'am_id=bene'];
  var REL = 'sponsored nofollow noopener';
  function marquer(){
    var liens = document.querySelectorAll('a[href]');
    for (var i = 0; i < liens.length; i++){
      var a = liens[i];
      var h = a.getAttribute('href') || '';
      var cible = false;
      for (var j = 0; j < MOTIFS.length; j++){
        if (h.indexOf(MOTIFS[j]) !== -1) { cible = true; break; }
      }
      if (!cible) continue;
      if (a.getAttribute('rel') === REL) continue;
      a.setAttribute('rel', REL);
      if (!a.getAttribute('target')) a.setAttribute('target', '_blank');
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', marquer);
  } else {
    marquer();
  }
  if (window.MutationObserver) {
    new MutationObserver(marquer).observe(document.documentElement, { childList: true, subtree: true });
  }
})();

/* Le quiz Tiquiz annonce sa hauteur par message : on la reporte sur le cadre.
   Le cadre est chargé paresseusement, donc toujours après ce script. */
(function () {
  var cadres = document.querySelectorAll('iframe[data-tiquiz]')
  if (!cadres.length) return

  window.addEventListener('message', function (e) {
    if (!e.data) return
    for (var i = 0; i < cadres.length; i++) {
      if (e.source !== cadres[i].contentWindow) continue
      if (e.data.type === 'tiquiz-embed-hello') {
        cadres[i].contentWindow.postMessage({ type: 'tiquiz-embed-ack' }, '*')
      } else if (e.data.type === 'tiquiz-embed-height' && e.data.height) {
        cadres[i].style.height = e.data.height + 'px'
      }
    }
  })

  // Si le bonjour du cadre arrive avant l'écoute, il reste sans réponse :
  // on confirme aussi dès que le cadre a fini de charger.
  for (var i = 0; i < cadres.length; i++) {
    cadres[i].addEventListener('load', function () {
      try { this.contentWindow.postMessage({ type: 'tiquiz-embed-ack' }, '*') } catch (e) {}
    })
  }
})()
