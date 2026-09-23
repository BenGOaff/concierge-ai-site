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
