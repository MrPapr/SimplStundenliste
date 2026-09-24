# Arbeitszeiten Simplicissimus – Offline-Version 5.6

Diese Version benötigt keine Datenbank und kein PHP.

- Die Synology stellt nur die statischen App-Dateien im lokalen Netzwerk bereit.
- Jeder Mitarbeiter öffnet die App einmal im lokalen Netzwerk und richtet auf seinem Gerät seinen Namen ein.
- Danach funktioniert die installierte PWA offline.
- Arbeitszeiten und Name bleiben ausschließlich lokal auf dem jeweiligen Gerät.
- Der Mitarbeitername wird in PDF und PDF-Dateiname übernommen.
- Unter Einstellungen gibt es Export/Import einer lokalen Datensicherung.

## Synology
Den Inhalt dieses Ordners nach `web/simplicissimus` kopieren. Der vorhandene `api`-Ordner wird für diese Version nicht benötigt.

## Wichtig
Beim Löschen der Website-/App-Daten gehen lokale Arbeitszeiten verloren. Deshalb regelmäßig die Datensicherung exportieren.


Version 5.6: Einrichtungswechsel korrigiert; PDF enthaelt am Schluss eine eigene Sonn- und Feiertagsseite.
