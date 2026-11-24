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
    contactLead: "Rejalaringiz bilan o‘rtoqlashing. Biz aniq va amaliy yo‘lni topishga yordam beramiz.",
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
    contactLead: "Расскажите о планах. Мы поможем найти ясный и практичный путь вперёд.",
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
    contactLead: "Share what you are planning. We will help you find a clear, practical way forward.",
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
const contactOrder = ["phone", "telegram", "instagram", "address", "working_hours"];
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

function contactLink(key, value) {
  switch (key) {
    case "phone": return `tel:${value.replace(/[^+\d]/g, "")}`;
    case "telegram": return `https://t.me/${socialHandle(value)}`;
    case "instagram": return `https://instagram.com/${socialHandle(value)}`;
    default: return null;
  }
}

function renderContact(lang) {
  if (!contactData) return;
  document.querySelectorAll("[data-contact-email]").forEach(link => {
    if (contactData.email) {
      const at = contactData.email.lastIndexOf("@");
      // allow the long address to wrap only at the "@"
      link.innerHTML = at > 0 ? `${escapeHtml(contactData.email.slice(0, at))}<wbr>${escapeHtml(contactData.email.slice(at))}` : escapeHtml(contactData.email);
      link.href = `mailto:${contactData.email}`;
      link.hidden = false;
    } else {
      link.hidden = true;
    }
  });
  document.querySelector("#contact-list").innerHTML = contactOrder.filter(key => contactData[key]).map(key => {
    const value = contactData[key];
    const social = key === "telegram" || key === "instagram";
    const shown = social ? "@" + socialHandle(value) : value;
    const href = contactLink(key, value);
    const valueHtml = href
      ? `<a class="contact-value" href="${escapeHtml(href)}"${social ? ' target="_blank" rel="noopener"' : ""}>${escapeHtml(shown)}</a>`
      : `<span class="contact-value">${escapeHtml(shown)}</span>`;
    return `<li><span class="contact-label">${stack(d => d.contactLabels[key], lang)}</span>${valueHtml}</li>`;
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
