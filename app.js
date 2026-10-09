// 1. Automatisches Injizieren des HTML-Gerüsts beim Laden der Seite
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("app-container");
    if (container) {
        container.innerHTML = `
            <div id="setup" class="screen">
                <div class="card login">
                    <img src="simp-logo.png" class="logo" alt="Logo">
                    <h1>Arbeitszeiten Simplicissimus</h1>
                    <p class="muted">Offline-Arbeitszeiterfassung</p>
                    <h2>Dieses Gerät einrichten</h2>
                    <label for="setupName">Mein Name</label>
                    <input id="setupName" placeholder="z. B. Max Mustermann" autocomplete="name">
                    <p class="hint">Der Name wird nur auf diesem Gerät gespeichert und erscheint auf deinen PDFs.</p>
                    <button id="setupBtn" class="primary wide">App einrichten</button>
                </div>
            </div>

            <div id="app" hidden>
                <header>
                    <img src="simp-logo.png" class="headlogo" alt="Logo">
                    <div>
                        <strong>Arbeitszeiten Simplicissimus</strong>
                        <small id="who"></small>
                    </div>
                </header>

                <div class="status">● Offline-App · V1.3.3</div>

                <nav>
                    <button data-v="day" class="active">Tag</button>
                    <button data-v="week">Woche</button>
                    <button data-v="month">Monat</button>
                    <button data-v="schedule">Spielplan</button>
                    <button data-v="settings">Einst.</button>
                </nav>

                <main>
                    <section id="day" class="view">
                        <div class="card">
                            <label for="date">Datum</label>
                            <input id="date" type="date">

                            <label style="margin-top: 10px;">Art des Eintrags</label>
                            <div class="type-selector">
                                <button type="button" class="type-btn active" data-type="work" onclick="setType('work')">Arbeit</button>
                                <button type="button" class="type-btn" data-type="vacation" onclick="setType('vacation')">Urlaub</button>
                                <button type="button" class="type-btn" data-type="sick" onclick="setType('sick')">Krank</button>
                               <!-- <button type="button" class="type-btn" data-type="za" onclick="setType('za')">ZA</button> -->
                            </div>

                            <div id="timeInputFields">
                                <div id="quickShiftsContainer" class="quick-shifts"></div>

                                <div class="grid">
                                    <div>
                                        <label>Beginn</label>
                                        <div class="time-pick">
                                            <select id="startHour" aria-label="Beginn Stunde"></select>
                                            <span>:</span>
                                            <select id="startMinute" aria-label="Beginn Minute"></select>
                                        </div>
                                    </div>
                                    <div>
                                        <label>Ende</label>
                                        <div class="time-pick">
                                            <select id="endHour" aria-label="Ende Stunde"></select>
                                            <span>:</span>
                                            <select id="endMinute" aria-label="Ende Minute"></select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style="margin-top: 15px;">
                                <label for="entryNote">Notiz (optional)</label>
                                <input id="entryNote" type="text" placeholder="z. B. Homeoffice">
                            </div>

                            <div class="actions" style="margin-top: 15px;">
                                <button id="save" class="primary">Eintrag speichern</button>
                                <button id="del" class="danger">Löschen</button>
                            </div>
                            <div id="daySum" class="summary"></div>
                        </div>

                        <div class="card">
                            <h2>Letzte 10 Einträge</h2>
                            <div class="table">
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Tag</th>
                                        <th>Start</th>
                                        <th>Ende</th>
                                        <th>Std.</th>
                                        <th>Edit</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody id="recent"></tbody>
                                </table>
                            </div>
                        </div>
                    </section>

<section id="week" class="view" hidden>
    <div class="card">
        <div class="between" style="align-items: flex-end; margin-bottom: 10px;">
            <div>
                <label for="weekDate">Woche mit Datum</label>
                <input id="weekDate" type="date">
            </div>
        </div>

        <h2 id="weekTotal"></h2>
        <div class="table">
            <table>
                <thead>
                <tr>
                    <th>Tag</th>
                    <th>Start</th>
                    <th>Ende</th>
                    <th>Std.</th>
                    <th>Edit</th>
                </tr>
                </thead>
                <tbody id="weekRows"></tbody>
            </table>
        </div>
    </div>
</section>
<section id="month" class="view" hidden>
    <div class="card">
        <!-- Oben: Monats-Picker und Checkbox -->
        <div class="between" style="align-items: flex-end; margin-bottom: 12px;">
            <div>
                <label for="monthPick">Monat</label>
                <input id="monthPick" type="month">
                <label for="monthWeeklyHours">Wochenstunden für diesen Monat</label>
                <input id="monthWeeklyHours" type="number" step="0.5" min="0" value="20">
            </div>
        </div>

        <!-- Darunter: Wochenstunden und PDF-Buttons nebeneinander -->
        <div class="between" style="align-items: flex-end; gap: 10px; margin-bottom: 15px;">

            <div class="actions" style="display: flex; gap: 8px;">
                <button id="pdf" class="primary">PDF erstellen</button>
                <button id="share">PDF teilen</button>
                <div class="custom-checkbox-wrapper">
                            <input type="checkbox" id="showAllMonth" checked onchange="renderMonth()">
                            <label for="showAllMonth" style="styled-label">Alle Tage anzeigen</label>
                        </div>

            </div>
            <a> * Richtigkeit des PDF selbst nachrechnen! Fehler nicht ausgeschlossen.</a>

        </div>

        <h2 id="monthTotal"></h2>

        <div class="table">
            <table>
                <thead>
                <tr>
                    <th>Tag</th>
                    <th>Start</th>
                    <th>Ende</th>
                    <th>Std.</th>
                    <th>Edit</th>
                </tr>
                </thead>
                <tbody id="monthRows"></tbody>
            </table>
        </div>
    </div>
</section>

                    <section id="schedule" class="view" hidden>
                        <div class="card">
                            <h2>🎭 Simpl-Spielplan</h2>

                            <!-- Monats-Navigation -->
                            <div style="display: flex; justify-content: space-between; align-items: center; margin: 15px 0; background: var(--bg-secondary, #2a2a2a); color: var(--text-color, #ffffff); padding: 8px 12px; border-radius: 8px;">
                                <button onclick="changeMonth(-1)" style="cursor: pointer; background: none; border: none; font-size: 16px; font-weight: bold; color: inherit;">◀</button>
                                <span id="currentMonthLabel" style="font-weight: bold; font-size: 14px; color: inherit;">Monat wird geladen...</span>
                                <button onclick="changeMonth(1)" style="cursor: pointer; background: none; border: none; font-size: 16px; font-weight: bold; color: inherit;">▶</button>
                            </div>

                            <div class="table">
                                <div id="scheduleListContainer" style="max-height: 60vh; overflow-y: auto;">
                                    <span style="color: var(--text-muted);">Lade Spielplan...</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="settings" class="view" hidden>
                        <div class="settings-group" style="margin-top: 20px; padding-top: 15px; border-top: 1px solid var(--border-color);">
                            <label>Android App</label>
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px;">
                                <a id="apkDownloadLink" href="https://github.com/MrPapr/SimplStundenliste/releases/latest" target="_blank" class="btn-secondary" style="text-decoration: none; padding: 6px 12px; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 5px;">
                                   📥 APK laden
                                </a>
                                <button onclick="forceManualUpdate()" class="update-btn-style">
                                    🔄 Update App
                                </button>

                            </div>

                        </div>

                        <div class="card">
                            <h2>Persönliche Einstellungen</h2>
                            <label for="name">Name für PDF</label>
                            <input id="name">

                            <label for="defaultWeeklyHours">Standard-Wochenstd.</label>
                            <input id="defaultWeeklyHours" type="number" step="0.5" min="0" value="20">

                            <label for="initialBalance" style="margin-top: 15px;">Start-Saldo / Korrektur (in Stunden)</label>
                                <input id="initialBalance" type="number" step="0.25" placeholder="z. B. 12.5 oder -5">
                                <p class="hint">Hier kannst du Plus- oder Minusstunden aus der Zeit vor der App eintragen.</p>

                            <h3 style="margin-top: 20px; font-size: 1rem;">Schicht-Schnellauswahl anpassen</h3>
                            <div id="quickShiftsSettings"></div>

                            <button id="settingsSave" class="primary wide" style="margin-top: 15px;">Einstellungen speichern</button>
                        </div>

                        <div class="card">
                            <h2>Datensicherung</h2>
                            <p class="hint">Da alles nur auf diesem Gerät gespeichert wird, empfehlen wir gelegentlich eine Sicherung.</p>
                            <div class="actions">
                                <button id="backup">Sicherung exportieren</button>
                                <label class="button">Sicherung importieren<input id="restore" type="file" accept="application/json" hidden></label>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        `;
    }
