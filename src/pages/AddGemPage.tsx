import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  Check,
  Crosshair,
  Hourglass,
  Languages,
  LocateFixed,
  MapPin,
  Plus,
  Search,
  Shield,
  WifiOff,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLang } from "@/features/shell/lang";
import { mockGemClient, type GemSubmission, type GemSubmissionClient } from "@/features/gems/client";
import { listSpotPins } from "@/features/gems/catalog";
import { dailyLimit, formatRetry, isTrustedAccount, retryInMs, sendsToday } from "@/features/gems/limits";
import { compressPhoto, PhotoTooLargeError, type CompressedPhoto } from "@/features/gems/photos";
import {
  NAME_MAX,
  PHOTO_MAX,
  STORY_MAX,
  STORY_MIN,
  formatMegabytes,
  altError,
  nameError,
  photoCountError,
  storyError,
  uploadTooLarge,
  type GemCategory,
} from "@/features/gems/validate";
import { nearestSpot, zoneAt } from "@/features/gems/zones";
import { copy as licenceMk } from "@/features/gems/licence-copy";
import { clearGemDraft, loadGemDraft, previewHarnessEnabled, saveGemDraft, type Season } from "@/features/gems/draft";

const SUBCATEGORIES: Record<GemCategory, Array<{ id: string; mk: string; en: string }>> = {
  nature: [
    { id: "lake", mk: "Езеро", en: "Lake" },
    { id: "waterfall", mk: "Водопад", en: "Waterfall" },
    { id: "viewpoint", mk: "Видиковец", en: "Viewpoint" },
    { id: "spring", mk: "Извор", en: "Spring" },
    { id: "cave", mk: "Пештера", en: "Cave" },
  ],
  food: [
    { id: "tavern", mk: "Кафана", en: "Tavern" },
    { id: "home-cooking", mk: "Домашна кујна", en: "Home cooking" },
  ],
  culture: [
    { id: "monastery", mk: "Манастир", en: "Monastery" },
    { id: "bazaar", mk: "Чаршија", en: "Bazaar" },
    { id: "village", mk: "Село", en: "Village" },
    { id: "craft", mk: "Занает", en: "Craft" },
  ],
  road: [
    { id: "pass", mk: "Превој", en: "Pass" },
    { id: "hairpin", mk: "Серпентини", en: "Hairpins" },
    { id: "track", mk: "Патека", en: "Track" },
  ],
};

const SEASONS: Array<{ id: Season; mk: string; en: string }> = [
  { id: "spring", mk: "Пролет", en: "Spring" },
  { id: "summer", mk: "Лето", en: "Summer" },
  { id: "autumn", mk: "Есен", en: "Autumn" },
  { id: "winter", mk: "Зима", en: "Winter" },
];

const CATEGORIES: Array<{ id: GemCategory; mk: string; en: string; hintMk: string; hintEn: string }> = [
  { id: "nature", mk: "Природа", en: "Nature", hintMk: "езера, водопади, видиковци, извори, пештери", hintEn: "lakes, waterfalls, viewpoints, springs, caves" },
  { id: "food", mk: "Храна", en: "Food", hintMk: "кафани, домашна кујна", hintEn: "taverns, home cooking" },
  { id: "culture", mk: "Култура", en: "Culture", hintMk: "манастири, чаршии, села, занаети", hintEn: "monasteries, bazaars, villages, crafts" },
  { id: "road", mk: "Пат", en: "Road", hintMk: "превои, серпентини, патеки", hintEn: "passes, hairpins, tracks" },
];

type Step = "location" | "details" | "photos" | "story" | "review";
const STEPS: Step[] = ["location", "details", "photos", "story", "review"];

