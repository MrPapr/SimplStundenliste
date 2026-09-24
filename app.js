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

                <div class="status">● Offline-App · V1.2</div>

                <nav>
                    <button data-v="day" class="active">Tag</button>
                    <button data-v="week">Woche</button>
                    <button data-v="month">Monat</button>
                    <button data-v="settings">Einstellungen</button>
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
                                <button type="button" class="type-btn" data-type="za" onclick="setType('za')">ZA</button>
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
                                        <th>Beginn</th>
                                        <th>Ende</th>
                                        <th>Stunden</th>
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
                            <label for="weekDate">Woche mit Datum</label>
                            <input id="weekDate" type="date">
                            <h2 id="weekTotal"></h2>
                            <div class="table">
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Tag</th>
                                        <th>Beginn</th>
                                        <th>Ende</th>
                                        <th>Stunden</th>
                                        <th>Bearbeiten</th>
                                    </tr>
                                    </thead>
                                    <tbody id="weekRows"></tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    <section id="month" class="view" hidden>
                        <div class="card">
                            <div class="between">
                                <div>
                                    <label for="monthPick">Monat</label>
                                    <input id="monthPick" type="month">
                                </div>
                                <div class="actions">
                                    <button id="pdf" class="primary">PDF erstellen</button>
                                    <button id="share">PDF teilen</button>
                                </div>
                            </div>

                            <div style="margin-top: 15px;">
                                <label for="monthWeeklyHours">Wochenstunden für diesen Monat</label>
                                <input id="monthWeeklyHours" type="number" step="0.5" min="0" value="20">
                            </div>

                            <h2 id="monthTotal"></h2>

                            <div class="table">
                                <table>
                                    <thead>
                                    <tr>
                                        <th>Tag</th>
                                        <th>Beginn</th>
                                        <th>Ende</th>
                                        <th>Stunden</th>
                                        <th>Bearbeiten</th>
                                    </tr>
                                    </thead>
                                    <tbody id="monthRows"></tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    <section id="settings" class="view" hidden>
                        <div class="card">
                            <h2>Persönliche Einstellungen</h2>
                            <label for="name">Name für PDF</label>
                            <input id="name">

                            <label for="defaultWeeklyHours">Standard-Wochenstunden</label>
                            <input id="defaultWeeklyHours" type="number" step="0.5" min="0" value="20">

                            <label for="initialBalance">Start-Saldo / Korrektur (in Stunden)</label>
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

    // App-Start initialisieren
    initApp();
});

// 2. Deine eigentliche App-Logik
if (typeof window !== 'undefined' && window.AndroidDownload) {
    document.addEventListener('DOMContentLoaded', () => {
        document.body.classList.add('is-android-app');
    });
}

const KEY='simplicissimus-offline-v57';
let S={
    name:'',
    entries:{},
    quickShifts: [
        { name: 'Normal', start: '18:00', end: '23:00' },
        { name: 'Doppel', start: '14:00', end: '23:00' },
        { name: 'Nachmittag', start: '14:00', end: '19:00' }
    ],
    defaultWeeklyHours: 20,
    initialBalance: 0,
    monthlyWeeklyHours: {}
};

let currentType = 'work'; // 'work', 'vacation', 'sick', 'za'

const $=s=>document.querySelector(s),pad=n=>String(n).padStart(2,'0'),iso=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;