// --- AUTOMATISCHER FALLBACK FÜR DESKTOP (FIREFOX / SAFARI AUF MAC) ---
    let monthInput = document.getElementById('monthPick');
    if (monthInput) {
        const isDesktopNonNative = !window.matchMedia('(pointer: coarse)').matches &&
                                   (navigator.userAgent.includes('Firefox') || (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')));

        if (isDesktopNonNative) {
            let parent = monthInput.parentNode;
            let wrapper = document.createElement('div');
            wrapper.style.cssText = "display: inline-flex; gap: 6px; align-items: center;";

            let selectMonth = document.createElement('select');
            selectMonth.id = 'selectMonth';
            const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
            months.forEach((m, idx) => {
                let opt = document.createElement('option');
                opt.value = String(idx + 1).padStart(2, '0');
                opt.textContent = m;
                selectMonth.appendChild(opt);
            });

            let selectYear = document.createElement('select');
            selectYear.id = 'selectYear';
            let currentYear = new Date().getFullYear();
            for (let y = currentYear - 3; y <= currentYear + 3; y++) {
                let opt = document.createElement('option');
                opt.value = y;
                opt.textContent = y;
                selectYear.appendChild(opt);
            }

            let now = new Date();
            selectYear.value = now.getFullYear();
            selectMonth.value = String(now.getMonth() + 1).padStart(2, '0');

            monthInput.style.display = 'none';
            wrapper.appendChild(selectMonth);
            wrapper.appendChild(selectYear);
            parent.appendChild(wrapper);

            Object.defineProperty(monthInput, 'value', {
                get() {
                    return `${selectYear.value}-${selectMonth.value}`;
                },
                set(val) {
                    if (val && val.includes('-')) {
                        let parts = val.split('-');
                        selectYear.value = parts[0];
                        selectMonth.value = parts[1];
                    }
                },
                configurable: true
            });

            selectMonth.onchange = () => monthInput.dispatchEvent(new Event('change'));
            selectYear.onchange = () => monthInput.dispatchEvent(new Event('change'));
        }
    }
    // App-Start initialisieren
    initApp();
});

// 2. Deine eigentliche App-Logik
if (typeof window !== 'undefined' && window.AndroidDownload) {
    document.addEventListener('DOMContentLoaded', () => {
        document.body.classList.add('is-android-app');
    });
}

const KEY = 'simplicissimus-offline-v57';
let S = {
    name: '',
    entries: {},
    quickShifts: [
        { name: 'Normal', start: '18:00', end: '23:00' },
        { name: 'Doppel', start: '14:00', end: '23:00' },
        { name: 'Nachmittag', start: '14:00', end: '19:00' }
    ],
    defaultWeeklyHours: 20,
    initialBalance: 0,
    monthlyWeeklyHours: {},
    theaterSchedule: [] // Spielplan direkt im State abgesichert
};

let currentType = 'work'; // 'work', 'vacation', 'sick', 'za'
let editingIndex = null;

const $ = s => document.querySelector(s),
      pad = n => String(n).padStart(2, '0'),
      iso = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;

function load(){
    try{
        let data = JSON.parse(localStorage.getItem(KEY) || '{}');
        S = { ...S, ...data };
        if(!S.monthlyWeeklyHours) S.monthlyWeeklyHours = {};
        if(!S.defaultWeeklyHours) S.defaultWeeklyHours = 20;
        if(!S.theaterSchedule) S.theaterSchedule = [];
        if(S.initialBalance === undefined) S.initialBalance = 0;

        if(!S.quickShifts || S.quickShifts.length === 0) {
            S.quickShifts = [
                { name: 'Normal', start: '18:00', end: '23:00' },
                { name: 'Doppel', start: '14:00', end: '23:00' },
                { name: 'Nachmittag', start: '14:00', end: '19:00' }
            ];
        }
    }catch{}
}

function save(){ localStorage.setItem(KEY, JSON.stringify(S)); }

function getDayEntries(ds) {
    let e = S.entries[ds];
    if (!e) return [];
    let list = Array.isArray(e) ? e : [e];

    // Sortiert die Dienste des Tages chronologisch nach Startzeit (früheste zuerst)
    return list.sort((a, b) => (a.start || '').localeCompare(b.start || ''));
}

function hours(a, b){
    if(!a || !b) return 0;
    let [ah, am] = a.split(':').map(Number),
        [bh, bm] = b.split(':').map(Number),
        m = (bh * 60 + bm) - (ah * 60 + am);
    if(m < 0) m += 1440;
    return m / 60;
}

