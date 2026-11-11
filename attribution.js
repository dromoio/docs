/**
 * Signup attribution for developer.dromo.io. Mintlify includes every .js file in the docs root
 * on every page.
 *
 * 1. Loads the HubSpot tracking code, so docs visits count as page views on the contact.
 * 2. Sets the first-/last-touch cookies (dromo_ft / dromo_lt) on .dromo.io, client-side. dromo.io
 *    sets them in a Netlify edge function; Mintlify has no server hook, so this mirrors those rules
 *    (new-website: netlify/attribution-cookies.js). The dashboard reads them at signup.
 *
 * Nothing here runs when the visitor declined analytics in dromo.io's cookie banner (cc_cookie,
 * readable on this subdomain); no recorded choice is not a decline.
 *
 * GA4 comes from the dromo.io GTM container, configured under `integrations.gtm` in docs.json.
 */
(function () {
  if (window.__dromoAttributionLoaded) return;
  window.__dromoAttributionLoaded = true;

  function analyticsDeclined() {
    var match = document.cookie.match(/(?:^|; )cc_cookie=([^;]*)/);
    if (!match) return false;
    var candidates = [match[1]];
    try {
      candidates.push(decodeURIComponent(match[1]));
    } catch (e) {}
    for (var i = 0; i < candidates.length; i++) {
      try {
        var categories = JSON.parse(candidates[i]).categories;
        if (Array.isArray(categories)) return categories.indexOf("analytics") === -1;
      } catch (e) {}
    }
    // Unreadable choice: we can't show consent was given.
    return true;
  }

  if (analyticsDeclined()) return;

  // --- HubSpot tracking code -------------------------------------------------------------------
  if (!document.getElementById("hs-script-loader")) {
    var hs = document.createElement("script");
    hs.id = "hs-script-loader";
    hs.async = true;
    hs.defer = true;
    hs.src = "https://js.hs-scripts.com/44698404.js";
    document.head.appendChild(hs);
  }

  // --- First-/last-touch cookies ---------------------------------------------------------------
  var KEYS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "gclid",
    "gbraid",
    "wbraid",
    "gad_source",
    "msclkid",
    "li_fat_id",
    "fbclid",
  ];

  function isDromoHost(host) {
    return host === "dromo.io" || /\.dromo\.io$/.test(host);
  }

  try {
    var search = new URLSearchParams(window.location.search);
    var params = {};
    var hasParams = false;
    KEYS.forEach(function (key) {
      var value = search.get(key);
      if (value) {
        params[key] = value.slice(0, 200);
        hasParams = true;
      }
    });

    // Invite links carry utm_source=customer; they are not acquisition.
    if ((params.utm_source || "").toLowerCase() === "customer") return;

    var refHost = "";
    try {
      refHost = document.referrer ? new URL(document.referrer).hostname : "";
    } catch (e) {}
    var external = !!refHost && !isDromoHost(refHost);
    if (!hasParams && !external) return;

    var touch = Object.assign({}, params, { landing: window.location.pathname });
    if (refHost) touch.ref_host = refHost;
    touch.ts = new Date().toISOString();
    var value = encodeURIComponent(JSON.stringify(touch));

    var domain = isDromoHost(window.location.hostname) ? "; Domain=.dromo.io" : "";
    var attributes = domain + "; Path=/; Max-Age=15552000; Secure; SameSite=Lax";

    // Only a visit with new params replaces either cookie: a JS-set cookie is capped at 7 days
    // in Safari, so it must not overwrite the 180-day ones dromo.io sets server-side.
    if (hasParams) document.cookie = "dromo_lt=" + value + attributes;
    // Written once, never overwritten.
    if (!/(?:^|; )dromo_ft=/.test(document.cookie)) {
      document.cookie = "dromo_ft=" + value + attributes;
    }
  } catch (e) {
    // Attribution must never break the docs.
  }
})();
