const copy = {
  uz: {
    metaTitle: "TashDevs — Innovatsion IT yechimlar",
    metaDescription: "TashDevs — innovatsion IT yechimlar. Biznes ehtiyojlariga mos veb-saytlar, ilovalar va avtomatlashtirish.",
    skip: "Aloqa ma’lumotlariga o‘tish",
    languageLabel: "Til",
    talk: "Biz bilan bog‘laning",
    statement: "Innovatsion IT yechimlar",
    lead: "Mahsulot strategiyasi, dizayn va muhandislikni bir jamoada jamlaymiz. Biznes ehtiyojlariga mos raqamli mahsulotlar yaratamiz.",
    photoAlt: "Toshkent shahri va tog‘lar manzarasi",
    contactLead: "Sizga veb-sayt, mobil ilova yoki jamoangiz vaqtini tejaydigan biznes tizimi kerakmi? Biz veb-saytlar, veb va mobil ilovalar, biznes platformalari, tizimlar integratsiyasi hamda sun’iy intellekt yordamida avtomatlashtirish yechimlarini yaratamiz. G‘oyangizni bizga yozing — uni aniq rejaga va ishlaydigan mahsulotga aylantirishga yordam beramiz.",
    services: "Raqamli mahsulotlar | Biznes platformalari | Tizimlar integratsiyasi | Avtomatlashtirish va AI",
    contactLabels: { email: "Email", phone: "Telefon", telegram: "Telegram", instagram: "Instagram", address: "Manzil", working_hours: "Ish vaqti" }
  },
  ru: {
    metaTitle: "TashDevs — Инновационные IT-решения",
    metaDescription: "TashDevs — инновационные IT-решения. Сайты, приложения и автоматизация для задач бизнеса.",
    skip: "Перейти к контактам",
    languageLabel: "Язык",
    talk: "Свяжитесь с нами",
    statement: "Инновационные IT-решения",
    lead: "Стратегия продукта, дизайн и разработка в одной команде. Создаём цифровые решения для конкретных задач бизнеса.",
    photoAlt: "Панорама Ташкента с горами",
    contactLead: "Нужен сайт, мобильное приложение или система, которая сэкономит время вашей команды? Мы создаём сайты, веб- и мобильные приложения, бизнес-платформы, интеграции между системами и автоматизацию с помощью искусственного интеллекта. Напишите нам о своей идее — поможем превратить её в понятный план и работающий продукт.",
    services: "Цифровые продукты | Бизнес-платформы | Интеграция систем | Автоматизация и ИИ",
    contactLabels: { email: "Email", phone: "Телефон", telegram: "Telegram", instagram: "Instagram", address: "Адрес", working_hours: "Часы работы" }
  },
  en: {
    metaTitle: "TashDevs — Innovative IT solutions",
    metaDescription: "TashDevs — innovative IT solutions. Websites, apps and automation built around real business needs.",
    skip: "Skip to contact details",
    languageLabel: "Language",
    talk: "Talk to us",
    statement: "Innovative IT solutions",
    lead: "One focused team for product strategy, design and engineering—building digital products around real business needs.",
    photoAlt: "Tashkent skyline with mountains",
    contactLead: "Need a website, a mobile app or a system that saves your team time? We build websites, web and mobile apps, business platforms, integrations between your systems and AI-powered automation. Write to us about your idea — we will help turn it into a clear plan and a working product.",
    services: "Digital products | Business platforms | Systems integration | Automation & AI",
    contactLabels: { email: "Email", phone: "Phone", telegram: "Telegram", instagram: "Instagram", address: "Address", working_hours: "Working hours" }
  }
};

const languages = ["uz", "ru", "en"];
let currentLanguage = "uz";

// Every translation is rendered in the same grid cell and only the active one
// is visible, so each block is always sized by its longest translation.
function stack(pick, lang) {
  return `<t-stack>${languages.map(l => `<t-v lang="${l}"${l === lang ? "" : ' aria-hidden="true"'}>${pick(copy[l])}</t-v>`).join("")}</t-stack>`;
}

// ---- Contact details: edit contact.txt in the GitHub repo ----
const contactOrder = ["email", "phone", "telegram", "instagram", "address", "working_hours"];
let contactData = null;

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}

function parseContactFile(text) {
  const data = {};
  text.split(/\r?\n/).forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const colon = trimmed.indexOf(":");
    if (colon === -1) return;
    const key = trimmed.slice(0, colon).trim().toLowerCase().replace(/\s+/g, "_");
    const value = trimmed.slice(colon + 1).trim();
    if (value) data[key] = value;
  });
  return data;
}