function ht(n){
    let prefix = n > 0 ? '' : '';
    return prefix + n.toLocaleString('de-AT', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + ' h';
}

function parse(s){ return new Date(s + 'T12:00:00'); }

function hasHours(e){
    if(!e) return false;
    let list = Array.isArray(e) ? e : [e];
    return list.some(item => item.type === 'vacation' || item.type === 'sick' || item.type === 'za' || (item.start && item.end && hours(item.start, item.end) > 0));
}

function getWeightedHours(ds, entry){
    let list = Array.isArray(entry) ? entry : getDayEntries(ds);
    if(list.length === 0) return 0;

    let total = 0;
    let m = ds.slice(0, 7);
    let weekly = S.monthlyWeeklyHours[m] !== undefined ? S.monthlyWeeklyHours[m] : (S.defaultWeeklyHours || 20);
    let dailyTarget = weekly / 5;

    for(let entry of list) {
        if (entry.type === 'vacation' || entry.type === 'sick') {
            total += dailyTarget;
        } else if (entry.type === 'za') {
            // 0 h
        } else if (entry.start && entry.end) {
            let base = hours(entry.start, entry.end);
            total += isDoublePayDay(ds) ? base * 2 : base;
        }
    }
    return total;
}


function fillTimeSelects() {
    const pad = (n) => String(n).padStart(2, '0');

    let hs = '<option value="">--</option>' + Array.from({length: 24}, (_, i) => `<option value="${pad(i)}">${pad(i)}</option>`).join(''),
        ms = '<option value="">--</option>' + ['00', '15', '30', '45'].map(x => `<option value="${x}">${x}</option>`).join('');

    // Selects füllen
    ['startHour', 'endHour'].forEach(id => { if($('#'+id)) $('#'+id).innerHTML = hs; });
    ['startMinute', 'endMinute'].forEach(id => { if($('#'+id)) $('#'+id).innerHTML = ms; });

    // Automatisch "00" bei den Minuten setzen, wenn eine Stunde gewählt wird
    const pairs = [
        { hour: 'startHour', minute: 'startMinute' },
        { hour: 'endHour', minute: 'endMinute' }
    ];

    pairs.forEach(pair => {
        const hourEl = document.getElementById(pair.hour) || $('#' + pair.hour);
        const minEl = document.getElementById(pair.minute) || $('#' + pair.minute);

        if (hourEl && minEl) {
            hourEl.addEventListener('change', () => {
                // Wenn eine Stunde gewählt wurde und die Minute noch leer ist
                if (hourEl.value !== '' && minEl.value === '') {
                    minEl.value = '00';
                }
            });
        }
    });
}

function setTime(prefix, t){
    let [h = '', m = ''] = String(t || '').split(':');
    if($('#'+prefix+'Hour')) $('#'+prefix+'Hour').value = h;
    if($('#'+prefix+'Minute')) $('#'+prefix+'Minute').value = m;
}

function getTime(prefix){
    let h = $('#'+prefix+'Hour')?.value, m = $('#'+prefix+'Minute')?.value;
    return h && m ? `${h}:${m}` : '';
}

function wd(s){ return ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'][parse(s).getDay()]; }


function easter(y){
    let a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k)%7,m=Math.floor((a+11*h+22*l)/451),mo=Math.floor((h+l-7*m+114)/31)-1,da=(h+l-7*m+114)%31+1;
    return new Date(y,mo,da);
}

function holidays(y){
    let x={[`${y}-01-01`]:'Neujahr',[`${y}-01-06`]:'Heilige Drei Könige',[`${y}-05-01`]:'Staatsfeiertag',[`${y}-08-15`]:'Mariä Himmelfahrt',[`${y}-10-26`]:'Nationalfeiertag',[`${y}-11-01`]:'Allerheiligen',[`${y}-12-08`]:'Mariä Empfängnis',[`${y}-12-25`]:'Christtag',[`${y}-12-26`]:'Stefanitag'},e=easter(y);
    [[1,'Ostermontag'],[39,'Christi Himmelfahrt'],[50,'Pfingstmontag'],[60,'Fronleichnam']].forEach(([n,t])=>{let d=new Date(e);d.setDate(d.getDate()+n);x[iso(d)]=t});
    return x;
}

function special(s){
    let d = parse(s), h = holidays(d.getFullYear());
    return h[s] || d.getDay() === 0 ? 'holiday' : '';
}

function isDoublePayDay(ds){
    return special(ds) === 'holiday';
}

// Saubere, zentrale Definition von getWeightedHours (unterstützt auch mehrere Einträge pro Tag korrekt)
function getWeightedHours(ds, entry){
    let list = Array.isArray(entry) ? entry : getDayEntries(ds);
    if(list.length === 0) return 0;

    let total = 0;
    let m = ds.slice(0, 7);
    let weekly = S.monthlyWeeklyHours[m] !== undefined ? S.monthlyWeeklyHours[m] : (S.defaultWeeklyHours || 20);
    let dailyTarget = weekly / 5;

    for(let item of list) {
        if (item.type === 'vacation' || item.type === 'sick') {
            total += dailyTarget;
        } else if (item.type === 'za') {
            // 0 h
        } else if (item.start && item.end) {
            let base = hours(item.start, item.end);
            total += isDoublePayDay(ds) ? base * 2 : base;
        }
    }
    return total;
}

function getTargetHoursForMonth(monthKey){
    let weekly = S.monthlyWeeklyHours[monthKey] !== undefined ? S.monthlyWeeklyHours[monthKey] : (S.defaultWeeklyHours || 20);
    return weekly * 4.33;
}

function getMonthStats(monthKey){
    let [y, mo] = monthKey.split('-').map(Number);
    let days = new Date(y, mo, 0).getDate();
    let ist = 0;

    for(let i=1; i<=days; i++){
        let ds = `${y}-${pad(mo)}-${pad(i)}`;
        let e = S.entries[ds];
        if(hasHours(e)){
            ist += getWeightedHours(ds, e);
        }
    }
    let soll = getTargetHoursForMonth(monthKey);
    let diff = ist - soll;
    return { ist, soll, diff };
}

function getCumulativeBalance(currentMonthKey){
    let months = Array.from(new Set([
        ...Object.keys(S.entries).map(k => k.slice(0, 7)),
        ...Object.keys(S.monthlyWeeklyHours),
        currentMonthKey
    ])).sort();

    let balance = parseFloat(S.initialBalance || 0);

    for (let m of months) {
        if (m > currentMonthKey) break;
        let stats = getMonthStats(m);
        balance += stats.diff;
    }
    return balance;
}

function entryRow(ds, e, editable = false){
    let list = Array.isArray(e) ? e : getDayEntries(ds);
    if(list.length === 0) return '';

    let d = parse(ds);
    let dateFormatted = `${wd(ds)} ${pad(d.getDate())}.${pad(d.getMonth()+1)}.`;

    let rowsHtml = '';
    list.forEach((item, idx) => {
        let hoursDisplay = '–';
        if(item.type === 'vacation') {
            hoursDisplay = `<span class="badge badge-urlaub">Urlaub</span>`;
        } else if(item.type === 'sick') {
            hoursDisplay = `<span class="badge badge-krank">Krank</span>`;
        } else if(item.type === 'za') {
            // Zeitausgleich: Zeige Badge und optional die Uhrzeit, falls eingetragen
            let timeInfo = (item.start && item.end) ? `<br><small style="color: var(--text-muted);">${item.start} - ${item.end}</small>` : '';
            hoursDisplay = `<span class="badge badge-za">Zeitausgleich</span>${timeInfo}`;
        } else if(item.start && item.end) {
            let base = hours(item.start, item.end);
            hoursDisplay = isDoublePayDay(ds) ? `${ht(base)} (2x)` : ht(base);
        }

        let noteHtml = item?.note ? `<br><small style="color: var(--text-muted); font-style: italic;">📝 ${item.note}</small>` : '';
        let isFirst = idx === 0;

        // Mitternachts-Kennzeichnung
        let endDisplay = item.end || '–';
        if (item.start && item.end && item.end < item.start) {
            endDisplay += ' <small style="color: var(--primary); font-weight: bold;">(+1)</small>';
        }

        let editBtnHtml = editable ? `<button class="edit-btn" onclick="editEntry('${ds}', ${idx})" title="Dienst bearbeiten">⚙️</button>` : '';

        rowsHtml += `<tr class="${special(ds)}">
            <td>${isFirst ? dateFormatted : ''}${noteHtml}</td>
            <td>${item?.start || '–'}</td>
            <td>${endDisplay}</td>
            <td>${hoursDisplay}</td>
            <td style="text-align: right;">${editBtnHtml}</td>
        </tr>`;
    });

    return rowsHtml;
}

function renderQuickShifts(){
    let container = $('#quickShiftsContainer');
    if(!container) return;
    container.innerHTML = S.quickShifts.map(s =>
        `<button type="button" class="shift-btn" onclick="applyShift('${s.start}', '${s.end}')">${s.name} (${s.start}-${s.end})</button>`
    ).join('');
}

function renderQuickShiftsSettings(){
    let container = $('#quickShiftsSettings');
    if(!container) return;
    container.innerHTML = S.quickShifts.map((s, idx) => `
        <div style="border:1px solid var(--border-color); padding:10px; border-radius:8px; margin-bottom:8px; background:var(--bg-body);">
            <label>Schicht ${idx+1} Bezeichnung</label>
            <input type="text" id="shiftName_${idx}" value="${s.name}">
            <div class="grid" style="margin-top:5px;">
                <div>
                    <label>Beginn</label>
                    <input type="time" id="shiftStart_${idx}" value="${s.start}">
                </div>
                <div>
                    <label>Ende</label>
                    <input type="time" id="shiftEnd_${idx}" value="${s.end}">
                </div>
            </div>
        </div>
    `).join('');
}

function applyShift(start, end){
    setTime('start', start);
    setTime('end', end);
    setType('work');
}

function setType(type){
    currentType = type;
    document.querySelectorAll('.type-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.type === type);
    });
    let timeFields = $('#timeInputFields');
    if(timeFields) {
        timeFields.style.display = (type === 'work' || type === 'za') ? 'block' : 'none';
    }
}

function render(){
    let ds = $('#date').value, e = S.entries[ds];
    setType(e?.type || 'work');
    setTime('start', e?.start || '');
    setTime('end', e?.end || '');

    // NEU: Notizfeld für das gewählte Datum aktualisieren
    if($('#entryNote')) {
        $('#entryNote').value = e?.note || '';
    }

    renderQuickShifts();
    renderQuickShiftsSettings();

    let recent = Object.keys(S.entries).filter(d => hasHours(S.entries[d])).sort().reverse().slice(0, 10);
    $('#recent').innerHTML = recent.map(d => entryRow(d, S.entries[d], true)).join('') || '<tr><td colspan="5">Noch keine Einträge.</td></tr>';

    document.querySelectorAll('[data-edit]').forEach(b => b.onclick = () => editEntry(b.dataset.edit));
    renderWeek();
    renderMonth();
}

