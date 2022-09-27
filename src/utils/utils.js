function setUILanguage(me, lang="en") {
  try {
    if (me.$root.$i18n) {
      me.$root.$i18n.locale = lang;
    } else {
      console.log("this.$root.$i18n not found");
    }
  } catch (err) {
    console.log("setUILanguage", err);
  }
}

export { setUILanguage };