function load(){
    try{
        let data = JSON.parse(localStorage.getItem(KEY)||'{}');
        S={...S,...data};
        if(!S.monthlyWeeklyHours) S.monthlyWeeklyHours = {};
        if(!S.defaultWeeklyHours) S.defaultWeeklyHours = 20;
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
function save(){localStorage.setItem(KEY,JSON.stringify(S))}

function hours(a,b){
    if(!a||!b)return 0;
    let [ah,am]=a.split(':').map(Number),[bh,bm]=b.split(':').map(Number),m=(bh*60+bm)-(ah*60+am);
    if(m<0)m+=1440;
    return m/60;
}

function ht(n){
    let prefix = n > 0 ? '+' : '';
    return prefix + n.toLocaleString('de-AT',{minimumFractionDigits:2,maximumFractionDigits:2})+' h';
}

function parse(s){return new Date(s+'T12:00:00')}

function hasHours(e){
    if(!e) return false;
    if(e.type === 'vacation' || e.type === 'sick' || e.type === 'za') return true;
    return e.start && e.end && hours(e.start, e.end) > 0;
}

function fillTimeSelects(){
    let hs='<option value="">--</option>'+Array.from({length:24},(_,i)=>`<option value="${pad(i)}">${pad(i)}</option>`).join(''),
        ms='<option value="">--</option>'+['00','15','30','45'].map(x=>`<option value="${x}">${x}</option>`).join('');
    ['startHour','endHour'].forEach(id=>{ if($('#'+id)) $('#'+id).innerHTML=hs; });
    ['startMinute','endMinute'].forEach(id=>{ if($('#'+id)) $('#'+id).innerHTML=ms; });
}

function setTime(prefix,t){
    let [h='',m='']=String(t||'').split(':');
    if($('#'+prefix+'Hour')) $('#'+prefix+'Hour').value=h;
    if($('#'+prefix+'Minute')) $('#'+prefix+'Minute').value=m;
}

function getTime(prefix){
    let h=$('#'+prefix+'Hour')?.value,m=$('#'+prefix+'Minute')?.value;
    return h&&m?`${h}:${m}`:'';
}

function wd(s){return ['So','Mo','Di','Mi','Do','Fr','Sa'][parse(s).getDay()]}

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
    let d=parse(s),h=holidays(d.getFullYear());
    return h[s]||d.getDay()===0?'holiday':'';
}

function isDoublePayDay(ds) {
    return special(ds) === 'holiday';
}

function getWeightedHours(ds, entry) {
    if(!hasHours(entry)) return 0;

    let m = ds.slice(0, 7);
    let weekly = S.monthlyWeeklyHours[m] !== undefined ? S.monthlyWeeklyHours[m] : (S.defaultWeeklyHours || 20);
    let dailyTarget = weekly / 5;

    if (entry.type === 'vacation' || entry.type === 'sick') {
        return dailyTarget;
    }
    if (entry.type === 'za') {
        return 0;
    }

    let base = hours(entry.start, entry.end);
    return isDoublePayDay(ds) ? base * 2 : base;
}

function getTargetHoursForMonth(monthKey) {
    let weekly = S.monthlyWeeklyHours[monthKey] !== undefined ? S.monthlyWeeklyHours[monthKey] : (S.defaultWeeklyHours || 20);
    return weekly * 4.33;
}

function getMonthStats(monthKey) {
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

function getCumulativeBalance(currentMonthKey) {
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

function entryRow(ds, e, editable=false){
    let hoursDisplay = '–';
    let d = parse(ds);
    // Datum ohne Jahr formatieren (z.B. "Mo 05.06.")
    let dateFormatted = `${wd(ds)} ${pad(d.getDate())}.${pad(d.getMonth()+1)}.`;

    if(hasHours(e)){
        if(e.type === 'vacation') {
            hoursDisplay = `<span class="badge badge-urlaub">Urlaub</span> (${ht(getWeightedHours(ds, e))})`;
        } else if(e.type === 'sick') {
            hoursDisplay = `<span class="badge badge-krank">Krank</span> (${ht(getWeightedHours(ds, e))})`;
        } else if(e.type === 'za') {
            hoursDisplay = `<span class="badge badge-za">Zeitausgleich</span> (0.00 h)`;
        } else {
            let base = hours(e.start, e.end);
            let weighted = getWeightedHours(ds, e);
            if(isDoublePayDay(ds)){
                hoursDisplay = `${ht(base)} <small style="color:var(--primary); font-weight:bold;">(2x = ${ht(weighted)})</small>`;
            } else {
                hoursDisplay = ht(base);
            }
        }
    }

    return `<tr class="${special(ds)}"><td>${dateFormatted}</td><td>${e?.start||'–'}</td><td>${e?.end||'–'}</td><td>${hoursDisplay}</td>${editable?`<td><button class="edit-btn" data-edit="${ds}">Bearbeiten</button></td>`:''}</tr>`;
}

    return `<tr class="${special(ds)}"><td>${wd(ds)} ${parse(ds).toLocaleDateString('de-AT')}</td><td>${e?.start||'–'}</td><td>${e?.end||'–'}</td><td>${hoursDisplay}</td>${editable?`<td><button class="edit-btn" data-edit="${ds}">Bearbeiten</button></td>`:''}</tr>`;
}

function renderQuickShifts() {
    let container = $('#quickShiftsContainer');
    if(!container) return;
    container.innerHTML = S.quickShifts.map(s =>
        `<button type="button" class="shift-btn" onclick="applyShift('${s.start}', '${s.end}')">${s.name} (${s.start}-${s.end})</button>`
    ).join('');
}

function renderQuickShiftsSettings() {
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

function applyShift(start, end) {
    setTime('start', start);
    setTime('end', end);
    setType('work');
}

function setType(type) {
    currentType = type;
    document.querySelectorAll('.type-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.type === type);
    });
    let timeFields = $('#timeInputFields');
    if(timeFields) {
        timeFields.style.display = (type === 'work') ? 'block' : 'none';
    }
}

function render(){
    let ds=$('#date').value, e=S.entries[ds];
    setType(e?.type || 'work');
    setTime('start', e?.start||'');
    setTime('end', e?.end||'');

    renderQuickShifts();
    renderQuickShiftsSettings();

    let recent=Object.keys(S.entries).filter(d=>hasHours(S.entries[d])).sort().reverse().slice(0,10);
    $('#recent').innerHTML=recent.map(d=>entryRow(d,S.entries[d],true)).join('')||'<tr><td colspan="5">Noch keine Einträge.</td></tr>';

    document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>editEntry(b.dataset.edit));
    renderWeek();
    renderMonth();
}

function editEntry(ds){
    $('#date').value=ds;
    let e=S.entries[ds];
    setType(e?.type || 'work');
    setTime('start',e?.start||'');
    setTime('end',e?.end||'');
    document.querySelectorAll('nav button').forEach(x=>x.classList.toggle('active',x.dataset.v==='day'));
    document.querySelectorAll('.view').forEach(v=>v.hidden=v.id!=='day');
    let c=$('#day .card');
    c.classList.add('editing');
    c.scrollIntoView({behavior:'smooth',block:'start'});
    setTimeout(()=>c.classList.remove('editing'),1400);
}

function renderWeek(){
    let d=parse($('#weekDate').value),day=d.getDay()||7;
    d.setDate(d.getDate()-day+1);
    let rows=[],tot=0;
    for(let i=0;i<7;i++){
        let x=new Date(d);
        x.setDate(d.getDate()+i);
        let ds=iso(x),e=S.entries[ds];
        if(hasHours(e)){
            tot+=getWeightedHours(ds, e);
            rows.push(entryRow(ds,e,true)); // <--- Hier auf true gesetzt
        }
    }
    $('#weekRows').innerHTML=rows.join('')||'<tr><td colspan="5">Keine Arbeitsstunden in dieser Woche.</td></tr>'; // colspan auf 5 erhöht für den Button
    $('#weekTotal').textContent='Angerechnete Stunden: '+ht(tot);

    // Klick-Event für die Bearbeiten-Buttons in der Woche binden
    document.querySelectorAll('#weekRows [data-edit]').forEach(b=>b.onclick=()=>editEntry(b.dataset.edit));
}

function renderMonth(){
    let m = $('#monthPick').value;
    if(!m) return;

    let [y, mo] = m.split('-').map(Number);
    let days = new Date(y, mo, 0).getDate();
    let rows = [];

    for(let i = 1; i <= days; i++){
        let ds = `${y}-${pad(mo)}-${pad(i)}`;
        let e = S.entries[ds];
        if(hasHours(e)){
            rows.push(entryRow(ds, e, true)); // Mit Bearbeiten-Button
        }
    }

    $('#monthRows').innerHTML = rows.rows || rows.join('') || '<tr><td colspan="5">Keine Arbeitsstunden in diesem Monat.</td></tr>';
    // Korrektur für die Tabellenzeilen-Ausgabe:
    $('#monthRows').innerHTML = rows.join('') || '<tr><td colspan="5">Keine Arbeitsstunden in diesem Monat.</td></tr>';

    // Klick-Event für die Bearbeiten-Buttons im Monat binden
    document.querySelectorAll('#monthRows [data-edit]').forEach(b=>b.onclick=()=>editEntry(b.dataset.edit));

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
    return String(s).replace(/[\\()]/g,'\\$&').replace(/[ä]/g,'ae').replace(/[ö]/g,'oe').replace(/[ü]/g,'ue').replace(/[Ä]/g,'Ae').replace(/[Ö]/g,'Oe').replace(/[Ü]/g,'Ue').replace(/ß/g,'ss');
}

function pdfBlob(){
    let m = $('#monthPick').value,
        [y, mo] = m.split('-').map(Number),
        days = new Date(y, mo, 0).getDate(),
        lines = [],
        specialLines = [];

    let totalIstHours = 0;
    let totalSpecialHours = 0;
    let hmap = holidays(y);

    for(let i = 1; i <= days; i++){
        let ds = `${y}-${pad(mo)}-${pad(i)}`,
            e = S.entries[ds],
            d = parse(ds),
            isSun = d.getDay() === 0,
            h = hmap[ds];

        if(hasHours(e)){
            if (e.type === 'vacation') {
                lines.push(`${wd(ds)}  ${pad(i)}.${pad(mo)}.${y}   Urlaub   ${ht(getWeightedHours(ds, e))}`);
                totalIstHours += getWeightedHours(ds, e);
            } else if (e.type === 'sick') {
                lines.push(`${wd(ds)}  ${pad(i)}.${pad(mo)}.${y}   Krank    ${ht(getWeightedHours(ds, e))}`);
                totalIstHours += getWeightedHours(ds, e);
            } else if (e.type === 'za') {
                lines.push(`${wd(ds)}  ${pad(i)}.${pad(mo)}.${y}   Zeitausgleich   0.00 h`);
            } else {
                let base = hours(e.start, e.end);
                totalIstHours += base;
                lines.push(`${wd(ds)}  ${pad(i)}.${pad(mo)}.${y}   ${e.start} - ${e.end}   ${ht(base)}`);

                if(isSun || h){
                    let label = [];
                    if(isSun) label.push('Sonntag');
                    if(h) label.push(h);

                    totalSpecialHours += base;
                    specialLines.push(`${wd(ds)} ${pad(i)}.${pad(mo)}.${y}   ${e.start} - ${e.end} (${label.join(' / ')}): ${ht(base)}`);
                }
            }
        }
    }

    if(lines.length === 0){
        lines.push('Keine Arbeitsstunden in diesem Monat eingetragen.');
    }

    let streams = [], per = 30;
    for(let p = 0; p < Math.ceil(lines.length / per); p++){
        let a = lines.slice(p * per, (p + 1) * per),
            s = `BT /F1 15 Tf 45 800 Td (${esc('Arbeitszeiten Simplicissimus')}) Tj /F1 11 Tf 0 -24 Td (${esc('Mitarbeiter: ' + S.name)}) Tj 0 -18 Td (${esc('Monat: ' + m)}) Tj`;

        a.forEach(l => s += ` 0 -19 Td (${esc(l)}) Tj`);

        if(p === Math.ceil(lines.length / per) - 1){
            s += ` 0 -25 Td (${esc('Gesamt Ist-Stunden: ' + ht(totalIstHours))}) Tj`;
        }
        s += ' ET';
        streams.push(s);
    }

    let sp = `BT /F1 15 Tf 45 800 Td (${esc('Sonn- und Feiertagsdienste')}) Tj /F1 11 Tf 0 -24 Td (${esc('Mitarbeiter: ' + S.name)}) Tj 0 -18 Td (${esc('Monat: ' + m)}) Tj 0 -24 Td (${esc('Geleistete Dienste an Sonn- und Feiertagen:')}) Tj`;

    if(specialLines.length){
        specialLines.forEach(l => sp += ` 0 -20 Td (${esc(l)}) Tj`);
        sp += ` 0 -25 Td (${esc('Gesamt Sonn-/Feiertagsstunden: ' + ht(totalSpecialHours))}) Tj`;
    } else {
        sp += ` 0 -20 Td (${esc('Keine Dienste an Sonn- oder Feiertagen in diesem Monat.')}) Tj`;
    }
    sp += ' ET';
    streams.push(sp);

    let objs = ['<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'],
        pages = [],
        contents = [];

    streams.forEach(s => {
        contents.push(objs.push(`<< /Length ${s.length} >>\nstream\n${s}\nendstream`));
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

function filename(){
    return `Arbeitszeiten-${S.name.replace(/[^a-zA-Z0-9äöüÄÖÜß_-]+/g,'_')}-${$('#monthPick').value}.pdf`;
}

function initApp() {
    load();
    fillTimeSelects();
    let today=iso(new Date());
    $('#date').value=today;
    $('#weekDate').value=today;
    $('#monthPick').value=today.slice(0,7);

    if(S.name) openApp();

    $('#setupBtn').onclick=()=>{
        let n=$('#setupName').value.trim();
        if(n.length<2)return alert('Bitte deinen Namen eingeben.');
        S.name=n;
        save();
        openApp();
    };

    document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{
        document.querySelectorAll('nav button').forEach(x=>x.classList.remove('active'));
        b.classList.add('active');
        document.querySelectorAll('.view').forEach(v=>v.hidden=true);
        $('#'+b.dataset.v).hidden=false;
        render();
    });

    $('#date').onchange=render;
    $('#weekDate').onchange=renderWeek;
    $('#monthPick').onchange=renderMonth;

    if($('#monthWeeklyHours')) {
        $('#monthWeeklyHours').onchange = (e) => {
            let val = parseFloat(e.target.value) || 0;
            let m = $('#monthPick').value;
            S.monthlyWeeklyHours[m] = val;
            save();
            renderMonth();
        };
    }

    $('#save').onclick=()=>{
        let dateVal = $('#date').value;
        if (currentType === 'work') {
            let a=getTime('start'), b=getTime('end');
            if(!a||!b) return alert('Bitte Beginn und Ende vollständig auswählen.');
            S.entries[dateVal] = { start: a, end: b, type: 'work' };
        } else {
            S.entries[dateVal] = { type: currentType };
        }
        save();
        render();
    };

    $('#del').onclick=()=>{
        delete S.entries[$('#date').value];
        save();
        render();
    };

    $('#settingsSave').onclick=()=>{
        let n=$('#name').value.trim();
        if(n.length<2)return alert('Bitte einen Namen eingeben.');
        S.name=n;
        if($('#defaultWeeklyHours')) {
            S.defaultWeeklyHours = parseFloat($('#defaultWeeklyHours').value) || 20;
        }
        if($('#initialBalance')) {
            S.initialBalance = parseFloat($('#initialBalance').value) || 0;
        }

        S.quickShifts = S.quickShifts.map((_, idx) => {
            return {
                name: $(`#shiftName_${idx}`)?.value || `Schicht ${idx+1}`,
                start: $(`#shiftStart_${idx}`)?.value || '00:00',
                end: $(`#shiftEnd_${idx}`)?.value || '00:00'
            };
        });

        save();
        $('#who').textContent=S.name;
        render();
        alert('Einstellungen gespeichert.');
    };

    $('#pdf').onclick = async () => {
        let blob = pdfBlob();
        let name = filename();

        if (typeof AndroidDownload !== 'undefined') {
            let reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                let base64Data = reader.result;
                AndroidDownload.saveBlob(base64Data, name);
            };
        } else {
            let a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = name;
            a.click();
            setTimeout(() => URL.revokeObjectURL(a.href), 1000);
        }
    };

    $('#share').onclick = async () => {
        let b = pdfBlob(), f = new File([b], filename(), { type: 'application/pdf' });
        if (navigator.canShare?.({ files: [f] })) {
            await navigator.share({ files: [f], title: 'Arbeitszeiten ' + S.name });
        } else {
            $('#pdf').click();
        }
    };

    $('#backup').onclick = () => {
        const exportPayload = {
            format: 'Simplicissimus-Offline',
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
            URL.revokeObjectURL(a.href);
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
    if(!S.name)return;
    $('#setup').hidden=true;
    $('#app').hidden=false;
    $('#who').textContent=S.name;
    if($('#name')) $('#name').value=S.name;
    if($('#defaultWeeklyHours')) $('#defaultWeeklyHours').value = S.defaultWeeklyHours || 20;
    if($('#initialBalance')) $('#initialBalance').value = S.initialBalance || 0;
    render();
}