function editEntry(ds, index = 0){
    $('#date').value = ds;
    let list = getDayEntries(ds);
    let e = list[index];

    if(!e) return;

    editingIndex = index; // Wir merken uns, welchen Index wir bearbeiten

    setType(e?.type || 'work');
    setTime('start', e?.start || '');
    setTime('end', e?.end || '');

    if($('#entryNote')) {
        $('#entryNote').value = e?.note || '';
    }

    // Optional: UI-Feedback, dass wir gerade einen spezifischen Eintrag bearbeiten
    let saveBtn = $('#save');
    if(saveBtn) saveBtn.textContent = `Eintrag #${index + 1} aktualisieren`;

    document.querySelectorAll('nav button').forEach(x => x.classList.toggle('active', x.dataset.v === 'day'));
    document.querySelectorAll('.view').forEach(v => v.hidden = v.id !== 'day');
    let c = $('#day .card');
    c.classList.add('editing');
    c.scrollIntoView({behavior: 'smooth', block: 'start'});
    setTimeout(() => c.classList.remove('editing'), 1400);
}

function renderWeek(){
    let dateVal = $('#weekDate').value;
    if(!dateVal) return;
    let d = parse(dateVal);
    let day = d.getDay();

    // Korrektur für europäischen Wochenstart (Montag = 1, Sonntag = 7)
    let diffToMonday = d.getDate() - day + (day === 0 ? -6 : 1);
    let monday = new Date(d.setDate(diffToMonday));

    let rows = [], tot = 0;

    // Alle 7 Tage (Montag bis Sonntag) durchgehen
    for(let i = 0; i < 7; i++){
        let x = new Date(monday);
        x.setDate(monday.getDate() + i);
        let ds = iso(x), e = S.entries[ds];

        if(hasHours(e)){
            tot += getWeightedHours(ds, e);
            rows.push(entryRow(ds, e, true));
        } else {
            rows.push(emptyDayRow(ds));
        }
    }

    $('#weekRows').innerHTML = rows.join('');
    $('#weekTotal').textContent = 'Angerechnete Stunden: ' + ht(tot);

    document.querySelectorAll('#weekRows [data-edit]').forEach(b => b.onclick = () => editEntry(b.dataset.edit));
}

// Hilfsfunktion für tage ohne Eintrag (ganz ohne Button)
function emptyDayRow(ds) {
    let d = parse(ds);
    const dayNamesShort = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    let wdStr = dayNamesShort[d.getDay()];
    let dateFormatted = `${wdStr}., ${pad(d.getDate())}.${pad(d.getMonth() + 1)}.`;

    return `<tr>
        <td>${dateFormatted}</td>
        <td colspan="4" style="color: var(--text-muted, #888); font-style: italic;">Frei / Kein Eintrag</td>
    </tr>`;
}

function renderMonth(){
    let m = $('#monthPick').value;
    if(!m) return;

    let [y, mo] = m.split('-').map(Number);
    let days = new Date(y, mo, 0).getDate();
    let rows = [];

    // Prüfen, ob die Checkbox existiert und ob sie angehakt ist
    let showAllCheckbox = $('#showAllMonth');
    let showAll = showAllCheckbox ? showAllCheckbox.checked : true;

    let weekHasRows = false; // Merkt sich, ob in der aktuellen Woche Zeilen da waren

    for(let i = 1; i <= days; i++){
        let ds = `${y}-${pad(mo)}-${pad(i)}`;
        let e = S.entries[ds];
        let d = parse(ds);
        let isSun = (d.getDay() === 0);

        let added = false;
        if(hasHours(e)){
            rows.push(entryRow(ds, e, true));
            added = true;
        } else if (showAll) {
            // Nur anzeigen, wenn die Checkbox "Alle Tage anzeigen" aktiv ist
            rows.push(emptyDayRow(ds));
            added = true;
        }

        if(added) {
            weekHasRows = true;
        }

        // Nach jedem Sonntag: Nur wenn in dieser Woche auch Zeilen gerendert wurden, den Abstand einfügen
        if(isSun){
            if(weekHasRows){
                rows.push(`<div style="height: 15px; margin: 0;"></div>`);
            }
            weekHasRows = false; // Für die nächste Woche zurücksetzen
        }
    }

    $('#monthRows').innerHTML = rows.join('');
    document.querySelectorAll('#monthRows [data-edit]').forEach(b => b.onclick = () => editEntry(b.dataset.edit));

    let currentWeekly = S.monthlyWeeklyHours[m] !== undefined ? S.monthlyWeeklyHours[m] : (S.defaultWeeklyHours || 20);
    if($('#monthWeeklyHours')) $('#monthWeeklyHours').value = currentWeekly;

    let stats = getMonthStats(m);
    let totalBalance = getCumulativeBalance(m);

    let diffClass = stats.diff > 0 ? 'val-positive' : (stats.diff < 0 ? 'val-negative' : 'val-neutral');
    let balanceClass = totalBalance > 0 ? 'val-positive' : (totalBalance < 0 ? 'val-negative' : 'val-neutral');

    let progressPercent = stats.soll > 0 ? Math.min(Math.round((stats.ist / stats.soll) * 100), 100) : 0;

    let summaryHTML = `
        <div class="progress-container">
            <div class="progress-bar" style="width: ${progressPercent}%;"></div>
        </div>
        <div class="progress-text">${progressPercent}% des Monatssolls erreicht</div>

        <div class="stats-grid">
            <div class="stat-card">
                <span class="label">Ist-Stunden</span>
                <span class="value">${ht(stats.ist)}</span>
            </div>
            <div class="stat-card">
                <span class="label">Soll-Stunden</span>
                <span class="value">${ht(stats.soll)}</span>
            </div>
            <div class="stat-card">
                <span class="label">Monats-Differenz</span>
                <span class="value ${diffClass}">${ht(stats.diff)}</span>
            </div>
            <div class="stat-card">
                <span class="label">Gesamtsaldo</span>
                <span class="value ${balanceClass}">${ht(totalBalance)}</span>
            </div>
        </div>
    `;

    $('#monthTotal').innerHTML = summaryHTML;
}

function esc(s){
    return String(s).replace(/[\\()]/g, '\\$&').replace(/[ä]/g, 'ae').replace(/[ö]/g, 'oe').replace(/[ü]/g, 'ue').replace(/[Ä]/g, 'Ae').replace(/[Ö]/g, 'Oe').replace(/[Ü]/g, 'Ue').replace(/ß/g, 'ss');
}

