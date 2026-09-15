import "./style.css";

const API = import.meta.env.DEV ? "http://localhost:5000/api" : "/api";
const app = document.querySelector("#app");

app.innerHTML = `
<header class="hero"><div class="hero-inner">
<div><p class="eyebrow">FULL STACK DEVELOPMENT • TASK 05</p>
<h1>Production-Ready Internship Portal</h1>
<p>Responsive, validated and security-conscious full-stack application.</p></div>
<div id="apiStatus" class="status-pill" role="status" aria-live="polite">Checking API…</div>
</div></header>
<main class="container">
<section class="card" aria-labelledby="form-title">
<h2 id="form-title">Application Form</h2>
<p class="muted">Validated in the browser and again on the server.</p>
<div id="formMessage" class="message hidden" role="status" aria-live="polite"></div>
<form id="applicationForm" novalidate>
<div class="grid">
<label>Full name<input name="name" maxlength="80" autocomplete="name" required><small data-error="name"></small></label>
<label>Email<input name="email" type="email" maxlength="120" autocomplete="email" required><small data-error="email"></small></label>
<label>Phone<input name="phone" maxlength="20" autocomplete="tel" required><small data-error="phone"></small></label>
<label>Course<select name="course" required><option value="">Choose a course</option><option>Full Stack Development</option><option>Frontend Development</option><option>Backend Development</option><option>AI/ML</option></select><small data-error="course"></small></label>
</div>
<label>Message<textarea name="message" rows="5" maxlength="1000" required placeholder="Tell us why you are interested…"></textarea><small data-error="message"></small></label>
<button id="submitButton" type="submit">Submit Application</button>
</form></section>

<section class="card" aria-labelledby="applications-title">
<div class="section-heading"><div><h2 id="applications-title">Submitted Applications</h2>
<p id="applicationsState" class="muted" role="status" aria-live="polite">Loading applications…</p></div>
<button id="retryButton" class="secondary" type="button">Refresh</button></div>
<div id="applications" class="applications"></div>
</section></main>`;

const form = document.querySelector("#applicationForm");
const message = document.querySelector("#formMessage");
const submit = document.querySelector("#submitButton");
const state = document.querySelector("#applicationsState");
const list = document.querySelector("#applications");
const retry = document.querySelector("#retryButton");
const apiStatus = document.querySelector("#apiStatus");

const escapeHtml = v => String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");

function setMessage(text, type="success") {
  message.textContent = text;
  message.className = `message ${type}`;
}

function showErrors(errors={}) {
  document.querySelectorAll("[data-error]").forEach(e => e.textContent = "");
  Object.entries(errors).forEach(([key, value]) => {
    const el = document.querySelector(`[data-error="${key}"]`);
    if (el) el.textContent = value;
  });
}

function clientValidate(data) {
  const e = {};
  if (data.name.trim().length < 2) e.name = "Enter at least 2 characters.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) e.email = "Enter a valid email.";
  if (!/^[0-9+\-\s()]{7,20}$/.test(data.phone.trim())) e.phone = "Enter a valid phone number.";
  if (!data.course) e.course = "Choose a course.";
  if (data.message.trim().length < 10) e.message = "Message must be at least 10 characters.";
  return e;
}

async function request(url, options={}, retries=2) {
  let last;
  for (let attempt=0; attempt<=retries; attempt++) {
    try {
      const r = await fetch(url, options);
      const body = await r.json().catch(() => ({}));
      if (!r.ok) {
        const error = new Error(body.message || "Request failed.");
        error.payload = body; error.status = r.status; throw error;
      }
      return body;
    } catch (e) {
      last = e;
      if (e.status || attempt === retries) break;
      await new Promise(resolve => setTimeout(resolve, 400 * (attempt + 1)));
    }
  }
  throw last;
}

function render(items) {
  if (!items.length) {
    list.innerHTML = `<div class="empty">No applications submitted yet.</div>`;
    return;
  }
  list.innerHTML = items.map(x => `<article class="application">
  <div class="application-top"><strong>${escapeHtml(x.name)}</strong><span>${escapeHtml(x.course)}</span></div>
  <p>${escapeHtml(x.message)}</p><small>${escapeHtml(x.email)} • ${escapeHtml(x.phone)}</small>
  </article>`).join("");
}

async function load() {
  state.textContent = "Loading applications…";
  list.innerHTML = "";
  try {
    const body = await request(`${API}/applications`);
    render(body.data || []);
    state.textContent = `${body.data?.length || 0} application(s) loaded.`;
    apiStatus.textContent = "API Connected";
    apiStatus.className = "status-pill online";
  } catch (e) {
    state.textContent = "Unable to load applications.";
    list.innerHTML = `<div class="error-box"><strong>Connection problem</strong><p>${escapeHtml(e.message)}</p><button class="secondary" id="inlineRetry" type="button">Retry</button></div>`;
    apiStatus.textContent = "API Unavailable";
    apiStatus.className = "status-pill offline";
    document.querySelector("#inlineRetry")?.addEventListener("click", load);
  }
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  showErrors({});
  message.className = "message hidden";
  const data = Object.fromEntries(new FormData(form).entries());
  const errors = clientValidate(data);

  if (Object.keys(errors).length) {
    showErrors(errors);
    setMessage("Please correct the highlighted fields.", "error");
    return;
  }

  submit.disabled = true;
  submit.textContent = "Submitting…";

  try {
    const body = await request(`${API}/applications`, {
      method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data)
    });
    setMessage(body.message || "Application submitted successfully.");
    form.reset();
    await load();
  } catch (e) {
    if (e.payload?.errors) showErrors(e.payload.errors);
    setMessage(e.message || "Submission failed. Please try again.", "error");
  } finally {
    submit.disabled = false;
    submit.textContent = "Submit Application";
  }
});

retry.addEventListener("click", load);
load();
