import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { supabase } from "./supabase";

const C = {
  oliveDark: "#4a4a2e", olive: "#6b6b44", olivePale: "#f0ede0", oliveXpale: "#f8f6ef",
  terra: "#c17b5a", terraDark: "#9a5c3e", terraPale: "#faf0ea",
  cream: "#faf8f4", soft: "#9a9a80", mid: "#5a5a42", dark: "#1e1e14", white: "#ffffff",
  success: "#4a7c5a", successPale: "#edf5f0", warn: "#a06030", warnPale: "#fdf3e8",
  danger: "#a03030", dangerPale: "#fdf0f0", border: "rgba(107,107,68,0.15)",
};

function whatsappLink(telefon, missatge) {
  if (!telefon) return null;
  const tel = telefon.replace(/[^0-9+]/g, "").replace(/^\+/, "");
  return `https://wa.me/${tel}?text=${encodeURIComponent(missatge)}`;
}

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

const btn = (type, extra = {}) => {
  const base = { padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all .15s", border: "none" };
  const types = {
    primary: { background: C.olive, color: C.white },
    secondary: { background: C.oliveXpale, color: C.oliveDark, border: `0.5px solid ${C.border}` },
    danger: { background: C.dangerPale, color: C.danger, border: `0.5px solid rgba(160,48,48,0.2)` },
    success: { background: C.successPale, color: C.success, border: `0.5px solid rgba(74,122,90,0.3)` },
    warn: { background: C.warnPale, color: C.warn, border: `0.5px solid rgba(160,96,48,0.2)` },
    terra: { background: C.terra, color: C.white },
  };
  return { ...base, ...types[type], ...extra };
};

const tag = (type) => {
  const types = {
    ok: { background: C.successPale, color: C.success },
    cancel: { background: C.dangerPale, color: C.danger },
    warn: { background: C.warnPale, color: C.warn },
    olive: { background: C.olivePale, color: C.oliveDark },
  };
  return { ...types[type], fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 500, whiteSpace: "nowrap" };
};

const card = { background: C.white, borderRadius: 14, border: `0.5px solid ${C.border}`, overflow: "hidden", marginBottom: 14 };

function Modal({ title, sub, onClose, children }) {
  const mobile = useIsMobile();
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(30,30,20,0.5)", zIndex: 300, display: "flex", alignItems: mobile ? "flex-end" : "center", justifyContent: "center" }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: C.white, borderRadius: mobile ? "20px 20px 0 0" : 18, padding: mobile ? "0 20px 36px" : 28, width: mobile ? "100%" : 480, maxWidth: "100vw", maxHeight: "88vh", overflowY: "auto", position: "relative" }}>
        {mobile && <div style={{ width: 36, height: 4, borderRadius: 2, background: C.border, margin: "12px auto 20px" }} />}
        <button onClick={onClose} style={{ position: "absolute", top: mobile ? 16 : 18, right: 18, background: "transparent", border: `0.5px solid ${C.border}`, borderRadius: 6, width: 28, height: 28, cursor: "pointer", fontSize: 14, color: C.soft }}>x</button>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.oliveDark, marginBottom: 4 }}>{title}</div>
        {sub && <div style={{ fontSize: 13, color: C.soft, fontWeight: 300, marginBottom: 20 }}>{sub}</div>}
        {children}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 10, letterSpacing: "1.5px", textTransform: "uppercase", color: C.soft, marginBottom: 5 }}>{label}</div>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} type={type}
        style={{ width: "100%", padding: "9px 12px", border: `0.5px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: C.dark, background: C.cream, outline: "none", boxSizing: "border-box" }} />
    </div>
  );
}

// ── LOGIN ALUMNA ──────────────────────────────────────────
function LoginAlumna({ onLogin }) {
  const [telefon, setTelefon] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    if (!telefon.trim()) return setError("Introdueix el teu telefon");
    setLoading(true);
    setError("");
    const tel = telefon.trim();
    const { data, error: err } = await supabase.from("alumnes").select("*").eq("telefon", tel).eq("activa", true).single();
    setLoading(false);
    if (err || !data) {
      setError("No hem trobat cap compte amb aquest numero. Contacta amb Focus Benestar.");
      return;
    }
    onLogin(data);
  }

  return (
    <div style={{ minHeight: "100vh", background: C.oliveDark, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", bottom: -40, right: -20, fontFamily: "'Playfair Display', serif", fontSize: 200, fontWeight: 700, color: "rgba(255,255,255,0.03)", lineHeight: 1, pointerEvents: "none" }}>focus</div>
      <div style={{ width: "100%", maxWidth: 380, position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: C.white, lineHeight: 1, marginBottom: 6 }}>focus</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, fontStyle: "italic", color: "#d9a080" }}>et cuida.</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 18, padding: 28, border: "0.5px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.white, marginBottom: 6 }}>Accedeix a la teva area</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 300, marginBottom: 24, lineHeight: 1.5 }}>Introdueix el teu numero de WhatsApp per entrar</div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Telefon WhatsApp</div>
            <input
              value={telefon}
              onChange={e => { setTelefon(e.target.value); setError(""); }}
              placeholder="+376 600 111"
              type="tel"
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              style={{ width: "100%", padding: "12px 14px", border: "0.5px solid rgba(255,255,255,0.15)", borderRadius: 10, fontSize: 15, fontFamily: "'DM Sans', sans-serif", color: C.white, background: "rgba(255,255,255,0.08)", outline: "none", boxSizing: "border-box" }}
            />
          </div>
          {error && <div style={{ background: C.dangerPale, color: C.danger, fontSize: 12, padding: "8px 12px", borderRadius: 8, marginBottom: 14, lineHeight: 1.5 }}>{error}</div>}
          <button onClick={handleLogin} disabled={loading} style={{ ...btn("terra"), width: "100%", padding: 13, fontSize: 14, borderRadius: 10, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Comprovant..." : "Entrar"}
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 300 }}>
          Problemes per accedir? Escriu-nos al WhatsApp del centre
        </div>
      </div>
    </div>
  );
}

// ── VISTA ALUMNA ──────────────────────────────────────────
// Helper: get next date for a given weekday (1=Mon...5=Fri)
function getNextDate(diaSetmana) {
  const avui = new Date();
  const avuiDia = avui.getDay() === 0 ? 7 : avui.getDay();
  let diff = diaSetmana - avuiDia;
  if (diff <= 0) diff += 7;
  const next = new Date(avui);
  next.setDate(avui.getDate() + diff);
  return next;
}

function formatDataCurta(date) {
  const dies = ["", "Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres", "Dissabte", "Diumenge"];
  const mesos = ["gener", "febrer", "marc", "abril", "maig", "juny", "juliol", "agost", "setembre", "octubre", "novembre", "desembre"];
  const dia = date.getDay() === 0 ? 7 : date.getDay();
  return `${dies[dia]} ${date.getDate()} de ${mesos[date.getMonth()]}`;
}

function generateSlots(franges, horarisFixos, assistencies, bloquejos = []) {
  const slots = [];
  const avui = new Date();
  avui.setHours(0,0,0,0);
  const limit = new Date(avui);
  limit.setDate(avui.getDate() + 30);

  for (let d = new Date(avui); d <= limit; d.setDate(d.getDate() + 1)) {
    const diaSemana = d.getDay() === 0 ? 7 : d.getDay();
    if (diaSemana > 5) continue;
    const dateStr = d.toISOString().split("T")[0];

    franges.forEach(f => {
      if (f.dia_setmana !== diaSemana) return;
      // Skip blocked dates
      if (bloquejos.some(b => b.franja_id === f.id && b.data === dateStr)) return;
      const max = f.tipus_classe === "individual" ? 1 : 3;

      // Count fixed horaris for this franja (always occupy a spot)
      const fixos = horarisFixos.filter(h =>
        h.franja_id === f.id && h.actiu && (h.tipus === "fix" || !h.tipus)
      ).length;

      // Count puntual classes for this specific date
      const puntuals = horarisFixos.filter(h =>
        h.franja_id === f.id && h.actiu && h.tipus === "puntual" && h.data_classe === dateStr
      ).length;

      // Count cancellations for this specific date (frees up spots)
      const cancelades = assistencies.filter(a =>
        a.franja_id === f.id && a.data === dateStr && a.estat === "cancelada"
      ).length;

      // Count recuperacions for this date (occupies spots)
      const recuperacions = assistencies.filter(a =>
        a.franja_id === f.id && a.data === dateStr && a.estat === "recuperacio"
      ).length;

      const ocupades = fixos + puntuals - cancelades + recuperacions;
      const lliures = Math.max(0, max - ocupades);

      if (lliures > 0) {
        slots.push({
          franja_id: f.id, franja: f, data: dateStr, dataObj: new Date(d),
          lliures, max, ocupades, servei: f.serveis?.nom || "",
          hora: f.hora_inici?.slice(0,5) || "", hora_fi: f.hora_fi?.slice(0,5) || "",
        });
      }
    });
  }
  return slots.sort((a,b) => a.data.localeCompare(b.data) || a.hora.localeCompare(b.hora));
}

function VistaAlumnaPanel({ alumna, onLogout }) {
  const mobile = useIsMobile();
  const [tab, setTab] = useState("inici");
  const [horaris, setHoraris] = useState([]);
  const [assistencies, setAssistencies] = useState([]);
  const [recuperacions, setRecuperacions] = useState([]);
  const [franges, setFranges] = useState([]);
  const [ocupacions, setOcupacions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalCancelar, setModalCancelar] = useState(null);
  const [modalSlot, setModalSlot] = useState(null);
  const [motiu, setMotiu] = useState("");
  const [slotAction, setSlotAction] = useState("recuperacio");

  useEffect(() => { fetchDades(); }, []);

  async function fetchDades() {
    setLoading(true);
    const avui = new Date();
    const limit = new Date(avui);
    limit.setDate(avui.getDate() + 30);
    const limitStr = limit.toISOString().split("T")[0];
    const avuiStr = avui.toISOString().split("T")[0];
    const [h, a, r, fr, totsHoraris, assistenciesClasses] = await Promise.all([
      // This alumna's horaris
      supabase.from("horaris_alumnes").select("*, franges(*, serveis(*), professores(*))").eq("alumna_id", alumna.id).eq("actiu", true).order("tipus").order("data_classe"),
      // This alumna's assistencies history
      supabase.from("assistencies").select("*, classes(*, franges(*, serveis(*)))").eq("alumna_id", alumna.id).order("created_at", { ascending: false }).limit(20),
      // This alumna's recuperacions
      supabase.from("recuperacions").select("*").eq("alumna_id", alumna.id).order("created_at", { ascending: false }),
      // All franges
      supabase.from("franges").select("*, serveis(*)").eq("activa", true),
      // ALL horaris fixos (to count real occupancy per franja)
      supabase.from("horaris_alumnes").select("franja_id, actiu, tipus, data_classe").eq("actiu", true),
      // All assistencies for next 30 days (cancelations + recuperacions)
      supabase.from("assistencies").select("estat, classes(franja_id, data)").gte("classes.data", avuiStr).lte("classes.data", limitStr),
    ]);
    if (h.data) setHoraris(h.data);
    if (a.data) setAssistencies(a.data);
    if (r.data) setRecuperacions(r.data);
    if (fr.data) setFranges(fr.data);
    // Build ocupacions flat list from assistencies
    const flat = [];
    if (assistenciesClasses.data) {
      assistenciesClasses.data.forEach(ass => {
        if (ass.classes) {
          flat.push({ franja_id: ass.classes.franja_id, data: ass.classes.data, estat: ass.estat });
        }
      });
    }
    // Store all horaris for occupancy calculation
    if (totsHoraris.data) setOcupacions(totsHoraris.data);
    // We'll use a combined state - repurpose ocupacions to store all horaris fixos
    // and pass assistencies flat to generateSlots via a ref
    if (totsHoraris.data) setOcupacions(totsHoraris.data);
    window._assistenciesFlat = flat;

    // Fetch bloquejos
    const avuiStr2 = avui.toISOString().split("T")[0];
    const { data: bloquejos } = await supabase.from("bloquejos").select("*").gte("data", avuiStr2).lte("data", limitStr);
    window._bloquejos = bloquejos || [];

    setLoading(false);
  }

  async function handleCancelar() {
    if (!modalCancelar) return;
    const h = modalCancelar;
    const franja = h.franges;
    const nextDate = getNextDate(franja?.dia_setmana);
    const nextDateStr = nextDate.toISOString().split("T")[0];
    const horaInici = franja?.hora_inici || "00:00";
    const classeDateTime = new Date(nextDateStr + "T" + horaInici);
    const horasDiff = (classeDateTime - new Date()) / (1000 * 60 * 60);
    const tipusCancelacio = horasDiff >= 24 ? "mes_24h" : "menys_24h";
    let classeId = null;
    const { data: existingClasse } = await supabase.from("classes").select("id").eq("franja_id", franja?.id).eq("data", nextDateStr).single();
    if (existingClasse) {
      classeId = existingClasse.id;
    } else {
      const { data: newClasse } = await supabase.from("classes").insert([{ franja_id: franja?.id, data: nextDateStr, estat: "programada" }]).select().single();
      if (newClasse) classeId = newClasse.id;
    }
    if (classeId) {
      const { data: existing } = await supabase.from("assistencies").select("id").eq("classe_id", classeId).eq("alumna_id", alumna.id).single();
      if (existing) {
        await supabase.from("assistencies").update({ estat: "cancelada", tipus_cancelacio: tipusCancelacio, data_cancelacio: new Date().toISOString(), motiu_cancelacio: motiu }).eq("id", existing.id);
      } else {
        await supabase.from("assistencies").insert([{ classe_id: classeId, alumna_id: alumna.id, estat: "cancelada", tipus_cancelacio: tipusCancelacio, data_cancelacio: new Date().toISOString(), motiu_cancelacio: motiu }]);
      }
    }
    if (tipusCancelacio === "mes_24h") {
      const caducitat = new Date();
      caducitat.setMonth(caducitat.getMonth() + 1);
      await supabase.from("recuperacions").insert([{ alumna_id: alumna.id, estat: "pendent", data_caducitat: caducitat.toISOString().split("T")[0] }]);
    }
    setModalCancelar(null);
    setMotiu("");
    fetchDades();
    // Crear notificacio per a la professora
    const franjaObj = modalCancelar?.franges;
    if (franjaObj?.professora_id) {
      const nextDate = getNextDate(franjaObj.dia_setmana);
      const missatge = `${alumna.nom} ${alumna.cognom} ha cancel·lat la classe del ${formatDataCurta(nextDate)} a les ${franjaObj.hora_inici?.slice(0,5)}`;
      await supabase.from("notificacions").insert([{
        alumna_id: alumna.id,
        tipus: "cancelacio",
        canal: "app",
        missatge,
        estat: "pendent"
      }]);
    }

    if (tipusCancelacio === "mes_24h") {
      alert("Classe cancel.lada. Tens 30 dies per recuperar-la des del calendari!");
    } else {
      alert("Classe cancel.lada. Com que es menys de 24h, no es pot recuperar.");
    }
  }

  async function handleApuntarSlot(slot) {
    const pendentsRecup = recuperacions.filter(r => r.estat === "pendent" && !r.data_proposta_alumna);
    if (slotAction === "recuperacio" && pendentsRecup.length > 0) {
      const recup = pendentsRecup[0];
      await supabase.from("recuperacions").update({ data_proposta_alumna: slot.data, estat: "aprovada" }).eq("id", recup.id);
      let classeId = null;
      const { data: existingClasse } = await supabase.from("classes").select("id").eq("franja_id", slot.franja_id).eq("data", slot.data).single();
      if (existingClasse) { classeId = existingClasse.id; }
      else {
        const { data: newClasse } = await supabase.from("classes").insert([{ franja_id: slot.franja_id, data: slot.data, estat: "programada" }]).select().single();
        if (newClasse) classeId = newClasse.id;
      }
      if (classeId) {
        await supabase.from("assistencies").insert([{ classe_id: classeId, alumna_id: alumna.id, estat: "recuperacio" }]);
      }
      setModalSlot(null);
      fetchDades();
      alert("Recuperacio confirmada! Ens veiem el " + formatDataCurta(slot.dataObj) + " a les " + slot.hora);
    } else {
      await supabase.from("canvis_horari").insert([{ alumna_id: alumna.id, franja_sollicitada_id: slot.franja_id, estat: "pendent", nota_alumna: "Sol.licitud des del calendari per al " + slot.data }]);
      setModalSlot(null);
      fetchDades();
      alert("Sol.licitud enviada a Rosario! Et confirmara aviat.");
    }
  }

  const pendentsRecup = recuperacions.filter(r => r.estat === "pendent");
  const slots = generateSlots(franges, ocupacions, window._assistenciesFlat || [], window._bloquejos || []);

  return (
    <div style={{ minHeight: "100vh", background: C.oliveXpale, width: "100%" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      <div style={{ background: C.oliveDark, padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.white }}>focus <span style={{ fontStyle: "italic", fontWeight: 400, color: "#d9a080", fontSize: 14 }}>et cuida.</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: C.terraDark, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 700, color: C.white }}>{alumna.nom[0]}</div>
          <button onClick={onLogout} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, padding: "5px 10px", cursor: "pointer", color: "rgba(255,255,255,0.6)", fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}>Sortir</button>
        </div>
      </div>

      <div style={{ padding: "20px 16px 80px" }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "50vh" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: C.soft, fontStyle: "italic" }}>Carregant...</div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.oliveDark, lineHeight: 1.1 }}>
                Hola, <em style={{ fontWeight: 400, color: C.terra }}>{alumna.nom}.</em>
              </div>
              <div style={{ fontSize: 12, color: C.soft, fontWeight: 300, marginTop: 4 }}>Benvinguda a la teva area personal</div>
            </div>

            {pendentsRecup.length > 0 && (
              <div style={{ background: C.warnPale, border: `0.5px solid rgba(160,96,48,0.2)`, borderRadius: 12, padding: "12px 14px", marginBottom: 16, display: "flex", alignItems: "flex-start", gap: 10 }}>
                <span style={{ fontSize: 18 }}>⚠️</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.warn, marginBottom: 3 }}>Tens {pendentsRecup.length} recuperacio{pendentsRecup.length > 1 ? "ns" : ""} pendent{pendentsRecup.length > 1 ? "s" : ""}</div>
                  <div style={{ fontSize: 12, color: C.warn, fontWeight: 300, lineHeight: 1.4 }}>Caduca: {pendentsRecup[0]?.data_caducitat}</div>
                  <button style={{ ...btn("warn"), marginTop: 8, fontSize: 11, padding: "5px 12px" }} onClick={() => setTab("calendari")}>Triar hora de recuperacio</button>
                </div>
              </div>
            )}

            {tab === "inici" && (
              <>
                <div style={{ fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", color: C.soft, marginBottom: 10 }}>El teu horari fix</div>
                {horaris.length === 0 ? (
                  <div style={{ ...card, padding: "24px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: 13, color: C.soft, fontStyle: "italic" }}>Encara no tens horari assignat. Contacta amb Focus Benestar.</div>
                  </div>
                ) : (
                  horaris.map(h => {
                    const franja = h.franges;
                    const servei = franja?.serveis;
                    const nextDate = franja ? getNextDate(franja.dia_setmana) : null;
                    const esPuntual = h.tipus === "puntual";
                    const dataText = esPuntual && h.data_classe
                      ? formatDataCurta(new Date(h.data_classe + "T12:00:00"))
                      : (nextDate ? formatDataCurta(nextDate) : "");
                    return (
                      <div key={h.id} style={{ background: esPuntual ? C.terraDark : C.oliveDark, borderRadius: 14, padding: 20, marginBottom: 12, position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", bottom: -16, right: -8, fontFamily: "'Playfair Display', serif", fontSize: 90, fontWeight: 700, color: "rgba(255,255,255,0.04)", lineHeight: 1, pointerEvents: "none" }}>focus</div>
                        <div style={{ fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
                          {esPuntual ? "Classe puntual" : "Proxima classe"}
                        </div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.white, marginBottom: 4 }}>{servei?.nom || "Servei"}</div>
                        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 300, marginBottom: 16 }}>
                          {dataText} · {franja?.hora_inici?.slice(0,5) || ""} – {franja?.hora_fi?.slice(0,5) || ""}
                        </div>
                        {!esPuntual && (
                          <button style={{ ...btn("terra"), fontSize: 12, padding: "8px 16px" }} onClick={() => setModalCancelar(h)}>
                            Cancel.lar aquesta classe
                          </button>
                        )}
                      </div>
                    );
                  })
                )}

                <div style={{ fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", color: C.soft, margin: "20px 0 10px" }}>Ultimes classes</div>
                <div style={card}>
                  {assistencies.slice(0, 5).map((a, i, arr) => (
                    <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", borderBottom: i < arr.length - 1 ? `0.5px solid ${C.border}` : "none" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: C.dark }}>{a.classes?.franges?.serveis?.nom || "Classe"}</div>
                        <div style={{ fontSize: 11, color: C.soft, marginTop: 1 }}>{a.classes?.data || ""}</div>
                      </div>
                      <span style={tag(a.estat === "confirmada" ? "ok" : a.estat === "cancelada" ? "cancel" : "warn")}>
                        {a.estat === "confirmada" ? "Assistida" : a.estat === "cancelada" ? "Cancel.lada" : "Recuperacio"}
                      </span>
                    </div>
                  ))}
                  {assistencies.length === 0 && <div style={{ padding: "24px 16px", textAlign: "center", color: C.soft, fontSize: 13, fontStyle: "italic" }}>Encara no tens classes registrades</div>}
                </div>
              </>
            )}

            {tab === "calendari" && (
              <>
                <div style={{ fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", color: C.soft, marginBottom: 6 }}>Places lliures — propers 30 dies</div>
                <div style={{ fontSize: 12, color: C.mid, fontWeight: 300, marginBottom: 16, lineHeight: 1.5 }}>
                  {pendentsRecup.length > 0
                    ? "Tens una recuperacio pendent. Toca qualsevol classe per apuntar-te directament."
                    : "Toca qualsevol classe per sol.licitar un canvi d'horari fix a Rosario."}
                </div>
                {slots.length === 0 ? (
                  <div style={{ ...card, padding: "28px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: 13, color: C.soft, fontStyle: "italic" }}>No hi ha places lliures els propers 30 dies</div>
                  </div>
                ) : (
                  <div style={card}>
                    {slots.map((slot, i, arr) => (
                      <div key={`${slot.franja_id}-${slot.data}`} onClick={() => { setModalSlot(slot); setSlotAction(pendentsRecup.length > 0 ? "recuperacio" : "canvi"); }}
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: i < arr.length - 1 ? `0.5px solid ${C.border}` : "none", cursor: "pointer", transition: "background .15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = C.oliveXpale}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: C.olivePale, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: C.oliveDark, lineHeight: 1 }}>{new Date(slot.dataObj).getDate()}</div>
                          <div style={{ fontSize: 9, color: C.soft, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            {["","gen","feb","mar","abr","mai","jun","jul","ago","set","oct","nov","des"][slot.dataObj.getMonth() + 1]}
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: C.dark }}>{slot.servei}</div>
                          <div style={{ fontSize: 11, color: C.soft, marginTop: 1 }}>{formatDataCurta(slot.dataObj)} · {slot.hora} – {slot.hora_fi}</div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <span style={{ ...tag("ok"), fontSize: 11 }}>{slot.lliures} {slot.lliures === 1 ? "lloc" : "llocs"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {tab === "historial" && (
              <>
                <div style={{ fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", color: C.soft, marginBottom: 10 }}>Historial complet</div>
                <div style={card}>
                  {assistencies.map((a, i, arr) => (
                    <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 16px", borderBottom: i < arr.length - 1 ? `0.5px solid ${C.border}` : "none" }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, background: a.estat === "confirmada" ? C.successPale : a.estat === "cancelada" ? C.dangerPale : C.warnPale, flexShrink: 0 }}>
                        {a.estat === "confirmada" ? "✓" : a.estat === "cancelada" ? "✕" : "↺"}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: C.dark }}>{a.classes?.franges?.serveis?.nom || "Classe"}</div>
                        <div style={{ fontSize: 11, color: C.soft, marginTop: 1 }}>{a.classes?.data || ""}</div>
                      </div>
                      <span style={tag(a.estat === "confirmada" ? "ok" : a.estat === "cancelada" ? "cancel" : "warn")}>
                        {a.estat === "confirmada" ? "Assistida" : a.estat === "cancelada" ? "Cancel.lada" : "Recuperacio"}
                      </span>
                    </div>
                  ))}
                  {assistencies.length === 0 && <div style={{ padding: "24px 16px", textAlign: "center", color: C.soft, fontSize: 13, fontStyle: "italic" }}>Sense historial encara</div>}
                </div>
              </>
            )}
          </>
        )}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: C.white, borderTop: `0.5px solid ${C.border}`, height: 60, zIndex: 100, display: "flex" }}>
        {[
          { key: "inici", label: "Inici", icon: "🏠" },
          { key: "calendari", label: "Places", icon: "📅", count: pendentsRecup.length },
          { key: "historial", label: "Historial", icon: "📋" }
        ].map(item => (
          <button key={item.key} onClick={() => setTab(item.key)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, cursor: "pointer", border: "none", background: "transparent", fontFamily: "'DM Sans', sans-serif", position: "relative" }}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span style={{ fontSize: 9, fontWeight: 500, color: tab === item.key ? C.oliveDark : C.soft }}>{item.label}</span>
            {item.count > 0 && <span style={{ position: "absolute", top: 6, right: "calc(50% - 16px)", background: C.terra, color: "white", fontSize: 9, fontWeight: 500, padding: "1px 5px", borderRadius: 20 }}>{item.count}</span>}
          </button>
        ))}
      </div>

      {modalCancelar && (
        <Modal title="Cancel.lar classe" sub={`Proxima classe: ${modalCancelar.franges ? formatDataCurta(getNextDate(modalCancelar.franges.dia_setmana)) : ""}`} onClose={() => setModalCancelar(null)}>
          <div style={{ background: C.warnPale, border: `0.5px solid rgba(160,96,48,0.2)`, borderRadius: 10, padding: "12px 14px", marginBottom: 16, fontSize: 12, color: C.warn, lineHeight: 1.6 }}>
            Si cancel.les amb mes de 24h d'antelacio, podras recuperar la classe en els propers 30 dies. Si cancel.les amb menys de 24h, la classe es perd.
          </div>
          <Field label="Motiu (opcional)" value={motiu} onChange={setMotiu} placeholder="No em trobo be, feina..." />
          <div style={{ display: "flex", gap: 8, marginTop: 16, paddingTop: 16, borderTop: `0.5px solid ${C.border}` }}>
            <button style={{ ...btn("secondary"), flex: 1 }} onClick={() => setModalCancelar(null)}>Tornar</button>
            <button style={{ ...btn("danger"), flex: 1 }} onClick={handleCancelar}>Si, cancel.lo</button>
          </div>
        </Modal>
      )}

      {modalSlot && (
        <Modal title={slotAction === "recuperacio" ? "Apuntar-me a aquesta classe" : "Sol.licitar canvi d'horari"} sub={`${modalSlot.servei} · ${formatDataCurta(modalSlot.dataObj)} · ${modalSlot.hora}`} onClose={() => setModalSlot(null)}>
          <div style={{ background: slotAction === "recuperacio" ? C.successPale : C.warnPale, borderRadius: 10, padding: "12px 14px", marginBottom: 16, fontSize: 12, color: slotAction === "recuperacio" ? C.success : C.warn, lineHeight: 1.6 }}>
            {slotAction === "recuperacio"
              ? "Aquesta accio confirmara la teva recuperacio directament. No cal esperar confirmacio de Rosario."
              : "S'enviara una sol.licitud a Rosario per canviar el teu horari fix. Ella ho haura d'aprovar."}
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <button onClick={() => setSlotAction("recuperacio")} style={{ flex: 1, padding: "9px", borderRadius: 9, border: `1.5px solid ${slotAction === "recuperacio" ? C.olive : C.border}`, background: slotAction === "recuperacio" ? C.olivePale : C.white, fontSize: 12, fontWeight: 500, cursor: "pointer", color: slotAction === "recuperacio" ? C.oliveDark : C.soft, fontFamily: "'DM Sans', sans-serif" }}>
                Recuperar classe{pendentsRecup.length > 0 ? ` (${pendentsRecup.length} pendent)` : ""}
              </button>
              <button onClick={() => setSlotAction("canvi")} style={{ flex: 1, padding: "9px", borderRadius: 9, border: `1.5px solid ${slotAction === "canvi" ? C.olive : C.border}`, background: slotAction === "canvi" ? C.olivePale : C.white, fontSize: 12, fontWeight: 500, cursor: "pointer", color: slotAction === "canvi" ? C.oliveDark : C.soft, fontFamily: "'DM Sans', sans-serif" }}>
                Canviar horari fix
              </button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8, paddingTop: 16, borderTop: `0.5px solid ${C.border}` }}>
            <button style={{ ...btn("secondary"), flex: 1 }} onClick={() => setModalSlot(null)}>Cancel.lar</button>
            <button style={{ ...btn("primary"), flex: 1 }} onClick={() => handleApuntarSlot(modalSlot)}>
              {slotAction === "recuperacio" ? "Confirmar recuperacio" : "Enviar sol.licitud"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── PANEL ROSARIO ─────────────────────────────────────────
function Sidebar({ active, setActive, counts }) {
  const items = [
    { key: "avui", label: "Avui", section: "Principal" },
    { key: "alumnes", label: "Alumnes", section: "Gestio" },
    { key: "franges", label: "Franges horaries" },
    { key: "espera", label: "Llista d'espera", count: counts.espera },
    { key: "recuperacions", label: "Recuperacions", count: counts.recuperacions },
    { key: "canvis", label: "Canvis d'horari", count: counts.canvis },
  ];
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: 220, height: "100vh", background: C.oliveDark, display: "flex", flexDirection: "column", zIndex: 100 }}>
      <div style={{ padding: "28px 24px 24px", borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: C.white }}>focus</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, fontStyle: "italic", color: "#d9a080", marginTop: 2 }}>et cuida.</div>
      </div>
      <nav style={{ flex: 1, padding: "16px 0", overflowY: "auto" }}>
        {items.map(item => (
          <div key={item.key}>
            {item.section && <div style={{ padding: "6px 16px 4px", fontSize: 9, letterSpacing: "2.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginTop: 10 }}>{item.section}</div>}
            <div onClick={() => setActive(item.key)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 20px", fontSize: 13, color: active === item.key ? C.white : "rgba(255,255,255,0.55)", cursor: "pointer", background: active === item.key ? "rgba(255,255,255,0.07)" : "transparent", borderLeft: active === item.key ? "2px solid #c17b5a" : "2px solid transparent", transition: "all .15s" }}>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.count > 0 && <span style={{ background: C.terra, color: "white", fontSize: 10, fontWeight: 500, padding: "2px 7px", borderRadius: 20 }}>{item.count}</span>}
            </div>
          </div>
        ))}
      </nav>
      <div style={{ padding: "16px 20px", borderTop: "0.5px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.terraDark, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: C.white }}>R</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: C.white }}>Rosario</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Administradora</div>
        </div>
      </div>
    </div>
  );
}

function BottomNav({ active, setActive, counts }) {
  const items = [
    { key: "avui", label: "Avui", icon: "🏠" },
    { key: "alumnes", label: "Alumnes", icon: "👥" },
    { key: "espera", label: "Espera", icon: "⏳", count: counts.espera },
    { key: "recuperacions", label: "Gestio", icon: "↺", count: counts.recuperacions + counts.canvis },
  ];
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: C.white, borderTop: `0.5px solid ${C.border}`, height: 60, zIndex: 200, display: "flex", paddingBottom: "env(safe-area-inset-bottom)" }}>
      {items.map(item => (
        <button key={item.key} onClick={() => setActive(item.key)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, cursor: "pointer", border: "none", background: "transparent", fontFamily: "'DM Sans', sans-serif", position: "relative" }}>
          <span style={{ fontSize: 20 }}>{item.icon}</span>
          <span style={{ fontSize: 9, fontWeight: 500, color: active === item.key ? C.oliveDark : C.soft }}>{item.label}</span>
          {item.count > 0 && <span style={{ position: "absolute", top: 6, right: "calc(50% - 18px)", background: C.terra, color: "white", fontSize: 9, fontWeight: 500, padding: "1px 5px", borderRadius: 20 }}>{item.count}</span>}
        </button>
      ))}
    </div>
  );
}

function VistaAvui({ alumnes, espera, recuperacions, canvis, mobile }) {
  const today = new Date().toLocaleDateString("ca-ES", { weekday: "long", day: "numeric", month: "long" });
  return (
    <div style={{ padding: mobile ? "16px 16px 80px" : "28px 32px" }}>
      <div style={{ marginBottom: mobile ? 16 : 24 }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: mobile ? 20 : 22, fontWeight: 700, color: C.oliveDark }}>Bon dia, Rosario.</div>
        <div style={{ fontSize: 12, color: C.soft, fontWeight: 300, marginTop: 4, textTransform: "capitalize" }}>{today}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4,1fr)", gap: mobile ? 8 : 12, marginBottom: mobile ? 14 : 24 }}>
        {[
          { label: "Alumnes actives", value: alumnes.length, accent: true },
          { label: "Llista d'espera", value: espera.filter(e => e.estat === "esperant").length, color: C.terra },
          { label: "Recuperacions", value: recuperacions.filter(r => r.estat === "pendent").length, color: C.warn },
          { label: "Canvis horari", value: canvis.filter(c => c.estat === "pendent").length, color: C.olive },
        ].map(s => (
          <div key={s.label} style={{ background: s.accent ? C.oliveDark : C.white, borderRadius: 10, padding: mobile ? "12px" : "18px 20px", border: `0.5px solid ${C.border}`, minWidth: 0 }}>
            <div style={{ fontSize: 8, letterSpacing: "1.5px", textTransform: "uppercase", color: s.accent ? "rgba(255,255,255,0.4)" : C.soft, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.label}</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: mobile ? 24 : 32, fontWeight: 700, color: s.accent ? C.white : (s.color || C.oliveDark), lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={card}>
        <div style={{ padding: "14px 18px", borderBottom: `0.5px solid ${C.border}`, fontSize: 14, fontWeight: 500, color: C.oliveDark }}>Alumnes recents</div>
        {alumnes.slice(0, 5).map((a, i, arr) => (
          <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: mobile ? "11px 16px" : "12px 20px", borderBottom: i < arr.length - 1 ? `0.5px solid ${C.border}` : "none" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.olivePale, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: C.oliveDark, flexShrink: 0 }}>{a.nom[0]}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: C.dark, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.nom} {a.cognom}</div>
              <div style={{ fontSize: 11, color: C.soft }}>{a.telefon}</div>
            </div>
            <span style={tag(a.activa ? "ok" : "cancel")}>{a.activa ? "Activa" : "Baixa"}</span>
          </div>
        ))}
        {alumnes.length === 0 && <div style={{ padding: "28px 16px", textAlign: "center", color: C.soft, fontSize: 13, fontStyle: "italic" }}>Sense alumnes encara</div>}
      </div>
    </div>
  );
}

function FichaAlumna({ alumna, onClose, onRefresh }) {
  const [horaris, setHoraris] = useState([]);
  const [franges, setFranges] = useState([]);
  const [serveis, setServeis] = useState([]);
  const [loadingH, setLoadingH] = useState(true);
  const [showAddHorari, setShowAddHorari] = useState(false);
  const [selectedFranja, setSelectedFranja] = useState("");
  const [filterServei, setFilterServei] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ nom: alumna.nom, cognom: alumna.cognom, telefon: alumna.telefon, email: alumna.email || "", notes: alumna.notes || "" });
  const [saving, setSaving] = useState(false);
  const dies = ["", "Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres"];

  useEffect(() => { fetchHoraris(); fetchFranges(); }, []);

  async function handleSaveEdit() {
    if (!editForm.nom || !editForm.cognom || !editForm.telefon) return alert("Nom, cognoms i telefon son obligatoris");
    setSaving(true);
    const { error } = await supabase.from("alumnes").update({
      nom: editForm.nom.trim(),
      cognom: editForm.cognom.trim(),
      telefon: editForm.telefon.trim(),
      email: editForm.email.trim(),
      notes: editForm.notes.trim(),
    }).eq("id", alumna.id);
    setSaving(false);
    if (error) return alert("Error: " + error.message);
    setEditMode(false);
    onRefresh();
    alert("Dades actualitzades correctament!");
  }

  async function fetchHoraris() {
    setLoadingH(true);
    const avui = new Date().toISOString().split("T")[0];
    // Auto-desactivar classes puntuals passades
    await supabase.from("horaris_alumnes")
      .update({ actiu: false })
      .eq("alumna_id", alumna.id)
      .eq("tipus", "puntual")
      .lt("data_classe", avui);
    const { data } = await supabase.from("horaris_alumnes")
      .select("*, franges(*, serveis(*))")
      .eq("alumna_id", alumna.id)
      .eq("actiu", true);
    if (data) setHoraris(data);
    setLoadingH(false);
  }

  async function fetchFranges() {
    const { data: sv } = await supabase.from("serveis").select("*").eq("actiu", true);
    if (sv) setServeis(sv);
    const { data: fr } = await supabase.from("franges").select("*, serveis(*)").eq("activa", true).order("dia_setmana").order("hora_inici");
    if (fr) setFranges(fr);
  }

  const [tipusHorari, setTipusHorari] = useState("fix");
  const [dataPuntual, setDataPuntual] = useState("");

  async function handleAddHorari() {
    if (!selectedFranja) return alert("Selecciona una franja");
    if (tipusHorari === "fix" && horaris.filter(h => h.tipus === "fix").length >= 3) return alert("Maxim 3 horaris fixos per alumna");
    if (tipusHorari === "puntual" && !dataPuntual) return alert("Selecciona la data de la classe puntual");
    const insert = { alumna_id: alumna.id, franja_id: selectedFranja, actiu: true, tipus: tipusHorari };
    if (tipusHorari === "puntual") insert.data_classe = dataPuntual;
    const { error } = await supabase.from("horaris_alumnes").insert([insert]);
    if (error) return alert("Error: " + error.message);
    setShowAddHorari(false);
    setSelectedFranja("");
    setDataPuntual("");
    setTipusHorari("fix");
    fetchHoraris();
    onRefresh();
  }

  async function handleRemoveHorari(id) {
    await supabase.from("horaris_alumnes").update({ actiu: false }).eq("id", id);
    fetchHoraris();
    onRefresh();
  }

  async function toggleActiva() {
    await supabase.from("alumnes").update({ activa: !alumna.activa }).eq("id", alumna.id);
    onRefresh();
    onClose();
  }

  const frangesFiltrades = franges;

  return (
    <Modal title={editMode ? "Editar alumna" : `${alumna.nom} ${alumna.cognom}`} sub={editMode ? "" : alumna.telefon} onClose={onClose}>

      {editMode ? (
        <>
          <Field label="Nom *" value={editForm.nom} onChange={v => setEditForm({...editForm, nom: v})} placeholder="Anna" />
          <Field label="Cognoms *" value={editForm.cognom} onChange={v => setEditForm({...editForm, cognom: v})} placeholder="Costa Puig" />
          <Field label="Telefon WhatsApp *" value={editForm.telefon} onChange={v => setEditForm({...editForm, telefon: v})} placeholder="+376 600 111" />
          <Field label="Email" value={editForm.email} onChange={v => setEditForm({...editForm, email: v})} placeholder="anna@gmail.com" />
          <Field label="Notes internes" value={editForm.notes} onChange={v => setEditForm({...editForm, notes: v})} placeholder="Embaras, lesio..." />
          <div style={{ display: "flex", gap: 8, marginTop: 16, paddingTop: 16, borderTop: `0.5px solid ${C.border}` }}>
            <button style={{ ...btn("secondary"), flex: 1 }} onClick={() => setEditMode(false)}>Cancel.lar</button>
            <button style={{ ...btn("primary"), flex: 1 }} onClick={handleSaveEdit} disabled={saving}>{saving ? "Guardant..." : "Guardar canvis"}</button>
          </div>
        </>
      ) : (
      <>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <span style={tag(alumna.activa ? "ok" : "cancel")}>{alumna.activa ? "Activa" : "Baixa"}</span>
        {alumna.notes && <span style={tag("olive")}>{alumna.notes}</span>}
        <button style={{ ...btn("secondary"), marginLeft: "auto", padding: "4px 10px", fontSize: 11 }} onClick={() => setEditMode(true)}>✏️ Editar dades</button>
      </div>

      <div style={{ fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase", color: C.soft, marginBottom: 10 }}>Horaris fixos ({horaris.length}/3)</div>

      {loadingH ? (
        <div style={{ fontSize: 13, color: C.soft, fontStyle: "italic", marginBottom: 12 }}>Carregant...</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
          {horaris.filter(h => h.tipus === "fix" || !h.tipus).map(h => (
            <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: C.oliveXpale, borderRadius: 9, border: `0.5px solid ${C.border}` }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: C.oliveDark }}>{h.franges?.serveis?.nom || "Servei"}</div>
                <div style={{ fontSize: 11, color: C.soft, marginTop: 1 }}>
                  {dies[h.franges?.dia_setmana] || ""} · {h.franges?.hora_inici?.slice(0,5) || ""} – {h.franges?.hora_fi?.slice(0,5) || ""}
                </div>
              </div>
              <button style={{ ...btn("danger"), padding: "4px 10px", fontSize: 11 }} onClick={() => handleRemoveHorari(h.id)}>Treure</button>
            </div>
          ))}
          {horaris.filter(h => h.tipus === "puntual").length > 0 && (
            <div style={{ fontSize: 10, letterSpacing: "1.5px", textTransform: "uppercase", color: C.terra, margin: "10px 0 6px" }}>Classes puntuals</div>
          )}
          {horaris.filter(h => h.tipus === "puntual").map(h => (
            <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: C.terraPale, borderRadius: 9, border: `0.5px solid rgba(193,123,90,0.2)` }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: C.terraDark }}>{h.franges?.serveis?.nom || "Servei"}</div>
                <div style={{ fontSize: 11, color: C.soft, marginTop: 1 }}>
                  {h.data_classe || ""} · {h.franges?.hora_inici?.slice(0,5) || ""} – {h.franges?.hora_fi?.slice(0,5) || ""}
                </div>
              </div>
              <span style={{ ...tag("warn"), marginRight: 6 }}>Puntual</span>
              <button style={{ ...btn("danger"), padding: "4px 10px", fontSize: 11 }} onClick={() => handleRemoveHorari(h.id)}>Treure</button>
            </div>
          ))}
          {horaris.length === 0 && <div style={{ fontSize: 13, color: C.soft, fontStyle: "italic", padding: "8px 0" }}>Sense horari assignat</div>}
        </div>
      )}

      {horaris.length < 3 && !showAddHorari && (
        <button style={{ ...btn("primary"), width: "100%", marginBottom: 16 }} onClick={() => setShowAddHorari(true)}>+ Afegir horari fix</button>
      )}

      {showAddHorari && (
        <div style={{ background: C.oliveXpale, borderRadius: 10, padding: 14, marginBottom: 16, border: `0.5px solid ${C.border}` }}>
          <div style={{ fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase", color: C.soft, marginBottom: 8 }}>Tipus de classe</div>
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            <button onClick={() => setTipusHorari("fix")} style={{ flex: 1, padding: "8px", borderRadius: 8, border: `1.5px solid ${tipusHorari === "fix" ? C.olive : C.border}`, background: tipusHorari === "fix" ? C.olivePale : C.white, fontSize: 12, fontWeight: 500, cursor: "pointer", color: tipusHorari === "fix" ? C.oliveDark : C.soft, fontFamily: "'DM Sans', sans-serif" }}>
              Horari fix
            </button>
            <button onClick={() => setTipusHorari("puntual")} style={{ flex: 1, padding: "8px", borderRadius: 8, border: `1.5px solid ${tipusHorari === "puntual" ? C.terra : C.border}`, background: tipusHorari === "puntual" ? C.terraPale : C.white, fontSize: 12, fontWeight: 500, cursor: "pointer", color: tipusHorari === "puntual" ? C.terraDark : C.soft, fontFamily: "'DM Sans', sans-serif" }}>
              Classe puntual
            </button>
          </div>
          {tipusHorari === "puntual" && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, letterSpacing: "1px", textTransform: "uppercase", color: C.soft, marginBottom: 4 }}>Data de la classe</div>
              <input type="date" value={dataPuntual} onChange={e => setDataPuntual(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `0.5px solid ${C.border}`, background: C.white, fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: C.dark, outline: "none", boxSizing: "border-box" }} />
            </div>
          )}
          <div style={{ marginBottom: 8 }}>
            <select value={selectedFranja} onChange={e => setSelectedFranja(e.target.value)}
              style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: `0.5px solid ${C.border}`, background: C.white, fontSize: 12, fontFamily: "'DM Sans', sans-serif", color: C.dark, outline: "none" }}>
              <option value="">Selecciona horari...</option>
              {frangesFiltrades.map(f => (
                <option key={f.id} value={f.id}>
                  {dies[f.dia_setmana]} {f.hora_inici?.slice(0,5)} — {f.tipus_classe === "individual" ? "Individual" : "Grupal"}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button style={{ ...btn("secondary"), flex: 1 }} onClick={() => { setShowAddHorari(false); setSelectedFranja(""); setTipusHorari("fix"); setDataPuntual(""); }}>Cancel.lar</button>
            <button style={{ ...btn("primary"), flex: 1 }} onClick={handleAddHorari}>Assignar</button>
          </div>
        </div>
      )}

      <div style={{ paddingTop: 14, borderTop: `0.5px solid ${C.border}` }}>
        <button style={{ ...btn(alumna.activa ? "danger" : "success"), width: "100%" }} onClick={toggleActiva}>
          {alumna.activa ? "Donar de baixa" : "Reactivar alumna"}
        </button>
      </div>
      </>
      )}
    </Modal>
  );
}

function VistaAlumnesAdmin({ alumnes, onRefresh, mobile }) {
  const [showModal, setShowModal] = useState(false);
  const [fichaAlumna, setFichaAlumna] = useState(null);
  const [form, setForm] = useState({ nom: "", cognom: "", telefon: "", email: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const filtered = alumnes.filter(a => `${a.nom} ${a.cognom} ${a.telefon}`.toLowerCase().includes(search.toLowerCase()));

  async function handleCreate() {
    if (!form.nom || !form.cognom || !form.telefon) return alert("Nom, cognoms i telefon son obligatoris");
    setLoading(true);
    const { error } = await supabase.from("alumnes").insert([{ ...form, activa: true }]);
    setLoading(false);
    if (error) return alert("Error: " + error.message);
    setShowModal(false);
    setForm({ nom: "", cognom: "", telefon: "", email: "", notes: "" });
    onRefresh();
  }

  return (
    <div style={{ padding: mobile ? "16px 16px 80px" : "28px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: mobile ? 16 : 24 }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: mobile ? 18 : 20, fontWeight: 700, color: C.oliveDark }}>Alumnes</div>
          <div style={{ fontSize: 12, color: C.soft, fontWeight: 300, marginTop: 2 }}>{alumnes.length} registrades</div>
        </div>
        <button style={btn("primary")} onClick={() => setShowModal(true)}>+ Nova</button>
      </div>
      <div style={card}>
        <div style={{ padding: "10px 16px", borderBottom: `0.5px solid ${C.border}`, background: C.oliveXpale }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cerca per nom o telefon..."
            style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `0.5px solid ${C.border}`, background: C.white, fontSize: 13, fontFamily: "'DM Sans', sans-serif", outline: "none", color: C.dark, boxSizing: "border-box" }} />
        </div>
        {filtered.map((a, i) => (
          <div key={a.id} onClick={() => setFichaAlumna(a)} style={{ display: "flex", alignItems: "center", gap: 12, padding: mobile ? "12px 16px" : "13px 20px", borderBottom: i < filtered.length - 1 ? `0.5px solid ${C.border}` : "none", cursor: "pointer", transition: "background .15s" }}
            onMouseEnter={e => e.currentTarget.style.background = C.oliveXpale}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.olivePale, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: C.oliveDark, flexShrink: 0 }}>{a.nom[0]}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: C.dark, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.nom} {a.cognom}</div>
              <div style={{ fontSize: 11, color: C.soft, marginTop: 1 }}>{a.telefon}</div>
              {a.notes && <div style={{ fontSize: 11, color: C.mid, fontStyle: "italic", marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.notes}</div>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, flexShrink: 0 }}>
              <span style={tag(a.activa ? "ok" : "cancel")}>{a.activa ? "Activa" : "Baixa"}</span>
              <span style={{ fontSize: 11, color: C.soft }}>Veure →</span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ padding: "28px 16px", textAlign: "center", color: C.soft, fontSize: 13, fontStyle: "italic" }}>{search ? "Cap resultat" : "Sense alumnes encara"}</div>}
      </div>

      {fichaAlumna && <FichaAlumna alumna={fichaAlumna} onClose={() => setFichaAlumna(null)} onRefresh={onRefresh} />}

      {showModal && (
        <Modal title="Nova alumna" sub="Dona d'alta una nova alumna al centre" onClose={() => setShowModal(false)}>
          <Field label="Nom *" value={form.nom} onChange={v => setForm({ ...form, nom: v })} placeholder="Anna" />
          <Field label="Cognoms *" value={form.cognom} onChange={v => setForm({ ...form, cognom: v })} placeholder="Costa Puig" />
          <Field label="Telefon WhatsApp *" value={form.telefon} onChange={v => setForm({ ...form, telefon: v })} placeholder="+376 600 111" />
          <Field label="Email (opcional)" value={form.email} onChange={v => setForm({ ...form, email: v })} placeholder="anna@gmail.com" />
          <Field label="Notes internes" value={form.notes} onChange={v => setForm({ ...form, notes: v })} placeholder="Embaras, lesio esquena..." />
          <div style={{ display: "flex", gap: 8, marginTop: 20, paddingTop: 16, borderTop: `0.5px solid ${C.border}` }}>
            <button style={{ ...btn("secondary"), flex: 1 }} onClick={() => setShowModal(false)}>Cancel.lar</button>
            <button style={{ ...btn("primary"), flex: 1 }} onClick={handleCreate} disabled={loading}>{loading ? "Creant..." : "Crear alumna"}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function VistaEspera({ espera, onRefresh, mobile }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nom: "", cognom: "", telefon: "", preferencia_horaria: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const actives = espera.filter(e => e.estat === "esperant" || e.estat === "avisada");

  async function handleCreate() {
    if (!form.nom || !form.cognom || !form.telefon) return alert("Nom, cognoms i telefon son obligatoris");
    setLoading(true);
    const { error } = await supabase.from("llista_espera").insert([{ ...form, estat: "esperant", ordre: espera.length + 1 }]);
    setLoading(false);
    if (error) return alert("Error: " + error.message);
    setShowModal(false);
    setForm({ nom: "", cognom: "", telefon: "", preferencia_horaria: "", notes: "" });
    onRefresh();
  }

  async function handleEstat(id, estat) {
    await supabase.from("llista_espera").update({ estat }).eq("id", id);
    onRefresh();
  }

  return (
    <div style={{ padding: mobile ? "16px 16px 80px" : "28px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: mobile ? 16 : 24 }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: mobile ? 18 : 20, fontWeight: 700, color: C.oliveDark }}>Llista d'espera</div>
          <div style={{ fontSize: 12, color: C.soft, fontWeight: 300, marginTop: 2 }}>{actives.length} persones esperant</div>
        </div>
        <button style={btn("primary")} onClick={() => setShowModal(true)}>+ Afegir</button>
      </div>
      <div style={card}>
        {actives.map((e, i) => (
          <div key={e.id} style={{ padding: mobile ? "12px 16px" : "14px 20px", borderBottom: i < actives.length - 1 ? `0.5px solid ${C.border}` : "none" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: i < 3 ? C.oliveDark : C.olivePale, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, color: i < 3 ? C.white : C.oliveDark, flexShrink: 0, marginTop: 2 }}>{i + 1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: C.dark }}>{e.nom} {e.cognom}</div>
                <div style={{ fontSize: 11, color: C.soft, marginTop: 1 }}>{e.telefon}{e.preferencia_horaria ? " · " + e.preferencia_horaria : ""}</div>
                {e.notes && <div style={{ fontSize: 11, color: C.mid, fontStyle: "italic", marginTop: 2 }}>{e.notes}</div>}
              </div>
              <span style={tag(e.estat === "avisada" ? "warn" : "olive")}>{e.estat === "avisada" ? "Avisada" : "Esperant"}</span>
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 10, marginLeft: 38 }}>
              {e.estat === "esperant" && <button style={{ ...btn("warn"), fontSize: 11, padding: "5px 12px" }} onClick={() => handleEstat(e.id, "avisada")}>Avisar</button>}
              <button style={{ ...btn("danger"), fontSize: 11, padding: "5px 12px" }} onClick={() => handleEstat(e.id, "descartada")}>Treure</button>
            </div>
          </div>
        ))}
        {actives.length === 0 && <div style={{ padding: "28px 16px", textAlign: "center", color: C.soft, fontSize: 13, fontStyle: "italic" }}>La llista d'espera esta buida</div>}
      </div>
      {showModal && (
        <Modal title="Afegir a la llista" sub="Persona que espera placa al centre" onClose={() => setShowModal(false)}>
          <Field label="Nom *" value={form.nom} onChange={v => setForm({ ...form, nom: v })} placeholder="Clara" />
          <Field label="Cognoms *" value={form.cognom} onChange={v => setForm({ ...form, cognom: v })} placeholder="Vidal" />
          <Field label="Telefon *" value={form.telefon} onChange={v => setForm({ ...form, telefon: v })} placeholder="+376 600 222" />
          <Field label="Preferencia horaria" value={form.preferencia_horaria} onChange={v => setForm({ ...form, preferencia_horaria: v })} placeholder="Matins, tardes..." />
          <Field label="Notes" value={form.notes} onChange={v => setForm({ ...form, notes: v })} placeholder="Servei que demana..." />
          <div style={{ display: "flex", gap: 8, marginTop: 20, paddingTop: 16, borderTop: `0.5px solid ${C.border}` }}>
            <button style={{ ...btn("secondary"), flex: 1 }} onClick={() => setShowModal(false)}>Cancel.lar</button>
            <button style={{ ...btn("primary"), flex: 1 }} onClick={handleCreate} disabled={loading}>{loading ? "Afegint..." : "Afegir"}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function VistaFranges({ mobile }) {
  const [franges, setFranges] = useState([]);
  const [loading, setLoading] = useState(true);
  const dies = ["", "Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres"];

  useEffect(() => { fetchFranges(); }, []);

  async function fetchFranges() {
    setLoading(true);
    const { data } = await supabase.from("franges").select("*, professores(nom)").eq("activa", true).order("dia_setmana").order("hora_inici");
    if (data) setFranges(data);
    setLoading(false);
  }

  async function toggleTipus(f) {
    const nouTipus = f.tipus_classe === "individual" ? "grupal" : "individual";
    await supabase.from("franges").update({ tipus_classe: nouTipus }).eq("id", f.id);
    fetchFranges();
  }

  const grouped = {};
  franges.forEach(f => {
    if (!grouped[f.dia_setmana]) grouped[f.dia_setmana] = [];
    grouped[f.dia_setmana].push(f);
  });

  return (
    <div style={{ padding: mobile ? "16px 16px 80px" : "28px 32px" }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: mobile ? 18 : 20, fontWeight: 700, color: C.oliveDark, marginBottom: 4 }}>Franges horaries</div>
      <div style={{ fontSize: 12, color: C.soft, fontWeight: 300, marginBottom: 16 }}>Marca cada classe com a Grupal (3 places) o Individual (1 plaça)</div>
      {loading ? (
        <div style={{ fontSize: 13, color: C.soft, fontStyle: "italic" }}>Carregant...</div>
      ) : (
        Object.keys(grouped).sort().map(dia => (
          <div key={dia} style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: C.oliveDark, marginBottom: 8 }}>{dies[dia]}</div>
            <div style={card}>
              {grouped[dia].map((f, i, arr) => (
                <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: mobile ? "11px 16px" : "12px 20px", borderBottom: i < arr.length - 1 ? `0.5px solid ${C.border}` : "none" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: C.dark }}>{f.hora_inici?.slice(0,5)} – {f.hora_fi?.slice(0,5)}</div>
                    <div style={{ fontSize: 11, color: C.soft, marginTop: 1 }}>{f.professores?.nom || "Sense professora"}</div>
                  </div>
                  <button onClick={() => toggleTipus(f)} style={{ padding: "6px 12px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", background: f.tipus_classe === "individual" ? C.terraPale : C.successPale, color: f.tipus_classe === "individual" ? C.terraDark : C.success }}>
                    {f.tipus_classe === "individual" ? "Individual" : "Grupal"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function VistaRecuperacions({ recuperacions, canvis, onRefresh, mobile }) {
  const [tab, setTab] = useState("recuperacions");
  const [aprovats, setAprovats] = useState({}); // { id: { tipus: 'aprovada'|'rebutjada' } } - tracking local abans de refrescar
  const pendR = recuperacions.filter(r => r.estat === "pendent");
  const pendC = canvis.filter(c => c.estat === "pendent");

  const dies = ["", "Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres"];

  async function aprovar(tabla, id) {
    await supabase.from(tabla).update({ estat: "aprovada" }).eq("id", id);
    setAprovats(prev => ({ ...prev, [id]: "aprovada" }));
    onRefresh();
  }
  async function rebutjar(tabla, id) {
    await supabase.from(tabla).update({ estat: "rebutjada" }).eq("id", id);
    setAprovats(prev => ({ ...prev, [id]: "rebutjada" }));
    onRefresh();
  }
  function tancar(id) {
    setAprovats(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }

  // Combine pendents amb els que acabem d'aprovar/rebutjar (encara no han desaparegut de la llista local)
  const recentsR = recuperacions.filter(r => aprovats[r.id]);
  const recentsC = canvis.filter(c => aprovats[c.id]);

  return (
    <div style={{ padding: mobile ? "16px 16px 80px" : "28px 32px" }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: mobile ? 18 : 20, fontWeight: 700, color: C.oliveDark, marginBottom: 4 }}>Recuperacions i Canvis</div>
      <div style={{ fontSize: 12, color: C.soft, fontWeight: 300, marginBottom: 16 }}>Sol.licituds pendents de les alumnes</div>
      <div style={{ display: "flex", gap: 0, background: C.white, borderRadius: 12, border: `0.5px solid ${C.border}`, padding: 4, marginBottom: 16, overflowX: "auto" }}>
        {[{ key: "recuperacions", label: "Recuperacions (" + pendR.length + ")" }, { key: "canvis", label: "Canvis (" + pendC.length + ")" }, { key: "historial", label: "Historial" }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ flex: 1, padding: "7px 10px", borderRadius: 9, fontSize: mobile ? 11 : 13, fontWeight: 500, cursor: "pointer", border: "none", fontFamily: "'DM Sans', sans-serif", background: tab === t.key ? C.oliveDark : "transparent", color: tab === t.key ? C.white : C.soft, whiteSpace: "nowrap", transition: "all .15s" }}>{t.label}</button>
        ))}
      </div>
      {tab === "recuperacions" && (
        <div style={card}>
          {pendR.length === 0 && recentsR.length === 0 && <div style={{ padding: "28px 16px", textAlign: "center", color: C.soft, fontSize: 13, fontStyle: "italic" }}>No hi ha recuperacions pendents</div>}
          {recentsR.map((r, i) => {
            const nomComplet = r.alumnes ? `${r.alumnes.nom} ${r.alumnes.cognom}` : "Alumna";
            const esAprovada = aprovats[r.id] === "aprovada";
            const missatge = esAprovada
              ? `Hola ${r.alumnes?.nom || ""}! T'confirmem la teva recuperacio${r.data_proposta_alumna ? " pel " + r.data_proposta_alumna : ""}. Ens veiem a Focus Benestar!`
              : `Hola ${r.alumnes?.nom || ""}! Ho sentim pero no podem confirmar aquesta recuperacio. Contacta amb nosaltres per buscar una altra opcio.`;
            const waLink = whatsappLink(r.alumnes?.telefon, missatge);
            return (
            <div key={r.id} style={{ padding: mobile ? "12px 16px" : "16px 20px", borderBottom: `0.5px solid ${C.border}`, background: esAprovada ? C.successPale : C.dangerPale }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: C.dark }}>{nomComplet}</div>
                <span style={tag(esAprovada ? "ok" : "cancel")}>{esAprovada ? "Aprovada" : "Rebutjada"}</span>
              </div>
              {r.data_proposta_alumna && <div style={{ fontSize: 12, color: C.soft, marginBottom: 10 }}>Data: {r.data_proposta_alumna}</div>}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {waLink && (
                  <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ ...btn(esAprovada ? "success" : "danger"), fontSize: 11, padding: "5px 12px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                    💬 Enviar avis per WhatsApp
                  </a>
                )}
                <button style={{ ...btn("secondary"), fontSize: 11, padding: "5px 12px" }} onClick={() => tancar(r.id)}>Tancar</button>
              </div>
            </div>
            );
          })}
          {pendR.map((r, i) => {
            const nomComplet = r.alumnes ? `${r.alumnes.nom} ${r.alumnes.cognom}` : "Alumna";
            return (
            <div key={r.id} style={{ padding: mobile ? "12px 16px" : "16px 20px", borderBottom: i < pendR.length - 1 ? `0.5px solid ${C.border}` : "none" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: C.dark }}>{nomComplet}</div>
                <span style={tag("warn")}>Pendent</span>
              </div>
              {r.data_proposta_alumna && <div style={{ fontSize: 12, color: C.soft, marginBottom: 10 }}>Proposta: {r.data_proposta_alumna}{r.data_caducitat ? " · Caduca: " + r.data_caducitat : ""}</div>}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button style={{ ...btn("success"), fontSize: 11, padding: "5px 12px" }} onClick={() => aprovar("recuperacions", r.id)}>Aprovar</button>
                <button style={{ ...btn("danger"), fontSize: 11, padding: "5px 12px" }} onClick={() => rebutjar("recuperacions", r.id)}>Rebutjar</button>
              </div>
            </div>
            );
          })}
        </div>
      )}
      {tab === "canvis" && (
        <div style={card}>
          {pendC.length === 0 && recentsC.length === 0 && <div style={{ padding: "28px 16px", textAlign: "center", color: C.soft, fontSize: 13, fontStyle: "italic" }}>No hi ha canvis pendents</div>}
          {recentsC.map((c, i) => {
            const nomComplet = c.alumnes ? `${c.alumnes.nom} ${c.alumnes.cognom}` : "Alumna";
            const horariText = c.franges ? `${dies[c.franges.dia_setmana]} ${c.franges.hora_inici?.slice(0,5)}` : "";
            const esAprovada = aprovats[c.id] === "aprovada";
            const missatge = esAprovada
              ? `Hola ${c.alumnes?.nom || ""}! T'confirmem el canvi d'horari${horariText ? " a " + horariText : ""}. Ens veiem a Focus Benestar!`
              : `Hola ${c.alumnes?.nom || ""}! Ho sentim pero no podem confirmar aquest canvi d'horari. Contacta amb nosaltres per buscar una altra opcio.`;
            const waLink = whatsappLink(c.alumnes?.telefon, missatge);
            return (
            <div key={c.id} style={{ padding: mobile ? "12px 16px" : "16px 20px", borderBottom: `0.5px solid ${C.border}`, background: esAprovada ? C.successPale : C.dangerPale }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: C.dark }}>{nomComplet}</div>
                <span style={tag(esAprovada ? "ok" : "cancel")}>{esAprovada ? "Aprovada" : "Rebutjada"}</span>
              </div>
              {horariText && <div style={{ fontSize: 12, color: C.soft, marginBottom: 10 }}>Horari: {horariText}</div>}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {waLink && (
                  <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ ...btn(esAprovada ? "success" : "danger"), fontSize: 11, padding: "5px 12px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                    💬 Enviar avis per WhatsApp
                  </a>
                )}
                <button style={{ ...btn("secondary"), fontSize: 11, padding: "5px 12px" }} onClick={() => tancar(c.id)}>Tancar</button>
              </div>
            </div>
            );
          })}
          {pendC.map((c, i) => {
            const nomComplet = c.alumnes ? `${c.alumnes.nom} ${c.alumnes.cognom}` : "Alumna";
            const horariText = c.franges ? `${dies[c.franges.dia_setmana]} ${c.franges.hora_inici?.slice(0,5)}` : "";
            return (
            <div key={c.id} style={{ padding: mobile ? "12px 16px" : "16px 20px", borderBottom: i < pendC.length - 1 ? `0.5px solid ${C.border}` : "none" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: C.dark }}>{nomComplet}</div>
                <span style={tag("warn")}>Pendent</span>
              </div>
              {horariText && <div style={{ fontSize: 12, color: C.soft, marginBottom: 4 }}>Sol.licita: {horariText}</div>}
              {c.nota_alumna && <div style={{ fontSize: 12, color: C.mid, marginBottom: 10, fontStyle: "italic" }}>{c.nota_alumna}</div>}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button style={{ ...btn("success"), fontSize: 11, padding: "5px 12px" }} onClick={() => aprovar("canvis_horari", c.id)}>Aprovar</button>
                <button style={{ ...btn("danger"), fontSize: 11, padding: "5px 12px" }} onClick={() => rebutjar("canvis_horari", c.id)}>Rebutjar</button>
              </div>
            </div>
            );
          })}
        </div>
      )}
      {tab === "historial" && (
        <div style={card}>
          {[...recuperacions.filter(r => r.estat !== "pendent"), ...canvis.filter(c => c.estat !== "pendent")].length === 0
            ? <div style={{ padding: "28px 16px", textAlign: "center", color: C.soft, fontSize: 13, fontStyle: "italic" }}>L'historial es buit</div>
            : [...recuperacions.filter(r => r.estat !== "pendent"), ...canvis.filter(c => c.estat !== "pendent")].map((item, i, arr) => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: mobile ? "11px 16px" : "12px 20px", borderBottom: i < arr.length - 1 ? `0.5px solid ${C.border}` : "none" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.dark }}>{"data_proposta_alumna" in item ? "Recuperacio" : "Canvi d'horari"}</div>
                  <div style={{ fontSize: 11, color: C.soft, marginTop: 1 }}>{new Date(item.created_at).toLocaleDateString("ca-ES")}</div>
                </div>
                <span style={tag(item.estat === "aprovada" ? "ok" : "cancel")}>{item.estat.charAt(0).toUpperCase() + item.estat.slice(1)}</span>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}

function PanelRosario() {
  const [active, setActive] = useState("avui");
  const [alumnes, setAlumnes] = useState([]);
  const [espera, setEspera] = useState([]);
  const [recuperacions, setRecuperacions] = useState([]);
  const [canvis, setCanvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const mobile = useIsMobile();

  async function fetchAll() {
    setLoading(true);
    const [a, e, r, c] = await Promise.all([
      supabase.from("alumnes").select("*").order("created_at", { ascending: false }),
      supabase.from("llista_espera").select("*").order("ordre", { ascending: true }),
      supabase.from("recuperacions").select("*, alumnes(nom, cognom, telefon)").order("created_at", { ascending: false }),
      supabase.from("canvis_horari").select("*, alumnes(nom, cognom, telefon), franges(dia_setmana, hora_inici, hora_fi)").order("created_at", { ascending: false }),
    ]);
    if (a.data) setAlumnes(a.data);
    if (e.data) setEspera(e.data);
    if (r.data) setRecuperacions(r.data);
    if (c.data) setCanvis(c.data);
    setLoading(false);
  }

  useEffect(() => { fetchAll(); }, []);

  const counts = {
    espera: espera.filter(e => e.estat === "esperant").length,
    recuperacions: recuperacions.filter(r => r.estat === "pendent").length,
    canvis: canvis.filter(c => c.estat === "pendent").length,
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.oliveXpale, minHeight: "100vh", color: C.dark, overflowX: "hidden", maxWidth: "100vw" }}>
      {mobile ? (
        <>
          <div style={{ background: C.oliveDark, padding: "0 16px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: C.white }}>focus <span style={{ fontStyle: "italic", fontWeight: 400, color: "#d9a080", fontSize: 14 }}>et cuida.</span></div>
            <button onClick={fetchAll} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, width: 34, height: 34, cursor: "pointer", color: C.white, fontSize: 18 }}>↻</button>
          </div>
          {loading ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}><div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: C.soft, fontStyle: "italic" }}>Carregant...</div></div> : (
            <>
              {active === "avui" && <VistaAvui alumnes={alumnes} espera={espera} recuperacions={recuperacions} canvis={canvis} mobile />}
              {active === "alumnes" && <VistaAlumnesAdmin alumnes={alumnes} onRefresh={fetchAll} mobile />}
              {active === "franges" && <VistaFranges mobile />}
              {active === "espera" && <VistaEspera espera={espera} onRefresh={fetchAll} mobile />}
              {(active === "recuperacions" || active === "canvis") && <VistaRecuperacions recuperacions={recuperacions} canvis={canvis} onRefresh={fetchAll} mobile />}
            </>
          )}
          <BottomNav active={active} setActive={setActive} counts={counts} />
        </>
      ) : (
        <>
          <Sidebar active={active} setActive={setActive} counts={counts} />
          <main style={{ marginLeft: 220, minHeight: "100vh" }}>
            <div style={{ background: C.white, borderBottom: `0.5px solid ${C.border}`, padding: "0 32px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.oliveDark }}>focus benestar</div>
                <div style={{ fontSize: 12, color: C.soft, fontWeight: 300 }}>Panel d'administracio · Rosario</div>
              </div>
              <button style={btn("primary")} onClick={fetchAll}>Actualitzar</button>
            </div>
            {loading ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}><div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: C.soft, fontStyle: "italic" }}>Carregant...</div></div> : (
              <>
                {active === "avui" && <VistaAvui alumnes={alumnes} espera={espera} recuperacions={recuperacions} canvis={canvis} mobile={false} />}
                {active === "alumnes" && <VistaAlumnesAdmin alumnes={alumnes} onRefresh={fetchAll} mobile={false} />}
                {active === "franges" && <VistaFranges mobile={false} />}
                {active === "espera" && <VistaEspera espera={espera} onRefresh={fetchAll} mobile={false} />}
                {(active === "recuperacions" || active === "canvis") && <VistaRecuperacions recuperacions={recuperacions} canvis={canvis} onRefresh={fetchAll} mobile={false} />}
              </>
            )}
          </main>
        </>
      )}
    </div>
  );
}