function pdfBlob(){
    let mVal = $('#monthPick').value,
        [y, mo] = mVal.split('-').map(Number),
        days = new Date(y, mo, 0).getDate(),
        lines = [],
        specialLines = [];

    // Deutsches Monat-Array für die schöne Anzeige
    const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    // Deutsches Wochentag-Array für die vollständige Ausschreibung
    const dayNames = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    let monthYearStr = `${monthNames[mo - 1] || mo} ${y}`;

    let totalIstHours = 0;
    let totalSpecialHours = 0;
    let totalZaHours = 0;
    let hmap = holidays(y);
    let weekHasEntries = false;

    // NEU: Holt den Status direkt von der Checkbox in der Monatsansicht (Fallback auf true, falls nicht vorhanden)
    let showAllCheckbox = $('#showAllMonth');
    let showAllDays = showAllCheckbox ? showAllCheckbox.checked : true;

    for(let i = 1; i <= days; i++){
        let ds = `${y}-${pad(mo)}-${pad(i)}`,
            d = parse(ds),
            isSun = d.getDay() === 0,
            h = hmap[ds];

        let list = getDayEntries(ds);
        let wdStr = dayNames[d.getDay()];
        let dateStr = `${pad(i)}.${pad(mo)}.${y}`;

        if (list.length > 0) {
            weekHasEntries = true;
            list.forEach((item) => {
                let noteStr = item?.note ? item.note : '';

                if (item.type === 'vacation') {
                    let weighted = getWeightedHours(ds, [item]);
                    totalIstHours += weighted;
                    lines.push({ wd: wdStr, date: dateStr, col2: 'Urlaub', col3: ht(weighted), note: noteStr });
                } else if (item.type === 'sick') {
                    let weighted = getWeightedHours(ds, [item]);
                    totalIstHours += weighted;
                    lines.push({ wd: wdStr, date: dateStr, col2: 'Krank', col3: ht(weighted), note: noteStr });
                } else if (item.type === 'za') {
                    let zaBase = 0;
                    let timeStr = '';
                    if (item.start && item.end) {
                        zaBase = hours(item.start, item.end);
                        totalZaHours += zaBase;
                        timeStr = `${item.start} - ${item.end}`;
                    } else if (item.start) {
                        timeStr = item.start;
                    }
                    lines.push({ wd: wdStr, date: dateStr, col2: timeStr, col3: ht(zaBase), note: noteStr });
                } else if (item.start && item.end) {
                    let base = hours(item.start, item.end);
                    totalIstHours += base;
                    let endDisplay = item.end + (item.end < item.start ? ' (+1)' : '');
                    let timeStr = `${item.start} - ${endDisplay}`;
                    lines.push({ wd: wdStr, date: dateStr, col2: timeStr, col3: ht(base), note: noteStr });

                    if(isSun || h){
                        let label = isSun && h ? `Sonntag / ${h}` : (isSun ? 'Sonntag' : h);
                        totalSpecialHours += base;
                        specialLines.push({ wd: wdStr, date: dateStr, col2: timeStr, col3: ht(base), note: noteStr ? `${noteStr} (${label})` : label });
                    }
                }
            });
        } else if (showAllDays) {
            // Wenn keine Einträge da sind, aber die Checkbox in der Monatsansicht aktiv ist:
            weekHasEntries = true;
            lines.push({
                wd: wdStr,
                date: dateStr,
                col2: '-',
                col3: '',
                note: h ? h : '' // Falls Feiertag, direkt als Notiz anzeigen
            });
        }

        if (isSun) {
            if (weekHasEntries) {
                lines.push(null);
            }
            weekHasEntries = false;
        }
    }

    if(lines.length === 0){
        lines.push({ wd: '', date: 'Keine Arbeitsstunden in diesem Monat eingetragen.', col2: '', col3: '', note: '' });
    }

    // Zeilen pro Seite auf 40 erhöht (vorher 28)
    let streams = [], per = 40, rowHeight = 15;
    let rightEdgeCol3 = 355; // Rechte Kante für Stunden-Spalte
    let charWidth = 5.5;     // Geschätzte Zeichenbreite bei Helvetica 10pt

    // Normale Zeilen ganz regulär in Chunks aufteilen
    let pageChunks = [];
    for(let i = 0; i < lines.length; i += per) {
        pageChunks.push(lines.slice(i, i + per));
    }

    pageChunks.forEach((chunk, p) => {
        let s = `BT /F1 15 Tf 45 800 Td (${esc('Arbeitszeiten Simplicissimus')}) Tj /F1 11 Tf 0 -22 Td (${esc('Mitarbeiter: ' + S.name)}) Tj 0 -16 Td (${esc('Monat: ' + monthYearStr)}) Tj`;

        let startY = 720;

        // --- TABELLENKOPF ---
        let col3HeaderX = rightEdgeCol3 - ('Stunden'.length * charWidth);
        s += ` /F1 10 Tf 1 0 0 1 45 ${startY} Tm (${esc('Tag')}) Tj`;
        s += ` 1 0 0 1 125 ${startY} Tm (${esc('Datum')}) Tj`;
        s += ` 1 0 0 1 220 ${startY} Tm (${esc('Zeit')}) Tj`;
        s += ` 1 0 0 1 ${col3HeaderX} ${startY} Tm (${esc('Stunden')}) Tj`;
        s += ` 1 0 0 1 370 ${startY} Tm (${esc('Notiz')}) Tj`;
        s += ` 0.5 w 45 ${startY - 4} m 545 ${startY - 4} l S`;

        // --- TABELLENZEILEN ---
        let rowStartY = startY - 18;
        chunk.forEach((row, index) => {
            let yPos = rowStartY - (index * rowHeight);
            if (row === null) return;

            s += ` /F1 10 Tf 1 0 0 1 45 ${yPos} Tm (${esc(row.wd)}) Tj`;
            s += ` 1 0 0 1 125 ${yPos} Tm (${esc(row.date)}) Tj`;
            if (row.col2) s += ` 1 0 0 1 220 ${yPos} Tm (${esc(row.col2)}) Tj`;
            if (row.col3) {
                let xPos3 = rightEdgeCol3 - (row.col3.length * charWidth);
                s += ` 1 0 0 1 ${xPos3} ${yPos} Tm (${esc(row.col3)}) Tj`;
            }
            if (row.note) s += ` 1 0 0 1 370 ${yPos} Tm (${esc(row.note)}) Tj`;
        });

        // --- SUMMEN AUF DER LETZTEN HAUPTSEITE ---
        let isLastMainPage = (p === pageChunks.length - 1);
        if (isLastMainPage) {
            let summaryY = rowStartY - (chunk.length * rowHeight) - 12;
            s += ` /F1 11 Tf 1 0 0 1 45 ${summaryY} Tm (${esc('Gesamt Ist-Stunden: ' + ht(totalIstHours))}) Tj`;
            if (totalZaHours > 0) {
                summaryY -= 15;
                s += ` 1 0 0 1 45 ${summaryY} Tm (${esc('Gesamt Zeitausgleich-Stunden: ' + ht(totalZaHours))}) Tj`;
            }
        }

        s += ' ET';
        streams.push(s);
    });

    // --- SONN- UND FEIERTAGSSEITE ---
    if (specialLines.length > 0) {
        let sp = `BT /F1 15 Tf 45 800 Td (${esc('Sonn- und Feiertagsdienste')}) Tj /F1 11 Tf 0 -22 Td (${esc('Mitarbeiter: ' + S.name)}) Tj 0 -16 Td (${esc('Monat: ' + monthYearStr)}) Tj`;

        let startY = 720;
        let col3HeaderX = rightEdgeCol3 - ('Stunden'.length * charWidth);
        sp += ` /F1 10 Tf 1 0 0 1 45 ${startY} Tm (${esc('Tag')}) Tj`;
        sp += ` 1 0 0 1 125 ${startY} Tm (${esc('Datum')}) Tj`;
        sp += ` 1 0 0 1 220 ${startY} Tm (${esc('Zeit')}) Tj`;
        sp += ` 1 0 0 1 ${col3HeaderX} ${startY} Tm (${esc('Stunden')}) Tj`;
        sp += ` 1 0 0 1 370 ${startY} Tm (${esc('Feiertag / Notiz')}) Tj`;
        sp += ` 0.5 w 45 ${startY - 4} m 545 ${startY - 4} l S`;

        let rowStartY = startY - 18;
        specialLines.forEach((row, index) => {
            let yPos = rowStartY - (index * rowHeight);
            sp += ` /F1 10 Tf 1 0 0 1 45 ${yPos} Tm (${esc(row.wd)}) Tj`;
            sp += ` 1 0 0 1 125 ${yPos} Tm (${esc(row.date)}) Tj`;
            if (row.col2) sp += ` 1 0 0 1 220 ${yPos} Tm (${esc(row.col2)}) Tj`;
            if (row.col3) {
                let xPos3 = rightEdgeCol3 - (row.col3.length * charWidth);
                sp += ` 1 0 0 1 ${xPos3} ${yPos} Tm (${esc(row.col3)}) Tj`;
            }
            if (row.note) sp += ` 1 0 0 1 370 ${yPos} Tm (${esc(row.note)}) Tj`;
        });
        let summaryY = rowStartY - (specialLines.length * rowHeight) - 12;
        sp += ` /F1 11 Tf 1 0 0 1 45 ${summaryY} Tm (${esc('Gesamt Sonn-/Feiertagsstunden: ' + ht(totalSpecialHours))}) Tj`;
        sp += ' ET';
        streams.push(sp);
    }

    // --- SEITENZAHLEN DYNAMISCH HINZUFÜGEN ---
    let totalPages = streams.length;
    streams = streams.map((st, idx) => {
        return st + ` BT /F1 9 Tf 510 30 Td (${esc((idx + 1) + ' / ' + totalPages)}) Tj ET`;
    });

    let objs = [
            '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'
        ],
        pages = [],
        contents = [];

    streams.forEach(st => {
        let streamBytes = new TextEncoder().encode(st);
        contents.push(objs.push(`<< /Length ${streamBytes.length} >>\nstream\n${st}\nendstream`));
        pages.push(objs.push('PENDING'));
    });

    let pagesId = objs.push('PENDING');
    pages.forEach((id, i) => objs[id - 1] = `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 1 0 R >> >> /Contents ${contents[i]} 0 R >>`);
    objs[pagesId - 1] = `<< /Type /Pages /Count ${pages.length} /Kids [${pages.map(x => x + ' 0 R').join(' ')}] >>`;

    let root = objs.push(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`),
        pdf = '%PDF-1.4\n',
        offs = [0];

    objs.forEach((o, i) => {
        offs.push(pdf.length);
        pdf += `${i + 1} 0 obj\n${o}\nendobj\n`;
    });

    let xr = pdf.length;
    pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + offs.slice(1).map(x => String(x).padStart(10, '0') + ' 00000 n \n').join('') + `trailer\n<< /Size ${objs.length + 1} /Root ${root} 0 R >>\nstartxref\n${xr}\n%%EOF`;

    return new Blob([pdf], { type: 'application/pdf' });
}

// Beispiel für deinen Event-Listener beim Knopfdruck:
async function handleDownloadPDF() {
    // 1. Dein bestehendes PDF als Blob generieren
    const myBlob = pdfBlob();
    const filename = 'Arbeitszeiten.pdf';

    const file = new File([myBlob], filename, { type: 'application/pdf' });

    // 2. Prüfen, ob die Web Share API mit Dateiversand unterstützt wird (iOS Safari unterstützt das hervorragend!)
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
            await navigator.share({
                files: [file],
                title: 'Arbeitszeiten PDF',
                text: 'Hier ist dein generierter Monatsbericht.',
            });
            return; // Erfolgreich geteilt / zum Speichern angeboten
        } catch (error) {
            // Wenn der Nutzer den Teilen-Dialog abbricht, ist das ein "AbortError" -> ignorieren
            if (error.name !== 'AbortError') {
                console.error('Fehler beim Teilen:', error);
            }
            return;
        }
    }

    // 3. Fallback für Desktop, Android oder ältere Browser (dein bisheriger Weg)
    const blobUrl = URL.createObjectURL(myBlob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
}



function filename(){
    return `Arbeitszeiten-${S.name.replace(/[^a-zA-Z0-9äöüÄÖÜß_-]+/g, '_')}-${$('#monthPick').value}.pdf`;
}

// --- 🎭 Theater-Spielplan Monatsansicht & Zustand ---

if (typeof S.currentMonthOffset === 'undefined') {
    S.currentMonthOffset = 0;
}

function fetchTheaterSchedule() {
    const scheduleUrl = "https://raw.githubusercontent.com/MrPapr/SimplStundenliste/main/schedule.json";
    renderScheduleSection(); // Offline-First: sofort lokale Daten anzeigen

    fetch(scheduleUrl)
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                S.theaterSchedule = data;
                save();
                renderScheduleSection();
            }
        })
        .catch(() => console.log('Offline: Nutze lokalen Spielplan.'));
}

function parseDateString(dateStr) {
    if (!dateStr) return null;

    let cleanStr = dateStr.toString().trim();
    let parts = cleanStr.split(/[\/\.\-]/);

    if (parts.length === 3) {
        let p0 = parseInt(parts[0], 10);
        let p1 = parseInt(parts[1], 10);
        let p2 = parseInt(parts[2], 10);

        let day, month, year;

        // Prüfen ob Jahr am Anfang steht (z.B. 2027-04-30) oder am Ende (30.04.2027)
        if (parts[0].length === 4) {
            year = p0;
            month = p1 - 1;
            day = p2;
        } else {
            // Europäisches Format erzwingen: Tag . Monat . Jahr
            day = p0;
            month = p1 - 1; // 0 = Januar, 3 = April etc.
            year = p2;
        }

        // WICHTIG: Date.UTC verhindert, dass Zeitzonen des Geräts das Datum verfälschen!
        let utcDate = new Date(Date.UTC(year, month, day));
        if (!isNaN(utcDate.getTime())) return utcDate;
    }

    let fallback = new Date(dateStr);
    return isNaN(fallback.getTime()) ? null : fallback;
}

function changeMonth(direction) {
    S.currentMonthOffset += direction;

    // Zustand speichern, falls die save()-Funktion global verfügbar ist
        if (typeof save === 'function') {
            save();
        }

    renderScheduleSection();
}

// Hilfsfunktion: Ermittelt die Kalenderwoche, um Wochenwechsel zu erkennen
function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    let dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    let yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d - yearStart) / 86400000) + 1)/7);
}




// 4. Datum für die Anzeige formatieren (z.B. 1.9.2026)
function formatDisplayDate(dateStr) {
    let itemDate = parseDateString(dateStr);
    if (!itemDate || isNaN(itemDate)) return dateStr;

    let day = itemDate.getUTCDate();
    let month = itemDate.getUTCMonth() + 1;
    let year = itemDate.getUTCFullYear();

    return `${day}.${month}.${year}`;
}

// 5. Die Hauptfunktion für den Spielplan
function renderScheduleSection() {
    let container = $('#scheduleListContainer');
    let label = $('#currentMonthLabel');
    if (!container) return;

    if (!S.theaterSchedule || S.theaterSchedule.length === 0) {
        if(label) label.textContent = "Kein Spielplan";
        container.innerHTML = `<div style="padding: 10px; color: var(--text-muted);">Kein Spielplan verfügbar.</div>`;
        return;
    }

    // Ziel-Monat berechnen basierend auf dem Offset
    let now = new Date();
    let targetDate = new Date(now.getFullYear(), now.getMonth() + S.currentMonthOffset, 1);
    let year = targetDate.getFullYear();
    let month = targetDate.getMonth();

    // Monatslabel aktualisieren
    if (label) {
        let monthNames = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
        label.textContent = `${monthNames[month]} ${year}`;
    }

    // Termine für diesen Monat filtern
    let filteredSchedule = S.theaterSchedule.filter(item => {
        let itemDate = parseDateString(item.date);
        return itemDate && itemDate.getFullYear() === year && itemDate.getMonth() === month;
    });

    // Chronologisch nach Datum sortieren
    filteredSchedule.sort((a, b) => parseDateString(a.date) - parseDateString(b.date));

    if (filteredSchedule.length === 0) {
        container.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-muted);">Keine Vorstellungen in diesem Monat.</div>`;
        return;
    }

    // Einträge nach Datum gruppieren (gleiche Daten zusammenfassen)
    let groupedSchedule = [];
    filteredSchedule.forEach(item => {
        let lastGroup = groupedSchedule[groupedSchedule.length - 1];
        if (lastGroup && lastGroup.dateStr === item.date) {
            lastGroup.events.push({ title: item.title, time: item.time });
        } else {
            groupedSchedule.push({
                dateStr: item.date,
                events: [{ title: item.title, time: item.time }]
            });
        }
    });

    // Tabelle aufbauen
    let html = `<table style="width: 100%; border-collapse: collapse;">`;
    let lastWeekNo = null;

    // Heutiges Datum für den Vergleich im ISO-Format ermitteln
    let todayObj = new Date();
    let todayIso = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`;

    groupedSchedule.forEach((group, index) => {
        let itemDate = parseDateString(group.dateStr);
        let currentWeekNo = itemDate ? getWeekNumber(itemDate) : null;

        // Wochentag im UTC-Modus ermitteln
        let weekdayName = itemDate ? itemDate.toLocaleDateString('de-DE', { weekday: 'short', timeZone: 'UTC' }) : '';

        // Prüfen ob Feiertag oder Sonntag
        let itemYear = itemDate ? itemDate.getUTCFullYear() : year;
        let holidayList = holidays(itemYear);

        let m = itemDate ? String(itemDate.getUTCMonth() + 1).padStart(2, '0') : '';
        let dayNum = itemDate ? String(itemDate.getUTCDate()).padStart(2, '0') : '';
        let isoStr = `${itemYear}-${m}-${dayNum}`;

        // 💡 HEUTIGEN TAG PRÜFEN & HIGHLIGHT-STYLE FESTLEGEN
        let isToday = (isoStr === todayIso);
        let rowHighlightStyle = isToday ? 'background-color: var(--accent-bg, rgba(255, 204, 0, 0.12)); border-left: 4px solid var(--accent-color, #ffcc00);' : '';
        let todayBadge = isToday ? `<span style="background: var(--accent-color, #ffcc00); color: #000; font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; font-weight: bold; margin-left: 6px; vertical-align: middle;">HEUTE</span>` : '';

        let holidayName = holidayList[isoStr];
        let isSunday = itemDate ? itemDate.getUTCDay() === 0 : false;

        let isSpecialDay = holidayName || isSunday;
        let dateColorStyle = isSpecialDay ? 'color: #ff5252;' : '';
        let specialInfoHTML = holidayName ? `<br><small style="color: ${isSpecialDay ? '#ff5252' : 'var(--text-muted)'}; font-style: italic;">${holidayName}</small>` : '';

        // Wochenwechsel-Linie + KW-Hinweis
        if (index > 0 && currentWeekNo !== lastWeekNo) {
            html += `<tr><td colspan="2" style="padding: 24px 0 12px 0;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="flex-grow: 1; border-top: 3px double var(--accent-color, #ffcc00);"></div>
                    <span style="font-size: 0.75rem; font-weight: bold; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">KW ${currentWeekNo}</span>
                    <div style="flex-grow: 1; border-top: 3px double var(--accent-color, #ffcc00);"></div>
                </div>
            </td></tr>`;
        } else if (index === 0 && currentWeekNo !== null) {
            html += `<tr><td colspan="2" style="padding: 4px 0 8px 0;">
                <span style="font-size: 0.75rem; font-weight: bold; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px;">KW ${currentWeekNo}</span>
            </td></tr>`;
        }
        lastWeekNo = currentWeekNo;

        // Alle Vorstellungen für diesen Tag generieren
        let eventsHtml = '';
        group.events.forEach((ev, evIndex) => {
            let marginStyle = evIndex > 0 ? 'margin-top: 8px; padding-top: 8px; border-top: 1px dashed var(--border-color, #444);' : '';
            eventsHtml += `
                <div style="${marginStyle}">
                    <strong>${ev.title || ''}</strong><br>
                    <small style="color: var(--text-muted);">${ev.time || ''}</small>
                </div>
            `;
        });

        // Zeile mit integriertem `rowHighlightStyle` und `todayBadge`
        html += `<tr style="border-bottom: 1px solid var(--border-color); ${rowHighlightStyle}">
            <td style="padding: 10px 8px; width: 35%; vertical-align: top;">
                <div style="font-weight: bold; ${dateColorStyle}">${weekdayName}, ${formatDisplayDate(group.dateStr)}${todayBadge}</div>
                ${specialInfoHTML}
            </td>
            <td style="padding: 10px 8px; vertical-align: top;">
                ${eventsHtml}
            </td>
        </tr>`;
    });
    html += `</table>`;
    container.innerHTML = html;
}

function initApp(){
    load();

    S.currentMonthOffset = 0;

    fillTimeSelects();
    let today = iso(new Date());
    $('#date').value = today;
    $('#weekDate').value = today;
    $('#monthPick').value = today.slice(0, 7);

    if($('#pdfShowAllDays')) {
            $('#pdfShowAllDays').checked = !!S.pdfShowAllDays;
        }

    if(S.name) openApp();

    $('#setupBtn').onclick = () => {
        let n = $('#setupName').value.trim();
        if(n.length < 2) return alert('Bitte deinen Namen eingeben.');
        S.name = n;
        save();
        openApp();
    };

    // Navigation-Umschaltung inklusive Abfrage für den Spielplan-Tab
    document.querySelectorAll('nav button').forEach(b => b.onclick = () => {
        document.querySelectorAll('nav button').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        document.querySelectorAll('.view').forEach(v => v.hidden = true);

        let targetView = b.dataset.v;
        $('#'+targetView).hidden = false;

        // Wenn der User auf den Spielplan klickt -> Daten laden
        if(targetView === 'schedule') {
            fetchTheaterSchedule();
        }

        render();
    });

    $('#date').onchange = render;
    $('#weekDate').onchange = renderWeek;
    $('#monthPick').addEventListener('input', renderMonth);
    $('#monthPick').addEventListener('change', renderMonth);

    if($('#monthWeeklyHours')) {
        $('#monthWeeklyHours').onchange = (e) => {
            let val = parseFloat(e.target.value) || 0;
            let m = $('#monthPick').value;
            S.monthlyWeeklyHours[m] = val;
            save();
            renderMonth();
        };
    }

            $('#save').onclick = () => {
                let dateVal = $('#date').value;
                let noteVal = $('#entryNote')?.value.trim() || '';

                let entryData = {
                    type: currentType,
                    note: noteVal
                };

                if (currentType === 'work') {
                    let a = getTime('start'), b = getTime('end');
                    if(!a || !b) return alert('Bitte Beginn und Ende vollständig auswählen.');
                    entryData.start = a;
                    entryData.end = b;
                }

                let dayEntries = getDayEntries(dateVal);

                if (editingIndex !== null && dayEntries[editingIndex]) {
                    // Bestehenden Eintrag an dieser Stelle aktualisieren
                    dayEntries[editingIndex] = entryData;
                    editingIndex = null; // Zurücksetzen
                    $('#save').textContent = 'Eintrag speichern';
                } else {
                    // Neuen Dienst an den Tag anhängen
                    dayEntries.push(entryData);
                }

                S.entries[dateVal] = dayEntries;
                save();
                render();

                // Formular zurücksetzen / Notiz leeren
                if($('#entryNote')) $('#entryNote').value = '';
            };

    $('#del').onclick = () => {
        let dateVal = $('#date').value;
        let dayEntries = getDayEntries(dateVal);

        if (dayEntries.length === 0) return;

        // Wenn ein spezifischer Eintrag im Bearbeitungsmodus ausgewählt ist:
        if (editingIndex !== null && dayEntries[editingIndex]) {
            dayEntries.splice(editingIndex, 1); // Nur diesen einen Index löschen
            editingIndex = null; // Bearbeitungsmodus zurücksetzen

            let saveBtn = $('#save');
            if(saveBtn) saveBtn.textContent = 'Eintrag speichern';
        } else if (dayEntries.length > 0) {
            // Fallback: Wenn kein Index aktiv ist, standardmäßig den ersten Eintrag löschen
            dayEntries.shift();
        }

        // Wenn nach dem Löschen keine Einträge mehr da sind, den Tag komplett löschen
        if (dayEntries.length === 0) {
            delete S.entries[dateVal];
        } else {
            S.entries[dateVal] = dayEntries;
        }

        save();
        render();

        // Eingabefelder zurücksetzen
        if($('#entryNote')) $('#entryNote').value = '';
        setTime('start', '');
        setTime('end', '');
    };

    $('#settingsSave').onclick = () => {
        let n = $('#name').value.trim();
        if(n.length < 2) return alert('Bitte einen Namen eingeben.');
        S.name = n;
        if($('#defaultWeeklyHours')) {
            S.defaultWeeklyHours = parseFloat($('#defaultWeeklyHours').value) || 20;
        }
        if($('#initialBalance')) {
            S.initialBalance = parseFloat($('#initialBalance').value) || 0;
        }

        // Neu: Status der PDF-Checkbox beim Speichern sichern
                if($('#pdfShowAllDays')) {
                    S.pdfShowAllDays = $('#pdfShowAllDays').checked;
                }

        S.quickShifts = S.quickShifts.map((_, idx) => {
            return {
                name: $(`#shiftName_${idx}`)?.value || `Schicht ${idx+1}`,
                start: $(`#shiftStart_${idx}`)?.value || '00:00',
                end: $(`#shiftEnd_${idx}`)?.value || '00:00'
            };
        });

        save();
        $('#who').textContent = S.name;
        render();
        alert('Einstellungen gespeichert.');
    };