const copy = {
  mk: {
    title: "Додај скриено место",
    step: (n: number) => `Чекор ${n} од 5`,
    close: "Затвори",
    back: "Назад",
    next: "Продолжи",
    signInTitle: "Најави се за да додадеш место",
    signInBody: "Предлозите се поврзани со твојот профил, за да можеме да те известиме кога местото ќе биде објавено и да те наведеме како автор.",
    signIn: "Најави се",
    signUp: "Направи профил",
    signHint: "Ти треба помалку од минута.",
    where: "Каде е местото?",
    whereLead: "Помести ја мапата додека иглата не застане точно на местото.",
    search: "Барај место или село…",
    locate: "Користи ја мојата локација",
    locateMe: "Моја локација",
    zoom: "Зумирај",
    locErrorTitle: "Не ја најдовме твојата локација",
    locErrorBody: "Дозволи пристап до локацијата во прелистувачот или помести ја мапата рачно.",
    protectedTitle: "Ова е во заштитено подрачје",
    protectedBody: (name: string) => `${name}. Можеш да продолжиш — вози само по означени патишта и почитувај ги правилата на паркот.`,
    blockedTitle: "Тука не може да се додаде место",
    blockedBody: (name: string) =>
      `Иглата е во строгиот природен резерват ${name}. Таму пристапот е дозволен само за научни истражувања, па не објавуваме места за посета. Помести ја иглата надвор од црвената зона.`,
    duplicateTitle: (meters: number) => `Слично место веќе постои на ${meters} м`,
    duplicateBody: "Провери дали е истото — можеш да додадеш фотографии таму наместо ново место.",
    open: "Отвори",
    duplicateHelp: "Проверката се прави во радиус од 150 м.",
    different: "Не, ова е друго место",
    what: "Кажи ни што е",
    whatLead: "Кратко име и категорија, за да го најдат другите возачи.",
    name: "Име на местото",
    namePlaceholder: "пр. Видиковец над Трпејца",
    nameError: "Внеси име (3–60 знаци).",
    category: "Категорија",
    categoryError: "Избери категорија.",
    fixTwo: "Поправи 2 полиња",
    fixTwoBody: "Името и категоријата се задолжителни.",
    photosTitle: "Додај фотографии",
    photosLead: "До 5 фотографии што ти си ги снимил. Првата е насловна.",
    add: "Додај",
    cover: "Насловна",
    photoHelp: "Од 1 до 5 фотографии, до 15 MB секоја (JPG, PNG, WebP, HEIC). Пред прикачување ги компресираме на твојот уред на најмногу 2 MB и ги бришеме GPS-податоците.",
    tooBig: (mb: string) => `Фотографијата е ${mb} MB — максимумот е 15 MB. Избери помала или исечи ја.`,
    needPhoto: "Додај барем една фотографија.",
    shrinkingTitle: "Ги намалуваме фотографиите",
    shrinkingBody: "На твојот уред, до најмногу 2 MB секоја, за побрзо прикачување.",
    own: "Јас ги снимив овие фотографии и имам право да ги споделам.",
    licence: licenceMk,
    privacy: "На фотографиите нема препознатливи лица или регистарски таблички, или имам согласност.",
    checks: "Потврди ги трите изјави за да продолжиш.",
    terms: "Услови",
    privacyPolicy: "Политика за приватност",
    storyTitle: "Раскажи ја приказната",
    storyLead: "Зошто вреди да се застане тука? Пат, поглед, совет.",
    writing: "Пишувам на",
    mk: "Македонски",
    en: "English",
    translateNote: "Ќе ја преведеме автоматски и ќе стои ознака",
    translateUntil: "додека уредник не ја провери. Без телефонски броеви и линкови.",
    badge: "Непроверен превод",
    storyLength: "Најмалку 40 и најмногу 500 знаци.",
    storyBanned: "Без телефонски броеви и линкови.",
    reviewTitle: "Провери и испрати",
    reviewLead: "Вака ќе изгледа по одобрување.",
    credit: "Фото: ти · авторските права се твои",
    location: "Локација",
    photosWord: "Фотографии",
    compressed: "компресирани",
    storyWord: "Приказна",
    yours: "твоја",
    edit: "Измени",
    nextWhat: "Што следува",
    nextBody: "Местото останува скриено додека модератор не го прегледа — обично до 48 часа. Ќе добиеш известување.",
    send: "Испрати на преглед",
    thanks: "Благодариме! Предлогот е испратен.",
    pendingLead: (name: string) => `„${name}“ сега чека преглед. Обично е готово до 48 часа.`,
    sent: "Испратено",
    checksAuto: "Автоматски проверки",
    checksAutoBody: "дупликати, содржина, големина на фотографии",
    moderator: "Преглед од модератор",
    moderatorBody: "одобрено, барање измени или одбиено со причина",
    published: "Објавено со твоето име",
    notify: "ќе добиеш известување",
    mine: "Види ги моите предлози",
    another: "Додај уште едно место",
    limitTitle: "Денес веќе испрати 3 места",
    limitBody: "Тоа е дневниот лимит за нови профили. Можеш повторно за",
    today: "Денешни предлози",
    trusted: "Доверливите профили можат до 10 дневно",
    backSpots: "Назад кон Места",
    offlineTitle: "Не успеавме да го испратиме",
    offlineBody: "Нема врска со интернет. Твојот предлог е зачуван на овој уред — ништо не е изгубено.",
    retry: "Обиди се повторно",
    mineTitle: "Мои предлози",
    mineLead: "Следи го статусот на местата што ги предложи.",
    waiting: "Чека преглед",
    storyHeading: "Приказна",
    showOriginal: "Прикажи оригинал",
    report: "Пријави грешка во преводот",
    autoFrom: "Автоматски преведено. Уредник уште не го проверил.",
    subcategory: "Подкатегорија",
    optional: "(незадолжително)",
    altMk: "Опис на насловната фотографија (македонски)",
    altEn: "Опис на насловната фотографија (англиски)",
    altHelp: "За луѓе што не ја гледаат фотографијата. Задолжително на двата јазика.",
    altError: "Внеси опис на двата јазика (3–250 знаци).",
    seasons: "Најдобро време за посета",
    saveDraft: "Зачувај како нацрт",
    draftSaved: "Нацртот е зачуван само на овој уред.",
    draftTextOnly: "Текстот е зачуван. Фотографиите не се собраа на уредот.",
    draftFailed: "Нацртот не е зачуван. Ослободи простор и обиди се повторно.",
    tooMany: "Можеш да додадеш најмногу 5 фотографии. Дополнителните не се земени.",
    minOne: "мин. 1",
    oversize: "Над 15 MB",
    nameHint: (n: number) => `3–60 знаци · ${n}/${NAME_MAX}`,
    storyHint: (n: number) => `${n}/${STORY_MAX} · најмалку ${STORY_MIN} знаци`,
    accuracy: (n: number) => `±${n} м`,
    readyCount: (done: number, total: number) => `${done} од ${total} готова`,
    uploadingCount: (done: number, total: number) => `Се прикачува… ${done} од ${total}`,
    compressingNow: "Се компресира…",
    heic: "HEIC не може да се прочита во овој прелистувач. Зачувај ја фотографијата како JPG или PNG.",
    photoFailed: "Не успеа",
    retryPhoto: "Обиди се пак",
    compressing: "Компресирање",
    waitingPhoto: "Чека…",
    uploadOffline: "Нема интернет. Ќе продолжиме кога ќе се врати врската.",
    uploading: "Се прикачува…",
    hours: (n: number) => `${n} ч`,
    minutes: (n: number) => `${n} мин`,
    limitMeter: (used: number, max: number) => `${used} / ${max}`,
    steps: ["Локација", "Детали", "Фотографии", "Приказна", "Преглед"],
    appealTitle: "Не се согласуваш со одлуката?",
    appealBody: "Можеш да поднесеш жалба во рок од 30 дена.",
    appealAction: "Поднеси жалба",
    appealSaved: "Барањето за жалба е зачувано на овој уред.",
    rejected: "Одбиено",
    rejectedReason: "Причина: веќе постои",
  },
  en: {
    title: "Add a hidden spot",
    step: (n: number) => `Step ${n} of 5`,
    close: "Close",
    back: "Back",
    next: "Continue",
    signInTitle: "Sign in to add a spot",
    signInBody: "Suggestions are tied to your profile, so we can tell you when the spot is published and credit you as the author.",
    signIn: "Sign in",
    signUp: "Create a profile",
    signHint: "It takes less than a minute.",
    where: "Where is the spot?",
    whereLead: "Move the map until the pin sits exactly on the place.",
    search: "Search for a place or village…",
    locate: "Use my location",
    locateMe: "My location",
    zoom: "Zoom in",
    locErrorTitle: "We couldn't find your location",
    locErrorBody: "Allow location access in the browser, or move the map yourself.",
    protectedTitle: "This is a protected area",
    protectedBody: (name: string) => `${name}. You can continue — stick to marked roads and follow the park rules.`,
    blockedTitle: "You can't add a place here",
    blockedBody: (name: string) =>
      `The pin is inside the ${name} strict nature reserve, where access is allowed for research only, so we don't publish places to visit. Move the pin outside the red zone.`,
    duplicateTitle: (meters: number) => `A similar spot already exists ${meters} m away`,
    duplicateBody: "Check whether it is the same place — you can add photos there instead of a new spot.",
    open: "Open",
    duplicateHelp: "The check uses a radius of 150 m.",
    different: "No, this is a different place",
    what: "Tell us what it is",
    whatLead: "A short name and a category, so other riders can find it.",
    name: "Spot name",
    namePlaceholder: "e.g. Viewpoint above Trpejca",
    nameError: "Enter a name (3–60 characters).",
    category: "Category",
    categoryError: "Choose a category.",
    fixTwo: "Fix 2 fields",
    fixTwoBody: "The name and the category are required.",
    photosTitle: "Add photos",
    photosLead: "Up to 5 photos you took yourself. The first one is the cover.",
    add: "Add",
    cover: "Cover",
    photoHelp: "1 to 5 photos, up to 15 MB each (JPG, PNG, WebP, HEIC). Before uploading we compress them on your device to 2 MB or less and remove GPS data.",
    tooBig: (mb: string) => `This photo is ${mb} MB — the limit is 15 MB. Pick a smaller one or crop it.`,
    needPhoto: "Add at least one photo.",
    shrinkingTitle: "Shrinking your photos",
    shrinkingBody: "On your device, to 2 MB or less each, so the upload is faster.",
    own: "I took these photos and have the right to share them.",
    licence: "I let SoulRide display these photos and my story with my name (non-exclusive licence). I keep the copyright.",
    privacy: "There are no recognisable faces or number plates in the photos, or I have consent.",
    checks: "Confirm all three statements to continue.",
    terms: "Terms",
    privacyPolicy: "Privacy policy",
    storyTitle: "Tell the story",
    storyLead: "Why is it worth stopping here? The road, the view, a tip.",
    writing: "I'm writing in",
    mk: "Macedonian",
    en: "English",
    translateNote: "We translate the other language automatically and mark it",
    translateUntil: "until an editor checks it. No phone numbers or links.",
    badge: "Unreviewed translation",
    storyLength: "At least 40 and at most 500 characters.",
    storyBanned: "No phone numbers or links.",
    reviewTitle: "Check and send",
    reviewLead: "This is how it will look after approval.",
    credit: "Photo: you · you keep the copyright",
    location: "Location",
    photosWord: "Photos",
    compressed: "compressed",
    storyWord: "Story",
    yours: "yours",
    edit: "Edit",
    nextWhat: "What happens next",
    nextBody: "The spot stays hidden until a moderator reviews it — usually within 48 hours. You'll be notified.",
    send: "Send for review",
    thanks: "Thank you! The suggestion was sent.",
    pendingLead: (name: string) => `“${name}” is waiting for review. It's usually done within 48 hours.`,
    sent: "Sent",
    checksAuto: "Automatic checks",
    checksAutoBody: "duplicates, content, photo size",
    moderator: "Moderator review",
    moderatorBody: "approved, changes requested, or rejected with a reason",
    published: "Published with your name",
    notify: "you'll be notified",
    mine: "See my suggestions",
    another: "Add another spot",
    limitTitle: "You've already sent 3 places today",
    limitBody: "That's the daily limit for new profiles. You can try again in",
    today: "Today's suggestions",
    trusted: "Trusted profiles can send up to 10 a day",
    backSpots: "Back to spots",
    offlineTitle: "We couldn't send it",
    offlineBody: "There's no internet connection. Your suggestion is still on this device — nothing was lost.",
    retry: "Try again",
    mineTitle: "My suggestions",
    mineLead: "Follow the status of the spots you suggested.",
    waiting: "Waiting for review",
    storyHeading: "Story",
    showOriginal: "Show original",
    report: "Report a translation error",
    autoFrom: "Machine-translated. An editor hasn't checked it yet.",
    subcategory: "Subcategory",
    optional: "(optional)",
    altMk: "Cover photo description (Macedonian)",
    altEn: "Cover photo description (English)",
    altHelp: "For people who cannot see the photo. Required in both languages.",
    altError: "Enter a description in both languages (3–250 characters).",
    seasons: "Best time to visit",
    saveDraft: "Save as draft",
    draftSaved: "The draft is saved on this device only.",
    draftTextOnly: "The text is saved. The photos did not fit on this device.",
    draftFailed: "The draft was not saved. Free some space and try again.",
    tooMany: "You can add at most 5 photos. The extra files were not added.",
    minOne: "min. 1",
    oversize: "Over 15 MB",
    nameHint: (n: number) => `3–60 characters · ${n}/${NAME_MAX}`,
    storyHint: (n: number) => `${n}/${STORY_MAX} · at least ${STORY_MIN} characters`,
    accuracy: (n: number) => `±${n} m`,
    readyCount: (done: number, total: number) => `${done} of ${total} ready`,
    uploadingCount: (done: number, total: number) => `Uploading… ${done} of ${total}`,
    compressingNow: "Compressing…",
    heic: "HEIC can't be read in this browser. Save the photo as JPG or PNG.",
    photoFailed: "Failed",
    retryPhoto: "Try again",
    compressing: "Compressing",
    waitingPhoto: "Waiting…",
    uploadOffline: "No internet. We'll continue when the connection is back.",
    uploading: "Uploading…",
    hours: (n: number) => `${n} h`,
    minutes: (n: number) => `${n} min`,
    limitMeter: (used: number, max: number) => `${used} / ${max}`,
    steps: ["Location", "Details", "Photos", "Story", "Review"],
    appealTitle: "Don't agree with the decision?",
    appealBody: "You can appeal within 30 days.",
    appealAction: "Submit an appeal",
    appealSaved: "The appeal request is saved on this device.",
    rejected: "Rejected",
    rejectedReason: "Reason: it already exists",
  },
} as const;

