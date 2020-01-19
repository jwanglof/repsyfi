import i18n from "i18next";
import {initReactI18next} from "react-i18next";

// the translations
// (tip move them in a JSON file and import them)
const resources = {
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
      "Click on a set for different actions": "Tryck på ett set för olika aktioner",
      "Save exercise": "Spara övning",
      "Feeling": "Känsla",
      "Discard exercise": "Avbryt",
      "Open detailed view": "Öppna detaljvyn",
      "Add exercise": "Ny övning",
      "Exercise name": "Övningsnamn",
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
      "Save new day": "Lägg till ny dag",
      "Start date": "Startdatum",
      "End date": "Slutdatum",
      "must be set": "måste finnas",
      "Update day": "Uppdatera dag",
      "Save": "Spara",
      "Discard": "Avbryt",
      "Abort": "Avbryt",
      "Delete": "Ta bort",
      "to edit/view": "för att redigera/visa",
      "Welcome to your": "Välkommen till din",
      "exercise diary": "träningsdagbok",
      "This application will help you to": "Denna applikation hjälper dig att",
      "Exercise type": "Övningstyp",
      "Sets with reps": "Set med repetitioner",
      "Time and distance": "Flås",
      "Notes": "Noteringar",
      "Stop timer": "Stoppa timern",
      "Start timer": "Starta timern",
      "Click again to delete!": "Klicka igen för att ta bort",
      "Edit": "Redigera",
      "Exercise time": "Träningstid",
      "Warm-up time": "Uppvärmningstid",
      "Distance (meters)": "Distans (i meter)",
      "Kcal": "Kcal",
      "Speed min": "Hastighet, lägst",
      "Speed max": "Hastighet, högst",
      "Incline min": "Lutning, minst",
      "Incline max": "Lutning, störst",
      "Actions": "Aktioner",
      "name": "namn",
      "exercise": "övning",
      "No exercises added": "Inga övningar tillagda",
      "Sets with seconds": "Set med sekunder",
      "Seconds": "Sekunder",
      "Exercise questionnaire": "Övningsformulär",
      "questionnaire": "formulär",
      "How did the workout feel?": "Hur kändes träningspasset?",
      "Worst": "Sämst",
      "Bad": "Dåligt",
      "Neutral": "Lagom",
      "Good": "Bra",
      "God-like": "Bäst",
      "Did you stretch?": "Stretcha du?",
      "How long did you stretch?": "Hur länge stretcha du?",
      "Total stretch time": "Total stretchtid",
      "Yes": "Ja",
      "No": "Nej",
      "(HH MM SS)": "(timme minut sekund)",
      "Update": "Uppdatera",
      "Part of super set": "Del av superset",
      "New super set": "Nytt superset",
      "Edit super set": "Redigera superset",
      "must exist, and be 0 or higher": "måste finnas, och vara 0 eller högre",
      "Amount": "Vikt",
      "can't be empty": "får inte vara tomt",

      // Features
      "Track your sets and repetitions": "Hålla koll på dina set och repetitioner",
      "Track your cardio machines": "Hålla koll på dina flåsmaskiner",
      "See how long you've been exercising": "Se hur länge du har tränat",
      "Know how long you ran last time": "Veta hur länge du sprang förra gången",
      "Know how long your rest has been": "Veta hur länge du har vilat",
      "Know what you lifted last time": "Veta vad du lyfte förra gången",
      "Know how fast you ran last time": "Veta hur snabbt du sprang förra gången",
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
