import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
    .use(LanguageDetector)
    .use({
        type: "backend",
        read(
            language: string,
            namespace: string,
            callback: (errorValue: unknown, ret: unknown) => void
        ) {
            import(`./locales/${language}/${namespace}.json`)
                .then((resources) => callback(null, resources.default || resources))
                .catch((error) => callback(error, null));
        },
    })
    .use(initReactI18next)
    .init({
        fallbackLng: {
            default: ["en"],
        },
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ["navigator"],
            caches: [],
        },
    })
    .catch(console.error);

export default i18n;