/**
 * Dromo Attribution Tracking Script
 * Tracks user interactions and attributes them to marketing campaigns
 */

var payload = {"identity": {},"event": "","type":"action","event_properties": {},"account_properties": {},"labels":["ux"]};
// window.tracked_account will be set dynamically after login - for anonymous visitors, it remains undefined
window.tracked_anon = '';

window.addEventListener("message", function(e) {
    if (e.origin !== "https://attribution.dromo.io") return;

    var message = "";
    try {
        message = JSON.parse(e.data)
    } catch (ex) {
        console.warn("Invalid JSON message received", e.data);
        return;
    }

    if (message !== "" && typeof message.uuid != "undefined" && message.uuid != '') {
        window.tracked_anon = message.uuid;
        innrCollectData();
        document.removeEventListener('click', innrCollectData);
        document.addEventListener('click', innrCollectData);
    }
});

// Mintlify may inject this script in <head>, before <body> exists.
function innrAppendVisitorFrame() {
    var iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = "https://attribution.dromo.io/get-visitor";
    document.body.appendChild(iframe);
}
if (document.body) {
    innrAppendVisitorFrame();
} else {
    document.addEventListener("DOMContentLoaded", innrAppendVisitorFrame);
}

function innrCollectData(customEvent=null,customProperties={}){setTimeout(function(){const hasValidAccount=typeof tracked_account==="object"&&tracked_account!==null&&typeof tracked_account.id==="string"&&tracked_account.id.trim()!=="";const hasValidAnon=typeof window.tracked_anon==="string"&&window.tracked_anon.trim()!=="";if(hasValidAccount||hasValidAnon){innrResetUserData(window.tracked_anon,window.tracked_account);if(customEvent&&typeof customEvent=="string"){let tempPayload={event:customEvent,event_properties:customProperties,identity:payload.identity,type:"action",labels:["ux"]};innrTrack(tempPayload)}else{const isPageURLMismatched=!payload?.event_properties?.pageURL||payload.event_properties.pageURL!==document.location.href;if(isPageURLMismatched){innrResetEventPropertiesData();payload.event="screen view";innrTrack(payload)}}}},100)}function innrResetUserData(anon_id,account){let accountData={};accountData.anon=anon_id;if(account&&account.id){accountData.account={id:account.id}}payload.identity=accountData;payload.account_properties=account?.account_properties||{}}function innrResetEventPropertiesData(){payload.event_properties={};payload.event_properties.pageURL=document.location.href;payload.event_properties.referrer=document.referrer;payload.event_properties.pagePath=document.location.pathname;payload.event_properties.hostName=document.location.hostname;payload.event_properties.utm_campaign=getCampaignParameter("utm_campaign");payload.event_properties.utm_medium=getCampaignParameter("utm_medium");payload.event_properties.utm_source=getCampaignParameter("utm_source");payload.event_properties.utm_term=getCampaignParameter("utm_term");payload.event_properties.utm_content=getCampaignParameter("utm_content");payload.event_properties.gclid=getCampaignParameter("gclid");payload.event_properties.msclkid=getCampaignParameter("msclkid");payload.event_properties.fbclid=getCampaignParameter("fbclid");payload.event_properties.li_fat_id=getCampaignParameter("li_fat_id");payload.event_properties.twclid=getCampaignParameter("twclid");payload.event_properties.rdt_cid=getCampaignParameter("rdt_cid");Object.keys(payload.event_properties).forEach(key=>{if(payload.event_properties[key]==="not-set"){delete payload.event_properties[key]}})}function getCampaignParameter(p){if(typeof p=="string"){if(document.location.search.indexOf(p)!=-1){let param=innrGetQueryVariable(p);return param?param.substring(0,110):"not-set"}else{return"not-set"}}else if(typeof p=="object"){var allQueriesParams=[];for(var i=0;i<p.length;i++){let param=innrGetQueryVariable(p[i]);if(param!==false)allQueriesParams.push(p[i]+"="+param.substring(0,110))}if(allQueriesParams.length>0)return allQueriesParams.join(",");else return"not-set"}}function innrGetQueryVariable(variable){var query=window.location.search.substring(1);var vars=query.split("&");for(var i=0;i<vars.length;i++){var pair=vars[i].split("=");if(pair[0]==variable){return decodeURIComponent(pair[1]||"")}}return false}function innrTrack(toSend){const data=JSON.stringify(toSend);const url="https://attribution.dromo.io/app_activity";if(navigator.sendBeacon){const blob=new Blob([data],{type:"text/plain"});navigator.sendBeacon(url,blob)}else{const transport=new Image;transport.src=`${url}?data=${encodeURIComponent(data)}`}}document.addEventListener("mousedown",function(e){let data_track_chain=[];let current_el=e.target;while(current_el){if(current_el.hasAttribute("data-track")){data_track_chain.unshift(current_el.getAttribute("data-track"))}current_el=current_el.parentElement}if(data_track_chain.length>0){let formatted_chain=data_track_chain.join(" > ");innrCollectData("click",{click_element:formatted_chain,pageURL:document.location.href})}});window.addEventListener("message",function(e){const isCalendly=e.origin==="https://calendly.com"||new URL(e.origin).hostname.endsWith(".calendly.com");if(e.data.event&&e.data.event.indexOf("calendly")===0&&isCalendly){let calendlyPayload={...e.data.payload||{},pageURL:document.location.href};innrCollectData(e.data.event,calendlyPayload)}});