$('#pdf').onclick = async () => {
    let blob = pdfBlob();
    let name = filename();

    // 1. Android-Spezifischer nativer Download
    if (typeof AndroidDownload !== 'undefined') {
        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            let base64Data = reader.result;
            AndroidDownload.saveBlob(base64Data, name);
        };
        return;
    }

    // 2. iOS / Safari: Blob-URL erzeugen und direkt öffnen
    // Auf iOS Safari kann der Nutzer im geöffneten PDF direkt auf das Teilen-Symbol tippen
    // und dort "In Dateien sichern" auswählen.
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    let blobUrl = URL.createObjectURL(blob);

    if (isIOS) {
        // Auf iOS öffnen wir das PDF in einem neuen Tab/Fenster.
        // Der Nutzer hat dort den nativen "Teilen" -> "In Dateien sichern"-Weg.
        let newWindow = window.open(blobUrl, '_blank');
        if (!newWindow) {
            // Falls ein Pop-up-Blocker zuschlägt, als Fallback direkt im aktuellen Tab navigieren
            window.location.href = blobUrl;
        }
        return;
    }

    let blobURL = URL.createObjectURL(blob)

    // 3. Fallback für Desktop und Standard-Browser (direkter Download)
    let a = document.createElement('a');
    a.href = blobUrl;
    a.download = name;
    document.body.appendChild(a); // Muss kurz ins DOM eingehängt werden
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
};