function socialHandle(value) {
  return value.replace(/^@/, "").replace(/^https?:\/\/(www\.)?(t\.me|instagram\.com)\//, "").replace(/\/$/, "");
}

// Long email addresses may wrap only at the "@".
function emailHtml(email) {
  const at = email.lastIndexOf("@");
  return at > 0 ? `${escapeHtml(email.slice(0, at))}<wbr>${escapeHtml(email.slice(at))}` : escapeHtml(email);
}

function contactLink(key, value) {
  switch (key) {
    case "email": return `mailto:${value}`;
    case "phone": return `tel:${value.replace(/[^+\d]/g, "")}`;
    case "telegram": return `https://t.me/${socialHandle(value)}`;
    case "instagram": return `https://instagram.com/${socialHandle(value)}`;
    default: return null;
  }
}

function renderContact(lang) {
  if (!contactData) return;
  // The big link in the contact section is Telegram; email is used only if there is no Telegram.
  const primary = contactData.telegram ? "telegram" : contactData.email ? "email" : null;
  document.querySelectorAll("[data-contact-primary]").forEach(link => {
    link.hidden = !primary;
    if (!primary) return;
    const icon = link.querySelector(".contact-primary-icon");
    const text = link.querySelector(".contact-primary-text");
    if (primary === "telegram") {
      const handle = socialHandle(contactData.telegram);
      link.href = `https://t.me/${handle}`;
      link.target = "_blank";
      link.rel = "noopener";
      link.setAttribute("aria-label", `Telegram @${handle}`);
      icon.removeAttribute("hidden");
      text.textContent = `@${handle}`;
    } else {
      link.href = `mailto:${contactData.email}`;
      link.removeAttribute("target");
      link.removeAttribute("rel");
      link.removeAttribute("aria-label");
      icon.setAttribute("hidden", "");
      text.innerHTML = emailHtml(contactData.email);
    }
  });
  document.querySelectorAll("[data-contact-telegram]").forEach(link => {
    if (contactData.telegram) {
      const handle = socialHandle(contactData.telegram);
      link.href = `https://t.me/${handle}`;
      link.setAttribute("aria-label", `Telegram @${handle}`);
      link.querySelector(".header-telegram-handle").textContent = `@${handle}`;
      link.hidden = false;
    } else {
      link.hidden = true;
    }
  });
  document.querySelector("#contact-list").innerHTML = contactOrder.filter(key => key !== primary && contactData[key]).map(key => {
    const value = contactData[key];
    const social = key === "telegram" || key === "instagram";
    const shownHtml = key === "email" ? emailHtml(value) : escapeHtml(social ? "@" + socialHandle(value) : value);
    const href = contactLink(key, value);
    const valueHtml = href
      ? `<a class="contact-value" href="${escapeHtml(href)}"${social ? ' target="_blank" rel="noopener"' : ""}>${shownHtml}</a>`
      : `<span class="contact-value">${shownHtml}</span>`;
    return `<li class="contact-item-${key}"><span class="contact-label">${stack(d => d.contactLabels[key], lang)}</span>${valueHtml}</li>`;
  }).join("");
}

fetch("/contact.txt", { cache: "no-cache" })
  .then(response => (response.ok ? response.text() : Promise.reject()))
  .then(text => { contactData = parseContactFile(text); renderContact(currentLanguage); })
  .catch(() => {});

// ---- Language ----
function setLanguage(lang) {
  const data = copy[lang] || copy.uz;
  currentLanguage = copy[lang] ? lang : "uz";
  document.documentElement.lang = currentLanguage;
  document.title = data.metaTitle;
  document.querySelector('meta[name="description"]').content = data.metaDescription;
  document.querySelector('meta[property="og:title"]').content = data.metaTitle;
  document.querySelector('meta[property="og:description"]').content = data.metaDescription;
  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.dataset.i18n;
    if (data[key] !== undefined) element.innerHTML = stack(d => d[key], currentLanguage);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach(element => element.setAttribute("aria-label", data[element.dataset.i18nAria]));
  document.querySelectorAll("[data-i18n-alt]").forEach(element => element.setAttribute("alt", data[element.dataset.i18nAlt]));
  document.querySelectorAll("[data-lang]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.lang === currentLanguage)));
  renderContact(currentLanguage);
  try { localStorage.setItem("tashdevs-language", currentLanguage); } catch {}
}

document.querySelectorAll("[data-lang]").forEach(button => button.addEventListener("click", () => setLanguage(button.dataset.lang)));
document.querySelector("#year").textContent = new Date().getFullYear();

let initialLanguage = "uz";
try {
  const stored = localStorage.getItem("tashdevs-language");
  if (copy[stored]) initialLanguage = stored;
} catch {}
setLanguage(initialLanguage);
