import i18n from "i18next";
import {initReactI18next} from "react-i18next";

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: {
      "All days": "All days",
      "Home": "Home",
      "Add day": "Add day",
      "SW": "SW",
      "EN": "EN",
      "Sign out": "Sign out",
      "Amount in KG": "Amount in KG",
      "Repetitions": "Repetitions",
      "Save set": "Save set",
      "Discard set": "Discard set",
      "Add set": "Add set",
      "Click on a set for different actions": "Click on a set for different actions (soon, anyway ;))",
      "Save exercise": "Save exercise",
      "Discard exercise": "Discard exercise",
      "Open detailed view": "Open detailed view",
      "Add exercise": "Add exercise",
      "Location": "Location",
      "Muscle groups": "Muscle groups",
      "Start time": "Start time",
      "End time": "End time",
      "Edit": "Edit",
      "End day": "End day",
      "Delete": "Delete",
      "Click to": "Click to",
      "collapse": "collapse",
      "expand": "expand",
    }
  },
  sv: {
    translation: {
      "All days": "Alla dagar",
      "Home": "Hem",
      "Add day": "Ny dag",
      "SW": "SV",
      "EN": "EN",
      "Sign out": "Logga ut",
      "Amount in KG": "Vikt (kg)",
      "Repetitions": "Repetitioner",
      "Save set": "Spara set",
      "Discard set": "Avbryt",
      "Add set": "Nytt set",
      "Click on a set for different actions": "Tryck på ett set för olika aktioner (snart, iaf ;))",
      "Save exercise": "Spara övning",
      "Discard exercise": "Avbryt",
      "Open detailed view": "Öppna detaljvyn",
      "Add exercise": "Ny övning",
      "Location": "Plats",
      "Muscle groups": "Muskelgrupper",
      "Start time": "Starttid",
      "End time": "Sluttid",
      "Edit": "Redigera",
      "End day": "Avsluta dag",
      "Delete": "Ta bort",
      "Click to": "Klicka för att",
      "collapse": "stänga",
      "expand": "öppna",
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "sv",

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