$('#share').onclick = async () => {
    let b = pdfBlob(), name = filename();

    // 1. Android-App (WebView) – nutzt deine native Kotlin-Brücke zum Teilen oder Speichern
    if (typeof AndroidDownload !== 'undefined') {
        let reader = new FileReader();
        reader.readAsDataURL(b);
        reader.onloadend = () => {
            if (typeof AndroidDownload.shareBlob === 'function') {
                AndroidDownload.shareBlob(reader.result, name);
            } else {
                AndroidDownload.saveBlob(reader.result, name);
            }
        };
        return;
    }

    // 2. Web Share API (Chrome, Safari, Edge etc.)
    if (navigator.share) {
        try {
            let f = new File([b], name, { type: 'application/pdf' });
            if (!navigator.canShare || navigator.canShare({ files: [f] })) {
                await navigator.share({
                    files: [f],
                    title: 'Arbeitszeiten ' + S.name,
                    text: 'Hier ist meine Arbeitszeitübersicht'
                });
                return; // Erfolgreich geteilt, fertig!
            }
        } catch (err) {
            // Wenn der Nutzer das Teilen-Menü abbricht, ist das kein technischer Fehler
            if (err.name !== 'AbortError') {
                console.error('Fehler beim Teilen:', err);
            }
            return;
        }
    }

    // 3. Fallback für Firefox & Browser ohne Datei-Teilen (Sowohl Share nicht da -> ab zu PDF)
    // Löst direkt den regulären PDF-Download aus, damit der Nutzer die Datei sicher erhält
    $('#pdf').click();
};

    $('#backup').onclick = () => {
        const exportPayload = {
            format: 'Simplicissimus-Offline-v5.7',
            timestamp: new Date().toISOString(),
            data: S
        };

        const jsonString = JSON.stringify(exportPayload, null, 2);
        const userName = (S && S.name) ? S.name.replace(/\s+/g, '_') : 'User';
        const filename = `Simplicissimus_Sicherung_${userName}.json`;

        if (typeof AndroidDownload !== 'undefined') {
            const base64Data = "data:application/json;base64," + btoa(unescape(encodeURIComponent(jsonString)));
            AndroidDownload.saveBlob(base64Data, filename);
        } else {
            const blob = new Blob([jsonString], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            a.click();
            URL.revokeObjectURL(a.exportPayload);
        }
    };

    $('#restore').onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const text = await file.text();
            const parsed = JSON.parse(text);

            const validFormats = ['Simplicissimus-Offline-v5.5', 'Simplicissimus-Offline-v5.6', 'Simplicissimus-Offline-v5.7'];
            if (!parsed || !validFormats.includes(parsed.format) || !parsed.data) {
                alert('Fehler: Die gewählte Datei ist keine gültige Simplicissimus-Sicherungsdatei.');
                e.target.value = '';
                return;
            }

            const confirmRestore = confirm(
                'Möchtest du alle aktuellen Daten auf diesem Gerät durch die Daten aus dieser Sicherung ersetzen?'
            );

            if (!confirmRestore) {
                e.target.value = '';
                return;
            }

            S = parsed.data;
            save();
            alert('Sicherung erfolgreich wiederhergestellt!');
            location.reload();

        } catch (err) {
            alert('Fehler beim Einlesen der Sicherungsdatei. Bitte überprüfe das Dateiformat.');
            e.target.value = '';
        }
    };
}