function demoPhotos(): CompressedPhoto[] {
  const base = import.meta.env.BASE_URL;
  return ["eastern-waterfalls-loop", "western-lakes-tour", "pelister-peaks-hike"].map((id) => ({
    name: `${id}.jpg`,
    type: "image/jpeg",
    blob: new Blob(),
    bytes: 1_800_000,
    width: 800,
    height: 450,
    previewUrl: `${base}img/routes/${id}.jpg`,
  }));
}

interface AddGemPageProps {
  client?: GemSubmissionClient;
  signedIn?: boolean;
}

const AddGemPage = ({ client = mockGemClient, signedIn }: AddGemPageProps) => {
  const auth = useAuth();
  const user = signedIn ?? Boolean(auth.user);
  const { lang } = useLang();
  const t = copy[lang];
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const preview = params.get("state");
  const harness = previewHarnessEnabled(import.meta.env.DEV, preview);
  const filled = harness && ["details", "photos", "photos-compress", "photos-err", "upload-failed", "story", "review", "success", "spot", "pending"].includes(preview ?? "");
  const showDemoPhotos = harness && ["photos", "photos-err", "photos-compress", "upload-failed", "story", "review"].includes(preview ?? "");
  const photoPreview = harness && ["photos", "story", "review", "photos-compress", "upload-failed"].includes(preview ?? "");
  const overlayJobs = harness && (preview === "upload-failed" || preview === "photos-compress");
  const pins = useMemo(() => listSpotPins(), []);

  const [step, setStep] = useState<Step>(!harness ? "location" : preview === "details" || preview === "details-err" ? "details" : preview === "photos" || preview === "photos-err" || preview === "photos-compress" || preview === "upload-failed" ? "photos" : preview === "story" ? "story" : preview === "review" ? "review" : "location");
  const [lat, setLat] = useState(!harness ? 41.6 : preview === "location-blocked" ? 40.9668 : preview === "duplicate" ? 41.0304 : 41.1897);
  const [lng, setLng] = useState(!harness ? 21.43 : preview === "location-blocked" ? 21.0402 : preview === "duplicate" ? 20.7506 : 20.7965);
  const [accuracy, setAccuracy] = useState<number | null>(harness ? 12 : null);
  const [locError, setLocError] = useState(harness && preview === "location-err");
  const [ackDuplicate, setAckDuplicate] = useState(false);
  const [query, setQuery] = useState("");
  const [name, setName] = useState(filled ? "Видиковец над Трпејца" : "");
  const [category, setCategory] = useState<GemCategory | null>(filled ? "nature" : null);
  const [subcategories, setSubcategories] = useState<string[]>(filled ? ["viewpoint"] : []);
  const [showDetailsErrors, setShowDetailsErrors] = useState(harness && preview === "details-err");
  const [photos, setPhotos] = useState<CompressedPhoto[]>(() => (showDemoPhotos ? demoPhotos() : []));
  const [altMk, setAltMk] = useState(showDemoPhotos ? "Поглед кон Трпејца и езерото" : "");
  const [altEn, setAltEn] = useState(showDemoPhotos ? "View towards Trpejca and the lake" : "");
  const [photoError, setPhotoError] = useState<string | null>(harness && preview === "photos-err" ? t.tooBig("23,4") : null);
  const [compressing, setCompressing] = useState(harness && preview === "photos-compress");
  const [uploadOffline, setUploadOffline] = useState(harness && preview === "upload-failed");
  const [photoJobs, setPhotoJobs] = useState<Array<{ id: string; name: string; progress: number; status: "compressing" | "failed" | "waiting"; detail?: string }>>(
    harness && preview === "upload-failed"
      ? [
          { id: "a", name: "cover.jpg", progress: 100, status: "waiting" },
          { id: "b", name: "road.jpg", progress: 45, status: "compressing" },
          { id: "c", name: "view.jpg", progress: 0, status: "failed" },
        ]
      : harness && preview === "photos-compress"
        ? [
            { id: "a", name: "cover.jpg", progress: 100, status: "waiting" },
            { id: "b", name: "road.jpg", progress: 64, status: "compressing" },
            { id: "c", name: "view.jpg", progress: 0, status: "waiting" },
          ]
        : harness && preview === "photos-err"
          ? [{ id: "bad", name: "too-big.jpg", progress: 0, status: "failed", detail: `${t.oversize} (23,4 MB)` }]
          : [],
  );
  const [own, setOwn] = useState(photoPreview);
  const [licence, setLicence] = useState(photoPreview);
  const [privacy, setPrivacy] = useState(photoPreview);
  const [showPhotoErrors, setShowPhotoErrors] = useState(preview === "photos-err");
  const [storyLang, setStoryLang] = useState<"mk" | "en">(lang === "en" ? "en" : "mk");
  const [story, setStory] = useState(filled ? "Од превојот се гледа целото езеро. Последните 2 км се макадам — со туристички мотор оди полека. Најубаво е пред зајдисонце." : "");
  const [seasons, setSeasons] = useState<Season[]>(harness && (preview === "story" || preview === "review") ? ["spring", "summer", "autumn"] : []);
  const [showStoryError, setShowStoryError] = useState(false);
  const [draftNote, setDraftNote] = useState<string | null>(null);
  const [appealNote, setAppealNote] = useState<string | null>(null);
  const [screen, setScreen] = useState<"flow" | "success" | "limit" | "offline" | "spot" | "pending">(
    preview === "success" ? "success" : preview === "limit" ? "limit" : preview === "offline" ? "offline" : preview === "spot" ? "spot" : preview === "pending" ? "pending" : "flow",
  );
  const [sent, setSent] = useState<GemSubmission | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const drag = useRef<{ x: number; y: number; lat: number; lng: number } | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const persistDraft = async () => {
    try {
      const result = await saveGemDraft({
        savedAt: new Date().toISOString(),
        lat,
        lng,
        name,
        category,
        subcategories,
        altMk,
        altEn,
        story,
        storyLang,
        seasons,
        own,
        licence,
        privacy,
        photos: photos.map((photo) => ({
          name: photo.name,
          type: photo.type,
          bytes: photo.bytes,
          width: photo.width,
          height: photo.height,
          blob: photo.blob,
        })),
      });
      setDraftNote(result === "saved" ? t.draftSaved : t.draftTextOnly);
    } catch {
      setDraftNote(t.draftFailed);
    }
  };

  useEffect(() => {
    if (harness) return;
    void loadGemDraft().then((draft) => {
      if (!draft) return;
      setLat(draft.lat);
      setLng(draft.lng);
      setName(draft.name);
      setCategory(draft.category);
      setSubcategories(draft.subcategories);
      setAltMk(draft.altMk);
      setAltEn(draft.altEn);
      setStory(draft.story);
      setStoryLang(draft.storyLang);
      setSeasons(draft.seasons);
      setOwn(draft.own);
      setLicence(draft.licence);
      setPrivacy(draft.privacy);
      setPhotos(
        draft.photos.map((photo) => ({
          name: photo.name,
          type: photo.type,
          blob: photo.blob,
          bytes: photo.bytes,
          width: photo.width,
          height: photo.height,
          previewUrl: URL.createObjectURL(photo.blob),
        })),
      );
    });
  }, [harness]);

  const zone = zoneAt(lat, lng);
  const nearby = nearestSpot(lat, lng, pins);
  const blocked = zone?.kind === "strict";
  const cat = CATEGORIES.find((item) => item.id === category);
  const stepIndex = STEPS.indexOf(step) + 1;

  const locate = () => {
    if (!navigator.geolocation) {
      setLocError(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        setAccuracy(Math.round(position.coords.accuracy));
        setLocError(false);
      },
      () => setLocError(true),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  const onSearch = (value: string) => {
    setQuery(value);
    const hit = pins.find((pin) => pin.title.toLowerCase().includes(value.trim().toLowerCase()) && value.trim().length > 1);
    if (hit) {
      setLat(hit.lat);
      setLng(hit.lng);
      setAccuracy(null);
    }
  };

  const isHeic = (file: File) => file.type === "image/heic" || file.type === "image/heif" || /\.hei[cf]$/i.test(file.name);

  const addFiles = async (list: FileList | null) => {
    if (!list || list.length === 0) return;
    setPhotoError(null);
    const room = PHOTO_MAX - photos.length;
    if (list.length > room) {
      setPhotoError(t.tooMany);
      setShowPhotoErrors(true);
    }
    const files = [...list].slice(0, Math.max(0, room));
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setUploadOffline(true);
      setPhotoJobs(files.map((file, index) => ({ id: `${Date.now()}-${index}`, name: file.name, progress: 0, status: "failed" as const })));
      return;
    }
    setCompressing(true);
    const next = [...photos];
    for (const file of files) {
      const id = `${Date.now()}-${file.name}-${file.size}`;
      if (isHeic(file)) {
        setPhotoJobs((jobs) => [...jobs, { id, name: file.name, progress: 0, status: "failed" }]);
        setPhotoError(t.heic);
        setShowPhotoErrors(true);
        continue;
      }
      if (uploadTooLarge(file.size)) {
        setPhotoJobs((jobs) => [...jobs, { id, name: file.name, progress: 0, status: "failed", detail: t.oversize }]);
        setPhotoError(t.tooBig(formatMegabytes(file.size)));
        setShowPhotoErrors(true);
        continue;
      }
      setPhotoJobs((jobs) => [...jobs, { id, name: file.name, progress: 0, status: "compressing" }]);
      try {
        const compressed = await compressPhoto(file, (ratio) => {
          setPhotoJobs((jobs) => jobs.map((job) => (job.id === id ? { ...job, progress: Math.round(ratio * 100) } : job)));
        });
        next.push(compressed);
        setPhotoJobs((jobs) => jobs.filter((job) => job.id !== id));
      } catch (error) {
        setPhotoJobs((jobs) => jobs.map((job) => (job.id === id ? { ...job, status: "failed", detail: error instanceof PhotoTooLargeError ? t.oversize : undefined } : job)));
        if (error instanceof PhotoTooLargeError) setPhotoError(t.tooBig(formatMegabytes(error.bytes)));
        else setPhotoError(t.photoFailed);
        setShowPhotoErrors(true);
      }
    }
    setPhotos(next.slice(0, PHOTO_MAX));
    setCompressing(false);
  };

  const goNext = async () => {
    if (step === "location") {
      if (blocked) return;
      setStep("details");
      return;
    }
    if (step === "details") {
      const badName = nameError(name);
      const badCategory = !category;
      setShowDetailsErrors(true);
      if (badName || badCategory) {
        nameRef.current?.focus();
        return;
      }
      setStep("photos");
      return;
    }
    if (step === "photos") {
      setShowPhotoErrors(true);
      if (photoCountError(photos.length) || altError(altMk) || altError(altEn) || !own || !licence || !privacy) return;
      setStep("story");
      return;
    }
    if (step === "story") {
      setShowStoryError(true);
      if (storyError(story)) return;
      setStep("review");
      return;
    }
    if (zoneAt(lat, lng)?.kind === "strict") {
      setStep("location");
      return;
    }
    if (sendsToday() >= dailyLimit(isTrustedAccount())) {
      setScreen("limit");
      return;
    }
    try {
      const row = await client.submit({
        name: name.trim(),
        category: category ?? "nature",
        subcategories,
        altMk: altMk.trim(),
        altEn: altEn.trim(),
        seasons,
        story: story.trim(),
        storyLang,
        lat,
        lng,
        photos: photos.map(({ name: photoName, type, bytes, width, height }) => ({ name: photoName, type, bytes, width, height })),
        ownWork: true,
        licence: "non-exclusive",
        privacy: true,
      });
      setSent(row);
      await clearGemDraft();
      setScreen("success");
    } catch {
      setScreen("offline");
    }
  };

  if (!user && !signedIn && !harness) {
    return (
      <Shell title={t.title} stepLabel="" closeLabel={t.close} backLabel={t.back} onClose={() => navigate("/spots")} showProgress={false}>
        <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-primary/15 text-primary">
            <MapPin className="h-10 w-10" />
          </span>
          <h2 className="font-display text-[22px] font-extrabold">{t.signInTitle}</h2>
          <p className="text-[15px] text-muted-foreground">{t.signInBody}</p>
          <Link to="/login" className="inline-flex h-[52px] w-full items-center justify-center rounded-lg bg-primary text-[15px] font-semibold text-primary-foreground shadow-glow">{t.signIn}</Link>
          <Link to="/signup" className="inline-flex h-[52px] w-full items-center justify-center rounded-lg border border-input text-[15px] font-semibold">{t.signUp}</Link>
          <p className="text-[13px] text-muted-foreground">{t.signHint}</p>
        </div>
      </Shell>
    );
  }

  if (screen === "limit") {
    const wait = formatRetry(retryInMs() || 9 * 3600000 + 18 * 60000);
    const used = Math.min(sendsToday() || 3, 3);
    return (
      <Shell title={t.title} stepLabel="" closeLabel={t.close} backLabel={t.back} onClose={() => navigate("/spots")} showProgress={false}>
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-10 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-destructive/15 text-destructive"><Hourglass className="h-10 w-10" /></span>
          <h2 className="font-display text-[22px] font-extrabold">{t.limitTitle}</h2>
          <p className="text-[15px] text-muted-foreground">{t.limitBody} <b className="font-mono text-foreground">{t.hours(wait.hours)} {t.minutes(wait.minutes)}</b>.</p>
          <div className="w-full text-left">
            <div className="mb-1.5 flex justify-between text-[13px]"><span className="text-muted-foreground">{t.today}</span><span className="font-mono">{t.limitMeter(used, 3)}</span></div>
            <div className="grid grid-cols-3 gap-1">{[0, 1, 2].map((i) => <span key={i} className={`h-2 rounded-full ${i < used ? "bg-destructive" : "bg-muted"}`} />)}</div>
          </div>
          <div className="flex gap-3 rounded-xl border border-info/45 bg-info/15 p-3 text-left text-sm"><Shield className="mt-0.5 h-4 w-4 shrink-0" /><div><b>{t.trusted}</b></div></div>
          <button type="button" className="inline-flex h-[52px] w-full items-center justify-center rounded-lg bg-primary font-semibold text-primary-foreground" onClick={() => void persistDraft()}>{t.saveDraft}</button>
          {draftNote && <p className="text-sm text-muted-foreground">{draftNote}</p>}
          <Link to="/spots" className="inline-flex h-[52px] w-full items-center justify-center rounded-lg border border-input font-semibold">{t.backSpots}</Link>
        </div>
      </Shell>
    );
  }

  if (screen === "offline") {
    return (
      <Shell title={t.title} stepLabel={t.step(5)} progress={5} steps={t.steps} closeLabel={t.close} backLabel={t.back} onClose={() => setScreen("flow")} back>
        <div className="bg-warning px-4 py-2 text-[13px] font-semibold text-warning-foreground">{t.offlineTitle}</div>
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-10 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-muted"><WifiOff className="h-10 w-10" /></span>
          <h2 className="font-display text-[22px] font-extrabold">{t.offlineTitle}</h2>
          <p className="text-[15px] text-muted-foreground">{t.offlineBody}</p>
          <button type="button" className="inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-lg bg-primary font-semibold text-primary-foreground" onClick={() => void goNext()}>{t.retry}</button>
          <button type="button" className="inline-flex h-[52px] w-full items-center justify-center rounded-lg border border-input font-semibold" onClick={() => void persistDraft()}>{t.saveDraft}</button>
          {draftNote && <p className="text-sm text-muted-foreground">{draftNote}</p>}
        </div>
      </Shell>
    );
  }

  if (screen === "success") {
    const label = sent?.name ?? name;
    return (
      <Shell title={lang === "mk" ? "Испратено" : "Sent"} stepLabel="" closeLabel={t.close} backLabel={t.back} onClose={() => navigate("/spots")} showProgress={false}>
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-10 text-center">
          <span className="grid h-20 w-20 place-items-center rounded-full bg-success/20 text-success"><Check className="h-10 w-10" /></span>
          <h2 className="font-display text-[22px] font-extrabold">{t.thanks}</h2>
          <p className="text-[15px] text-muted-foreground">{t.pendingLead(label)}</p>
          <ol className="w-full space-y-3 text-left text-sm">
            <li><b>{t.sent}</b></li>
            <li><b>{t.checksAuto}</b> — {t.checksAutoBody}</li>
            <li><b>{t.moderator}</b> — {t.moderatorBody}</li>
            <li><b>{t.published}</b> — {t.notify}</li>
          </ol>
          <button type="button" className="inline-flex h-[52px] w-full items-center justify-center rounded-lg bg-primary font-semibold text-primary-foreground" onClick={() => setScreen("pending")}>{t.mine}</button>
          <button type="button" className="inline-flex h-[52px] w-full items-center justify-center rounded-lg border border-input font-semibold" onClick={() => { setScreen("flow"); setStep("location"); }}>{t.another}</button>
        </div>
      </Shell>
    );
  }

  if (screen === "pending") {
    return (
      <Shell title={t.mineTitle} stepLabel="" closeLabel={t.close} backLabel={t.back} onClose={() => navigate("/spots")} showProgress={false}>
        <div className="mx-auto max-w-lg px-4 py-6">
          <p className="mb-4 text-[15px] text-muted-foreground">{t.mineLead}</p>
          <article className="mb-3 flex items-center gap-3 rounded-xl border border-border bg-card p-3">
            <div className="min-w-0 flex-1"><b>{sent?.name ?? name}</b><p className="text-[13px] text-muted-foreground">{t.sent}</p></div>
            <span className="rounded-pill bg-warning/20 px-2.5 py-1 text-xs font-bold text-warning">{t.waiting}</span>
          </article>
          <div className="flex gap-3 rounded-xl border border-info/45 bg-info/15 p-3 text-sm">
            <Shield className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <b className="block">{t.appealTitle}</b>
              {t.appealBody}{" "}
              <button type="button" className="underline" onClick={() => { localStorage.setItem("soulride.gem-appeal", new Date().toISOString()); setAppealNote(t.appealSaved); }}>{t.appealAction}</button>
              {appealNote && <p className="mt-1 text-muted-foreground">{appealNote}</p>}
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  if (screen === "spot") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-4 pb-28">
        <img src={`${import.meta.env.BASE_URL}img/routes/western-lakes-tour.jpg`} alt={name} className="aspect-hero w-full rounded-lg object-cover" />
        <h1 className="mt-3 font-display text-[28px] font-extrabold">{name}</h1>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-bold">{t.storyHeading}</h2>
          <span className="inline-flex h-[26px] items-center gap-1 rounded-pill border border-dashed border-warning bg-warning/15 px-2 text-xs font-semibold text-warning" title={t.autoFrom}>
            <Languages className="h-3.5 w-3.5" /> {t.badge}
          </span>
        </div>
        <p className="mt-2 text-base leading-relaxed">{showOriginal ? "From the pass you can see the whole lake. The last 2 km are gravel." : story}</p>
        <p className="mt-2 text-[13px] text-muted-foreground">
          {t.autoFrom}{" "}
          <button type="button" className="underline" onClick={() => setShowOriginal((value) => !value)}>{t.showOriginal}</button>
          {" · "}
          <a className="underline" href="mailto:hello@soulride.mk">{t.report}</a>
        </p>
      </div>
    );
  }

  const photoTotal = overlayJobs ? photos.length : photos.length + photoJobs.length;
  const photoDone = overlayJobs
    ? photos.filter((_, index) => {
        const job = photoJobs[index];
        return Boolean(job && job.status === "waiting" && job.progress >= 100);
      }).length
    : photos.length;
  const photosBusy = compressing || uploadOffline || photoJobs.some((job) => job.status === "compressing");
  const continueLabel = step === "review" ? t.send : nearby && !ackDuplicate && step === "location" ? t.different : uploadOffline ? t.uploadingCount(photoDone, Math.max(photoTotal, 1)) : compressing || photoJobs.some((job) => job.status === "compressing") ? t.compressingNow : t.next;

  return (
    <Shell
      title={t.title}
      stepLabel={t.step(stepIndex)}
      progress={stepIndex}
      steps={t.steps}
      closeLabel={t.close}
      backLabel={t.back}
      onClose={() => (step === "location" ? navigate("/spots") : setStep(STEPS[stepIndex - 2]))}
      back={step !== "location"}
    >
      {uploadOffline && (
        <div className="flex items-center gap-2 bg-warning px-4 py-2 text-[13px] font-semibold text-warning-foreground">
          <WifiOff className="h-4 w-4 shrink-0" />
          {t.uploadOffline}
        </div>
      )}
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-5 pb-28 lg:px-8">
        {step === "location" && (
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-[22px] font-extrabold">{t.where}</h2>
              <p className="text-[15px] text-muted-foreground">{t.whereLead}</p>
            </div>
            <div className="relative h-[340px] overflow-hidden rounded-lg border border-border bg-muted lg:order-first lg:h-[520px]">
              <MapArt strict={blocked} />
              <label className="absolute left-3 right-16 top-3 flex h-11 items-center gap-2 rounded-lg border border-input bg-background px-3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input value={query} onChange={(event) => onSearch(event.target.value)} placeholder={t.search} className="w-full bg-transparent text-[15px] outline-none" aria-label={t.search} />
              </label>
              <div
                className="absolute inset-0 cursor-grab"
                onPointerDown={(event) => {
                  drag.current = { x: event.clientX, y: event.clientY, lat, lng };
                }}
                onPointerMove={(event) => {
                  if (!drag.current) return;
                  const nextLat = Math.min(42.4, Math.max(40.8, drag.current.lat + (event.clientY - drag.current.y) * 0.00015));
                  const nextLng = Math.min(23.1, Math.max(20.4, drag.current.lng - (event.clientX - drag.current.x) * 0.00015));
                  setLat(nextLat);
                  setLng(nextLng);
                }}
                onPointerUp={() => {
                  drag.current = null;
                }}
              />
              <MapPin className="pointer-events-none absolute left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-full text-primary" />
              <div className="absolute bottom-3 right-3 flex flex-col gap-2">
                <button type="button" aria-label={t.locateMe} className="grid h-11 w-11 place-items-center rounded-lg border border-border bg-card" onClick={locate}><LocateFixed className="h-5 w-5" /></button>
                <button type="button" aria-label={t.zoom} className="grid h-11 w-11 place-items-center rounded-lg border border-border bg-card" onClick={() => setAccuracy((value) => (value ? Math.max(3, value - 3) : 8))}><Plus className="h-5 w-5" /></button>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {locError && <Note tone="err" title={t.locErrorTitle} body={t.locErrorBody} />}
              <p className="font-mono text-[13px] text-muted-foreground">{lat.toFixed(4)}° N, {lng.toFixed(4)}° E{accuracy ? ` · ${t.accuracy(accuracy)}` : ""}</p>
              <button type="button" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-input font-semibold" onClick={locate}><Crosshair className="h-4 w-4" />{t.locate}</button>
              {blocked && zone && <Note tone="err" title={t.blockedTitle} body={t.blockedBody(lang === "mk" ? zone.nameMk : zone.nameEn)} />}
              {!blocked && zone?.kind === "protected" && <Note tone="warn" title={t.protectedTitle} body={t.protectedBody(lang === "mk" ? zone.nameMk : zone.nameEn)} />}
              {nearby && !ackDuplicate && (
                <div className="rounded-xl border border-warning/50 bg-warning/10 p-3 text-sm">
                  <b>{t.duplicateTitle(Math.round(nearby.meters))}</b>
                  <p>{t.duplicateBody}</p>
                  <Link to={`/spots/${nearby.spot.id}`} className="mt-2 inline-flex h-11 items-center rounded-lg border border-input px-3 font-semibold">{t.open}</Link>
                  <p className="mt-2 text-[13px] text-muted-foreground">{t.duplicateHelp}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {step === "details" && (
          <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
            {showDetailsErrors && (nameError(name) || !category) && <Note tone="err" title={t.fixTwo} body={t.fixTwoBody} alert />}
            <div><h2 className="font-display text-[22px] font-extrabold">{t.what}</h2><p className="text-[15px] text-muted-foreground">{t.whatLead}</p></div>
            <label className="flex flex-col gap-1.5 text-sm font-semibold">
              {t.name}
              <input ref={nameRef} value={name} onChange={(event) => setName(event.target.value)} maxLength={NAME_MAX} placeholder={t.namePlaceholder} aria-invalid={showDetailsErrors && Boolean(nameError(name))} className={`h-11 rounded-lg border bg-background px-3 text-base font-normal ${showDetailsErrors && nameError(name) ? "border-destructive" : "border-input"}`} />
              {showDetailsErrors && nameError(name) ? <span className="text-[13px] font-normal text-destructive">{t.nameError}</span> : <span className="text-[13px] font-normal text-muted-foreground">{t.nameHint(name.trim().length)}</span>}
            </label>
            <fieldset>
              <legend className="mb-2 text-sm font-semibold">{t.category}</legend>
              <div className="grid grid-cols-2 gap-2.5">
                {CATEGORIES.map((item) => (
                  <button key={item.id} type="button" aria-pressed={category === item.id} onClick={() => { setCategory(item.id); setSubcategories([]); }} className={`min-h-11 rounded-xl border p-3 text-left ${category === item.id ? "border-2 border-primary bg-primary/10" : "border-input"} ${showDetailsErrors && !category ? "border-destructive" : ""}`}>
                    <b className="block text-[15px]">{lang === "mk" ? item.mk : item.en}</b>
                    <small className="text-xs text-muted-foreground">{lang === "mk" ? item.hintMk : item.hintEn}</small>
                  </button>
                ))}
              </div>
              {showDetailsErrors && !category && <p className="mt-1 text-[13px] text-destructive">{t.categoryError}</p>}
            </fieldset>
            {category && (
              <fieldset>
                <legend className="mb-2 text-sm font-semibold">{t.subcategory} <span className="font-normal text-muted-foreground">{t.optional}</span></legend>
                <div className="flex flex-wrap gap-2">
                  {SUBCATEGORIES[category].map((item) => {
                    const on = subcategories.includes(item.id);
                    return (
                      <button key={item.id} type="button" aria-pressed={on} className="inline-flex h-11 items-center" onClick={() => setSubcategories(on ? subcategories.filter((id) => id !== item.id) : [...subcategories, item.id])}>
                        <span className={on ? "inline-flex h-9 items-center rounded-pill border border-primary bg-primary px-3 text-sm font-medium text-primary-foreground" : "inline-flex h-9 items-center rounded-pill border border-input px-3 text-sm font-medium"}>{lang === "mk" ? item.mk : item.en}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}
          </div>
        )}

        {step === "photos" && (
          <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
            <div><h2 className="font-display text-[22px] font-extrabold">{t.photosTitle}</h2><p className="text-[15px] text-muted-foreground">{t.photosLead}</p></div>
            <div className="grid grid-cols-3 gap-2">
              {photos.map((photo, index) => {
                const job = overlayJobs ? photoJobs[index] : undefined;
                const failed = job?.status === "failed";
                return (
                  <div key={photo.previewUrl} className={`relative aspect-square overflow-hidden rounded-lg bg-muted ${failed ? "outline outline-2 outline-destructive" : ""}`}>
                    <img src={photo.previewUrl} alt={index === 0 ? altMk : ""} className={`h-full w-full object-cover ${failed ? "opacity-40" : ""}`} />
                    {index === 0 && !job && <span className="absolute bottom-1 left-1 rounded bg-primary px-1.5 py-0.5 text-[11px] font-bold text-primary-foreground">{t.cover}</span>}
                    {job?.status === "waiting" && job.progress >= 100 && <span className="absolute left-1 top-1 rounded bg-success px-1.5 py-0.5 text-[11px] font-bold text-success-foreground">{formatMegabytes(photo.bytes)} MB</span>}
                    {job && job.status !== "failed" && job.progress < 100 && (
                      <div className="absolute inset-x-0 bottom-0 bg-scrim/75 px-1.5 py-1 text-[11px] font-semibold text-foreground">
                        {job.status === "compressing" ? `${t.compressing} ${job.progress}%` : t.waitingPhoto}
                        <span className="mt-1 block h-1 overflow-hidden rounded bg-background/40"><span className="block h-full bg-accent" style={{ width: `${job.progress}%` }} /></span>
                      </div>
                    )}
                    {failed && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-destructive/75 px-1 text-center text-[11px] font-semibold text-primary-foreground">
                        <AlertTriangle className="h-4 w-4" />
                        {job.detail ?? t.photoFailed}
                        <button type="button" className="min-h-11 underline" onClick={() => fileRef.current?.click()}>{t.retryPhoto}</button>
                      </div>
                    )}
                    <button type="button" aria-label={t.close} className="absolute right-0 top-0 z-10 grid h-11 w-11 place-items-center" onClick={() => setPhotos(photos.filter((_, i) => i !== index))}><span className="grid h-7 w-7 place-items-center rounded-full bg-scrim/75"><X className="h-4 w-4" /></span></button>
                  </div>
                );
              })}
              {!overlayJobs && photoJobs.map((job) => (
                <div key={job.id} className={`relative flex aspect-square flex-col items-center justify-center gap-1 overflow-hidden rounded-lg px-2 text-center text-[11px] font-semibold ${job.status === "failed" ? "bg-destructive/80 text-primary-foreground outline outline-2 outline-destructive" : "bg-muted"}`}>
                  {job.status === "failed" && <AlertTriangle className="h-4 w-4" />}
                  <span>{job.status === "failed" ? (job.detail ?? t.photoFailed) : job.status === "compressing" ? `${t.compressing} ${job.progress}%` : t.waitingPhoto}</span>
                  {job.status !== "failed" && <span className="h-1 w-full overflow-hidden rounded bg-scrim/40"><span className="block h-full bg-accent" style={{ width: `${job.progress}%` }} /></span>}
                  {job.status === "failed" && (
                    <button type="button" className="min-h-11 underline" onClick={() => fileRef.current?.click()}>{t.retryPhoto}</button>
                  )}
                </div>
              ))}
              {photos.length < PHOTO_MAX && (
                <button type="button" className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-input text-xs text-muted-foreground" onClick={() => fileRef.current?.click()}>
                  <Camera className="h-5 w-5" />{t.add}<span>{photos.length}/{PHOTO_MAX} · {t.minOne}</span>
                </button>
              )}
            </div>
            <label htmlFor="gem-photos" className="sr-only">{t.photosTitle}</label>
            <input id="gem-photos" ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic,.heic,.heif" multiple className="sr-only" aria-label={t.photosTitle} aria-describedby="gem-photo-help" onChange={(event) => void addFiles(event.target.files)} />
            {(compressing || overlayJobs) && preview !== "upload-failed" && photoJobs.some((job) => job.status === "compressing") && <Note tone="info" title={t.shrinkingTitle} body={`${t.shrinkingBody} ${t.readyCount(photoDone, Math.max(photoTotal, 1))}`} />}
            {showPhotoErrors && photoError && <p className="text-[13px] text-destructive">{photoError}</p>}
            {showPhotoErrors && photoCountError(photos.length) === "min" && <p className="text-[13px] text-destructive">{t.needPhoto}</p>}
            <p id="gem-photo-help" className="text-[13px] text-muted-foreground">{t.photoHelp}</p>
            <p id="gem-alt-help" className="text-[13px] text-muted-foreground">{t.altHelp}</p>
            <label className="flex flex-col gap-1.5 text-sm font-semibold">
              {t.altMk}
              <input value={altMk} onChange={(event) => setAltMk(event.target.value)} maxLength={250} aria-describedby="gem-alt-help" aria-invalid={showPhotoErrors && Boolean(altError(altMk))} className={`h-11 rounded-lg border bg-background px-3 text-base font-normal ${showPhotoErrors && altError(altMk) ? "border-destructive" : "border-input"}`} />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-semibold">
              {t.altEn}
              <input value={altEn} onChange={(event) => setAltEn(event.target.value)} maxLength={250} lang="en" aria-describedby="gem-alt-help" aria-invalid={showPhotoErrors && Boolean(altError(altEn))} className={`h-11 rounded-lg border bg-background px-3 text-base font-normal ${showPhotoErrors && altError(altEn) ? "border-destructive" : "border-input"}`} />
            </label>
            {showPhotoErrors && (altError(altMk) || altError(altEn)) && <p className="text-[13px] text-destructive">{t.altError}</p>}
            <CheckRow checked={own} onChange={setOwn} label={t.own} invalid={showPhotoErrors && !own} />
            <CheckRow checked={licence} onChange={setLicence} label={<>{t.licence} <Link to="/about" className="underline">{t.terms}</Link></>} invalid={showPhotoErrors && !licence} />
            <CheckRow checked={privacy} onChange={setPrivacy} label={<>{t.privacy} <Link to="/about" className="underline">{t.privacyPolicy}</Link></>} invalid={showPhotoErrors && !privacy} />
            {showPhotoErrors && (!own || !licence || !privacy) && <p className="text-[13px] text-destructive">{t.checks}</p>}
          </div>
        )}

        {step === "story" && (
          <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
            <div><h2 className="font-display text-[22px] font-extrabold">{t.storyTitle}</h2><p className="text-[15px] text-muted-foreground">{t.storyLead}</p></div>
            <div role="radiogroup" aria-label={t.writing} className="flex rounded-lg bg-muted p-1">
              {(["mk", "en"] as const).map((code) => (
                <button key={code} type="button" aria-pressed={storyLang === code} className={`h-11 flex-1 rounded-md text-sm font-semibold ${storyLang === code ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`} onClick={() => setStoryLang(code)}>{code === "mk" ? t.mk : t.en}</button>
              ))}
            </div>
            <label className="flex flex-col gap-1.5 text-sm font-semibold">
              {t.storyTitle}
              <textarea value={story} onChange={(event) => setStory(event.target.value)} maxLength={STORY_MAX} aria-label={t.storyTitle} className="min-h-[150px] rounded-lg border border-input bg-background p-3 text-base font-normal" />
            </label>
            <p className="text-right text-xs text-muted-foreground">{t.storyHint(story.trim().length)}</p>
            {showStoryError && storyError(story) === "length" && <p className="text-[13px] text-destructive">{t.storyLength}</p>}
            {showStoryError && storyError(story) === "banned" && <p className="text-[13px] text-destructive">{t.storyBanned}</p>}
            <Note tone="info" title={storyLang === "mk" ? "Англиската верзија ја правиме ние" : "We write the other language"} body={`${t.translateNote} „${t.badge}“ ${t.translateUntil}`} />
            <fieldset>
              <legend className="mb-2 text-sm font-semibold">{t.seasons} <span className="font-normal text-muted-foreground">{t.optional}</span></legend>
              <div className="flex flex-wrap gap-2">
                {SEASONS.map((item) => {
                  const on = seasons.includes(item.id);
                  return (
                    <button key={item.id} type="button" aria-pressed={on} className="inline-flex h-11 items-center" onClick={() => setSeasons(on ? seasons.filter((id) => id !== item.id) : [...seasons, item.id])}>
                      <span className={on ? "inline-flex h-9 items-center rounded-pill border border-primary bg-primary px-3 text-sm font-medium text-primary-foreground" : "inline-flex h-9 items-center rounded-pill border border-input px-3 text-sm font-medium"}>{lang === "mk" ? item.mk : item.en}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>
        )}

        {step === "review" && (
          <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
            <div><h2 className="font-display text-[22px] font-extrabold">{t.reviewTitle}</h2><p className="text-[15px] text-muted-foreground">{t.reviewLead}</p></div>
            <article className="overflow-hidden rounded-lg border border-border bg-card">
              {photos[0] && <img src={photos[0].previewUrl} alt="" className="aspect-hero w-full object-cover" />}
              <div className="flex flex-col gap-2 p-4">
                <span className="inline-flex h-6 w-fit items-center rounded-pill bg-region-bg px-2 text-xs font-semibold text-region">{[cat ? (lang === "mk" ? cat.mk : cat.en) : "", ...subcategories.map((id) => SUBCATEGORIES[category ?? "nature"].find((item) => item.id === id)?.[lang === "mk" ? "mk" : "en"])].filter(Boolean).join(" · ")}</span>
                <h3 className="font-display text-xl font-bold">{name}</h3>
                <p className="line-clamp-3 text-sm text-muted-foreground">{story}</p>
                <p className="text-[13px] text-muted-foreground">{t.credit}</p>
              </div>
              <Row label={t.location} value={`${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`} onEdit={() => setStep("location")} edit={t.edit} />
              <Row label={t.photosWord} value={`${photos.length} · ${t.compressed}`} onEdit={() => setStep("photos")} edit={t.edit} />
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-4 py-3 text-sm">
                <span><span className="text-muted-foreground">{t.storyWord}</span> · {storyLang.toUpperCase()} ({t.yours})</span>
                <span className="inline-flex h-[26px] items-center gap-1 rounded-pill border border-dashed border-warning bg-warning/15 px-2 text-xs font-semibold text-warning"><Languages className="h-3.5 w-3.5" />{t.badge}</span>
                <button type="button" className="font-semibold text-primary" onClick={() => setStep("story")}>{t.edit}</button>
              </div>
            </article>
            <Note tone="info" title={t.nextWhat} body={t.nextBody} />
          </div>
        )}
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-header flex gap-2 border-t border-border bg-background px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:right-auto lg:left-1/2 lg:w-full lg:max-w-5xl lg:-translate-x-1/2 lg:px-8">
        {step !== "location" && <button type="button" className="inline-flex h-[52px] items-center justify-center rounded-lg border border-input px-4 font-semibold" onClick={() => setStep(STEPS[stepIndex - 2])}>{t.back}</button>}
        <button type="button" disabled={blocked || photosBusy} className="inline-flex h-[52px] flex-1 items-center justify-center rounded-lg bg-primary px-4 font-semibold text-primary-foreground disabled:opacity-50 lg:flex-none lg:min-w-[200px]" onClick={() => { if (nearby && !ackDuplicate && step === "location") { setAckDuplicate(true); return; } void goNext(); }}>{continueLabel}</button>
      </div>
    </Shell>
  );
};

function Shell({ title, stepLabel, progress = 0, onClose, back, showProgress = true, steps = [], closeLabel = "Close", backLabel = "Back", children }: { title: string; stepLabel: string; progress?: number; onClose: () => void; back?: boolean; showProgress?: boolean; steps?: readonly string[]; closeLabel?: string; backLabel?: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-header border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-1 px-2 lg:h-16 lg:px-8">
          <button type="button" className="grid h-11 w-11 place-items-center" aria-label={back ? backLabel : closeLabel} onClick={onClose}>{back ? <ArrowLeft /> : <X />}</button>
          <h1 className="truncate text-[17px] font-bold">{title}</h1>
          {stepLabel && <span className="ml-auto pr-2 text-[13px] text-muted-foreground">{stepLabel}</span>}
        </div>
        {showProgress && progress > 0 && <div className="h-1 bg-muted lg:hidden"><div className="h-full bg-primary" style={{ width: `${progress * 20}%` }} /></div>}
        {showProgress && steps.length > 0 && (
          <ol className="mx-auto hidden max-w-5xl gap-2 px-8 pb-3 lg:flex">
            {steps.map((label, index) => (
              <li key={label} className={`flex-1 border-t-2 pt-1.5 text-xs font-semibold ${index < progress ? "border-primary text-foreground" : "border-muted text-muted-foreground"}`}>
                {index + 1}. {label}
              </li>
            ))}
          </ol>
        )}
      </header>
      {children}
    </div>
  );
}

function Note({ tone, title, body, alert }: { tone: "err" | "warn" | "info"; title: string; body: string; alert?: boolean }) {
  const toneClass = tone === "err" ? "border-destructive/60 bg-destructive/15" : tone === "warn" ? "border-warning/50 bg-warning/15" : "border-info/45 bg-info/15";
  return (
    <div role={alert || tone === "err" ? "alert" : "status"} className={`flex gap-2.5 rounded-xl border p-3 text-sm ${toneClass}`}>
      {tone === "err" ? <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> : <Shield className="mt-0.5 h-4 w-4 shrink-0" />}
      <div><b className="block">{title}</b>{body}</div>
    </div>
  );
}

function CheckRow({ checked, onChange, label, invalid }: { checked: boolean; onChange: (value: boolean) => void; label: ReactNode; invalid?: boolean }) {
  return (
    <label className="flex min-h-11 items-start gap-3 text-sm">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="peer sr-only" />
      <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[4px] border peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring ${checked ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background"} ${invalid ? "border-destructive" : ""}`}>
        {checked && <Check className="h-3.5 w-3.5" />}
      </span>
      <span className={invalid ? "text-destructive" : ""}>{label}</span>
    </label>
  );
}

function Row({ label, value, onEdit, edit }: { label: string; value: string; onEdit: () => void; edit: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm">
      <span><span className="text-muted-foreground">{label}</span> · <span className="font-mono">{value}</span></span>
      <button type="button" className="font-semibold text-primary" onClick={onEdit}>{edit}</button>
    </div>
  );
}

function MapArt({ strict }: { strict: boolean }) {
  return (
    <svg viewBox="0 0 400 340" className="absolute inset-0 h-full w-full" aria-hidden>
      <rect width="400" height="340" fill="hsl(var(--muted))" />
      <path d="M0 230 C80 200 120 260 200 240 S330 180 400 210 L400 340 L0 340Z" fill="hsl(var(--brand-lake) / 0.35)" />
      <path d="M120 40 L310 30 L350 190 L190 225 L105 150Z" fill={strict ? "hsl(var(--destructive) / 0.28)" : "hsl(var(--success) / 0.22)"} stroke={strict ? "hsl(var(--destructive))" : "hsl(var(--success))"} strokeDasharray="5 4" />
      <text x="12" y="328" fontSize="10" fill="hsl(var(--muted-foreground))">© OpenStreetMap</text>
    </svg>
  );
}

export default AddGemPage;
