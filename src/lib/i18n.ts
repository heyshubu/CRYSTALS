export type Locale = "en" | "ne";

export const LOCALES: { value: Locale; label: string; nativeLabel: string }[] = [
  { value: "en", label: "English", nativeLabel: "English" },
  { value: "ne", label: "Nepali", nativeLabel: "नेपाली" },
];

/**
 * Flat key → string dictionary per locale.
 * `t()` falls back to English, then to the key itself, so missing
 * translations never render blank.
 */
export const TRANSLATIONS: Record<Locale, Record<string, string>> = {
  en: {
    // App name / roles
    "app.name": "Sanyukta",
    "app.coordinator": "Coordinator",
    "app.responder": "Responder",

    // Navbar
    "nav.map": "Map",
    "nav.safe": "I'm Safe",
    "nav.report": "Report",
    "nav.shelters": "Shelters",
    "nav.firstAid": "First Aid",
    "nav.signIn": "Sign In",
    "nav.logout": "Logout",
    "nav.dashboard": "Dashboard",
    "nav.admin": "Admin",

    // Dropdown sections
    "menu.theme": "Theme",
    "menu.language": "Language",
    "menu.font": "Font",
    "menu.dyslexiaFont": "Dyslexia-Friendly Font",
    "menu.dyslexiaDesc": "OpenDyslexic with wider spacing",
    "menu.on": "ON",
    "menu.off": "OFF",

    // Theme options
    "theme.normal": "Normal Vision",
    "theme.normalDesc": "Standard color palette",
    "theme.deuteranomaly": "Deuteranomaly",
    "theme.deuteranomalyDesc": "Reduced green sensitivity (most common)",
    "theme.protanomaly": "Protanomaly",
    "theme.protanomalyDesc": "Reduced red sensitivity",
    "theme.deuteranopia": "Deuteranopia",
    "theme.deuteranopiaDesc": "No green cones — greens look beige",
    "theme.protanopia": "Protanopia",
    "theme.protanopiaDesc": "No red cones — reds look black/brown",

    // Map page
    "map.hotline": "Emergency Hotline: 100",
    "map.safeTitle": "I'm Safe",
    "map.safeDesc": "Check in and let others know your status",
    "map.reportTitle": "Report Need",
    "map.reportDesc": "Report food, water, medical, or shelter needs",
    "map.sheltersTitle": "Find Shelters",
    "map.sheltersDesc": "View shelter locations and occupancy",

    // Emergency alerts
    "alert.active": "Active Alert",
    "alert.activePlural": "Active Alerts",
    "alert.urgent": "URGENT",
    "alert.floodTitle": "⚠️ Flood Warning — Gorkha Region",
    "alert.floodMsg":
      "Heavy rainfall expected in Gorkha and surrounding districts over the next 48 hours. Relief routes through Trishuli may be affected. Stay alert and move to higher ground if near river banks.",
    "alert.quakeTitle": "🔵 Aftershock Advisory — Sindhupalchok",
    "alert.quakeMsg":
      "Minor aftershocks (3.2-4.1 magnitude) recorded in the past 24 hours. Check structural integrity of buildings before re-entering. Report any damage through the Report Need page.",
  },

  ne: {
    // App name / roles
    "app.name": "सन्युक्ता",
    "app.coordinator": "संयोजक",
    "app.responder": "प्रतिक्रियाकर्ता",

    // Navbar
    "nav.map": "नक्सा",
    "nav.safe": "म सुरक्षित छु",
    "nav.report": "रिपोर्ट",
    "nav.shelters": "आश्रयहरू",
    "nav.firstAid": "प्राथमिक उपचार",
    "nav.signIn": "साइन इन",
    "nav.logout": "लगआउट",
    "nav.dashboard": "ड्यासबोर्ड",
    "nav.admin": "प्रशासक",

    // Dropdown sections
    "menu.theme": "थीम",
    "menu.language": "भाषा",
    "menu.font": "फन्ट",
    "menu.dyslexiaFont": "डिस्लेक्सिया-मैत्री फन्ट",
    "menu.dyslexiaDesc": "फराकिलो अक्षर भएको OpenDyslexic",
    "menu.on": "खुल्ला",
    "menu.off": "बन्द",

    // Theme options
    "theme.normal": "सामान्य दृष्टि",
    "theme.normalDesc": "मानक रङ प्यालेट",
    "theme.deuteranomaly": "ड्युटेरानोमाली",
    "theme.deuteranomalyDesc": "हरियो रङ प्रति कम संवेदनशीलता (सबैभन्दा सामान्य)",
    "theme.protanomaly": "प्रोटानोमाली",
    "theme.protanomalyDesc": "रातो रङ प्रति कम संवेदनशीलता",
    "theme.deuteranopia": "ड्युटेरानोपिया",
    "theme.deuteranopiaDesc": "हरियो रङ देखिँदैन — खैरो जस्तो देखिन्छ",
    "theme.protanopia": "प्रोटानोपिया",
    "theme.protanopiaDesc": "रातो रङ देखिँदैन — कालो/खैरो जस्तो देखिन्छ",

    // Map page
    "map.hotline": "आपतकालीन हटलाइन: १००",
    "map.safeTitle": "म सुरक्षित छु",
    "map.safeDesc": "चेक इन गर्नुहोस् र अरूलाई आफ्नो स्थिति थाहा दिनुहोस्",
    "map.reportTitle": "आवश्यकता रिपोर्ट",
    "map.reportDesc": "खाना, पानी, चिकित्सा वा आश्रयको आवश्यकता रिपोर्ट गर्नुहोस्",
    "map.sheltersTitle": "आश्रय खोज्नुहोस्",
    "map.sheltersDesc": "आश्रय स्थानहरू र अवस्था हेर्नुहोस्",

    // Emergency alerts
    "alert.active": "सक्रिय सतर्कता",
    "alert.activePlural": "सक्रिय सतर्कताहरू",
    "alert.urgent": "अत्यावश्यक",
    "alert.floodTitle": "⚠️ बाढी चेतावनी — गोरखा क्षेत्र",
    "alert.floodMsg":
      "४८ घण्टाभित्र गोरखा र छिमेकी जिल्लाहरूमा भारी वर्षाको अपेक्षा छ। त्रिशूली हुने राहत मार्गहरू प्रभावित हुन सक्छन्। नदी किनार नजिक हुनुहुन्छ भने सतर्क रहनुहोस् र सुरक्षित उच्च स्थानमा जानुहोस्।",
    "alert.quakeTitle": "🔵 पराकम्पन सूचना — सिन्धुपाल्चोक",
    "alert.quakeMsg":
      "विगत २४ घण्टामा साना पराकम्पनहरू (३.२-४.१ परिमाण) महसुस गरियो। घरभित्र पुन: प्रवेश गर्नुअघि संरचनाको अवस्था जाँच्नुहोस्। क्षति भएको भए रिपोर्ट पृष्ठबाट जानकारी दिनुहोस्।",
  },
};