function openApp(){
    if(!S.name) return;
    $('#setup').hidden = true;
    $('#app').hidden = false;
    $('#who').textContent = S.name;
    if($('#name')) $('#name').value = S.name;
    if($('#defaultWeeklyHours')) $('#defaultWeeklyHours').value = S.defaultWeeklyHours || 20;
    if($('#initialBalance')) $('#initialBalance').value = S.initialBalance || 0;
    render();
}

function forceManualUpdate() {
    // 1. Optional: Dem Nutzer eine kurze Meldung anzeigen
    // (Falls du ein Element für Meldungen hast, kannst du den Text setzen,
    // oder alternativ einen kleinen alert nutzen)

    // Beispiel mit einem Element (falls vorhanden, z.B. ein Lade-Text):
    const statusMsg = document.getElementById('statusMessage'); // Passe die ID an dein HTML an
    if (statusMsg) {
        statusMsg.innerText = '🔄 Update wird geladen...';
        statusMsg.style.display = 'block';
    } else {
        // Falls kein spezielles Element da ist, reicht auch ein kurzes Feedback
        console.log('Update wird ausgeführt...');
    }
    // Dem neuen Service Worker Bescheid geben, sofort zu übernehmen
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.ready.then(registration => {
            if (registration.waiting) {
              registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
          });
        }

    // 2. Kurzer Timeout (z. B. 400 Millisekunden), damit der Nutzer die Meldung kurz sehen kann
    setTimeout(() => {
            // Nimm die aktuelle URL inklusive Hash und hänge den Update-Parameter an
            const currentUrl = window.location.href.split('?')[0]; // eventuelle alte Parameter entfernen
            const hash = window.location.hash;
            window.location.href = `${currentUrl}?update=${Date.now()}${hash}`;
        }, 400);
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registriert mit Scope:', registration.scope);

        // Optional: Auf Updates prüfen
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // Neuer Content ist verfügbar, Nutzer benachrichtigen!
                showUpdateNotification();
              }
            }
          };
        };
      })
      .catch(error => {
        console.error('Service Worker Registrierung fehlgeschlagen:', error);
      });
  });
}

function showUpdateNotification() {
  const updateBanner = document.getElementById('update-banner'); // Deine Banner-ID im HTML
  if (updateBanner) {
    updateBanner.style.display = 'block'; // Banner anzeigen
  } else {
    // Falls kein Banner da ist, kannst du z.B. deine forceManualUpdate direkt aufrufen
    // oder eine andere UI-Komponente triggern.
    console.log('neues Update verfügbar.');
  }
}

function toggleAndSaveSetting(key, value) {
    // 1. Wert direkt im State speichern
    S[key] = value;

    // 2. Sofort in den Speicher schreiben (z.B. localStorage)
    if (typeof save === 'function') {
        save();
    }

    // 3. Falls gerade die Monatsansicht offen ist oder das PDF betroffen ist, optional neu rendern
    if (typeof renderMonth === 'function') {
        renderMonth();
    }
}