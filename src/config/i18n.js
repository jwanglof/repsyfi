import i18n from "i18next";
import {initReactI18next} from "react-i18next";

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: {
      "All days": "All days",
      "Home": "Home",
      "Add new day": "Add new day",
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
      "Feeling": "Feeling",
      "Discard exercise": "Discard exercise",
      "Open detailed view": "Open detailed view",
      "Add exercise": "Add exercise",
      "Exercise": "Exercise",
      "Workout location": "Workout location",
      "Muscle groups": "Muscle groups",
      "Title": "Title",
      "Start time": "Start time",
      "End time": "End time",
      "Edit day": "Edit day",
      "End day": "End day",
      "Delete day": "Delete day",
      "Click to": "Click to",
      "collapse": "collapse",
      "expand": "expand",
      "Amount must be 0 or higher": "Amount must be 0 or higher",
      "Repetitions must be higher than 1": "Repetitions must be higher than 1",
      "Index must be higher than 1": "Index must be higher than 1",
      "Save new day": "Save new day",
      "Start date": "Start date",
      "End date": "End date",
      "must be set": "must be set",
      "Update day": "Update day",
      "Save": "Save",
      "Discard": "Discard",
      "Title can't be empty": "Title can't be empty",
      "Delete": "Delete",
      "to edit": "to edit",
      "Welcome to your": "Welcome to your",
      "exercise diary": "exercise diary",
      "This application will help you to": "This application will help you to",
      "Track your sets and repetitions": "Track your sets and repetitions",
      "Track your cardio machines": "Track your cardio machines",
      "See how long you've been exercising": "See how long you've been exercising",
      "Exercise type": "Exercise type",
      "Sets and reps": "Sets and reps",
      "Time and distance": "Time and distance"
    }
  },
  sv: {
    translation: {
      "All days": "Alla dagar",
      "Home": "Hem",
      "Add new day": "Lägg till ny dag",
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
      "Feeling": "Känsla",
      "Discard exercise": "Avbryt",
      "Open detailed view": "Öppna detaljvyn",
      "Add exercise": "Ny övning",
      "Exercise": "Övning",
      "Workout location": "Träningslokal",
      "Muscle groups": "Muskelgrupper",
      "Title": "Titel",
      "Start time": "Starttid",
      "End time": "Sluttid",
      "Edit day": "Redigera dag",
      "End day": "Avsluta dag",
      "Delete day": "Ta bort dag",
      "Click to": "Klicka för att",
      "collapse": "fälla ihop",
      "expand": "veckla ut",
      "Amount must be 0 or higher": "Vikten måste vara 0 eller högre",
      "Repetitions must be higher than 1": "Repetitioner måste vara högre än 1",
      "Index must be higher than 1": "Index måste vara högre än 1",
      "Save new day": "Lägg till ny dag",
      "Start date": "Startdatum",
      "End date": "Slutdatum",
      "must be set": "måste finnas",
      "Update day": "Uppdatera dag",
      "Save": "Spara",
      "Discard": "Avbryt",
      "Title can't be empty": "Titel kan inte vara tom",
      "Delete": "Ta bort",
      "to edit": "för att redigera",
      "Welcome to your": "Välkommen till din",
      "exercise diary": "träningsdagbok",
      "This application will help you to": "Denna applikation hjälper dig att",
      "Track your sets and repetitions": "Hålla koll på dina set och repetitioner",
      "Track your cardio machines": "Hålla koll på dina flåsmaskiner",
      "See how long you've been exercising": "Se hur länge du har tränat",
      "Exercise type": "Övningstyp",
      "Sets and reps": "Set och repetitioner",
      "Time and distance": "Flås"
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