// ── LOGIN PROFESSORA ─────────────────────────────────────
function LoginProfessora({ onLogin }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!pin) return setError("Introdueix el teu PIN");
    setLoading(true);
    setError("");
    const { data, error: err } = await supabase.from("professores").select("*").eq("pin", pin).eq("activa", true).single();
    setLoading(false);
    if (err || !data) {
      setError("PIN incorrecte. Contacta amb Rosario.");
      return;
    }
    onLogin(data);
  }

  return (
    <div style={{ minHeight: "100vh", background: C.oliveDark, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", bottom: -40, right: -20, fontFamily: "'Playfair Display', serif", fontSize: 200, fontWeight: 700, color: "rgba(255,255,255,0.03)", lineHeight: 1, pointerEvents: "none" }}>focus</div>
      <div style={{ width: "100%", maxWidth: 340, position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: C.white }}>focus</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontStyle: "italic", color: "#d9a080", marginTop: 4 }}>et cuida.</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 18, padding: 28, border: "0.5px solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.white, marginBottom: 6 }}>Acces professores</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 300, marginBottom: 24 }}>Introdueix el teu PIN personal</div>
          <Field label="PIN" value={pin} onChange={v => { setPin(v); setError(""); }} placeholder="••••" type="password" />
          {error && <div style={{ background: C.dangerPale, color: C.danger, fontSize: 12, padding: "8px 12px", borderRadius: 8, marginBottom: 12 }}>{error}</div>}
          <button onClick={handleLogin} disabled={loading} style={{ ...btn("terra"), width: "100%", padding: 13, fontSize: 14, borderRadius: 10, marginTop: 8, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Comprovant..." : "Entrar"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── PANEL PROFESSORA ──────────────────────────────────────
function PanelProfessora({ professora, onLogout }) {
  const mobile = useIsMobile();
  const [classes, setClasses] = useState([]);
  const [notificacions, setNotificacions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("setmana");
  const dies = ["", "Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres"];

  useEffect(() => { fetchDades(); }, []);

  async function fetchDades() {
    setLoading(true);
    const avui = new Date();
    const diaSemana = avui.getDay() === 0 ? 7 : avui.getDay();
    const inicSemana = new Date(avui);
    inicSemana.setDate(avui.getDate() - diaSemana + 1);
    const fiSemana = new Date(inicSemana);
    fiSemana.setDate(inicSemana.getDate() + 6);
    const inicStr = inicSemana.toISOString().split("T")[0];
    const fiStr = fiSemana.toISOString().split("T")[0];

    // Get franges for this professora
    const { data: franges } = await supabase.from("franges")
      .select("*, serveis(*)")
      .eq("professora_id", professora.id)
      .eq("activa", true);

    if (franges && franges.length > 0) {
      const franjaIds = franges.map(f => f.id);

      // Get horaris alumnes for these franges (shows who attends each class)
      const { data: horarisData } = await supabase.from("horaris_alumnes")
        .select("*, alumnes(nom, cognom, telefon), franges(dia_setmana, hora_inici, hora_fi, serveis(nom))")
        .in("franja_id", franjaIds)
        .eq("actiu", true)
        .eq("tipus", "fix");

      // Get assistencies (cancelations this week)
      const { data: assistenciesData } = await supabase.from("assistencies")
        .select("*, alumnes(nom, cognom), classes(data, franja_id, franges(hora_inici, serveis(nom)))")
        .in("classes.franja_id", franjaIds)
        .eq("estat", "cancelada")
        .gte("classes.data", inicStr)
        .lte("classes.data", fiStr);

      // Build weekly schedule
      const setmana = [];
      for (let dia = 1; dia <= 5; dia++) {
        const dataObj = new Date(inicSemana);
        dataObj.setDate(inicSemana.getDate() + dia - 1);
        const dataStr = dataObj.toISOString().split("T")[0];
        const frangesDia = franges.filter(f => f.dia_setmana === dia);
        if (frangesDia.length > 0) {
          setmana.push({
            dia, dataObj, dataStr,
            franges: [...frangesDia]
              .sort((a, b) => (a.hora_inici || "").localeCompare(b.hora_inici || ""))
              .map(f => ({
              ...f,
              alumnes: (horarisData || []).filter(h => h.franja_id === f.id),
              cancelades: (assistenciesData || []).filter(a => a.classes?.franja_id === f.id && a.classes?.data === dataStr),
            }))
          });
        }
      }
      setClasses(setmana);
    } else {
      setClasses([]);
    }

    // Get notificacions
    const { data: nots } = await supabase.from("notificacions")
      .select("*, alumnes(nom, cognom)")
      .eq("canal", "app")
      .eq("estat", "pendent")
      .order("created_at", { ascending: false })
      .limit(20);
    if (nots) setNotificacions(nots);

    setLoading(false);
  }

  async function marcarLlegida(id) {
    await supabase.from("notificacions").update({ estat: "enviada" }).eq("id", id);
    fetchDades();
  }

  async function handleBloquejar(franjaId, data) {
    if (!window.confirm(`Segur que vols bloquejar aquesta classe del ${data}? Les alumnes no podran veure-la al calendari.`)) return;
    const { error } = await supabase.from("bloquejos").insert([{
      franja_id: franjaId,
      data: data,
      bloquejat_per: professora.id,
      motiu: "Classe bloquejada"
    }]);
    if (error) return alert("Error: " + error.message);
    alert("Classe bloquejada correctament!");
    fetchDades();
  }

  const avui = new Date();
  const diaSemanaAvui = avui.getDay() === 0 ? 7 : avui.getDay();

  return (
    <div style={{ minHeight: "100vh", background: C.oliveXpale, overflowX: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />

      <div style={{ background: C.oliveDark, padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: C.white }}>focus <span style={{ fontStyle: "italic", fontWeight: 400, color: "#d9a080", fontSize: 13 }}>et cuida.</span></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{professora.nom}</div>
          {notificacions.length > 0 && (
            <div style={{ background: C.terra, color: "white", fontSize: 10, fontWeight: 700, width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{notificacions.length}</div>
          )}
          <button onClick={onLogout} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, padding: "5px 10px", cursor: "pointer", color: "rgba(255,255,255,0.6)", fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}>Sortir</button>
        </div>
      </div>

      <div style={{ padding: "16px 16px 80px" }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "50vh" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 16, color: C.soft, fontStyle: "italic" }}>Carregant...</div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: C.oliveDark }}>
                Bon dia, <em style={{ color: C.terra, fontWeight: 400 }}>{professora.nom}.</em>
              </div>
              <div style={{ fontSize: 12, color: C.soft, fontWeight: 300, marginTop: 4 }}>
                {new Date().toLocaleDateString("ca-ES", { weekday: "long", day: "numeric", month: "long" })}
              </div>
            </div>

            {notificacions.length > 0 && tab === "setmana" && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", color: C.terra, marginBottom: 8 }}>Notificacions pendents</div>
                {notificacions.map(n => (
                  <div key={n.id} style={{ background: C.warnPale, border: `0.5px solid rgba(160,96,48,0.2)`, borderRadius: 10, padding: "12px 14px", marginBottom: 8, display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <span style={{ fontSize: 16 }}>🔔</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: C.warn }}>{n.alumnes?.nom} {n.alumnes?.cognom}</div>
                      <div style={{ fontSize: 12, color: C.warn, fontWeight: 300, marginTop: 2 }}>{n.missatge}</div>
                      <div style={{ fontSize: 10, color: C.soft, marginTop: 4 }}>{new Date(n.created_at).toLocaleDateString("ca-ES")}</div>
                    </div>
                    <button style={{ ...btn("secondary"), fontSize: 10, padding: "3px 8px", flexShrink: 0 }} onClick={() => marcarLlegida(n.id)}>✓ Llegida</button>
                  </div>
                ))}
              </div>
            )}

            {tab === "setmana" && (
              <>
                <div style={{ fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", color: C.soft, marginBottom: 12 }}>Classes aquesta setmana</div>
                {classes.length === 0 ? (
                  <div style={{ ...card, padding: "28px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: 13, color: C.soft, fontStyle: "italic" }}>No tens classes assignades aquesta setmana</div>
                  </div>
                ) : (
                  classes.map(dia => (
                    <div key={dia.dia} style={{ marginBottom: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: dia.dia === diaSemanaAvui ? C.terra : C.oliveDark }}>
                          {dies[dia.dia]}
                        </div>
                        <div style={{ fontSize: 12, color: C.soft }}>{dia.dataObj.getDate()} de {["","gen","feb","mar","abr","mai","jun","jul","ago","set","oct","nov","des"][dia.dataObj.getMonth()+1]}</div>
                        {dia.dia === diaSemanaAvui && <span style={tag("warn")}>Avui</span>}
                      </div>
                      {dia.franges.map(f => (
                        <div key={f.id} style={{ ...card, marginBottom: 8 }}>
                          <div style={{ padding: "12px 16px", borderBottom: `0.5px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 500, color: C.oliveDark }}>{f.serveis?.nom}</div>
                              <div style={{ fontSize: 12, color: C.soft, marginTop: 2 }}>{f.hora_inici?.slice(0,5)} – {f.hora_fi?.slice(0,5)}</div>
                            </div>
                            <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                              <div style={{ fontSize: 12, fontWeight: 500, color: C.oliveDark }}>{f.alumnes.length - f.cancelades.length} alumnes</div>
                              {f.cancelades.length > 0 && <div style={{ fontSize: 11, color: C.danger }}>{f.cancelades.length} cancel·lació{f.cancelades.length > 1 ? "ns" : ""}</div>}
                              <button style={{ ...btn("danger"), fontSize: 10, padding: "3px 8px" }} onClick={() => handleBloquejar(f.id, dia.dataStr)}>Bloquejar</button>
                            </div>
                          </div>
                          {f.alumnes.map((h, i) => {
                            const cancelada = f.cancelades.some(c => c.alumna_id === h.alumna_id);
                            return (
                              <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderBottom: i < f.alumnes.length - 1 ? `0.5px solid ${C.border}` : "none", opacity: cancelada ? 0.4 : 1 }}>
                                <div style={{ width: 30, height: 30, borderRadius: "50%", background: cancelada ? C.dangerPale : C.olivePale, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 700, color: cancelada ? C.danger : C.oliveDark, flexShrink: 0 }}>
                                  {h.alumnes?.nom?.[0] || "?"}
                                </div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: 13, fontWeight: 500, color: C.dark, textDecoration: cancelada ? "line-through" : "none" }}>{h.alumnes?.nom} {h.alumnes?.cognom}</div>
                                  {cancelada && <div style={{ fontSize: 11, color: C.danger }}>Ha cancel·lat</div>}
                                </div>
                              </div>
                            );
                          })}
                          {f.alumnes.length === 0 && (
                            <div style={{ padding: "12px 16px", fontSize: 13, color: C.soft, fontStyle: "italic" }}>Sense alumnes assignades</div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </>
            )}

            {tab === "notificacions" && (
              <>
                <div style={{ fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", color: C.soft, marginBottom: 12 }}>Totes les notificacions</div>
                {notificacions.length === 0 ? (
                  <div style={{ ...card, padding: "28px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: 13, color: C.soft, fontStyle: "italic" }}>No tens notificacions pendents</div>
                  </div>
                ) : (
                  <div style={card}>
                    {notificacions.map((n, i, arr) => (
                      <div key={n.id} style={{ padding: "14px 16px", borderBottom: i < arr.length - 1 ? `0.5px solid ${C.border}` : "none" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                          <span style={{ fontSize: 16 }}>🔔</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: C.dark }}>{n.alumnes?.nom} {n.alumnes?.cognom}</div>
                            <div style={{ fontSize: 12, color: C.mid, marginTop: 2 }}>{n.missatge}</div>
                            <div style={{ fontSize: 10, color: C.soft, marginTop: 4 }}>{new Date(n.created_at).toLocaleDateString("ca-ES")}</div>
                          </div>
                          <button style={{ ...btn("success"), fontSize: 10, padding: "3px 8px" }} onClick={() => marcarLlegida(n.id)}>✓</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: C.white, borderTop: `0.5px solid ${C.border}`, height: 60, zIndex: 200, display: "flex" }}>
        {[
          { key: "setmana", label: "Setmana", icon: "📅" },
          { key: "notificacions", label: "Avisos", icon: "🔔", count: notificacions.length },
        ].map(item => (
          <button key={item.key} onClick={() => setTab(item.key)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, cursor: "pointer", border: "none", background: "transparent", fontFamily: "'DM Sans', sans-serif", position: "relative" }}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span style={{ fontSize: 9, fontWeight: 500, color: tab === item.key ? C.oliveDark : C.soft }}>{item.label}</span>
            {item.count > 0 && <span style={{ position: "absolute", top: 6, right: "calc(50% - 16px)", background: C.terra, color: "white", fontSize: 9, fontWeight: 500, padding: "1px 5px", borderRadius: 20 }}>{item.count}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── PANTALLA LOGIN ROSARIO ────────────────────────────────
function LoginRosario({ onLogin }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const PIN_ROSARIO = "1234";

  function handleLogin() {
    if (pin === PIN_ROSARIO) { onLogin(); }
    else { setError("PIN incorrecte"); }
  }

  return (
    <div style={{ minHeight: "100vh", background: C.oliveDark, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 340 }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, color: C.white }}>focus</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 14, fontStyle: "italic", color: "#d9a080", marginTop: 4 }}>Panel d'administracio</div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 18, padding: 28, border: "0.5px solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: C.white, marginBottom: 20 }}>Acces Rosario</div>
          <Field label="PIN d'acces" value={pin} onChange={v => { setPin(v); setError(""); }} placeholder="****" type="password" />
          {error && <div style={{ background: C.dangerPale, color: C.danger, fontSize: 12, padding: "8px 12px", borderRadius: 8, marginBottom: 12 }}>{error}</div>}
          <button style={{ ...btn("terra"), width: "100%", padding: 12, fontSize: 14, borderRadius: 10, marginTop: 8 }} onClick={handleLogin}>Entrar</button>
        </div>
      </div>
    </div>
  );
}

// ── HOME — SELECTOR ───────────────────────────────────────
function Home() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: "100vh", background: C.oliveDark, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", bottom: -40, right: -20, fontFamily: "'Playfair Display', serif", fontSize: 200, fontWeight: 700, color: "rgba(255,255,255,0.03)", lineHeight: 1, pointerEvents: "none" }}>focus</div>
      <div style={{ width: "100%", maxWidth: 360, position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 700, color: C.white, lineHeight: 1 }}>focus</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontStyle: "italic", color: "#d9a080", marginTop: 6 }}>et cuida.</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button onClick={() => navigate("/alumna")} style={{ background: C.terra, color: C.white, border: "none", borderRadius: 14, padding: "18px 24px", fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "left" }}>
            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>Soc alumna</div>
            <div>Accedeix a la teva area personal</div>
          </button>
          <button onClick={() => navigate("/professora")} style={{ background: "rgba(255,255,255,0.06)", color: C.white, border: "0.5px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "18px 24px", fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "left" }}>
            <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 4 }}>Soc professora</div>
            <div>Veure les meves classes</div>
          </button>
          <button onClick={() => navigate("/admin")} style={{ background: "rgba(255,255,255,0.04)", color: C.white, border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "18px 24px", fontSize: 15, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "left" }}>
            <div style={{ fontSize: 12, opacity: 0.4, marginBottom: 4 }}>Administracio</div>
            <div>Panel de Rosario</div>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── ROUTES ────────────────────────────────────────────────
function AlumnaRoute() {
  const [alumna, setAlumna] = useState(null);
  if (!alumna) return <LoginAlumna onLogin={setAlumna} />;
  return <VistaAlumnaPanel alumna={alumna} onLogout={() => setAlumna(null)} />;
}

function ProfessoraRoute() {
  const [professora, setProfessora] = useState(null);
  if (!professora) return <LoginProfessora onLogin={setProfessora} />;
  return <PanelProfessora professora={professora} onLogout={() => setProfessora(null)} />;
}

function AdminRoute() {
  const [loggedIn, setLoggedIn] = useState(false);
  if (!loggedIn) return <LoginRosario onLogin={() => setLoggedIn(true)} />;
  return <PanelRosario />;
}

export default function App() {
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/alumna" element={<AlumnaRoute />} />
          <Route path="/professora" element={<ProfessoraRoute />} />
          <Route path="/admin" element={<AdminRoute />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
