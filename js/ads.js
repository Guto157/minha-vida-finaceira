(function () {
  "use strict";

  const TEST_BANNER_ID = "ca-app-pub-3940256099942544/6300978111";
  const $ = (id) => document.getElementById(id);
  let started = false;

  async function startAds() {
    if (started) return;
    const capacitor = window.Capacitor;
    if (!capacitor || !capacitor.isNativePlatform || !capacitor.isNativePlatform()) return;

    const AdMob = capacitor.Plugins && capacitor.Plugins.AdMob;
    if (!AdMob) {
      console.warn("AdMob não está disponível nesta instalação.");
      return;
    }

    started = true;
    try {
      let consent = await AdMob.requestConsentInfo();
      if (consent && consent.isConsentFormAvailable && consent.status === "REQUIRED") {
        consent = await AdMob.showConsentForm();
      }
      if (consent && consent.canRequestAds === false) return;

      await AdMob.initialize();
      await AdMob.showBanner({
        adId: TEST_BANNER_ID,
        adSize: "ADAPTIVE_BANNER",
        position: "BOTTOM_CENTER",
        margin: 0
      });

      document.body.classList.add("has-native-ad");
    } catch (error) {
      started = false;
      console.error("Não foi possível carregar o banner:", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startAds, { once: true });
  } else {
    startAds();
  }

  window.addEventListener("pageshow", startAds);
})();
