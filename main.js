'use strict';
/* Kith — plugin Obsidian (nessuna build necessaria) */
const obsidian = require('obsidian');
const {
  Plugin, ItemView, Modal, Notice, PluginSettingTab, Setting, TFile,
  FuzzySuggestModal, setIcon, normalizePath, stringifyYaml, MarkdownRenderChild, Menu, requestUrl,
} = obsidian;

/* ───────────────────────── i18n (IT / EN) ───────────────────────── */
/* Le stringhe nel codice sono in italiano e fanno da chiave; EN contiene le traduzioni inglesi.
   La lingua segue Obsidian (localStorage "language"), con override opzionale "crm-contatti-lang". */
const EN = {"✓ In calendario": "✓ In calendar", "Calendario": "Calendar", "Calendario: compleanni e follow-up": "Calendar: birthdays and follow-ups", "✓ Compleanno in Google Calendar (riapri)": "✓ Birthday in Google Calendar (reopen)", "Aggiungi compleanno a Google Calendar": "Add birthday to Google Calendar", "Scarica .ics di questo contatto": "Download .ics for this contact", "Scarica .ics della selezione": "Download .ics for the selection", "Scarica .ics di compleanni e follow-up": "Download .ics of birthdays and follow-ups", "Impostazioni calendario…": "Calendar settings…", "Nessuna immagine negli appunti": "No image in the clipboard", "Incolla immagine dagli appunti": "Paste image from clipboard", "Immagine non scaricabile da questo link": "Couldn't download an image from this link", "Recupera da Instagram": "Fetch from Instagram", "Nessun profilo Instagram nella scheda": "No Instagram profile on this contact", "Foto recuperata da Instagram": "Photo fetched from Instagram", "Impossibile recuperare la foto da Instagram (profilo privato o accesso bloccato). Carica la foto a mano.": "Couldn't fetch the photo from Instagram (private profile or access blocked). Upload it manually.", "Salva": "Save", "Link o percorso dell’immagine": "Image link or path", "Rimuovi logo": "Remove logo", "Incolla link immagine…": "Paste image link…", "Carica immagine…": "Upload image…", "Cambia logo": "Change logo", "Nascondi campo in questa pagina": "Hide field on this page", "Rimuovi sezione da questa pagina": "Remove section from this page", "Ripristina predefinito di tutte le aziende": "Reset default for all companies", "Ripristina questa pagina": "Reset this page", "Disposizione salvata come predefinita": "Layout saved as default", "Usa questa disposizione per tutte le aziende": "Use this layout for all companies", "Personalizza questa pagina": "Customize this page", "Personalizza pagina": "Customize page", "Aprendo la pagina di un’azienda, Kith cerca sito, settore, contatti e logo su Wikidata e sul sito ufficiale. Invia in rete solo il nome dell’azienda. Spegni per usare solo i dati inseriti a mano.": "When you open a company page, Kith looks up website, industry, contacts and logo on Wikidata and the official site. Only the company name is sent. Turn off to use manual data only.", "Arricchisci le aziende in automatico": "Enrich companies automatically", "Fonte: ${}": "Source: ${}", "Recupero non riuscito": "Fetch failed", "Nessuna nuova informazione trovata": "No new information found", "Aggiunti ${} campi (${})": "Added ${} fields (${})", "Recupero informazioni…": "Fetching information…", "Recupero…": "Fetching…", "Aggiorna info": "Refresh info", "Descrizione": "Description", "Collegate via relazione": "Linked via relationship", "Apri ${}": "Open ${}", "Aggiungi relazione": "Add relationship", "Mostra tutte le persone a ${}": "Show everyone in ${}", "Kith: indietro": "Kith: go back", "Scegli un’azienda…": "Choose a company…", "Apri pagina azienda…": "Open company page…", "Nessuna nota. Creala dal pulsante a sinistra.": "No note yet. Create it with the button on the left.", "Nota azienda": "Company note", "Cronologia azienda": "Company timeline", "Ex colleghi": "Former colleagues", "Persone": "People", "dai contatti": "from contacts", "Indirizzo": "Address", "Sito web": "Website", "Riepilogo": "Summary", "Informazioni": "Information", "Crea nota azienda": "Create company note", "Mostra in Kith": "Show in Kith", "+ Persona": "+ Person", "persone": "people", "persona": "person", "Email copiate": "Emails copied", "Copia ${} email": "Copy ${} emails", "Interazione": "Interaction", "${} contatti selezionati": "${} contacts selected", "1 contatto selezionato: ${}": "1 contact selected: ${}", "Ordine crescente": "Ascending", "Ordine decrescente": "Descending", "Filtra per questa colonna": "Filter by this column", "Rimuovi filtro colonna": "Remove column filter", "Blocca colonna": "Pin column", "Sblocca colonna": "Unpin column", "contiene…": "contains…", "Filtra: ${}": "Filter: ${}", "Opzioni colonna": "Column options", "Cerca un campo…": "Search a field…", "Nessun campo": "No fields", "Altri contatti in questa azienda": "Other contacts at this company", "Passata": "Past", "ex": "former", "Aziende": "Companies", "Mostra tutte le persone in Kith": "Show everyone in Kith", "Apri nota azienda": "Open company note", "Nessun altro contatto": "No other contacts", "Salva colore": "Save color", "Comprimi intestazione": "Collapse header", "Espandi intestazione": "Expand header", "Eliminare ${} contatti?": "Delete ${} contacts?", "Le note verranno spostate nel cestino secondo le impostazioni di Obsidian. Le interazioni collegate restano nel vault.": "Notes will be moved to the trash according to Obsidian settings. Linked interactions stay in the vault.", "${} contatti eliminati": "${} contacts deleted", "Cambia foto": "Change photo", "Carica foto…": "Upload photo…", "Rimuovi foto": "Remove photo", "Te l’ha presentato/a": "Introduced you", "Presentato/a da te": "Introduced by you", "tra ${} gg": "in ${} d", "${} giorni fa": "${} days ago", "oggi": "today", "ieri": "yesterday", "domani": "tomorrow", "mese": "month", "mesi": "months", "anno": "year", "anni": "years", "${} ${} fa": "${} ${} ago", "Anagrafica": "Personal", "Contatti": "Contact", "Lavoro": "Work", "Relazione": "Relationship", "Rete": "Network", "Note": "Notes", "Nome": "First name", "Cognome": "Last name", "Soprannome": "Nickname", "Compleanno": "Birthday", "Città": "City", "Paese": "Country", "Partner": "Partner", "Figli": "Children", "Lingue": "Languages", "Email": "Email", "Email lavoro": "Work email", "Telefono": "Phone", "Ruolo attuale": "Current role", "Azienda attuale": "Current company", "Aziende passate": "Past companies", "Settore": "Industry", "Competenze": "Skills", "Vicinanza": "Closeness", "Stato": "Status", "Priorità": "Priority", "Frequenza contatto": "Contact frequency", "Canale preferito": "Preferred channel", "Ultimo contatto": "Last contact", "Prossimo follow-up": "Next follow-up", "Quando contattare": "When to reach out", "Conosciuti dove": "Met where", "Conosciuti quando": "Met when", "Conosciuti tramite": "Met through", "Interessi": "Interests", "Può aiutarmi con": "Can help me with", "Posso aiutarlo con": "I can help with", "Favori ricevuti": "Favors received", "Favori dati": "Favors given", "Nome A→Z": "Name A→Z", "Contatto più vecchio": "Oldest contact", "Follow-up più urgente": "Most urgent follow-up", "Prossimo compleanno": "Next birthday", "Apri Kith": "Open Kith", "Nuovo contatto": "New contact", "Registra interazione": "Log interaction", "Segna contatto come contattato oggi": "Mark contact as contacted today", "${}: ultimo contatto = oggi": "${}: last contact = today", "Elimina contatto…": "Delete contact…", "Personalizza CRM (colori, font, campi, Google Calendar)": "Customize CRM (colors, fonts, fields, Google Calendar)", "Aggiungi il compleanno del contatto a Google Calendar": "Add the contact's birthday to Google Calendar", "Importa contatti (LinkedIn, telefono, Facebook, CSV)": "Import contacts (LinkedIn, phone, Facebook, CSV)", "Esporta compleanni e follow-up per il calendario (.ics)": "Export birthdays and follow-ups for your calendar (.ics)", "Inserisci widget CRM “Oggi” nella nota": "Insert CRM “Today” widget in note", "Copiato": "Copied", "Copia non riuscita": "Copy failed", "“${}” eliminato": "“${}” deleted", "“${}” archiviato": "“${}” archived", "“${}” ripristinato": "“${}” restored", "Questo contatto non ha un compleanno valido (serve almeno giorno e mese)": "This contact has no valid birthday (day and month are required)", "Senza nome": "Unnamed", "---\n${}---\n\n## Note\n\n## Interazioni\n": "---\n${}---\n\n## Notes\n\n## Interactions\n", "\n## Note\n\n## Interazioni\n": "\n## Notes\n\n## Interactions\n", "Nessun compleanno o follow-up da esportare": "No birthdays or follow-ups to export", "${}/Compleanni e follow-up.ics": "${}/Birthdays and follow-ups.ics", "Creato “${}”: ${} compleanni, ${} follow-up. Aprilo per importarlo nel calendario.": "Created “${}”: ${} birthdays, ${} follow-ups. Open it to import into your calendar.", "Kith": "Kith", "Cerca per nome, azienda, città, interessi…": "Search by name, company, city, interests…", "Importa": "Import", "Personalizza": "Customize", "Calendario .ics": "Calendar .ics", "+ Nuovo contatto": "+ New contact", "Contatti attivi": "Active contacts", "Follow-up scaduti": "Overdue follow-ups", "Compleanni (${} gg)": "Birthdays (${} d)", "Priorità alta": "High priority", "Tutte le relazioni": "All relationships", "Ogni vicinanza": "Any closeness", "Ogni priorità": "Any priority", "Solo attivi": "Active only", "Tutti (incl. archiviati)": "All (incl. archived)", "Filtro rapido: ${} ✕": "Quick filter: ${} ✕", "Ordina": "Sort", "Raggruppa": "Group by", "Colonne: relazione": "Columns: relationship", "Colonne: vicinanza": "Columns: closeness", "Colonne: stato": "Columns: status", "Colonne: priorità": "Columns: priority", "Tabella": "Table", "Schede": "Cards", "Kanban": "Kanban", "Nessun contatto trovato": "No contacts found", "Cerco note con frontmatter in “${}”. Se il tuo vault usa un'altra cartella, cambiala nelle impostazioni del plugin, oppure crea il primo contatto.": "Looking for notes with frontmatter in “${}”. If your vault uses a different folder, change it in the plugin settings, or create your first contact.", "contatto": "contact", "contatti": "contacts", "Nessun risultato con questi filtri.": "No results with these filters.", "Aziende": "Companies", "Isolati (${})": "Isolated (${})", "Adatta": "Fit", "Nessuna connessione da mostrare. Le relazioni nascono da: stessa azienda (almeno 2 persone), “Conosciuti tramite” con il nome di un altro contatto, “Partner”, oppure [[link]] tra schede.": "No connections to show. Relationships come from: the same company (at least 2 people), “Met through” naming another contact, “Partner”, or [[links]] between notes.", "Mostrati i 700 contatti più connessi": "Showing the 700 most connected contacts", "Oggi": "Today", "Contatto": "Contact", "Chiama": "Call", "Scaduto da ${} gg": "Overdue by ${} d", "Tra ${} gg": "In ${} d", "Ultimo contatto: ": "Last contact: ", "Follow-up: ": "Follow-up: ", "Follow-up": "Follow-up", "oggi!": "today!", "Non assegnato": "Unassigned", "Spostato in “${}”": "Moved to “${}”", "← Elenco": "← List", "✓ Contattato oggi": "✓ Contacted today", "+ Interazione": "+ Interaction", "Modifica": "Edit", "Apri nota": "Open note", "Elimina": "Delete", "Ripristina": "Restore", "Archivia": "Archive", "Prossimo contatto": "Next contact", "Frequenza": "Frequency", "Personale": "Personal", "Ruolo": "Role", "Azienda": "Company", "✓ In Google Calendar": "✓ In Google Calendar", "+ Google Calendar": "+ Google Calendar", " · ${} anni": " · ${} years old", "tra ": "in ", " gg": " d", "Altri campi": "Other fields", "Interazioni recenti": "Recent interactions", "Nessuna interazione registrata.": "No interactions logged.", "Apri scheda": "Open record", "Contattato oggi": "Contacted today", "Copia scheda completa": "Copy full record", "Scheda copiata": "Record copied", "Copia nome": "Copy name", "Nome copiato": "Name copied", "email lavoro": "work email", "Copia ${}": "Copy ${}", "${} copiata": "${} copied", "Copia selezione": "Copy selection", "${} copiato": "${} copied", "Copia “${}: …”": "Copy “${}: …”", "Seleziona un contatto per vedere la scheda completa.": "Select a contact to see the full record.", "Tutto in ordine ✨": "All clear ✨", "Prossimi 7 giorni": "Next 7 days", "Compleanni in arrivo": "Upcoming birthdays", "Agenda": "Agenda", "🎂 oggi": "🎂 today", "Modifica ${}": "Edit ${}", "valori separati da |": "values separated by |", "Annulla": "Cancel", "Salva modifiche": "Save changes", "Crea contatto": "Create contact", "Inserisci almeno nome o cognome": "Enter at least a first or last name", "Contatto aggiornato": "Contact updated", "Contatto creato": "Contact created", "Errore nel salvataggio: ": "Error while saving: ", "Nuova interazione con ${}": "New interaction with ${}", "Tipo": "Type", "Data": "Date", "Messaggio": "Message", "Chiamata": "Call", "Incontro": "Meeting", "Evento": "Event", "Altro": "Other", "Prossimo follow-up (opzionale)": "Next follow-up (optional)", "Cosa vi siete detti": "What you talked about", "Registra": "Log", "Interazione registrata": "Interaction logged", "Errore: ": "Error: ", "Scegli un contatto…": "Choose a contact…", "stessa email": "same email", "stesso telefono": "same phone", "stesso LinkedIn": "same LinkedIn", "stesso nome": "same name", "lettura non riuscita": "could not be read", "Nato/a il ${}": "Born on ${}", "🎂 Compleanno di ${}": "🎂 ${}’s birthday", "Relazione: ${}": "Relationship: ${}", "Canale: ${}": "Channel: ${}", "📞 Ricontatta ${}${}": "📞 Get back in touch with ${}${}", " (scaduto)": " (overdue)", "CRM · Oggi": "CRM · Today", "Apri CRM": "Open CRM", "Nulla in programma ✨": "Nothing scheduled ✨", "… e altri ${}": "… and ${} more", "scaduto da ${} gg": "overdue by ${} d", "${}: contattato": "${}: contacted", "📞 Da ricontattare": "📞 To follow up", "🗓 Prossimi ${} giorni": "🗓 Next ${} days", "🎂 Compleanni": "🎂 Birthdays", "Importa contatti": "Import contacts", "Carica uno o più file esportati da LinkedIn, dalla rubrica del telefono o da Facebook. Nel passo successivo scegli esattamente chi importare: niente viene creato prima della tua conferma.": "Upload one or more files exported from LinkedIn, your phone contacts or Facebook. In the next step you choose exactly who to import: nothing is created before you confirm.", "Origine: ": "Source: ", "Rileva automaticamente": "Auto-detect", "LinkedIn (Connections.csv)": "LinkedIn (Connections.csv)", "Telefono (.vcf oppure Google Contacts CSV)": "Phone (.vcf or Google Contacts CSV)", "Facebook (friends .json / .html)": "Facebook (friends .json / .html)", "CSV generico / formato del vault": "Generic CSV / vault format", "Trascina qui i file oppure": "Drop files here or", "Scegli file…": "Choose files…", "Come esportare i dati": "How to export your data", "LinkedIn: Impostazioni → Privacy dei dati → Ottieni una copia dei tuoi dati → seleziona “Collegamenti” → scarica lo zip e usa Connections.csv.": "LinkedIn: Settings → Data privacy → Get a copy of your data → select “Connections” → download the zip and use Connections.csv.", "iPhone: iCloud.com → Contatti → seleziona tutti → Esporta vCard. Android / Google: contacts.google.com → Esporta → vCard (.vcf) oppure Google CSV.": "iPhone: iCloud.com → Contacts → select all → Export vCard. Android / Google: contacts.google.com → Export → vCard (.vcf) or Google CSV.", "Facebook: Impostazioni → Le tue informazioni → Scarica le tue informazioni → Amici e follower, formato JSON → file your_friends.json. Facebook esporta solo nome e data di amicizia: niente email, telefono o compleanni.": "Facebook: Settings → Your information → Download your information → Friends and followers, JSON format → your_friends.json. Facebook only exports name and friendship date: no email, phone or birthdays.", "CSV generico: qualsiasi CSV con intestazioni tipo Nome, Cognome, Email, Telefono, Azienda… (anche il formato del tuo contatti.csv, separatore ; o ,).": "Generic CSV: any CSV with headers such as First name, Last name, Email, Phone, Company… (separator ; or ,).", "${}: nessun contatto riconosciuto (${})": "${}: no contacts recognized (${})", "Cerca nell’elenco…": "Search the list…", "Tutti gli stati": "All statuses", "Solo nuovi": "New only", "Già presenti": "Already present", "Doppi nel file": "Duplicates in file", "Tutte le fonti": "All sources", "Seleziona visibili": "Select visible", "Deseleziona visibili": "Deselect visible", "Solo i nuovi": "Only new", "＋ Aggiungi altri file": "＋ Add more files", "Relazione per i nuovi (vuoto = come da fonte)": "Relationship for new contacts (empty = as in source)", "Contatti già presenti": "Existing contacts", "Salta (non toccare)": "Skip (leave untouched)", "Completa solo i campi vuoti": "Fill empty fields only", " Crea le note azienda mancanti": " Create missing company notes", "(senza nome)": "(no name)", "Fonte": "Source", "Nuovo": "New", "Già presente · ${}": "Already present · ${}", "Doppio nel file · ${}": "Duplicate in file · ${}", "Mostra altri ${} (${} nascosti)": "Show ${} more (${} hidden)", "Nessun contatto con questi filtri.": "No contacts match these filters.", "${} selezionati su ${} · ${} visibili": "${} selected of ${} · ${} visible", "Importa ${} nuovi${}": "Import ${} new${}", " e aggiorna ${}": " and update ${}", "Importazione in corso…": "Importing…", "Interrompi": "Stop", "Importazione interrotta": "Import stopped", "Importazione completata": "Import complete", "${} contatti creati": "${} contacts created", "${} contatti esistenti completati": "${} existing contacts completed", "${} saltati": "${} skipped", "${} errori": "${} errors", "Apri il CRM": "Open the CRM", "Chiudi": "Close", "Compleanno di ${}": "${}’s birthday", "(${} anni)": "(turns ${})", " (${} anni)": " (turns ${})", "Eliminare ${}?": "Delete ${}?", "nel cestino di sistema (recuperabile)": "to the system trash (recoverable)", "nella cartella .trash del vault (recuperabile)": "to the vault’s .trash folder (recoverable)", "in modo definitivo (NON recuperabile)": "permanently (NOT recoverable)", "nel cestino": "to the trash", "La nota “${}” verrà spostata ${}. Le interazioni collegate restano nel vault.": "The note “${}” will be moved ${}. Linked interactions stay in the vault.", "Puoi cambiare questo comportamento in Impostazioni → File e collegamenti → File eliminati.": "You can change this in Settings → Files and links → Deleted files.", "Archivia invece": "Archive instead", "Aggiungi il compleanno a Google Calendar": "Add the birthday to Google Calendar", "${}: prossimo compleanno ${}.": "${}: next birthday ${}.", "Si apre Google Calendar con un evento annuale, tutto il giorno, già compilato: devi solo premere “Salva”.": "Google Calendar opens with a pre-filled yearly all-day event: you only need to press “Save”.", "Non chiedermelo più quando creo un contatto": "Don’t ask again when I create a contact", "Non ora": "Not now", "Apri Google Calendar": "Open Google Calendar", "Cartella contatti": "Contacts folder", "Percorso (dalla radice del vault) delle note persona.": "Path (from the vault root) of the person notes.", "Cartella interazioni": "Interactions folder", "Dove salvare le interazioni registrate.": "Where to save logged interactions.", "Cartella aziende": "Companies folder", "Dove creare le note azienda mancanti.": "Where to create missing company notes.", "Collega le aziende con [[link]]": "Link companies with [[links]]", "Crea nota azienda se manca": "Create company note if missing", "Finestra compleanni (giorni)": "Birthday window (days)", "Vista predefinita": "Default view", "Calendario .ics: includi i follow-up": "Calendar .ics: include follow-ups", "L’export .ics contiene sempre i compleanni (ricorrenti ogni anno); attiva per aggiungere anche le scadenze di ricontatto.": "The .ics export always includes birthdays (repeating yearly); turn on to also add follow-up due dates.", "Conferma prima di eliminare un contatto": "Confirm before deleting a contact", "Se spento, “Elimina” sposta subito la nota nel cestino senza chiedere.": "If off, “Delete” moves the note to the trash immediately without asking.", "Widget “Oggi” nelle nuove daily note (sperimentale)": "“Today” widget in new daily notes (experimental)", "Aggiunge il blocco crm-oggi alle daily note appena create. Dipende dalle impostazioni del plugin Note giornaliere.": "Adds the crm-oggi block to newly created daily notes. Depends on the Daily notes plugin settings.", "Personalizza Kith": "Customize Kith", "Google Calendar": "Google Calendar", "Ripristina predefiniti": "Reset to defaults", "“Come il tema” usa il font di Obsidian/Minimal.": "“Like the theme” uses the Obsidian/Minimal font.", "Come il tema": "Like the theme", "Sans di sistema": "System sans", "Monospazio": "Monospace", "Famiglia font": "Font family", "Nome di un font installato, es. Inter o \"SF Pro Text\".": "Name of an installed font, e.g. Inter or \"SF Pro Text\".", "Dimensione testo": "Text size", "Scala tutta l’interfaccia del CRM (100% = dimensione del tema).": "Scales the whole CRM interface (100% = theme size).", "Densità righe": "Row density", "Altezza delle righe della tabella.": "Height of table rows.", "Compatta": "Compact", "Normale": "Normal", "Comoda": "Comfortable", "Arrotondamento angoli": "Corner radius", "Bordi tra le colonne": "Column borders", "Striscia KPI in alto": "KPI strip on top", "Di base il CRM usa i colori del tema attivo (Minimal). Qui puoi sovrascriverli solo per il CRM.": "By default the CRM uses your active theme’s colors (Minimal). Here you can override them for the CRM only.", "Usa il colore del tema": "Use theme color", "Accento": "Accent", "Pulsanti principali, selezione, filtro attivo.": "Primary buttons, selection, active filter.", "Scaduto / priorità alta": "Overdue / high priority", "Follow-up scaduti e priorità alta.": "Overdue follow-ups and high priority.", "In scadenza / priorità media": "Due soon / medium priority", "Follow-up nei prossimi giorni.": "Follow-ups in the coming days.", "Ok": "OK", "Follow-up non urgenti, vicinanza stretta.": "Non-urgent follow-ups, close relationships.", "Evidenziazione dei compleanni.": "Birthday highlighting.", "Avatar": "Avatar", "Colorati": "Colored", "Neutri": "Neutral", "Colorati (tenui, in base al nome) oppure tutti neutri.": "Colored (soft, based on the name) or all neutral.", "Etichette neutre": "Neutral tags", "Spento: ogni valore (relazione, interessi…) prende un colore automatico dal tema.": "Off: each value (relationship, interests…) gets an automatic color from the theme.", "Colore per relazione": "Color per relationship", "Neutro": "Neutral", "Rinomina i campi, nascondili dal form e dalla scheda, o aggiungine di nuovi. I dati nelle note non vengono mai cancellati.": "Rename fields, hide them from the form and the record, or add new ones. Data in your notes is never deleted.", " · personalizzato": " · custom", "Chiave nella nota: ${}": "Key in the note: ${}", "Mostra nel form e nella scheda": "Show in the form and record", "Rimuovi il campo (i dati nelle note restano)": "Remove the field (data in notes stays)", "Nuovo campo personalizzato": "New custom field", "Nome del campo": "Field name", "Es. Taglia regalo": "e.g. Gift size", "Chiave nella nota": "Key in the note", "Nome della proprietà nel frontmatter. Vuoto = ricavata dal nome.": "Property name in the frontmatter. Empty = derived from the name.", "Testo": "Text", "Testo lungo": "Long text", "Lista (valori separati da |)": "List (values separated by |)", "Scelta (suggerisce i valori già usati)": "Choice (suggests values already used)", "Sezione del form": "Form section", "Aggiungi campo": "Add field", "Inserisci un nome per il campo": "Enter a name for the field", "La chiave “${}” è già usata da “${}”": "The key “${}” is already used by “${}”", "Scegli quali colonne mostrare nella tabella e in che ordine. “Contatto” è sempre la prima.": "Choose which columns to show in the table and in what order. “Contact” is always first.", "Sposta a sinistra": "Move left", "Sposta a destra": "Move right", "Rimuovi colonna": "Remove column", "Aggiungi colonna": "Add column", "Aggiungi": "Add", "Ripristina colonne predefinite": "Reset default columns", "Il plugin apre Google Calendar con un evento annuale “tutto il giorno” già compilato; tu premi “Salva”. Non serve collegare nessun account al plugin.": "The plugin opens Google Calendar with a pre-filled yearly “all-day” event; you press “Save”. No account needs to be linked to the plugin.", "Abilita “Aggiungi a Google Calendar”": "Enable “Add to Google Calendar”", "Mostra il pulsante nella scheda del contatto e il comando dedicato.": "Shows the button on the contact record and the dedicated command.", "Proponi quando creo o modifico un contatto con compleanno": "Offer when I create or edit a contact with a birthday", "Dopo il salvataggio compare una finestra con il pulsante per aprire Google Calendar.": "After saving, a window appears with a button to open Google Calendar.", "Titolo evento": "Event title", "Segnaposto: {nome} {cognome} {eta}": "Placeholders: {first} {last} {age}", "Descrizione evento": "Event description", "Dopo l’inserimento la scheda riceve la proprietà compleanno_in_calendario, così il CRM sa che l’evento esiste. Promemoria e calendario di destinazione si scelgono su Google Calendar al momento del salvataggio.": "After insertion the record gets the property birthday_in_calendar, so the CRM knows the event exists. Reminders and the target calendar are chosen in Google Calendar when you save.", "Colori, font, campi dei contatti, colonne della tabella e Google Calendar.": "Colors, fonts, contact fields, table columns and Google Calendar.", "Apri “Personalizza”": "Open “Customize”", "Aspetto": "Appearance", "Colori": "Colors", "Campi": "Fields", "Generale": "General", "Font": "Font", "oggi! 🎂": "today! 🎂", "Caricamento…": "Loading…", "Elimina…": "Delete…", "Personalizzato…": "Custom…", "Compleanni": "Birthdays", "Personalizzazione": "Customization", "🎂 Compleanno di {nome} {cognome}": "🎂 {first} {last}’s birthday", "Compleanno di {nome} {cognome} {eta}": "{first} {last}’s birthday {age}", "gg/mm/aaaa": "dd/mm/yyyy", "mm/gg/aaaa": "mm/dd/yyyy", "aaaa-mm-gg": "yyyy-mm-dd", "Data non valida": "Invalid date", "Follow-up non valido": "Invalid follow-up", "email": "email", "telefono": "phone", "archiviato": "archived", "Lingua": "Language", "Automatica": "Automatic", "Automatica = segue la lingua di Obsidian. Dopo il cambio disattiva e riattiva il plugin (Impostazioni → Plugin della community).": "Automatic = follows Obsidian’s language. After changing it, turn the plugin off and on again (Settings → Community plugins).", "Lingua salvata: riavvia il plugin per applicarla.": "Language saved: restart the plugin to apply it.", "Formato data (visualizzazione)": "Date format (display)", "Nelle note le date vengono sempre scritte in formato ISO (AAAA-MM-GG), che non è ambiguo.": "In your notes dates are always written in ISO format (YYYY-MM-DD), which is unambiguous.", "Date con la barra (es. 03/04/2025)": "Dates with slashes (e.g. 03/04/2025)", "Come interpretare le date scritte con la barra nelle note esistenti.": "How to interpret slash-formatted dates in your existing notes.", "Automatico (dalla lingua)": "Automatic (from language)", "giorno/mese/anno": "day/month/year", "mese/giorno/anno": "month/day/year", "Analizza le note": "Analyze notes", "Nessuna data con la barra trovata: sei già a posto.": "No slash-formatted dates found: you’re all set.", "Trovate ${} date con la barra: ${} sono certamente giorno/mese. Imposto “giorno/mese/anno”.": "Found ${} slash-formatted dates: ${} are definitely day/month. Setting “day/month/year”.", "Trovate ${} date con la barra: ${} sono certamente mese/giorno. Imposto “mese/giorno/anno”.": "Found ${} slash-formatted dates: ${} are definitely month/day. Setting “month/day/year”.", "Trovate ${} date con la barra, ma i segnali sono misti o assenti (${} giorno/mese, ${} mese/giorno). Scegli a mano.": "Found ${} slash-formatted dates, but the signals are mixed or missing (${} day/month, ${} month/day). Please choose manually.", "Aggiungi al calendario": "Add to calendar", "Esporta compleanni e follow-up in un file .ics da importare nel calendario": "Export birthdays and follow-ups to an .ics file you can import into your calendar", "Importa da LinkedIn, rubrica del telefono, Facebook o CSV. Scegli esattamente chi importare prima della conferma: niente viene creato prima.": "Import from LinkedIn, your phone contacts, Facebook or CSV. You choose exactly who to import before confirming: nothing is created before that.", "Apri importatore": "Open importer", "Archiviati": "Archived", "Esplora": "Browse", "Azzera filtri": "Clear filters", "Nessun valore": "No values", "Cerca contatti…": "Search contacts…", "Mostra meno": "Show less", "vicinanza ${}": "closeness ${}", "frequenza": "frequency", "follow-up": "follow-up", "Apri scheda completa": "Open full record", "← Kith": "← Kith", "Trascina per ridimensionare": "Drag to resize", "Aggiungi campo": "Add field", "Nuovo campo personalizzato": "New custom field", "← Indietro": "← Back", "Persone in ${}": "People at ${}", "Persone collegate": "Connected people", "Nessuna": "None", "Scheda": "Record", "Cronologia": "Timeline", "Tutte le interazioni": "All interactions", "Esporta CSV": "Export CSV", "${} selezionati": "${} selected", "Deseleziona": "Clear selection", "Seleziona tutti": "Select all", "contatti esportati": "contacts exported"};
function detectLang() {
  let l = '';
  try { l = localStorage.getItem('crm-contatti-lang') || ''; } catch (e) { l = ''; }
  if (l !== 'it' && l !== 'en') {
    try { l = localStorage.getItem('language') || ''; } catch (e) { l = ''; }
    if (!l && typeof navigator !== 'undefined') l = navigator.language || '';
  }
  return /^it/i.test(l) ? 'it' : 'en';
}
let LANG = detectLang();
function T(s, ...args) {
  const tagged = Array.isArray(s);
  const key = tagged ? s.join('${}') : s;
  let out = key;
  if (LANG === 'en' && Object.prototype.hasOwnProperty.call(EN, key)) out = EN[key];
  if (!tagged) return out;
  let i = 0;
  return out.replace(/\$\{\}/g, () => String(args[i++] == null ? '' : args[i - 1]));
}
const FOLDER_DEF = LANG === 'it'
  ? ['Persone/Persone', 'Persone/Interazioni', 'Persone/Aziende']
  : ['Contacts/People', 'Contacts/Interactions', 'Contacts/Companies'];


const VIEW_TYPE = 'crm-contatti-view';
const SIDE_TYPE = 'crm-contatti-side';
const RECORD_TYPE = 'crm-contatti-record';
const COMPANY_TYPE = 'crm-contatti-company';

const DEFAULT_SETTINGS = {
  personeFolder: FOLDER_DEF[0],
  interazioniFolder: FOLDER_DEF[1],
  aziendeFolder: FOLDER_DEF[2],
  language: 'auto',
  dateFormat: 'iso',
  slashOrder: 'auto',
  linkAziende: true,
  createAziende: true,
  autoEnrichCompanies: true,
  coEnrich: {},
  coLayout: {},
  birthdayWindow: 30,
  defaultMode: 'tabella',
  groupBy: 'relazione',
  icsFollowup: true,
  autoDailyWidget: false,
  confirmDelete: true,
  ui: {
    accent: '', cDanger: '', cWarn: '', cOk: '', cBday: '',
    font: 'theme', fontCustom: '', scale: 100, density: 'normal', radius: 6,
    colBorders: true, showKpi: true, avatarStyle: 'tinted', neutralTags: true, relColors: {},
  },
  fields: {
    hidden: [], labels: {}, custom: [],
    tableCols: ['ruolo', 'azienda', 'relazione', 'vicinanza', 'citta', 'ultimo', 'followup', 'priorita'],
  },
  gcal: {
    enabled: true, askOnCreate: true,
    title: T('🎂 Compleanno di {nome} {cognome}'),
    details: T('Compleanno di {nome} {cognome} {eta}'),
  },
};

/* ───────────────────────── Helpers ───────────────────────── */

const norm = (s) => String(s == null ? '' : s)
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[^a-z0-9]/g, '');

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');
const stripLinks = (s) => String(s).replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, a, b) => b || a);

function hue(s) {
  let h = 0;
  for (const ch of String(s)) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return h;
}

const pad = (n) => String(n).padStart(2, '0');
const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
let DATE_FMT = 'iso';
let SLASH_ORDER = 'auto';
const slashOrder = () => (SLASH_ORDER === 'dmy' || SLASH_ORDER === 'mdy' ? SLASH_ORDER
  : DATE_FMT === 'dmy' || DATE_FMT === 'mdy' ? DATE_FMT : (LANG === 'it' ? 'dmy' : 'mdy'));
function setDateFormat(fmt, order) {
  DATE_FMT = ['iso', 'dmy', 'mdy'].includes(fmt) ? fmt : 'iso';
  SLASH_ORDER = ['dmy', 'mdy'].includes(order) ? order : 'auto';
}
const fmtDate = (d) => (DATE_FMT === 'dmy' ? `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
  : DATE_FMT === 'mdy' ? `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}` : isoDate(d));
const fmtDM = (d) => (DATE_FMT === 'dmy' ? `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`
  : DATE_FMT === 'mdy' ? `${pad(d.getMonth() + 1)}/${pad(d.getDate())}` : `${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
const datePh = () => (DATE_FMT === 'dmy' ? T('gg/mm/aaaa') : DATE_FMT === 'mdy' ? T('mm/gg/aaaa') : T('aaaa-mm-gg'));
/* data parziale {d,m,y} -> testo nel formato scelto */
function fmtParts(p) {
  if (!p) return '';
  if (p.d && p.m && p.y) return fmtDate(new Date(p.y, p.m - 1, p.d));
  if (p.d && p.m) return fmtDM(new Date(2000, p.m - 1, p.d));
  if (p.m && p.y) return `${p.y}-${pad(p.m)}`;
  return '';
}
/* data parziale -> ISO (sempre non ambiguo) per il frontmatter */
function toIsoParts(p) {
  if (!p) return '';
  if (p.d && p.m && p.y) return `${p.y}-${pad(p.m)}-${pad(p.d)}`;
  if (p.d && p.m) return `--${pad(p.m)}-${pad(p.d)}`;
  if (p.m && p.y) return `${p.y}-${pad(p.m)}`;
  return '';
}
/* a/b con barra: decide quale e' giorno e quale mese */
function resolveDM(a, b, sep) {
  if (a > 12 && b <= 12) return { d: a, m: b };
  if (b > 12 && a <= 12) return { d: b, m: a };
  if (sep === '.') return { d: a, m: b };
  return slashOrder() === 'mdy' ? { d: b, m: a } : { d: a, m: b };
}
const today = () => { const t = new Date(); return new Date(t.getFullYear(), t.getMonth(), t.getDate()); };
const daysBetween = (a, b) => Math.round((b.getTime() - a.getTime()) / 864e5);
const BIG = 8.64e15;

function toStr(v) {
  if (v == null) return '';
  if (Array.isArray(v)) return v.map(toStr).filter(Boolean).join(' | ');
  if (v instanceof Date) return fmtDate(v);
  if (typeof v === 'object') return '';
  return stripLinks(String(v).trim());
}

function toList(v) {
  if (v == null || v === '') return [];
  if (Array.isArray(v)) return v.map(toStr).filter(Boolean);
  const s = stripLinks(String(v));
  let parts = s.split(/\s*\|\s*/);
  if (parts.length === 1 && s.includes(',')) parts = s.split(/\s*,\s*/);
  return parts.map((x) => x.trim()).filter(Boolean);
}

function parseDate(v) {
  if (!v) return null;
  if (v instanceof Date) return { d: v.getDate(), m: v.getMonth() + 1, y: v.getFullYear() };
  const s = String(v).trim();
  let m;
  if ((m = s.match(/^(\d{4})-(\d{2})-(\d{2})/))) return { d: +m[3], m: +m[2], y: +m[1] };
  if ((m = s.match(/^--(\d{2})-?(\d{2})$/))) return { d: +m[2], m: +m[1], y: null };
  if ((m = s.match(/^(\d{4})-(\d{2})$/))) return { d: null, m: +m[2], y: +m[1] };
  if ((m = s.match(/^(\d{1,2})([\/.\-])(\d{1,2})[\/.\-](\d{4})$/))) { const r = resolveDM(+m[1], +m[3], m[2]); return { d: r.d, m: r.m, y: +m[4] }; }
  if ((m = s.match(/^(\d{1,2})[\/\-](\d{4})$/))) return { d: null, m: +m[1], y: +m[2] };
  if ((m = s.match(/^(\d{1,2})([\/\-])(\d{1,2})$/))) { const r = resolveDM(+m[1], +m[3], m[2]); return { d: r.d, m: r.m, y: null }; }
  return null;
}

const toDate = (p) => (p && p.d && p.m && p.y ? new Date(p.y, p.m - 1, p.d) : null);

function nextBirthday(p) {
  if (!p || !p.d || !p.m) return null;
  const t = today();
  let n = new Date(t.getFullYear(), p.m - 1, p.d);
  if (n < t) n = new Date(t.getFullYear() + 1, p.m - 1, p.d);
  const days = daysBetween(t, n);
  const age = p.y ? n.getFullYear() - p.y : null;
  return { date: n, days, age, ageNow: age == null ? null : (days === 0 ? age : age - 1) };
}

const FREQ_DAYS = {
  settimanale: 7, mensile: 30, trimestrale: 90, semestrale: 180, annuale: 365,
};

function relTime(d) {
  if (!d) return '—';
  const n = daysBetween(d, today());
  if (n === 0) return T('oggi');
  if (n === 1) return T('ieri');
  if (n === -1) return T('domani');
  if (n < 0) return T`tra ${-n} gg`;
  if (n < 31) return T`${n} giorni fa`;
  if (n < 365) { const m = Math.round(n / 30); return T`${m} ${m === 1 ? T('mese') : T('mesi')} fa`; }
  const y = Math.round(n / 365);
  return T`${y} ${y === 1 ? T('anno') : T('anni')} fa`;
}

function linkFor(kind, v) {
  v = String(v || '').trim();
  if (!v) return null;
  switch (kind) {
    case 'email': return 'mailto:' + v;
    case 'tel': return 'tel:' + v.replace(/[^\d+]/g, '');
    case 'whatsapp': return 'https://wa.me/' + v.replace(/[^\d]/g, '').replace(/^00/, '');
    case 'linkedin': return /^https?:/.test(v) ? v : 'https://www.linkedin.com/in/' + v.replace(/^\/+|\/+$/g, '');
    case 'instagram': return /^https?:/.test(v) ? v : 'https://instagram.com/' + v.replace(/^@/, '');
    default: return null;
  }
}

const PRESETS_IT = {
  relazione: ['amico stretto', 'amico', 'ex collega', 'collega attuale', 'mentor', 'contatto business', 'famiglia', 'conoscente'],
  vicinanza: ['stretta', 'media', 'lontana'],
  frequenza: ['settimanale', 'mensile', 'trimestrale', 'semestrale', 'annuale', 'occasionale'],
  canale: ['whatsapp', 'instagram', 'email', 'linkedin', 'telefono', 'di persona'],
  priorita: ['alta', 'media', 'bassa'],
  stato: ['attivo', 'dormiente', 'archiviato'],
};
const PRESETS_EN = {
  relazione: ['close friend', 'friend', 'former colleague', 'current colleague', 'mentor', 'business contact', 'family', 'acquaintance'],
  vicinanza: ['close', 'medium', 'distant'],
  frequenza: ['weekly', 'monthly', 'quarterly', 'semiannual', 'yearly', 'occasional'],
  canale: ['whatsapp', 'instagram', 'email', 'linkedin', 'phone', 'in person'],
  priorita: ['high', 'medium', 'low'],
  stato: ['active', 'dormant', 'archived'],
};
const PRESETS = LANG === 'it' ? PRESETS_IT : PRESETS_EN;
/* valori inglesi -> valore canonico italiano usato dalla logica interna */
const CANON_EN = {
  weekly: 'settimanale', monthly: 'mensile', quarterly: 'trimestrale', semiannual: 'semestrale', semiannually: 'semestrale', biannual: 'semestrale',
  yearly: 'annuale', annual: 'annuale', annually: 'annuale', high: 'alta', medium: 'media', low: 'bassa',
  close: 'stretta', distant: 'lontana', far: 'lontana', active: 'attivo', dormant: 'dormiente', archived: 'archiviato',
};
const REL_COLORS = {};
['--color-pink', '--color-green', '--color-orange', '--color-blue', '--color-purple', '--color-cyan', '--color-red', '--color-yellow'].forEach((cssVar, i) => { REL_COLORS[norm(PRESETS_IT.relazione[i])] = REL_COLORS[norm(PRESETS_EN.relazione[i])] = cssVar; });
const PALETTE_VARS = ['--color-red', '--color-orange', '--color-yellow', '--color-green', '--color-cyan', '--color-blue', '--color-purple', '--color-pink'];
const relDefaultVar = (label) => REL_COLORS[norm(label)] || PALETTE_VARS[hue(norm(label)) % 8];
const DV = {};
for (const k of Object.keys(PRESETS_IT)) PRESETS_IT[k].forEach((it, i) => { DV[norm(it)] = DV[norm(PRESETS_EN[k][i])] = LANG === 'it' ? it : PRESETS_EN[k][i]; });
const dv = (s) => DV[norm(s)] || s; // preset value shown in the UI language
const nv = (s) => norm(dv(s));
const relTone = (u, text) => (u.relColors && (u.relColors[cv(text)] || u.relColors[norm(text)])) || '';
const cv = (s) => { const n = norm(s); return CANON_EN[n] || n; };

/* Campi: k = chiave logica, dk = chiave frontmatter se nuova, al = alias normalizzati riconosciuti */
const FIELDS = [
  { k: 'nome', label: T('Nome'), group: T('Anagrafica'), dk: 'nome', al: ['nome'] },
  { k: 'cognome', label: T('Cognome'), group: T('Anagrafica'), dk: 'cognome', al: ['cognome'] },
  { k: 'soprannome', label: T('Soprannome'), group: T('Anagrafica'), dk: 'soprannome', al: ['soprannome', 'nickname'] },
  { k: 'compleanno', label: T('Compleanno'), group: T('Anagrafica'), dk: 'compleanno', al: ['compleanno', 'datadinascita', 'nascita'], type: 'date' },
  { k: 'citta', label: T('Città'), group: T('Anagrafica'), dk: 'citta', al: ['citta', 'city'] },
  { k: 'paese', label: T('Paese'), group: T('Anagrafica'), dk: 'paese', al: ['paese', 'country'] },
  { k: 'partner', label: T('Partner'), group: T('Anagrafica'), dk: 'partner', al: ['partner'], type: 'person' },
  { k: 'foto', label: T('Foto'), group: T('Anagrafica'), dk: 'foto', al: ['foto', 'photo', 'immagine', 'image', 'avatar'], internal: true },
  { k: 'figli', label: T('Figli'), group: T('Anagrafica'), dk: 'figli', al: ['figli'], type: 'list' },
  { k: 'lingue', label: T('Lingue'), group: T('Anagrafica'), dk: 'lingue', al: ['lingue'], type: 'list' },

  { k: 'email', label: T('Email'), group: T('Contatti'), dk: 'email', al: ['email', 'mail'] },
  { k: 'emaillavoro', label: T('Email lavoro'), group: T('Contatti'), dk: 'email_lavoro', al: ['emaillavoro', 'emailwork'] },
  { k: 'telefono', label: T('Telefono'), group: T('Contatti'), dk: 'telefono', al: ['telefono', 'cellulare', 'phone'] },
  { k: 'whatsapp', label: 'WhatsApp', group: T('Contatti'), dk: 'whatsapp', al: ['whatsapp'] },
  { k: 'instagram', label: 'Instagram', group: T('Contatti'), dk: 'instagram', al: ['instagram'] },
  { k: 'linkedin', label: 'LinkedIn', group: T('Contatti'), dk: 'linkedin', al: ['linkedin'] },

  { k: 'ruolo', label: T('Ruolo attuale'), group: T('Lavoro'), dk: 'ruolo_attuale', al: ['ruoloattuale', 'ruolo'] },
  { k: 'azienda', label: T('Azienda attuale'), group: T('Lavoro'), dk: 'azienda_attuale', al: ['aziendaattuale', 'azienda'], type: 'company' },
  { k: 'aziendepassate', label: T('Aziende passate'), group: T('Lavoro'), dk: 'aziende_passate', al: ['aziendepassate'], type: 'companylist' },
  { k: 'settore', label: T('Settore'), group: T('Lavoro'), dk: 'settore', al: ['settore'] },
  { k: 'competenze', label: T('Competenze'), group: T('Lavoro'), dk: 'competenze', al: ['competenze'], type: 'list' },

  { k: 'relazione', label: T('Relazione'), group: T('Relazione'), dk: 'relazione', al: ['relazione'], type: 'list' },
  { k: 'vicinanza', label: T('Vicinanza'), group: T('Relazione'), dk: 'vicinanza', al: ['vicinanza'], type: 'enum' },
  { k: 'stato', label: T('Stato'), group: T('Relazione'), dk: 'stato', al: ['stato'], type: 'enum' },
  { k: 'priorita', label: T('Priorità'), group: T('Relazione'), dk: 'priorita', al: ['priorita'], type: 'enum' },
  { k: 'frequenza', label: T('Frequenza contatto'), group: T('Relazione'), dk: 'frequenza_contatto', al: ['frequenzacontatto', 'frequenza'], type: 'enum' },
  { k: 'canale', label: T('Canale preferito'), group: T('Relazione'), dk: 'canale_preferito', al: ['canalepreferito', 'canale'], type: 'enum' },
  { k: 'ultimocontatto', label: T('Ultimo contatto'), group: T('Relazione'), dk: 'ultimo_contatto', al: ['ultimocontatto'], type: 'date' },
  { k: 'prossimofollowup', label: T('Prossimo follow-up'), group: T('Relazione'), dk: 'prossimo_follow_up', al: ['prossimofollowup', 'prossimofollowup', 'followup'], type: 'date' },
  { k: 'quandocontattare', label: T('Quando contattare'), group: T('Relazione'), dk: 'quando_contattare', al: ['quandocontattare'] },
  { k: 'conosciutidove', label: T('Conosciuti dove'), group: T('Relazione'), dk: 'conosciuti_dove', al: ['conosciutidove'] },
  { k: 'conosciutiquando', label: T('Conosciuti quando'), group: T('Relazione'), dk: 'conosciuti_quando', al: ['conosciutiquando'] },
  { k: 'conosciutitramite', label: T('Conosciuti tramite'), group: T('Relazione'), dk: 'conosciuti_tramite', al: ['conosciutitramite'], type: 'person' },

  { k: 'interessi', label: T('Interessi'), group: T('Rete'), dk: 'interessi', al: ['interessi'], type: 'list' },
  { k: 'puoaiutarmi', label: T('Può aiutarmi con'), group: T('Rete'), dk: 'puo_aiutarmi_con', al: ['puoaiutarmicon', 'puoaiutarmi'] },
  { k: 'possoaiutarlo', label: T('Posso aiutarlo con'), group: T('Rete'), dk: 'posso_aiutarlo_con', al: ['possoaiutarlocon', 'possoaiutarlo'] },
  { k: 'favoriricevuti', label: T('Favori ricevuti'), group: T('Rete'), dk: 'favori_ricevuti', al: ['favoriricevuti'] },
  { k: 'favoridati', label: T('Favori dati'), group: T('Rete'), dk: 'favori_dati', al: ['favoridati'] },

  { k: 'note', label: T('Note'), group: T('Note'), dk: 'note', al: ['note'], type: 'longtext' },
];
/* Chiavi frontmatter inglesi: riconosciute sempre; usate per le nuove note se la lingua e' l'inglese */
const EN_KEYS = {
  nome: 'first_name', cognome: 'last_name', soprannome: 'nickname', compleanno: 'birthday', citta: 'city', paese: 'country',
  partner: 'partner', figli: 'children', lingue: 'languages', email: 'email', emaillavoro: 'work_email', telefono: 'phone',
  whatsapp: 'whatsapp', instagram: 'instagram', linkedin: 'linkedin', ruolo: 'current_role', azienda: 'current_company',
  aziendepassate: 'past_companies', settore: 'industry', competenze: 'skills', relazione: 'relationship', vicinanza: 'closeness',
  stato: 'status', priorita: 'priority', frequenza: 'contact_frequency', canale: 'preferred_channel', ultimocontatto: 'last_contact',
  prossimofollowup: 'next_follow_up', quandocontattare: 'when_to_contact', conosciutidove: 'met_where', conosciutiquando: 'met_when',
  conosciutitramite: 'met_through', interessi: 'interests', puoaiutarmi: 'can_help_me_with', possoaiutarlo: 'i_can_help_with',
  favoriricevuti: 'favors_received', favoridati: 'favors_given', note: 'notes', foto: 'photo',
};
const EN_EXTRA_AL = {
  nome: ['name'], compleanno: ['dateofbirth', 'dob'], ruolo: ['role', 'jobtitle'], azienda: ['company', 'organization'],
  telefono: ['mobile'], prossimofollowup: ['nextfollowup'], ultimocontatto: ['lastcontacted'],
};
for (const f of FIELDS) {
  const en = EN_KEYS[f.k];
  if (!en) continue;
  for (const a of [norm(en), ...(EN_EXTRA_AL[f.k] || [])]) if (!f.al.includes(a)) f.al.push(a);
  if (LANG === 'en') f.dk = en;
}
const FM = Object.fromEntries(FIELDS.map((f) => [f.k, f]));

/* Relazioni multiple: "ex collega @ Azienda" = relazione + azienda collegata */
function parseRel(e) {
  const m = String(e || '').split(/\s+@\s*/);
  return { raw: String(e || '').trim(), label: (m[0] || '').trim(), company: (m.slice(1).join(' @ ') || '').trim() };
}
const REL_LINKABLE = /collega|colleague|client|fornitor|supplier|business|mentor|socio|partner|manager|capo|boss/i;

class Contact {
  constructor(file, fm) {
    this.file = file;
    this.fm = fm || {};
    this.nmap = {};
    for (const k of Object.keys(this.fm)) this.nmap[norm(k)] = k;
    const nome = this.s('nome');
    const cognome = this.s('cognome');
    this.name = [nome, cognome].filter(Boolean).join(' ') || file.basename;
    this.initials = (nome || cognome)
      ? ((nome[0] || '') + (cognome[0] || '')).toUpperCase()
      : this.name.slice(0, 2).toUpperCase();
    this.archived = cv(this.s('stato')) === 'archiviato';
    this.due = dueInfo(this);
    this.bday = nextBirthday(parseDate(this.raw(FM.compleanno)));
    this._hay = null;
  }
  raw(f) { for (const a of f.al) if (a in this.nmap) return this.fm[this.nmap[a]]; return undefined; }
  realKey(f) { for (const a of f.al) if (a in this.nmap) return this.nmap[a]; return null; }
  get rels() { if (!this._rels) this._rels = toList(this.raw(FM.relazione)).map(parseRel).filter((r) => r.label); return this._rels; }
  s(k) { if (k === 'relazione') { const r = this.rels[0]; return r ? r.label : ''; } return toStr(this.raw(FM[k])); }
  l(k) { return toList(this.raw(FM[k])); }
  get hay() {
    if (!this._hay) {
      this._hay = norm([this.name, this.s('soprannome'), this.s('azienda'), this.s('ruolo'), this.s('citta'),
        this.s('email'), this.s('telefono'), this.s('settore'), this.l('interessi').join(' '),
        this.l('competenze').join(' '), this.rels.map((r) => `${r.label} ${r.company}`).join(' '), this.s('note')].join(' '));
    }
    return this._hay;
  }
}

function dueInfo(c) {
  const t = today();
  const nf = toDate(parseDate(c.raw(FM.prossimofollowup)));
  const last = toDate(parseDate(c.raw(FM.ultimocontatto)));
  const fd = FREQ_DAYS[cv(c.s('frequenza'))];
  let due = nf;
  let source = 'followup';
  if (!due && last && fd) { due = new Date(last); due.setDate(due.getDate() + fd); source = 'frequenza'; }
  if (!due) return { due: null, days: null, state: 'none', last, source: null };
  const days = daysBetween(t, due);
  return { due, days, last, source, state: days < 0 ? 'scaduto' : days <= 7 ? 'presto' : 'ok' };
}

const prioRank = (c) => ({ alta: 0, media: 1, bassa: 2 }[cv(c.s('priorita'))] ?? 3);
const SORTS = {
  nome: (a, b) => a.name.localeCompare(b.name, LANG),
  ultimo: (a, b) => (a.due.last ? a.due.last.getTime() : 0) - (b.due.last ? b.due.last.getTime() : 0),
  followup: (a, b) => (a.due.due ? a.due.due.getTime() : BIG) - (b.due.due ? b.due.due.getTime() : BIG),
  compleanno: (a, b) => (a.bday ? a.bday.days : 1e9) - (b.bday ? b.bday.days : 1e9),
  priorita: (a, b) => prioRank(a) - prioRank(b),
};
const SORT_LABELS = {
  nome: T('Nome A→Z'), ultimo: T('Contatto più vecchio'), followup: T('Follow-up più urgente'),
  compleanno: T('Prossimo compleanno'), priorita: T('Priorità'),
};

/* ───────────────────────── Plugin ───────────────────────── */

class CRMPlugin extends Plugin {
  async onload() {
    await this.loadSettings();
    setDateFormat(this.settings.dateFormat, this.settings.slashOrder);
    applyFieldConfig(this.settings.fields);
    this.applyTheme();
    this.registerView(VIEW_TYPE, (leaf) => new CRMView(leaf, this));
    this.registerView(SIDE_TYPE, (leaf) => new KithSidebar(leaf, this));
    this.registerView(RECORD_TYPE, (leaf) => new CRMRecordView(leaf, this));
    this.registerView(COMPANY_TYPE, (leaf) => new CRMCompanyView(leaf, this));
    this.addCommand({ id: 'kith-indietro', name: T('Kith: indietro'), checkCallback: (chk) => { const v = this.app.workspace.getActiveViewOfType(ItemView); const ok = !!v && typeof v.goBack === 'function'; if (ok && !chk) v.goBack(); return ok; } });
    this.addCommand({ id: 'apri-azienda', name: T('Apri pagina azienda…'), callback: () => new CompanyPicker(this.app, allCompanyNames(this), (n) => this.openCompany(n)).open() });
    this.app.workspace.onLayoutReady(() => { this.syncSidebar(); });
    this.registerEvent(this.app.workspace.on('active-leaf-change', () => this.syncSidebar()));
    this.addRibbonIcon('users', T('Apri Kith'), () => this.activateView());

    this.addCommand({ id: 'apri-crm', name: T('Apri Kith'), callback: () => this.activateView() });
    this.addCommand({
      id: 'nuovo-contatto', name: T('Nuovo contatto'),
      callback: () => new ContactModal(this.app, this, null, (f) => this.focusContact(f)).open(),
    });
    this.addCommand({
      id: 'registra-interazione', name: T('Registra interazione'),
      callback: () => this.withContact((c) => new InteractionModal(this.app, this, c).open()),
    });
    this.addCommand({
      id: 'contattato-oggi', name: T('Segna contatto come contattato oggi'),
      callback: () => this.withContact(async (c) => {
        await this.markContacted(c);
        new Notice(T`${c.name}: ultimo contatto = oggi`);
      }),
    });
    this.addCommand({ id: 'elimina-contatto', name: T('Elimina contatto…'), callback: () => this.withContact((c) => this.removeContact(c)) });
    this.addCommand({ id: 'personalizza', name: T('Personalizza CRM (colori, font, campi, Google Calendar)'), callback: () => new CustomizeModal(this.app, this).open() });
    this.addCommand({
      id: 'compleanno-google-calendar', name: T('Aggiungi il compleanno del contatto a Google Calendar'),
      callback: () => this.withContact((c) => this.openBirthday(this.birthdayInfo(c))),
    });
    this.addCommand({ id: 'importa-contatti', name: T('Importa contatti (LinkedIn, telefono, Facebook, CSV)'), callback: () => new ImportModal(this.app, this, () => {}).open() });
    this.addCommand({ id: 'esporta-calendario', name: T('Esporta compleanni e follow-up per il calendario (.ics)'), callback: () => this.exportICS() });
    this.addCommand({
      id: 'inserisci-widget-oggi', name: T('Inserisci widget CRM “Oggi” nella nota'),
      editorCallback: (editor) => editor.replaceSelection('```crm-oggi\ngiorni: 7\n```\n'),
    });
    this.registerMarkdownCodeBlockProcessor('crm-oggi', (source, el, ctx) => {
      ctx.addChild(new OggiWidget(el, this, parseWidgetOpts(source)));
    });
    this.registerEvent(this.app.vault.on('create', (f) => {
      if (!this.settings.autoDailyWidget || !(f instanceof TFile) || f.extension !== 'md') return;
      setTimeout(() => this.maybeAddDailyWidget(f), 1500);
    }));
    this.addSettingTab(new CRMSettingTab(this.app, this));
  }

  async loadSettings() {
    const d = (await this.loadData()) || {};
    this.settings = Object.assign({}, DEFAULT_SETTINGS, d);
    for (const k of ['ui', 'fields', 'gcal']) {
      this.settings[k] = Object.assign(JSON.parse(JSON.stringify(DEFAULT_SETTINGS[k])), d[k] || {});
    }
    const tc = this.settings.fields.tableCols;
    if (JSON.stringify(tc) === JSON.stringify(['relazione', 'vicinanza', 'citta', 'ultimo', 'followup', 'priorita'])) this.settings.fields.tableCols = ['ruolo', 'azienda', ...tc];
  }

  onunload() {
    if (this.styleEl) this.styleEl.remove();
    for (const c of ['crm-opt-av-neutral', 'crm-opt-no-colborders', 'crm-opt-no-kpi']) document.body.classList.remove(c);
  }

  applyTheme() {
    const u = this.settings.ui;
    if (!this.styleEl) { this.styleEl = document.createElement('style'); this.styleEl.id = 'crm-contatti-theme'; document.head.appendChild(this.styleEl); }
    this.styleEl.textContent = buildThemeCss(u);
    document.body.classList.toggle('crm-opt-av-neutral', u.avatarStyle === 'neutral');
    document.body.classList.toggle('crm-opt-no-colborders', !u.colBorders);
    document.body.classList.toggle('crm-opt-no-kpi', !u.showKpi);
  }

  refreshViews() {
    for (const t of [VIEW_TYPE, RECORD_TYPE, COMPANY_TYPE]) for (const leaf of this.app.workspace.getLeavesOfType(t)) { const v = leaf.view; if (v && v.refresh) v.refresh(); else if (v && v.render) v.render(); }
    this.refreshSidebar();
  }

  copyText(text, msg) {
    const done = () => new Notice(msg || T('Copiato'));
    const fallback = () => {
      const ta = document.body.createEl('textarea', { attr: { style: 'position:fixed;opacity:0' } });
      ta.value = text; ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { new Notice(T('Copia non riuscita')); }
      ta.remove();
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
  }

  async removeContact(c) {
    const go = async () => {
      await this.app.fileManager.trashFile(c.file);
      new Notice(T`“${c.name}” eliminato`);
    };
    if (!this.settings.confirmDelete) { await go(); return; }
    new RemoveContactModal(this.app, this, c, go).open();
  }

  async setArchived(c, on) {
    await this.saveContact(c.file, { stato: on ? PRESETS.stato[2] : PRESETS.stato[0] });
    new Notice(on ? T`“${c.name}” archiviato` : T`“${c.name}” ripristinato`);
  }

  birthdayInfo(c) {
    return { file: c.file, nome: c.s('nome'), cognome: c.s('cognome'), date: parseDate(c.raw(FM.compleanno)) };
  }

  offerBirthday(file, nome, cognome, date) {
    const g = this.settings.gcal;
    if (!g.enabled || !g.askOnCreate || !date || !date.d || !date.m) return;
    new BirthdayCalModal(this.app, this, { file, nome, cognome, date }).open();
  }

  async openBirthday(info) {
    if (!info || !info.date || !info.date.d || !info.date.m) { new Notice(T('Questo contatto non ha un compleanno valido (serve almeno giorno e mese)')); return; }
    const url = buildGcalUrl(info, this.settings.gcal);
    if (!url) return;
    window.open(url, '_blank');
    if (info.file) {
      try {
        await this.app.fileManager.processFrontMatter(info.file, (fm) => {
          const key = Object.keys(fm).find((k) => ['compleannoincalendario', 'birthdayincalendar'].includes(norm(k))) || (LANG === 'it' ? 'compleanno_in_calendario' : 'birthday_in_calendar');
          fm[key] = isoDate(new Date());
        });
      } catch (e) { console.error('CRM: marcatura compleanno', e); }
    }
  }
  async saveSettings() { await this.saveData(this.settings); }

  /* Cerca nelle note le date con la barra e conta quante sono sicuramente gg/mm o mm/gg */
  analyzeDates() {
    const r = { total: 0, dmy: 0, mdy: 0 };
    for (const c of this.getContacts()) {
      for (const f of FIELDS) {
        if (f.type !== 'date') continue;
        const v = String(c.raw(f) == null ? '' : c.raw(f)).trim();
        const m = v.match(/^(\d{1,2})\/(\d{1,2})(?:\/\d{4})?$/);
        if (!m) continue;
        r.total++;
        if (+m[1] > 12 && +m[2] <= 12) r.dmy++;
        else if (+m[2] > 12 && +m[1] <= 12) r.mdy++;
      }
    }
    return r;
  }

  getContacts() {
    const folder = normalizePath(this.settings.personeFolder) + '/';
    const out = [];
    for (const f of this.app.vault.getMarkdownFiles()) {
      if (!f.path.startsWith(folder)) continue;
      const fm = this.app.metadataCache.getFileCache(f)?.frontmatter;
      if (!fm) continue;
      out.push(new Contact(f, fm));
    }
    return out;
  }

  contactFor(file) {
    const fm = this.app.metadataCache.getFileCache(file)?.frontmatter;
    return fm ? new Contact(file, fm) : null;
  }

  withContact(fn) {
    const active = this.app.workspace.getActiveFile();
    const folder = normalizePath(this.settings.personeFolder) + '/';
    if (active && active.path.startsWith(folder)) {
      const c = this.contactFor(active);
      if (c) return fn(c);
    }
    new ContactPicker(this.app, this.getContacts().filter((c) => !c.archived), fn).open();
  }

  /* the side panel lives only while a Kith tab is the active one; elsewhere the left sidebar returns to what it was */
  async syncSidebar() {
    if (obsidian.Platform.isMobile || this._syncing) return;
    this._syncing = true;
    try {
      const ws = this.app.workspace;
      const act = ws.getActiveViewOfType(ItemView);
      const onKith = !!act && (act.getViewType() === VIEW_TYPE || act.getViewType() === SIDE_TYPE || act.getViewType() === RECORD_TYPE || act.getViewType() === COMPANY_TYPE);
      if (onKith) await this.ensureSidebar(!ws.leftSplit.collapsed);
      else if (ws.getLeavesOfType(SIDE_TYPE).length) this.closeSidebar();
    } finally { this._syncing = false; }
  }
  async ensureSidebar(reveal = true) {
    if (obsidian.Platform.isMobile) return;
    const ws = this.app.workspace;
    if (ws.getLeavesOfType(SIDE_TYPE).length) return;
    const leaf = ws.getLeftLeaf(false);
    if (!leaf) return;
    this._prevLeft = ws.getLeavesOfType('file-explorer').find((l) => l.view.containerEl.offsetParent !== null) || null;
    await leaf.setViewState({ type: SIDE_TYPE, active: reveal });
    if (reveal) ws.revealLeaf(leaf);
  }
  closeSidebar() {
    const ws = this.app.workspace;
    ws.detachLeavesOfType(SIDE_TYPE);
    const prev = this._prevLeft; this._prevLeft = null;
    if (prev && ws.getLeavesOfType('file-explorer').includes(prev) && !ws.leftSplit.collapsed) ws.revealLeaf(prev);
  }
  onMainClosed() { setTimeout(() => this.syncSidebar(), 80); }
  refreshSidebar() {
    clearTimeout(this._st);
    this._st = setTimeout(() => {
      for (const leaf of this.app.workspace.getLeavesOfType(SIDE_TYPE)) { const v = leaf.view; if (v && v.update) v.update(); }
    }, 120);
  }
  async navigate(patch) {
    const leaf = await this.activateView();
    if (leaf.view && leaf.view.applyNav) leaf.view.applyNav(patch);
  }

  async activateView() {
    await this.ensureSidebar(!this.app.workspace.leftSplit.collapsed);
    let leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE)[0];
    if (!leaf) {
      leaf = this.app.workspace.getLeaf('tab');
      await leaf.setViewState({ type: VIEW_TYPE, active: true });
    }
    this.app.workspace.revealLeaf(leaf);
    return leaf;
  }

  resolveImg(v, from) {
    v = String(v || '').trim(); if (!v) return '';
    if (/^(https?:|data:)/i.test(v)) return v;
    const f = this.app.vault.getAbstractFileByPath(v) || this.app.metadataCache.getFirstLinkpathDest(v.replace(/^\[\[|\]\]$/g, ''), from || '');
    return f instanceof TFile ? this.app.vault.getResourcePath(f) : '';
  }
  companyLogo(name) {
    const f = this.findCompanyNote(name); if (!f) return '';
    const fm = (this.app.metadataCache.getFileCache(f) || {}).frontmatter || {};
    return this.resolveImg(toStr(fm.logo || ''), f.path);
  }

  findCompanyNote(name) {
    const byFolder = this.app.vault.getAbstractFileByPath(normalizePath(this.settings.aziendeFolder) + '/' + name + '.md');
    if (byFolder) return byFolder;
    const f = this.app.metadataCache.getFirstLinkpathDest(name, '');
    return f && f.path.startsWith(normalizePath(this.settings.aziendeFolder) + '/') ? f : null;
  }

  async openCompany(name, fromPath) {
    const ws = this.app.workspace;
    const cur = ws.getActiveViewOfType(ItemView);
    let leaf = (cur && [RECORD_TYPE, COMPANY_TYPE].includes(cur.getViewType())) ? cur.leaf : (ws.getLeavesOfType(VIEW_TYPE)[0] || ws.getLeavesOfType(RECORD_TYPE)[0]);
    if (!leaf) leaf = ws.getLeaf('tab');
    const from = fromPath || (cur && cur.getViewType() === RECORD_TYPE ? cur.path : null);
    await leaf.setViewState({ type: COMPANY_TYPE, active: true, state: { name, from } });
    ws.revealLeaf(leaf);
  }

  async openRecord(file, opts) {
    const ws = this.app.workspace;
    // same tab as the list, so Obsidian's back arrow returns to it
    const cur = ws.getActiveViewOfType(ItemView);
    let leaf = (cur && [RECORD_TYPE, COMPANY_TYPE].includes(cur.getViewType())) ? cur.leaf : (ws.getLeavesOfType(VIEW_TYPE)[0] || ws.getLeavesOfType(RECORD_TYPE)[0]);
    if (!leaf) leaf = ws.getLeaf('tab');
    const stack = (cur && cur.getViewType() === RECORD_TYPE && cur.path && cur.path !== file.path) ? [...cur.stack, cur.path] : (cur && cur.getViewType() === RECORD_TYPE ? cur.stack : []);
    const co = (opts && opts.company) || (cur && cur.getViewType() === RECORD_TYPE && cur.path !== file.path ? cur.co : null) || null;
    await leaf.setViewState({ type: RECORD_TYPE, active: true, state: { path: file.path, stack, co } });
    ws.revealLeaf(leaf);
  }

  async focusContact(file) {
    const leaf = await this.activateView();
    if (leaf.view && leaf.view.select) leaf.view.select(file.path);
  }

  async ensureFolder(path) {
    const parts = normalizePath(path).split('/').filter(Boolean);
    let cur = '';
    for (const p of parts) {
      cur = cur ? `${cur}/${p}` : p;
      if (!this.app.vault.getAbstractFileByPath(cur)) await this.app.vault.createFolder(cur);
    }
  }

  uniquePath(folder, name) {
    const clean = name.replace(/[\\/:*?"<>|#^\[\]]/g, '').trim() || T('Senza nome');
    let p = normalizePath(`${folder}/${clean}.md`);
    let i = 2;
    while (this.app.vault.getAbstractFileByPath(p)) p = normalizePath(`${folder}/${clean} ${i++}.md`);
    return p;
  }

  async markContacted(c) {
    const vals = { ultimocontatto: isoDate(new Date()) };
    if (c.due.source === 'followup' && c.due.days != null && c.due.days <= 0 && c.raw(FM.prossimofollowup)) vals.prossimofollowup = '';
    await this.saveContact(c.file, vals);
  }

  async maybeAddDailyWidget(f) {
    try {
      const opt = this.app.internalPlugins?.getPluginById?.('daily-notes')?.instance?.options || {};
      const fmt = opt.format || 'YYYY-MM-DD';
      const folder = String(opt.folder || '').replace(/^\/|\/$/g, '');
      const parent = !f.parent || f.parent.path === '/' ? '' : f.parent.path;
      if (folder !== parent) return;
      const m = window.moment;
      if (!m || !m(f.basename, fmt, true).isValid()) return;
      const txt = await this.app.vault.read(f);
      if (txt.includes('crm-oggi')) return;
      await this.app.vault.append(f, '\n## CRM oggi\n```crm-oggi\n```\n');
    } catch (e) { console.error('CRM: widget daily note', e); }
  }

  async createContactFast(rec, o = {}) {
    const wrap = (v) => (this.settings.linkAziende && v && !/^\[\[/.test(v) ? `[[${v}]]` : v);
    const fm = {};
    for (const f of FIELDS) {
      let v = rec[f.k];
      if (v == null || v === '' || (Array.isArray(v) && !v.length)) continue;
      if (f.type === 'list') v = Array.isArray(v) ? v : toList(v);
      else if (f.type === 'companylist') v = (Array.isArray(v) ? v : toList(v)).map(wrap);
      else if (f.type === 'company') v = wrap(String(v).trim());
      else v = String(v).trim();
      fm[f.dk] = v;
    }
    if (o.companies) {
      const names = [rec.azienda, ...(Array.isArray(rec.aziendepassate) ? rec.aziendepassate : [])];
      for (const n of names) if (n) await this.ensureCompany(String(n), o.seen, true);
    }
    const name = [rec.nome, rec.cognome].filter(Boolean).join(' ') || T('Senza nome');
    await this.ensureFolder(this.settings.personeFolder);
    const path = this.uniquePath(this.settings.personeFolder, name);
    return this.app.vault.create(path, T`---\n${stringifyYaml(fm)}---\n\n## Note\n\n## Interazioni\n`);
  }

  calendarMenu(list, e) {
    const m = new Menu();
    const one = list.length === 1 ? list[0] : null;
    if (one) {
      m.addItem((i) => i.setTitle(hasGcalMark(one) ? T('✓ Compleanno in Google Calendar (riapri)') : T('Aggiungi compleanno a Google Calendar')).setIcon('calendar-plus').onClick(() => this.openBirthday(this.birthdayInfo(one))));
    }
    m.addItem((i) => i.setTitle(one ? T('Scarica .ics di questo contatto') : list.length ? T('Scarica .ics della selezione') : T('Scarica .ics di compleanni e follow-up')).setIcon('download').onClick(() => this.exportICS(list.length ? list : null)));
    m.addSeparator();
    m.addItem((i) => i.setTitle(T('Impostazioni calendario…')).setIcon('settings').onClick(() => new CustomizeModal(this.app, this).open()));
    m.showAtMouseEvent(e);
  }
  async exportICS(only) {
    const cs = (only || this.getContacts()).filter((c) => !c.archived || only);
    const { text, nb, nf } = buildICS(cs, { followups: this.settings.icsFollowup });
    if (!nb && !nf) { new Notice(T('Nessun compleanno o follow-up da esportare')); return; }
    await this.ensureFolder(this.settings.personeFolder);
    const path = normalizePath(T`${this.settings.personeFolder}/Compleanni e follow-up.ics`);
    await this.app.vault.adapter.write(path, text);
    new Notice(T`Creato “${path}”: ${nb} compleanni, ${nf} follow-up. Aprilo per importarlo nel calendario.`, 9000);
    try { if (this.app.openWithDefaultApp) await this.app.openWithDefaultApp(path); } catch (e) { /* solo desktop */ }
  }

  async ensureCompany(name, seen, force) {
    if (!(force || this.settings.createAziende) || !name) return;
    if (seen) { const k = norm(name); if (seen.has(k)) return; seen.add(k); }
    if (this.app.metadataCache.getFirstLinkpathDest(name, '')) return;
    await this.ensureFolder(this.settings.aziendeFolder);
    const p = this.uniquePath(this.settings.aziendeFolder, name);
    if (p.endsWith(`/${name}.md`)) await this.app.vault.create(p, '');
  }

  findPerson(name, self) {
    const k = norm(String(name).replace(/^\[\[|\]\]$/g, ''));
    if (!k) return null;
    const pool = this.getContacts().filter((c) => !self || c.file.path !== self.path);
    const ex = pool.find((c) => norm(c.name) === k || norm(c.file.basename) === k);
    if (ex) return ex;
    const part = pool.filter((c) => norm(c.name).split(' ').includes(k) || norm(c.name).startsWith(k + ' '));
    return part.length === 1 ? part[0] : null;
  }
  linkPerson(name, self) {
    if (!name || /^\[\[/.test(name)) return name;
    const c = this.findPerson(name, self);
    return c ? `[[${c.file.basename}]]` : name;
  }
  photoUrl(c) {
    const v = c.s('foto'); if (!v) return null;
    const f = this.app.vault.getAbstractFileByPath(v) || this.app.metadataCache.getFirstLinkpathDest(v, c.file.path);
    return f instanceof TFile ? this.app.vault.getResourcePath(f) : null;
  }
  igHandle(c) {
    const v = (c.s('instagram') || '').trim(); if (!v) return '';
    const m = v.match(/instagram\.com\/([^/?#]+)/i);
    return (m ? m[1] : v).replace(/^@/, '').replace(/\/$/, '');
  }
  async photoFromUrl(c, url) {
    const r = await requestUrl({ url, throw: false, headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15' } });
    const ct = String((r.headers && (r.headers['content-type'] || r.headers['Content-Type'])) || '');
    if (r.status === 200 && r.arrayBuffer && r.arrayBuffer.byteLength > 500 && (/^image\//i.test(ct) || !ct)) {
      const ext = /png/i.test(ct) ? 'png' : /webp/i.test(ct) ? 'webp' : /gif/i.test(ct) ? 'gif' : 'jpg';
      await this.setPhoto(c, { name: `foto.${ext}`, arrayBuffer: async () => r.arrayBuffer });
      return true;
    }
    return false;
  }
  async fetchInstagramPhoto(c) {
    const h = this.igHandle(c);
    if (!h) { new Notice(T('Nessun profilo Instagram nella scheda')); return false; }
    const e = encodeURIComponent(h);
    const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15';
    const og = (host, ua) => async () => {
      const r = await requestUrl({ url: `https://${host}/${e}/`, throw: false, headers: { 'User-Agent': ua, 'Accept-Language': 'en' } });
      const m = r.status === 200 && r.text && (r.text.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i) || r.text.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image/i));
      if (!m) return null;
      return m[1].replace(/&amp;/g, '&');
    };
    const api = async () => {
      const r = await requestUrl({ url: `https://i.instagram.com/api/v1/users/web_profile_info/?username=${e}`, headers: { 'x-ig-app-id': '936619743392459', 'User-Agent': UA }, throw: false });
      const u = r.status === 200 && r.json && r.json.data && r.json.data.user;
      return u ? (u.profile_pic_url_hd || u.profile_pic_url) : null;
    };
    const direct = (u) => async () => u;
    const sources = [
      ['unavatar', direct(`https://unavatar.io/instagram/${e}?fallback=false`)],
      ['unavatar-ig', direct(`https://unavatar.io/${e}?fallback=false`)],
      ['api', api],
      ['og-facebook', og('www.instagram.com', 'facebookexternalhit/1.1')],
      ['og-google', og('www.instagram.com', 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)')],
      ['imginn', og('imginn.com', UA)],
      ['picuki', og('www.picuki.com/profile', UA)],
    ];
    const log = [];
    for (const [name, get] of sources) {
      try {
        const u = await get();
        if (!u) { log.push(name + ':–'); continue; }
        if (await this.photoFromUrl(c, u)) { new Notice(T('Foto recuperata da Instagram')); return true; }
        log.push(name + ':no');
      } catch (err) { log.push(name + ':err'); }
    }
    console.warn('Kith Instagram photo', h, log.join(' '));
    new Notice(T('Impossibile recuperare la foto da Instagram (profilo privato o accesso bloccato). Carica la foto a mano.') + '\n' + log.join(' '), 12000);
    return false;
  }
  async photoFromClipboard(c) {
    try {
      const items = await navigator.clipboard.read();
      for (const it of items) {
        const t = it.types.find((x) => x.startsWith('image/'));
        if (t) { const b = await it.getType(t); await this.setPhoto(c, { name: 'incollata.' + t.split('/')[1], arrayBuffer: () => b.arrayBuffer() }); return true; }
      }
    } catch (e) { /* nessun permesso o nessuna immagine */ }
    new Notice(T('Nessuna immagine negli appunti'));
    return false;
  }
  async setPhoto(c, file) {
    const ext = (file.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '') || 'png';
    const name = `${c.file.basename} ${Date.now()}.${ext}`;
    let path;
    try { path = await this.app.fileManager.getAvailablePathForAttachment(name, c.file.path); }
    catch (e) { await this.ensureFolder(this.settings.personeFolder + '/Foto'); path = this.uniquePath(this.settings.personeFolder + '/Foto', name.replace(/\.[^.]+$/, '')).replace(/\.md$/, '.' + ext); }
    await this.app.vault.createBinary(path, await file.arrayBuffer());
    await this.saveContact(c.file, { foto: path });
  }

  /* values: { chiaveLogica: stringa | array }. Passare '' o [] per cancellare il campo. */
  async saveContact(file, values) {
    if (!file) {
      const name = [values.nome, values.cognome].filter(Boolean).join(' ').trim();
      await this.ensureFolder(this.settings.personeFolder);
      const path = this.uniquePath(this.settings.personeFolder, name);
      file = await this.app.vault.create(path, T('\n## Note\n\n## Interazioni\n'));
    }
    const wrapLink = (v) => (this.settings.linkAziende && v && !/^\[\[/.test(v) ? `[[${v}]]` : v);
    if (values.relazione != null) values.relazione = (Array.isArray(values.relazione) ? values.relazione : toList(values.relazione)).map((x) => String(x).replace(/\s*@\s*$/, '').trim()).filter(Boolean);
    for (const k of ['azienda']) if (values[k]) await this.ensureCompany(values[k]);
    for (const r of (values.relazione || []).map(parseRel)) if (r.company) await this.ensureCompany(r.company);

    await this.app.fileManager.processFrontMatter(file, (fm) => {
      const nmap = {};
      for (const k of Object.keys(fm)) nmap[norm(k)] = k;
      for (const f of FIELDS) {
        if (!(f.k in values)) continue;
        let v = values[f.k];
        const alias = f.al.find((a) => a in nmap);
        const key = alias ? nmap[alias] : f.dk;
        const empty = v === '' || v == null || (Array.isArray(v) && !v.length);
        if (empty) { if (alias) delete fm[key]; continue; }
        const existing = fm[key];
        const isList = f.type === 'list' || f.type === 'companylist';
        if (isList) {
          let arr = Array.isArray(v) ? v : toList(v);
          if (f.type === 'companylist') arr = arr.map(wrapLink);
          v = (alias && typeof existing === 'string') ? arr.join(' | ') : arr;
        } else if (f.type === 'company') {
          v = wrapLink(String(v).trim());
        } else if (f.type === 'person') {
          v = this.linkPerson(String(v).trim(), file);
        } else {
          v = String(v).trim();
        }
        fm[key] = v;
      }
    });
    return file;
  }

  getInteractions(c) {
    const folder = normalizePath(this.settings.interazioniFolder) + '/';
    const out = [];
    for (const f of this.app.vault.getMarkdownFiles()) {
      if (!f.path.startsWith(folder)) continue;
      const cache = this.app.metadataCache.getFileCache(f);
      if (!cache) continue;
      const links = [...(cache.links || []), ...(cache.frontmatterLinks || [])];
      const hit = links.some((l) => {
        const dest = this.app.metadataCache.getFirstLinkpathDest(String(l.link).split('#')[0], f.path);
        return dest && dest.path === c.file.path;
      });
      if (!hit) continue;
      const fm = cache.frontmatter || {};
      const nm = {};
      for (const k of Object.keys(fm)) nm[norm(k)] = fm[k];
      const date = toDate(parseDate(nm.data || nm.date)) || new Date(f.stat.ctime);
      out.push({ file: f, tipo: toStr(nm.tipo || nm.type), date });
    }
    out.sort((a, b) => b.date - a.date);
    return out;
  }
}

/* ───────────────────────── Vista principale ───────────────────────── */

class CRMView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf); this.navigation = true;
    this.plugin = plugin;
    this.q = '';
    this.filters = { relazione: '', vicinanza: '', priorita: '', azienda: '', citta: '', stato: 'attivi' };
    this.quick = '';
    this.mode = plugin.settings.defaultMode;
    this.colSort = null; this.colFilters = {};
    this.groupBy = plugin.settings.groupBy;
    this.sort = 'nome';
    this.selected = null;
    this.checked = new Set();
    this.selAt = 0;
    this.all = [];
    this._t = null;
    this.graph = null;
    this.graphPos = new Map();
    this.graphCam = null;
    this.graphOpts = { companies: true, isolated: false };
  }
  async onClose() { if (this.graph) { this.graph.destroy(); this.graph = null; } this.plugin.onMainClosed(this); }

  applyNav(p) {
    if (p.reset) { this.filters = { relazione: '', vicinanza: '', priorita: '', azienda: '', citta: '', stato: 'attivi' }; this.quick = ''; this.q = ''; if (this.searchEl) this.searchEl.value = ''; }
    if (p.quick !== undefined) this.quick = (p.quick && this.quick === p.quick) ? '' : p.quick;
    if (p.toggle) { const { key, v } = p.toggle; const same = nv(this.filters[key] || '') === nv(v); this.filters[key] = same ? (key === 'stato' ? 'attivi' : '') : v; }
    if (p.q !== undefined) { this.q = p.q; if (this.searchEl) this.searchEl.value = p.q; if (Object.keys(p).length === 1) { this.renderList(); return; } }
    if (this.mode === 'rete') this.mode = this.plugin.settings.defaultMode === 'rete' ? 'tabella' : this.plugin.settings.defaultMode;
    this.renderKpi(); this.renderToolbar(); this.renderList();
  }
  getViewType() { return VIEW_TYPE; }
  getDisplayText() { return T('Kith'); }
  getIcon() { return 'users'; }

  async onOpen() {
    const root = this.contentEl;
    root.empty();
    root.addClass('crm-root');
    this.rootEl = root;

    const h = root.createDiv('crm-header');
    h.createDiv({ cls: 'crm-title', text: T('Kith') });
    const sw = h.createDiv('crm-search-wrap');
    setIcon(sw.createSpan('crm-search-icon'), 'search');
    this.searchEl = sw.createEl('input', { type: 'search', cls: 'crm-search', placeholder: T('Cerca per nome, azienda, città, interessi…') });
    this.searchEl.addEventListener('input', () => { this.q = this.searchEl.value; this.renderList(); });
    const nb = h.createEl('button', { cls: 'crm-btn crm-btn-primary', text: T('+ Nuovo contatto') });
    nb.addEventListener('click', () => new ContactModal(this.app, this.plugin, null, (f) => this.select(f.path)).open());
    h.createEl('button', { cls: 'crm-btn', text: T('Aggiungi al calendario'), attr: { title: T('Esporta compleanni e follow-up in un file .ics da importare nel calendario') } })
      .addEventListener('click', () => this.plugin.exportICS());
    h.createEl('button', { cls: 'crm-btn', text: T('Personalizza') })
      .addEventListener('click', () => new CustomizeModal(this.app, this.plugin).open());

    const col = h.createEl('button', { cls: 'clickable-icon crm-collapse' });
    const syncCol = () => {
      const on = this.plugin.settings.headerCollapsed !== false;
      root.toggleClass('crm-collapsed', on);
      setIcon(col, on ? 'chevrons-up-down' : 'chevrons-down-up');
      col.setAttribute('aria-label', on ? T('Espandi intestazione') : T('Comprimi intestazione'));
      col.setAttribute('title', on ? T('Espandi intestazione') : T('Comprimi intestazione'));
    };
    col.addEventListener('click', () => { this.plugin.settings.headerCollapsed = this.plugin.settings.headerCollapsed === false; this.plugin.saveData(this.plugin.settings); syncCol(); });
    syncCol();

    this.tabsEl = root.createDiv('crm-tabs');
    this.kpiEl = root.createDiv('crm-kpis');
    this.toolbarEl = root.createDiv('crm-toolbar');
    const body = root.createDiv('crm-body');
    this.mainEl = body.createDiv('crm-main');
    this.detailEl = body.createDiv('crm-detail');
    this.detailEl.addEventListener('contextmenu', (e) => this.onDetailContext(e));
    root.tabIndex = -1;
    root.addEventListener('keydown', (e) => {
      const t = e.target && e.target.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(t)) return;
      if (!this.selected || !(e.key === 'Delete' || (e.key === 'Backspace' && (e.metaKey || e.ctrlKey)))) return;
      const c = this.all.find((x) => x.file.path === this.selected);
      if (c) { e.preventDefault(); this.plugin.removeContact(c); }
    });

    const trig = (f) => {
      const p = f && f.path;
      if (!p) return;
      const pf = normalizePath(this.plugin.settings.personeFolder) + '/';
      const inf = normalizePath(this.plugin.settings.interazioniFolder) + '/';
      if (p.startsWith(pf) || p.startsWith(inf)) this.scheduleRefresh();
    };
    this.registerEvent(this.app.metadataCache.on('changed', trig));
    this.registerEvent(this.app.vault.on('delete', trig));
    this.registerEvent(this.app.vault.on('rename', trig));
    this.refresh();
    this.plugin.syncSidebar();
  }

  scheduleRefresh() {
    clearTimeout(this._t);
    this._t = setTimeout(() => this.refresh(), 350);
  }

  refresh() {
    this.all = this.plugin.getContacts();
    this.renderKpi();
    this.renderToolbar();
    this.renderList();
    this.renderDetail();
  }

  select(path) {
    this.selected = path;
    this.selAt = Date.now();
    this.rootEl.toggleClass('has-selection', !!path);
    if (this.mode === 'rete' && this.graph && path && this.all.some((c) => c.file.path === path)) {
      this.graph.setSelected(path);
      this.renderDetail();
      return;
    }
    this.scheduleRefresh();
    this.renderList();
    this.renderDetail();
  }

  /* ── filtri ── */
  applyFilters() {
    const q = norm(this.q);
    const win = this.plugin.settings.birthdayWindow;
    const f = this.filters;
    let list = this.all.filter((c) => {
      if (this.quick === 'archiviati') { if (!c.archived) return false; }
      else if (f.stato === 'attivi') { if (c.archived) return false; }
      else if (f.stato !== 'tutti' && f.stato && nv(c.s('stato')) !== nv(f.stato)) return false;
      if (f.relazione && !c.rels.some((r) => nv(r.label) === nv(f.relazione))) return false;
      if (f.vicinanza && nv(c.s('vicinanza')) !== nv(f.vicinanza)) return false;
      if (f.priorita && nv(c.s('priorita')) !== nv(f.priorita)) return false;
      if (f.azienda && norm(c.s('azienda')) !== norm(f.azienda)) return false;
      if (f.citta && norm(c.s('citta')) !== norm(f.citta)) return false;
      if (q && !c.hay.includes(q)) return false;
      if (this.quick === 'scaduti' && c.due.state !== 'scaduto') return false;
      if (this.quick === 'compleanni' && !(c.bday && c.bday.days <= win)) return false;
      if (this.quick === 'alta' && cv(c.s('priorita')) !== 'alta') return false;
      return true;
    });
    const sortKey = this.quick === 'compleanni' ? 'compleanno' : this.quick === 'scaduti' ? 'followup' : this.sort;
    list = list.sort(SORTS[sortKey]);
    for (const [k, q2] of Object.entries(this.colFilters || {})) { const nq = norm(q2); if (nq) list = list.filter((c) => norm(colText(c, k)).includes(nq)); }
    if (this.colSort && colDef(this.colSort.key)) {
      const { key, dir } = this.colSort;
      list = list.sort((a, b) => { const x = colSortVal(a, key), y = colSortVal(b, key); const r = (typeof x === 'number' && typeof y === 'number') ? x - y : String(x).localeCompare(String(y), LANG); return dir === 'desc' ? -r : r; });
    }
    return list;
  }

  /* ── KPI ── */
  renderKpi() {
    const el = this.kpiEl;
    el.empty();
    const active = this.all.filter((c) => !c.archived);
    const win = this.plugin.settings.birthdayWindow;
    const items = [
      { id: '', label: T('Contatti attivi'), value: active.length, icon: 'users' },
      { id: 'scaduti', label: T('Follow-up scaduti'), value: active.filter((c) => c.due.state === 'scaduto').length, icon: 'alarm-clock', tone: 'danger' },
      { id: 'compleanni', label: T`Compleanni (${win} gg)`, value: active.filter((c) => c.bday && c.bday.days <= win).length, icon: 'cake', tone: 'accent' },
      { id: 'alta', label: T('Priorità alta'), value: active.filter((c) => cv(c.s('priorita')) === 'alta').length, icon: 'star', tone: 'warn' },
    ];
    for (const it of items) {
      const k = el.createDiv({ cls: `crm-kpi ${it.tone ? 'tone-' + it.tone : ''}${this.quick === it.id && it.id ? ' is-active' : ''}` });
      setIcon(k.createDiv('crm-kpi-icon'), it.icon);
      const t = k.createDiv('crm-kpi-text');
      t.createDiv({ cls: 'crm-kpi-value', text: String(it.value) });
      t.createDiv({ cls: 'crm-kpi-label', text: it.label });
      k.addEventListener('click', () => {
        this.quick = (it.id && this.quick !== it.id) ? it.id : '';
        this.renderKpi(); this.renderToolbar(); this.renderList();
      });
    }
    this.renderTabs();
  }

  renderTabs() {
    const el = this.tabsEl; if (!el) return;
    el.empty();
    const active = this.all.filter((c) => !c.archived);
    const win = this.plugin.settings.birthdayWindow;
    const items = [
      { id: '', label: T('Contatti attivi'), n: active.length },
      { id: 'scaduti', label: T('Follow-up scaduti'), n: active.filter((c) => c.due.state === 'scaduto').length },
      { id: 'compleanni', label: T`Compleanni (${win} gg)`, n: active.filter((c) => c.bday && c.bday.days <= win).length },
      { id: 'alta', label: T('Priorità alta'), n: active.filter((c) => cv(c.s('priorita')) === 'alta').length },
      { id: 'archiviati', label: T('Archiviati'), n: this.all.length - active.length },
    ];
    for (const it of items) {
      const t = el.createDiv({ cls: 'crm-tab' + (this.quick === it.id ? ' is-active' : '') });
      t.createSpan({ text: it.label }); t.createSpan({ cls: 'crm-tab-n', text: String(it.n) });
      t.addEventListener('click', () => { this.quick = it.id; this.renderKpi(); this.renderToolbar(); this.renderList(); });
    }
  }

  /* ── toolbar ── */
  uniqueValues(key) {
    const seen = new Map();
    for (const p of (PRESETS[key] || [])) seen.set(nv(p), p);
    for (const c of this.all) for (const v of (key === 'relazione' ? c.rels.map((r) => r.label) : [c.s(key)])) if (v && !seen.has(nv(v))) seen.set(nv(v), dv(v));
    return [...seen.values()];
  }

  renderToolbar() {
    const el = this.toolbarEl;
    el.empty();
    const left = el.createDiv('crm-tb-left');
    const mkSel = (parent, value, opts, onchange, title) => {
      const s = parent.createEl('select', { cls: 'dropdown crm-select', attr: { 'aria-label': title } });
      for (const [v, t] of opts) { const o = s.createEl('option', { value: v, text: t }); if (v === value) o.selected = true; }
      s.addEventListener('change', () => onchange(s.value));
      return s;
    };
    const fopts = (key, all) => [['', all], ...this.uniqueValues(key).map((v) => [v, cap(dv(v))])];
    mkSel(left, this.filters.relazione, fopts('relazione', T('Tutte le relazioni')), (v) => { this.filters.relazione = v; this.renderList(); }, T('Relazione'));
    mkSel(left, this.filters.vicinanza, fopts('vicinanza', T('Ogni vicinanza')), (v) => { this.filters.vicinanza = v; this.renderList(); }, T('Vicinanza'));
    mkSel(left, this.filters.priorita, fopts('priorita', T('Ogni priorità')), (v) => { this.filters.priorita = v; this.renderList(); }, T('Priorità'));
    mkSel(left, this.filters.stato, [['attivi', T('Solo attivi')], ['tutti', T('Tutti (incl. archiviati)')], ...this.uniqueValues('stato').map((v) => [v, cap(dv(v))])],
      (v) => { this.filters.stato = v; this.renderKpi(); this.renderList(); }, T('Stato'));
    if (this.quick) {
      const chip = left.createEl('button', { cls: 'crm-chip-clear', text: T`Filtro rapido: ${this.quick} ✕` });
      chip.addEventListener('click', () => { this.quick = ''; this.renderKpi(); this.renderToolbar(); this.renderList(); });
    }

    for (const [fk, lab] of [['azienda', T('Azienda')], ['citta', T('Città')]]) {
      if (!this.filters[fk]) continue;
      const chip = left.createEl('button', { cls: 'crm-chip-clear', text: `${lab}: ${this.filters[fk]} ✕` });
      chip.addEventListener('click', () => { this.filters[fk] = ''; this.renderKpi(); this.renderToolbar(); this.renderList(); });
    }
    for (const [k, q2] of Object.entries(this.colFilters || {})) {
      if (!q2 || !colDef(k)) continue;
      const chip = left.createEl('button', { cls: 'crm-chip-clear', text: `${colDef(k).label}: “${q2}” ✕` });
      chip.addEventListener('click', () => { delete this.colFilters[k]; this.renderKpi(); this.renderToolbar(); this.renderList(); });
    }

    const right = el.createDiv('crm-tb-right');
    mkSel(right, this.sort, Object.entries(SORT_LABELS), (v) => { this.sort = v; this.renderList(); }, T('Ordina'));
    if (this.mode === 'kanban') {
      mkSel(right, this.groupBy, [['relazione', T('Colonne: relazione')], ['vicinanza', T('Colonne: vicinanza')], ['stato', T('Colonne: stato')], ['priorita', T('Colonne: priorità')]],
        (v) => { this.groupBy = v; this.renderList(); }, T('Raggruppa'));
    }
    const cal = right.createEl('button', { cls: 'clickable-icon crm-tb-cal', attr: { 'aria-label': T('Calendario'), title: T('Calendario: compleanni e follow-up') } });
    setIcon(cal, 'calendar-plus');
    cal.addEventListener('click', (e) => this.plugin.calendarMenu([...this.checked].length ? this.all.filter((c) => this.checked.has(c.file.path)) : [], e));
    const seg = right.createDiv('crm-seg');
    for (const [m, label, icon] of [['tabella', T('Tabella'), 'table'], ['schede', T('Schede'), 'layout-grid'], ['kanban', T('Kanban'), 'layout-dashboard'], ['rete', T('Rete'), 'network']]) {
      const b = seg.createEl('button', { cls: 'crm-seg-btn' + (this.mode === m ? ' is-active' : ''), attr: { 'aria-label': label, 'title': label } });
      setIcon(b.createSpan('crm-seg-ico'), icon);
      b.addEventListener('click', () => { this.mode = m; this.renderToolbar(); this.renderList(); });
    }
  }

  /* ── elenco ── */
  renderList() {
    this.plugin.refreshSidebar();
    const el = this.mainEl;
    if (this.graph) { this.graph.destroy(); this.graph = null; }
    el.empty();
    el.toggleClass('is-graph', this.mode === 'rete');
    this.rootEl.toggleClass('crm-nodetail', this.mode !== 'rete');
    if (!this.all.length) {
      const e = el.createDiv('crm-empty');
      e.createEl('h3', { text: T('Nessun contatto trovato') });
      e.createEl('p', { text: T`Cerco note con frontmatter in “${this.plugin.settings.personeFolder}”. Se il tuo vault usa un'altra cartella, cambiala nelle impostazioni del plugin, oppure crea il primo contatto.` });
      const eb = e.createDiv({ cls: 'crm-empty-actions' });
      eb.createEl('button', { cls: 'crm-btn crm-btn-primary', text: T('+ Nuovo contatto') })
        .addEventListener('click', () => new ContactModal(this.app, this.plugin, null, (f) => this.select(f.path)).open());
      eb.createEl('button', { cls: 'crm-btn', text: T('Importa contatti') })
        .addEventListener('click', () => new ImportModal(this.app, this.plugin, () => this.scheduleRefresh()).open());
      return;
    }
    const list = this.applyFilters();
    el.createDiv({ cls: 'crm-count', text: `${list.length} ${list.length === 1 ? T('contatto') : T('contatti')}` });
    if (!list.length) { el.createDiv({ cls: 'crm-empty', text: T('Nessun risultato con questi filtri.') }); return; }
    if (this.mode === 'tabella') this.renderTable(el, list);
    else if (this.mode === 'schede') this.renderCards(el, list);
    else if (this.mode === 'rete') this.renderGraph(el, list);
    else this.renderKanban(el, list);
  }

  buildGraphData(list) {
    const o = this.graphOpts;
    const byName = new Map();
    for (const c of this.all) byName.set(norm(c.name), c);
    const inList = new Set(list.map((c) => c.file.path));
    const edges = [];
    const seenE = new Set();
    const addE = (a, b, kind) => {
      if (a === b) return;
      const k = a < b ? `${a}|${b}` : `${b}|${a}`;
      if (seenE.has(k)) return;
      seenE.add(k);
      edges.push({ a, b, kind });
    };
    const companies = new Map();
    const rl = this.app.metadataCache.resolvedLinks || {};
    for (const c of list) {
      const az = c.s('azienda');
      if (az && o.companies) {
        const key = 'co:' + norm(az);
        if (!companies.has(key)) companies.set(key, { id: key, label: az, members: [] });
        companies.get(key).members.push(c);
      }
      for (const nm of c.l('conosciutitramite')) {
        const t = byName.get(norm(nm));
        if (t && inList.has(t.file.path)) addE(c.file.path, t.file.path, 'tramite');
      }
      const pt = byName.get(norm(c.s('partner')));
      if (pt && inList.has(pt.file.path)) addE(c.file.path, pt.file.path, 'partner');
      for (const dest of Object.keys(rl[c.file.path] || {})) if (inList.has(dest)) addE(c.file.path, dest, 'link');
    }
    const compNodes = [];
    for (const co of companies.values()) {
      if (co.members.length < 2) continue;
      compNodes.push({ id: co.id, kind: 'company', label: co.label, r: 8 + Math.min(6, co.members.length / 3), color: 'var(--text-faint)' });
      for (const m of co.members) addE(m.file.path, co.id, 'company');
    }
    const deg = new Map();
    for (const e of edges) { deg.set(e.a, (deg.get(e.a) || 0) + 1); deg.set(e.b, (deg.get(e.b) || 0) + 1); }
    let people = list.map((c) => ({
      id: c.file.path, kind: 'person', label: c.name, c,
      r: 5 + ({ stretta: 3, media: 1.5 }[cv(c.s('vicinanza'))] || 0) + (cv(c.s('priorita')) === 'alta' ? 2 : 0),
      color: c.s('relazione') ? `hsl(${hue(norm(c.s('relazione')))} 60% 50%)` : '#8b8d98',
    }));
    const isolated = people.filter((n) => !deg.get(n.id)).length;
    if (!o.isolated) people = people.filter((n) => deg.get(n.id));
    people.sort((a, b) => (deg.get(b.id) || 0) - (deg.get(a.id) || 0));
    const capped = people.length > 700;
    people = people.slice(0, 700);
    const ids = new Set(people.map((n) => n.id));
    const comps = compNodes.filter((n) => edges.some((e) => (e.a === n.id && ids.has(e.b)) || (e.b === n.id && ids.has(e.a))));
    return { nodes: [...people, ...comps], edges, isolated, capped };
  }

  renderGraph(el, list) {
    const data = this.buildGraphData(list);
    const wrap = el.createDiv('crm-graph');
    const host = wrap.createDiv('crm-graph-host');
    const ctl = wrap.createDiv('crm-graph-ctl');
    const tog = (label, key) => {
      const l = ctl.createEl('label', { cls: 'crm-check' });
      const cb = l.createEl('input', { type: 'checkbox' });
      cb.checked = this.graphOpts[key];
      l.createSpan({ text: ' ' + label });
      cb.addEventListener('change', () => { this.graphOpts[key] = cb.checked; this.renderList(); });
    };
    tog(T('Aziende'), 'companies');
    tog(T`Isolati (${data.isolated})`, 'isolated');
    const zb = (t, fn) => ctl.createEl('button', { cls: 'crm-btn crm-graph-btn', text: t }).addEventListener('click', fn);
    zb('+', () => this.graph && this.graph.zoomBy(1.25));
    zb('−', () => this.graph && this.graph.zoomBy(1 / 1.25));
    zb(T('Adatta'), () => this.graph && this.graph.fit());

    if (!data.nodes.length) {
      host.createDiv({ cls: 'crm-empty', text: T('Nessuna connessione da mostrare. Le relazioni nascono da: stessa azienda (almeno 2 persone), “Conosciuti tramite” con il nome di un altro contatto, “Partner”, oppure [[link]] tra schede.') });
      return;
    }
    const leg = wrap.createDiv('crm-graph-legend');
    const rels = new Map();
    for (const n of data.nodes) if (n.kind === 'person' && n.c.s('relazione')) rels.set(norm(n.c.s('relazione')), n.c.s('relazione'));
    for (const r of [...rels.values()].slice(0, 9)) {
      const i = leg.createDiv('crm-legend-item');
      const dot = i.createSpan('crm-legend-dot');
      dot.style.background = `hsl(${hue(norm(r))} 60% 50%)`;
      i.createSpan({ text: cap(r) });
    }
    if (data.capped) leg.createDiv({ cls: 'crm-muted', text: T('Mostrati i 700 contatti più connessi') });
    this.graph = new RelGraph(host, data, {
      pos: this.graphPos,
      cam: this.graphCam,
      saveCam: (c) => { this.graphCam = c; },
      selected: this.selected,
      onSelect: (n) => { if (n.kind === 'person') this.select(n.id); },
    });
  }

  avatar(parent, c, size) {
    const url = this.plugin.photoUrl(c);
    const a = parent.createDiv({ cls: 'crm-avatar t' + (hue(c.name) % 8) + (size ? ' ' + size : '') + (url ? ' has-photo' : '') });
    if (url) a.createEl('img', { attr: { src: url, alt: c.name } }); else a.setText(c.initials);
    return a;
  }

  badge(parent, text, cls) {
    if (!text) return null;
    const u = this.plugin.settings.ui;
    const b = parent.createSpan({ cls: 'crm-badge ' + (cls || (u.neutralTags ? '' : 't' + (hue(norm(text)) % 8))), text: cap(dv(text)) });
    const custom = !cls && relTone(u, text);
    if (custom) { b.style.setProperty('--tone', custom); b.addClass('has-tone'); }
    return b;
  }

  relBadges(parent, c) {
    for (const r of c.rels) {
      const b = this.badge(parent, r.label);
      if (b && !b.hasClass('has-tone')) { b.style.setProperty('--tone', `var(${relDefaultVar(r.label)})`); b.addClass('has-tone'); }
      if (b && r.company) {
        b.createSpan({ cls: 'crm-rel-sep', text: '·' });
        const a = b.createEl('a', { cls: 'crm-rel-co', text: r.company, attr: { 'aria-label': T`Apri ${r.company}` } });
        a.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); this.plugin.openCompany(r.company); });
      }
    }
  }

  dueChip(parent, c) {
    const d = c.due;
    if (d.state === 'none') { parent.createSpan({ cls: 'crm-muted', text: '—' }); return; }
    let text;
    if (d.state === 'scaduto') text = T`Scaduto da ${-d.days} gg`;
    else if (d.days === 0) text = T('Oggi');
    else if (d.days <= 7) text = T`Tra ${d.days} gg`;
    else text = fmtDate(d.due);
    parent.createSpan({ cls: `crm-due due-${d.state}`, text });
  }

  priChip(parent, c) {
    const p = c.s('priorita');
    if (p) this.badge(parent, p, `crm-pri crm-pri-${cv(p)}`);
  }

  subline(c) {
    return [c.s('ruolo'), c.s('azienda')].filter(Boolean).join(' · ') || c.s('citta');
  }

  columnFilter(anchor, key, label) {
    document.querySelectorAll('.crm-colpick').forEach((n) => n.remove());
    const pop = document.body.createDiv('crm-colpick');
    const r = anchor.getBoundingClientRect();
    pop.style.top = (r.bottom + 6) + 'px';
    pop.style.left = Math.max(8, Math.min(window.innerWidth - 280, r.left)) + 'px';
    pop.createDiv({ cls: 'crm-colpick-h', text: T`Filtra: ${label}` });
    const inp = pop.createEl('input', { type: 'text', placeholder: T('contiene…'), cls: 'crm-colpick-s' });
    inp.value = this.colFilters[key] || '';
    const apply = () => { if (inp.value.trim()) this.colFilters[key] = inp.value.trim(); else delete this.colFilters[key]; this.renderKpi(); this.renderToolbar(); this.renderList(); };
    const close = () => { pop.remove(); document.removeEventListener('mousedown', away, true); };
    const away = (e) => { if (!pop.contains(e.target)) close(); };
    setTimeout(() => document.addEventListener('mousedown', away, true), 0);
    inp.addEventListener('input', () => { apply(); });
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === 'Escape') { close(); } });
    setTimeout(() => { inp.focus(); inp.select(); }, 0);
  }

  applyPins(t, keys, pinned) {
    const heads = [...t.querySelectorAll('thead th')];
    const stickyIdx = [0, 1, ...keys.map((k, i) => (pinned.includes(k) ? i + 2 : -1)).filter((i) => i >= 0)];
    let left = 0;
    stickyIdx.forEach((ci, n) => {
      const th = heads[ci]; if (!th) return;
      const w = th.offsetWidth;
      for (const row of t.rows) { const cell = row.cells[ci]; if (!cell) continue; cell.addClass('crm-sticky'); cell.style.left = left + 'px'; if (n === stickyIdx.length - 1) cell.addClass('crm-sticky-last'); }
      left += w;
    });
  }

  columnPicker(anchor, keys, onPick) {
    document.querySelectorAll('.crm-colpick').forEach((n) => n.remove());
    const pop = document.body.createDiv('crm-colpick');
    const r = anchor.getBoundingClientRect();
    pop.style.top = (r.bottom + 6) + 'px';
    pop.style.left = Math.max(8, Math.min(window.innerWidth - 280, r.right - 270)) + 'px';
    const inp = pop.createEl('input', { type: 'search', placeholder: T('Cerca un campo…'), cls: 'crm-colpick-s' });
    const box = pop.createDiv('crm-colpick-list');
    const free = allColKeys().filter((k) => !keys.includes(k) && colDef(k));
    const draw = () => {
      box.empty();
      const q = norm(inp.value);
      const hit = free.filter((k) => !q || norm(colDef(k).label).includes(q));
      if (!hit.length) box.createDiv({ cls: 'crm-muted', text: T('Nessun campo') });
      for (const k of hit) { const it = box.createDiv({ cls: 'crm-colpick-item', text: colDef(k).label }); it.addEventListener('click', () => { close(); onPick(k); }); }
    };
    const close = () => { pop.remove(); document.removeEventListener('mousedown', away, true); document.removeEventListener('keydown', esc, true); };
    const away = (e) => { if (!pop.contains(e.target)) close(); };
    const esc = (e) => { if (e.key === 'Escape') close(); };
    setTimeout(() => { document.addEventListener('mousedown', away, true); document.addEventListener('keydown', esc, true); }, 0);
    inp.addEventListener('input', draw); draw(); setTimeout(() => inp.focus(), 0);
  }

  bulkBar(el, picked, list) {
    const p = this.plugin, n = picked.length;
    const bar = el.createDiv('crm-bulkbar');
    bar.createSpan({ cls: 'crm-bulk-count', text: n === 1 ? T`1 contatto selezionato: ${picked[0].name}` : T`${n} contatti selezionati` });
    const btn = (icon, label, fn, cls) => { const b = bar.createEl('button', { cls: 'crm-bulk-btn' + (cls ? ' ' + cls : '') }); setIcon(b.createSpan('crm-bulk-ico'), icon); b.createSpan({ text: label }); b.addEventListener('click', fn); return b; };
    const done = () => { this.checked.clear(); this.refresh(); };
    btn('check', T('Contattato oggi'), async () => { for (const c of picked) await p.markContacted(c); new Notice(n === 1 ? T`${picked[0].name}: ultimo contatto = oggi` : T`${n} contatti: ultimo contatto = oggi`); this.refresh(); });
    if (n === 1) btn('message-square-plus', T('Interazione'), () => new InteractionModal(this.app, p, picked[0]).open());
    const sub = (m, title, icon, key, vals) => {
      const apply = async (v) => {
        for (const c of picked) {
          if (key === 'relazione') { const cur = c.l('relazione'); if (!c.rels.some((r) => nv(r.label) === nv(v) && !r.company)) await p.saveContact(c.file, { relazione: [...cur, v] }); }
          else await p.saveContact(c.file, { [key]: v });
        }
        this.refresh();
      };
      let sm = null;
      m.addItem((it) => { it.setTitle(title).setIcon(icon); if (typeof it.setSubmenu === 'function') sm = it.setSubmenu(); });
      if (sm) for (const v of vals) sm.addItem((i2) => i2.setTitle(cap(v)).onClick(() => apply(v)));
      else for (const v of vals) m.addItem((i2) => i2.setTitle(`${title}: ${cap(v)}`).onClick(() => apply(v)));
    };
    btn('pencil', T('Modifica'), (e) => {
      if (n === 1) { new ContactModal(this.app, p, picked[0], () => this.refresh()).open(); return; }
      const m = new Menu();
      sub(m, T('Aggiungi relazione'), 'users', 'relazione', PRESETS.relazione);
      sub(m, T('Vicinanza'), 'heart', 'vicinanza', PRESETS.vicinanza);
      sub(m, T('Priorità'), 'flag', 'priorita', PRESETS.priorita);
      sub(m, T('Stato'), 'activity', 'stato', PRESETS.stato);
      m.showAtMouseEvent(e);
    });
    btn('calendar-plus', T('Calendario'), (e) => p.calendarMenu(picked, e));
    btn('trash', T('Elimina'), () => new BulkDeleteModal(this.app, p, picked, done).open(), 'is-danger');
    if (n === 1) btn('maximize-2', T('Apri scheda'), () => p.openRecord(picked[0].file));
    btn('chevron-down', T('Altro'), (e) => {
      const m = new Menu();
      const allArch = picked.every((c) => c.archived);
      m.addItem((i) => i.setTitle(allArch ? T('Ripristina') : T('Archivia')).setIcon('archive').onClick(async () => { for (const c of picked) await p.setArchived(c, !allArch); this.checked.clear(); this.refresh(); }));
      if (n === 1) {
        const c = picked[0];
        for (const [icon, label, kind, val] of [['mail', T('Email'), 'email', c.s('email') || c.s('emaillavoro')], ['phone', T('Chiama'), 'tel', c.s('telefono')], ['message-circle', 'WhatsApp', 'whatsapp', c.s('whatsapp') || c.s('telefono')], ['link', 'LinkedIn', 'linkedin', c.s('linkedin')], ['at-sign', 'Instagram', 'instagram', c.s('instagram')]]) {
          const href = val && linkFor(kind, val);
          if (href) m.addItem((i) => i.setTitle(label).setIcon(icon).onClick(() => window.open(href, '_blank')));
        }
        m.addItem((i) => i.setTitle(T('Apri nota')).setIcon('file-text').onClick(() => this.app.workspace.getLeaf('tab').openFile(c.file)));
      } else {
        const mails = picked.map((c) => c.s('email') || c.s('emaillavoro')).filter(Boolean);
        if (mails.length) m.addItem((i) => i.setTitle(T`Copia ${mails.length} email`).setIcon('mail').onClick(() => p.copyText(mails.join(', '), T('Email copiate'))));
      }
      m.addItem((i) => i.setTitle(T('Esporta CSV')).setIcon('download').onClick(() => this.exportCSV(picked)));
      m.showAtMouseEvent(e);
    });
    const x = bar.createEl('button', { cls: 'clickable-icon crm-bulk-x', attr: { 'aria-label': T('Deseleziona'), title: T('Deseleziona') } });
    setIcon(x, 'x'); if (!x.querySelector('svg')) x.setText('✕');
    x.addEventListener('click', () => { this.checked.clear(); this.renderList(); });
  }

  renderTable(el, list) {
    const pickedNow = list.filter((c) => this.checked.has(c.file.path));
    if (pickedNow.length) this.bulkBar(el, pickedNow, list);
    const wrap = el.createDiv('crm-table-wrap');
    const t = wrap.createEl('table', { cls: 'crm-table' });
    const cols = FIELD_CFG.tableCols.map((k) => colDef(k)).filter(Boolean);
    const hr = t.createEl('thead').createEl('tr');
    const hc = hr.createEl('th', { cls: 'crm-chk' }).createEl('input', { type: 'checkbox', attr: { 'aria-label': T('Seleziona tutti') } });
    hc.checked = list.length > 0 && list.every((c) => this.checked.has(c.file.path));
    hc.addEventListener('change', () => { for (const c of list) { if (hc.checked) this.checked.add(c.file.path); else this.checked.delete(c.file.path); } this.renderList(); });
    hr.createEl('th', { text: T('Contatto') });
    const keys = FIELD_CFG.tableCols.filter((k) => colDef(k));
    const cfgSave = async (arr) => { const p = this.plugin; p.settings.fields.tableCols = arr; await p.saveSettings(); applyFieldConfig(p.settings.fields); p.refreshViews(); };
    const pinned = (this.plugin.settings.pinnedCols || []).filter((k) => keys.includes(k));
    const setPins = async (arr) => { this.plugin.settings.pinnedCols = arr; await this.plugin.saveSettings(); this.renderList(); };
    keys.forEach((key, i) => {
      const th = hr.createEl('th', { cls: 'crm-th' + (pinned.includes(key) ? ' is-pinned' : ''), attr: { draggable: 'true', 'data-col': key } });
      const inner = th.createDiv('crm-th-in');
      const lab = inner.createSpan({ cls: 'crm-th-l', text: cols[i].label });
      if (this.colSort && this.colSort.key === key) { const si = inner.createSpan('crm-th-ico'); setIcon(si, this.colSort.dir === 'asc' ? 'arrow-up' : 'arrow-down'); }
      if (this.colFilters[key]) { const fi = inner.createSpan('crm-th-ico'); setIcon(fi, 'filter'); }
      if (pinned.includes(key)) { const pi = inner.createSpan('crm-th-ico'); setIcon(pi, 'pin'); }
      const setSort = (dir) => { this.colSort = (this.colSort && this.colSort.key === key && this.colSort.dir === dir) ? null : { key, dir }; this.renderList(); };
      lab.addEventListener('click', () => setSort(this.colSort && this.colSort.key === key && this.colSort.dir === 'asc' ? 'desc' : 'asc'));
      const mb = inner.createSpan({ cls: 'clickable-icon crm-th-menu', attr: { 'aria-label': T('Opzioni colonna') } }); mb.setText('⋮');
      mb.addEventListener('click', (e) => {
        e.stopPropagation();
        const m = new Menu();
        m.addItem((it) => it.setTitle(T('Ordine crescente')).setIcon('arrow-up').setChecked(!!(this.colSort && this.colSort.key === key && this.colSort.dir === 'asc')).onClick(() => setSort('asc')));
        m.addItem((it) => it.setTitle(T('Ordine decrescente')).setIcon('arrow-down').setChecked(!!(this.colSort && this.colSort.key === key && this.colSort.dir === 'desc')).onClick(() => setSort('desc')));
        m.addItem((it) => it.setTitle(T('Filtra per questa colonna')).setIcon('filter').onClick(() => this.columnFilter(th, key, cols[i].label)));
        if (this.colFilters[key]) m.addItem((it) => it.setTitle(T('Rimuovi filtro colonna')).setIcon('filter-x').onClick(() => { delete this.colFilters[key]; this.renderKpi(); this.renderToolbar(); this.renderList(); }));
        m.addSeparator();
        m.addItem((it) => it.setTitle(pinned.includes(key) ? T('Sblocca colonna') : T('Blocca colonna')).setIcon(pinned.includes(key) ? 'pin-off' : 'pin').onClick(() => setPins(pinned.includes(key) ? pinned.filter((x) => x !== key) : [...pinned, key])));
        m.addItem((it) => it.setTitle(T('Sposta a sinistra')).setIcon('arrow-left').setDisabled(i === 0).onClick(() => { const a = [...keys]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; cfgSave(a); }));
        m.addItem((it) => it.setTitle(T('Sposta a destra')).setIcon('arrow-right').setDisabled(i === keys.length - 1).onClick(() => { const a = [...keys]; [a[i + 1], a[i]] = [a[i], a[i + 1]]; cfgSave(a); }));
        m.addItem((it) => it.setTitle(T('Aggiungi colonna')).setIcon('plus').onClick(() => this.columnPicker(th, keys, (k) => { const a = [...keys]; a.splice(i + 1, 0, k); cfgSave(a); })));
        m.addSeparator();
        m.addItem((it) => it.setTitle(T('Rimuovi colonna')).setIcon('x').onClick(() => cfgSave(keys.filter((x) => x !== key))));
        m.showAtMouseEvent(e);
      });
      th.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/kith-col', key); e.dataTransfer.effectAllowed = 'move'; });
      th.addEventListener('dragover', (e) => { if (e.dataTransfer.types.includes('text/kith-col')) { e.preventDefault(); th.addClass('is-over'); } });
      th.addEventListener('dragleave', () => th.removeClass('is-over'));
      th.addEventListener('drop', (e) => {
        e.preventDefault(); th.removeClass('is-over');
        const from = e.dataTransfer.getData('text/kith-col');
        if (!from || from === key) return;
        const a = keys.filter((x) => x !== from); a.splice(a.indexOf(key) + (keys.indexOf(from) < i ? 1 : 0), 0, from); cfgSave(a);
      });
    });
    const addTh = hr.createEl('th', { cls: 'crm-th-add' });
    const addBtn = addTh.createSpan({ cls: 'clickable-icon', attr: { 'aria-label': T('Aggiungi colonna'), title: T('Aggiungi colonna') } }); setIcon(addBtn, 'plus');
    addBtn.addEventListener('click', (e) => { e.stopPropagation(); this.columnPicker(addBtn, keys, (k) => cfgSave([...keys, k])); });
    const tb = t.createEl('tbody');
    for (const c of list) {
      const tr = tb.createEl('tr', { cls: 'crm-row' + (this.selected === c.file.path ? ' is-selected' : '') });
      const ck = tr.createEl('td', { cls: 'crm-chk' }).createEl('input', { type: 'checkbox' });
      ck.checked = this.checked.has(c.file.path);
      ck.addEventListener('click', (e) => e.stopPropagation());
      ck.addEventListener('change', () => { if (ck.checked) this.checked.add(c.file.path); else this.checked.delete(c.file.path); this.renderList(); });
      const n = tr.createEl('td').createDiv('crm-namecell');
      this.avatar(n, c);
      const nt = n.createDiv('crm-nametext');
      nt.createDiv({ cls: 'crm-name', text: c.name });
      for (const col of cols) col.cell(this, tr.createEl('td'), c);
      tr.createEl('td', { cls: 'crm-th-add' });
      tr.addEventListener('click', (e) => { if (e.target.closest && (e.target.closest('.crm-nametext') || e.target.closest('.crm-avatar'))) this.plugin.openRecord(c.file); else this.select(c.file.path); });
      tr.addEventListener('dblclick', () => this.plugin.openRecord(c.file));
      tr.addEventListener('contextmenu', (e) => this.contactMenu(e, c));
    }
    requestAnimationFrame(() => { try { this.applyPins(t, keys, pinned); } catch (e) { /* layout non pronto */ } });
    const picked = list.filter((c) => this.checked.has(c.file.path));
    const foot = el.createDiv('crm-foot');
    const left = foot.createDiv('crm-foot-l');
    left.createSpan({ cls: 'crm-foot-count', text: `${list.length} ${T(list.length === 1 ? 'contatto' : 'contatti')}` });
    const exp = foot.createEl('button', { cls: 'crm-btn', text: T('Esporta CSV') });
    exp.addEventListener('click', () => this.exportCSV(picked.length ? picked : list));
  }

  exportCSV(list) {
    const fields = FIELDS.filter((f) => !f.internal && (!isHidden(f.k) || f.k === 'nome' || f.k === 'cognome'));
    const q = (v) => `"${String(v == null ? '' : v).replace(/"/g, '""')}"`;
    const rows = [fields.map((f) => q(f.label)).join(',')];
    for (const c of list) rows.push(fields.map((f) => q(f.type === 'list' || f.type === 'companylist' ? c.l(f.k).join(' | ') : c.s(f.k))).join(','));
    const blob = new Blob(['\ufeff' + rows.join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'kith-contacts.csv';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    new Notice(`${list.length} ${T('contatti esportati')}`);
  }

  quickActions(parent, c) {
    const bar = parent.createDiv('crm-qa');
    const add = (icon, title, href) => {
      if (!href) return;
      const a = bar.createEl('a', { cls: 'crm-qa-btn', href, attr: { 'aria-label': title, target: '_blank', rel: 'noopener' } });
      setIcon(a, icon);
      a.addEventListener('click', (e) => e.stopPropagation());
    };
    add('mail', T('Email'), linkFor('email', c.s('email') || c.s('emaillavoro')));
    add('phone', T('Chiama'), linkFor('tel', c.s('telefono')));
    add('message-circle', 'WhatsApp', linkFor('whatsapp', c.s('whatsapp') || c.s('telefono')));
    add('link', 'LinkedIn', linkFor('linkedin', c.s('linkedin')));
    add('at-sign', 'Instagram', linkFor('instagram', c.s('instagram')));
  }

  renderCards(el, list) {
    const grid = el.createDiv('crm-grid');
    for (const c of list) {
      const card = grid.createDiv({ cls: 'crm-card' + (this.selected === c.file.path ? ' is-selected' : '') });
      const top = card.createDiv('crm-card-top');
      this.avatar(top, c, 'lg');
      const nt = top.createDiv('crm-nametext');
      nt.createDiv({ cls: 'crm-name', text: c.name });
      nt.createDiv({ cls: 'crm-sub', text: this.subline(c) });
      const tags = card.createDiv('crm-card-tags');
      this.relBadges(tags, c);
      this.priChip(tags, c);
      const meta = card.createDiv('crm-card-meta');
      if (c.s('citta')) meta.createDiv({ text: '📍 ' + c.s('citta') });
      meta.createDiv({ text: T('Ultimo contatto: ') + (c.due.last ? relTime(c.due.last) : '—') });
      const fu = meta.createDiv();
      fu.createSpan({ text: T('Follow-up: ') });
      this.dueChip(fu, c);
      if (c.bday && c.bday.days <= this.plugin.settings.birthdayWindow) {
        meta.createDiv({ cls: 'crm-bday', text: `🎂 ${c.bday.days === 0 ? T('oggi!') : T('tra ') + c.bday.days + T(' gg')}` });
      }
      this.quickActions(card, c);
      card.addEventListener('click', () => this.plugin.openRecord(c.file));
      card.addEventListener('contextmenu', (e) => this.contactMenu(e, c));
    }
  }

  renderKanban(el, list) {
    const key = this.groupBy;
    const cols = new Map();
    for (const p of (PRESETS[key] || [])) cols.set(norm(p), { title: cap(p), value: p, items: [] });
    const none = { title: T('Non assegnato'), value: '', items: [] };
    for (const c of list) {
      const v = c.s(key);
      if (!v) { none.items.push(c); continue; }
      if (!cols.has(norm(v))) cols.set(norm(v), { title: cap(dv(v)), value: v, items: [] });
      cols.get(norm(v)).items.push(c);
    }
    const all = [...cols.values(), none].filter((col) => col.items.length || col.value !== '' || true);
    const board = el.createDiv('crm-board');
    for (const col of all) {
      const ce = board.createDiv('crm-col');
      const head = ce.createDiv('crm-col-head');
      head.createSpan({ cls: 'crm-col-title', text: col.title });
      head.createSpan({ cls: 'crm-col-count', text: String(col.items.length) });
      const body = ce.createDiv('crm-col-body');
      ce.addEventListener('dragover', (e) => { e.preventDefault(); ce.addClass('is-over'); });
      ce.addEventListener('dragleave', () => ce.removeClass('is-over'));
      ce.addEventListener('drop', async (e) => {
        e.preventDefault(); ce.removeClass('is-over');
        const path = e.dataTransfer.getData('text/plain');
        const f = this.app.vault.getAbstractFileByPath(path);
        if (f instanceof TFile) {
          if (key === 'relazione') { const cc = this.all.find((x) => x.file.path === path); const rest = cc ? cc.l('relazione').slice(1) : []; await this.plugin.saveContact(f, { relazione: col.value ? [col.value, ...rest] : rest }); }
          else await this.plugin.saveContact(f, { [key]: col.value });
          new Notice(T`Spostato in “${col.title}”`);
        }
      });
      for (const c of col.items) {
        const k = body.createDiv({ cls: 'crm-kcard' + (this.selected === c.file.path ? ' is-selected' : ''), attr: { draggable: 'true' } });
        k.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', c.file.path); e.dataTransfer.effectAllowed = 'move'; });
        const r = k.createDiv('crm-card-top');
        this.avatar(r, c);
        const nt = r.createDiv('crm-nametext');
        nt.createDiv({ cls: 'crm-name', text: c.name });
        nt.createDiv({ cls: 'crm-sub', text: this.subline(c) });
        const f = k.createDiv('crm-kfoot');
        this.dueChip(f, c);
        this.priChip(f, c);
        k.addEventListener('click', () => this.plugin.openRecord(c.file));
        k.addEventListener('contextmenu', (e) => this.contactMenu(e, c));
      }
    }
  }

  /* ── dettaglio ── */
  renderDetail() {
    const d = this.detailEl;
    d.empty();
    const c = this.selected && this.all.find((x) => x.file.path === this.selected);
    if (!c) {
      if (this.selected && Date.now() - this.selAt < 4000) { d.createDiv({ cls: 'crm-muted', text: T('Caricamento…') }); return; }
      this.selected = null;
      this.rootEl.removeClass('has-selection');
      this.renderAgenda(d);
      return;
    }
    const back = d.createEl('button', { cls: 'crm-back', text: T('← Elenco') });
    back.addEventListener('click', () => this.select(null));

    const head = d.createDiv('crm-d-head');
    this.avatar(head, c, 'xl');
    head.createDiv({ cls: 'crm-d-name', text: c.name });
    if (c.s('soprannome')) head.createDiv({ cls: 'crm-sub', text: `“${c.s('soprannome')}”` });
    head.createDiv({ cls: 'crm-sub', text: this.subline(c) });
    const tags = head.createDiv('crm-card-tags');
    this.relBadges(tags, c);
    this.badge(tags, c.s('vicinanza') && T`vicinanza ${dv(c.s('vicinanza'))}`);
    this.priChip(tags, c);
    if (c.archived) this.badge(tags, T('archiviato'), 'crm-pri crm-pri-bassa');
    this.quickActions(head, c);

    const acts = d.createDiv('crm-d-actions');
    const act = (text, cls, fn) => { const b = acts.createEl('button', { cls: 'crm-btn ' + cls, text }); b.addEventListener('click', fn); };
    act(T('✓ Contattato oggi'), 'crm-btn-primary', async () => {
      await this.plugin.markContacted(c);
      new Notice(T`${c.name}: ultimo contatto = oggi`);
    });
    act(T('+ Interazione'), '', () => new InteractionModal(this.app, this.plugin, c).open());
    act(T('Apri scheda completa'), '', () => this.plugin.openRecord(c.file));
    act(T('Modifica'), '', () => new ContactModal(this.app, this.plugin, c, () => {}).open());
    act(T('Calendario'), '', (e) => this.plugin.calendarMenu([c], e));
    act(T('Apri nota'), '', () => this.app.workspace.getLeaf('tab').openFile(c.file));
    act(T('Elimina'), 'crm-btn-danger', () => this.plugin.removeContact(c));

    const sec = (title) => { const s = d.createDiv('crm-sec'); s.createDiv({ cls: 'crm-sec-title', text: title }); return s; };
    const row = (s, label, val, kind) => {
      if (!val) return;
      const r = s.createDiv('crm-kv');
      r.dataset.label = label; r.dataset.value = val;
      r.createSpan({ cls: 'crm-k', text: label });
      const v = r.createSpan('crm-v');
      const href = kind ? linkFor(kind, val) : null;
      if (href) v.createEl('a', { text: val, href, attr: { target: '_blank', rel: 'noopener' } });
      else if (kind === 'person') {
        val.split(/\s*[|,;]\s*/).filter(Boolean).forEach((nm, i) => {
          if (i) v.appendText(', ');
          const pc = this.plugin.findPerson(nm, c.file);
          if (pc) { const a = v.createEl('a', { cls: 'crm-int-title', text: pc.name }); a.addEventListener('click', (ev) => { ev.preventDefault(); ev.stopPropagation(); this.plugin.openRecord(pc.file); }); }
          else v.appendText(nm);
        });
      }
      else v.setText(val);
    };

    const s1 = sec(T('Contatti'));
    if (!isHidden('email')) row(s1, FL('email', T('Email')), c.s('email'), 'email');
    if (!isHidden('emaillavoro')) row(s1, FL('emaillavoro', T('Email lavoro')), c.s('emaillavoro'), 'email');
    if (!isHidden('telefono')) row(s1, FL('telefono', T('Telefono')), c.s('telefono'), 'tel');
    if (!isHidden('whatsapp')) row(s1, FL('whatsapp', 'WhatsApp'), c.s('whatsapp'), 'whatsapp');
    if (!isHidden('instagram')) row(s1, FL('instagram', 'Instagram'), c.s('instagram'), 'instagram');
    if (!isHidden('linkedin')) row(s1, FL('linkedin', 'LinkedIn'), c.s('linkedin'), 'linkedin');
    if (!isHidden('canale')) row(s1, FL('canale', T('Canale preferito')), cap(dv(c.s('canale'))));

    const s2 = sec(T('Relazione'));
    if (!isHidden('ultimocontatto')) row(s2, FL('ultimocontatto', T('Ultimo contatto')), c.due.last ? `${fmtDate(c.due.last)} · ${relTime(c.due.last)}` : '');
    if (c.due.due && !isHidden('prossimofollowup')) {
      const r = s2.createDiv('crm-kv');
      r.createSpan({ cls: 'crm-k', text: T('Prossimo contatto') });
      const v = r.createSpan('crm-v');
      this.dueChip(v, c);
      v.createSpan({ cls: 'crm-muted', text: ` (${c.due.source === 'frequenza' ? T('frequenza') : T('follow-up')})` });
    }
    if (!isHidden('frequenza')) row(s2, FL('frequenza', T('Frequenza')), cap(dv(c.s('frequenza'))));
    if (!isHidden('quandocontattare')) row(s2, FL('quandocontattare', T('Quando contattare')), c.s('quandocontattare'));
    if (!isHidden('conosciutidove')) row(s2, FL('conosciutidove', T('Conosciuti dove')), c.s('conosciutidove'));
    if (!isHidden('conosciutiquando')) row(s2, FL('conosciutiquando', T('Conosciuti quando')), c.s('conosciutiquando'));
    if (!isHidden('conosciutitramite')) row(s2, FL('conosciutitramite', T('Conosciuti tramite')), c.s('conosciutitramite'));

    const s3 = sec(T('Personale'));
    if (c.bday && !isHidden('compleanno')) {
      const bp = parseDate(c.raw(FM.compleanno));
      const age = c.bday.ageNow != null ? T` · ${c.bday.ageNow} anni` : '';
      const when = c.bday.days === 0 ? T('oggi! 🎂') : T`tra ${c.bday.days} gg`;
      row(s3, FL('compleanno', T('Compleanno')), `${fmtParts(bp) || [bp.d, bp.m, bp.y].filter(Boolean).map(pad).join('/')}${age} · ${when}`);
      if (this.plugin.settings.gcal.enabled) {
        const kv = s3.querySelector('.crm-kv:last-child .crm-v');
        if (kv) {
          const done = hasGcalMark(c);
          const gb = kv.createEl('button', { cls: 'crm-btn crm-mini', text: done ? T('✓ In Google Calendar') : T('+ Google Calendar') });
          gb.addEventListener('click', () => this.plugin.openBirthday(this.plugin.birthdayInfo(c)));
        }
      }
    }
    if (!isHidden('citta')) row(s3, FL('citta', T('Città')), [c.s('citta'), c.s('paese')].filter(Boolean).join(', '));
    if (!isHidden('partner')) row(s3, FL('partner', T('Partner')), c.s('partner'), 'person');
    if (!isHidden('figli')) row(s3, FL('figli', T('Figli')), c.l('figli').join(', '));
    if (!isHidden('lingue')) row(s3, FL('lingue', T('Lingue')), c.l('lingue').join(', '));

    const s4 = sec(T('Lavoro'));
    if (!isHidden('ruolo')) row(s4, FL('ruolo', T('Ruolo')), c.s('ruolo'));
    const az = c.s('azienda');
    if (az && !isHidden('azienda')) {
      const r = s4.createDiv('crm-kv');
      r.dataset.label = T('Azienda'); r.dataset.value = az;
      r.createSpan({ cls: 'crm-k', text: T('Azienda') });
      const a = r.createEl('a', { cls: 'internal-link crm-v', text: az });
      a.addEventListener('click', (e) => { e.preventDefault(); this.app.workspace.openLinkText(az, c.file.path, 'tab'); });
    }
    if (!isHidden('aziendepassate')) row(s4, FL('aziendepassate', T('Aziende passate')), c.l('aziendepassate').join(', '));
    if (!isHidden('settore')) row(s4, FL('settore', T('Settore')), c.s('settore'));
    if (!isHidden('competenze')) row(s4, FL('competenze', T('Competenze')), c.l('competenze').join(', '));

    const s5 = sec(T('Rete'));
    if (!isHidden('puoaiutarmi')) row(s5, FL('puoaiutarmi', T('Può aiutarmi con')), c.s('puoaiutarmi'));
    if (!isHidden('possoaiutarlo')) row(s5, FL('possoaiutarlo', T('Posso aiutarlo con')), c.s('possoaiutarlo'));
    if (!isHidden('favoriricevuti')) row(s5, FL('favoriricevuti', T('Favori ricevuti')), c.s('favoriricevuti'));
    if (!isHidden('favoridati')) row(s5, FL('favoridati', T('Favori dati')), c.s('favoridati'));
    const ints = c.l('interessi');
    if (ints.length && !isHidden('interessi')) {
      const tg = s5.createDiv('crm-tags');
      for (const i of ints) this.badge(tg, i);
    }

    const custom = FIELDS.filter((f) => f.custom && !isHidden(f.k));
    if (custom.length) {
      const sc = sec(T('Altri campi'));
      for (const f of custom) {
        const val = (f.type === 'list' || f.type === 'companylist') ? c.l(f.k).join(', ') : c.s(f.k);
        if (f.type === 'longtext' && val) { sc.createDiv({ cls: 'crm-k', text: f.label }); sc.createDiv({ cls: 'crm-note', text: val }); } else row(sc, f.label, val);
      }
    }

    if (c.s('note') && !isHidden('note')) { const sn = sec(T('Note')); sn.createDiv({ cls: 'crm-note', text: c.s('note') }); }

    const si = sec(T('Interazioni recenti'));
    const list = this.plugin.getInteractions(c).slice(0, 6);
    if (!list.length) si.createDiv({ cls: 'crm-muted', text: T('Nessuna interazione registrata.') });
    for (const it of list) {
      const r = si.createDiv('crm-int');
      r.createSpan({ cls: 'crm-int-date', text: fmtDate(it.date) });
      if (it.tipo) this.badge(r, it.tipo);
      const a = r.createEl('a', { cls: 'crm-int-title', text: it.file.basename });
      a.addEventListener('click', (e) => { e.preventDefault(); this.app.workspace.getLeaf('tab').openFile(it.file); });
    }
  }

  /* ── menu contestuali (tasto destro) ── */
  contactText(c) {
    const lines = [c.name];
    const sub = this.subline(c);
    if (sub) lines.push(sub);
    for (const g of [...new Set(FIELDS.map((f) => f.group))]) {
      for (const f of FIELDS.filter((x) => !x.internal && x.group === g && !['nome', 'cognome'].includes(x.k) && !isHidden(x.k))) {
        const v = (f.type === 'list' || f.type === 'companylist') ? c.l(f.k).join(', ') : c.s(f.k);
        if (v) lines.push(`${f.label}: ${v}`);
      }
    }
    return lines.join('\n');
  }

  contactMenu(e, c) {
    e.preventDefault(); e.stopPropagation();
    const m = new Menu();
    m.addItem((i) => i.setTitle(T('Apri scheda')).setIcon('user').onClick(() => this.select(c.file.path)));
    m.addItem((i) => i.setTitle(T('Apri nota')).setIcon('file-text').onClick(() => this.app.workspace.getLeaf('tab').openFile(c.file)));
    m.addItem((i) => i.setTitle(T('Modifica')).setIcon('pencil').onClick(() => new ContactModal(this.app, this.plugin, c, () => {}).open()));
    m.addSeparator();
    m.addItem((i) => i.setTitle(T('Contattato oggi')).setIcon('check').onClick(async () => { await this.plugin.markContacted(c); new Notice(T`${c.name}: ultimo contatto = oggi`); }));
    m.addItem((i) => i.setTitle(T('Registra interazione')).setIcon('message-square-plus').onClick(() => new InteractionModal(this.app, this.plugin, c).open()));
    m.addSeparator();
    m.addItem((i) => i.setTitle(T('Copia scheda completa')).setIcon('copy').onClick(() => this.plugin.copyText(this.contactText(c), T('Scheda copiata'))));
    m.addItem((i) => i.setTitle(T('Copia nome')).setIcon('copy').onClick(() => this.plugin.copyText(c.name, T('Nome copiato'))));
    for (const [k, label] of [['email', T('email')], ['telefono', T('telefono')], ['emaillavoro', T('email lavoro')]]) {
      const v = c.s(k);
      if (v) m.addItem((i) => i.setTitle(T`Copia ${label}`).setIcon('copy').onClick(() => this.plugin.copyText(v, T`${cap(label)} copiata`)));
    }
    m.addSeparator();
    m.addItem((i) => i.setTitle(c.archived ? T('Ripristina') : T('Archivia')).setIcon(c.archived ? 'archive-restore' : 'archive').onClick(() => this.plugin.setArchived(c, !c.archived)));
    m.addItem((i) => i.setTitle(T('Elimina…')).setIcon('trash').onClick(() => this.plugin.removeContact(c)));
    m.showAtMouseEvent(e);
  }

  onDetailContext(e) {
    const c = this.selected && this.all.find((x) => x.file.path === this.selected);
    if (!c) return;
    e.preventDefault();
    const m = new Menu();
    const row = e.target.closest && e.target.closest('.crm-kv');
    const sel = window.getSelection ? String(window.getSelection()).trim() : '';
    if (sel) m.addItem((i) => i.setTitle(T('Copia selezione')).setIcon('copy').onClick(() => this.plugin.copyText(sel, T('Copiato'))));
    if (row && row.dataset.value) {
      const { label, value } = row.dataset;
      m.addItem((i) => i.setTitle(T`Copia ${label.toLowerCase()}`).setIcon('copy').onClick(() => this.plugin.copyText(value, T`${label} copiato`)));
      m.addItem((i) => i.setTitle(T`Copia “${label}: …”`).setIcon('copy').onClick(() => this.plugin.copyText(`${label}: ${value}`, T('Copiato'))));
      m.addSeparator();
    }
    m.addItem((i) => i.setTitle(T('Copia scheda completa')).setIcon('copy').onClick(() => this.plugin.copyText(this.contactText(c), T('Scheda copiata'))));
    m.addItem((i) => i.setTitle(T('Copia nome')).setIcon('copy').onClick(() => this.plugin.copyText(c.name, T('Nome copiato'))));
    m.addSeparator();
    m.addItem((i) => i.setTitle(T('Modifica')).setIcon('pencil').onClick(() => new ContactModal(this.app, this.plugin, c, () => {}).open()));
    m.addItem((i) => i.setTitle(c.archived ? T('Ripristina') : T('Archivia')).setIcon(c.archived ? 'archive-restore' : 'archive').onClick(() => this.plugin.setArchived(c, !c.archived)));
    m.addItem((i) => i.setTitle(T('Elimina…')).setIcon('trash').onClick(() => this.plugin.removeContact(c)));
    m.showAtMouseEvent(e);
  }

  renderAgenda(d) {
    const act = this.all.filter((c) => !c.archived);
    const win = this.plugin.settings.birthdayWindow;
    d.createDiv({ cls: 'crm-d-name', text: T('Agenda') });
    d.createDiv({ cls: 'crm-sub', text: T('Seleziona un contatto per vedere la scheda completa.') });
    const block = (title, items, render) => {
      const s = d.createDiv('crm-sec');
      s.createDiv({ cls: 'crm-sec-title', text: title });
      if (!items.length) { s.createDiv({ cls: 'crm-muted', text: T('Tutto in ordine ✨') }); return; }
      for (const c of items.slice(0, 8)) {
        const r = s.createDiv('crm-agenda-row');
        this.avatar(r, c);
        r.createDiv({ cls: 'crm-name', text: c.name });
        render(r.createDiv('crm-agenda-right'), c);
        r.addEventListener('click', () => this.select(c.file.path));
        r.addEventListener('contextmenu', (e) => this.contactMenu(e, c));
      }
    };
    block(T('Follow-up scaduti'), act.filter((c) => c.due.state === 'scaduto').sort(SORTS.followup), (e, c) => this.dueChip(e, c));
    block(T('Prossimi 7 giorni'), act.filter((c) => c.due.state === 'presto').sort(SORTS.followup), (e, c) => this.dueChip(e, c));
    block(T('Compleanni in arrivo'), act.filter((c) => c.bday && c.bday.days <= win).sort(SORTS.compleanno),
      (e, c) => e.createSpan({ cls: 'crm-bday', text: c.bday.days === 0 ? T('🎂 oggi') : T`tra ${c.bday.days} gg` }));
  }
}

/* ───────────────────────── Modali ───────────────────────── */


/* swipe orizzontale a due dita = indietro (Obsidian non lo gestisce per le viste personalizzate) */
function installSwipeBack(view, goBack) {
  let acc = 0, lock = false, reset = null;
  view.registerDomEvent(view.contentEl, 'wheel', (e) => {
    if (lock || Math.abs(e.deltaX) < Math.abs(e.deltaY) * 1.5) return;
    for (let el = e.target; el && el !== view.contentEl; el = el.parentElement) {
      if (el.scrollWidth > el.clientWidth + 2) {
        const ov = getComputedStyle(el).overflowX;
        if ((ov === 'auto' || ov === 'scroll') && (e.deltaX < 0 ? el.scrollLeft > 0 : el.scrollLeft + el.clientWidth < el.scrollWidth - 1)) return;
      }
    }
    acc += e.deltaX;
    clearTimeout(reset); reset = setTimeout(() => { acc = 0; }, 250);
    if (acc < -140) { acc = 0; lock = true; setTimeout(() => { lock = false; }, 700); goBack(); }
  }, { passive: true });
}

/* ───────────────────────── Scheda a pagina intera ───────────────────────── */
class CRMRecordView extends ItemView {
  constructor(leaf, plugin) { super(leaf); this.navigation = true; this.plugin = plugin; this.path = null; this.stack = []; this.co = null; this.adding = new Set(); this._t = null; }
  getViewType() { return RECORD_TYPE; }
  getIcon() { return 'user-round'; }
  getDisplayText() { const c = this.contact(); return c ? c.name : T('Scheda'); }
  getState() { return { path: this.path, stack: this.stack, co: this.co }; }
  async setState(state, result) { if (!state || state.path !== this.path) this.adding = new Set(); this.path = state && state.path; this.stack = (state && state.stack) || []; this.co = (state && state.co) || null; await super.setState(state, result); this.render(); this.leaf.updateHeader && this.leaf.updateHeader(); }
  saveCols(rc) { this.plugin.settings.recordCols = { l: rc.l, r: rc.r }; this.plugin.saveData(this.plugin.settings); }
  async goBack() {
    const prev = this.stack[this.stack.length - 1];
    if (prev) await this.leaf.setViewState({ type: RECORD_TYPE, active: true, state: { path: prev, stack: this.stack.slice(0, -1), co: this.co } });
    else if (this.co) await this.leaf.setViewState({ type: COMPANY_TYPE, active: true, state: { name: this.co, from: null } });
    else await this.leaf.setViewState({ type: VIEW_TYPE, active: true });
  }
  contact() { return this.path ? this.plugin.getContacts().find((x) => x.file.path === this.path) : null; }
  async onOpen() {
    this.contentEl.addClass('crm-root', 'crm-rec-root');
    installSwipeBack(this, () => this.goBack());
    const later = (f) => { if (f && f.path && (f.path === this.path || f.path.startsWith(normalizePath(this.plugin.settings.interazioniFolder) + '/'))) { clearTimeout(this._t); this._t = setTimeout(() => this.render(), 350); } };
    this.registerEvent(this.app.metadataCache.on('changed', later));
    this.registerEvent(this.app.vault.on('rename', later));
    this.render();
    this.plugin.syncSidebar();
  }
  render() {
    const root = this.contentEl; if (!root.hasClass('crm-rec-root')) return;
    root.empty();
    const c = this.contact();
    if (!c) { root.createDiv({ cls: 'crm-muted crm-rec-empty', text: T('Caricamento…') }); return; }
    const all = this.plugin.getContacts();
    const bar = root.createDiv('crm-rec-bar');
    const goBack = () => this.goBack();
    bar.createEl('button', { cls: 'crm-btn', text: (this.stack.length || this.co) ? T('← Indietro') : T('← Kith') }).addEventListener('click', goBack);
    const wrap = root.createDiv('crm-rec');
    const rc = Object.assign({ l: 22, r: 22 }, this.plugin.settings.recordCols || {});
    wrap.style.setProperty('--lf', rc.l); wrap.style.setProperty('--rf', rc.r);
    const handle = (side) => {
      const h = wrap.createDiv({ cls: 'crm-rec-handle h-' + side, attr: { 'aria-label': T('Trascina per ridimensionare'), role: 'separator' } });
      h.addEventListener('dblclick', () => { rc[side] = 22; wrap.style.setProperty(side === 'l' ? '--lf' : '--rf', 22); this.saveCols(rc); });
      h.addEventListener('pointerdown', (e) => {
        e.preventDefault(); h.setPointerCapture(e.pointerId); h.addClass('is-drag');
        const W = wrap.clientWidth, x0 = e.clientX, start = rc[side];
        const move = (ev) => {
          const dx = (ev.clientX - x0) / W * 100;
          let v = side === 'l' ? start + dx : start - dx;
          const other = side === 'l' ? rc.r : rc.l;
          v = Math.max(14, Math.min(v, Math.min(46, 68 - other)));
          rc[side] = Math.round(v * 10) / 10;
          wrap.style.setProperty(side === 'l' ? '--lf' : '--rf', rc[side]);
        };
        const up = () => { h.removeClass('is-drag'); h.removeEventListener('pointermove', move); h.removeEventListener('pointerup', up); h.releasePointerCapture && h.releasePointerCapture(e.pointerId); this.saveCols(rc); };
        h.addEventListener('pointermove', move); h.addEventListener('pointerup', up);
      });
    };
    handle('l'); handle('r');
    const openRec = (x) => this.plugin.openRecord(x.file);

    /* sinistra: identità e dati chiave */
    const left = wrap.createDiv('crm-rec-col crm-rec-left');
    const card = left.createDiv('crm-rec-card crm-d-head');
    const av = this.avatar(card, c, 'xl');
    av.addClass('crm-av-edit'); av.setAttr('aria-label', T('Cambia foto'));
    const pick = card.createEl('input', { type: 'file', attr: { accept: 'image/*', style: 'display:none' } });
    pick.addEventListener('change', async () => { const f = pick.files && pick.files[0]; if (f) { await this.plugin.setPhoto(c, f); } });
    av.addEventListener('click', (e) => {
      const m = new Menu();
      m.addItem((it) => it.setTitle(T('Carica foto…')).setIcon('image-plus').onClick(() => pick.click()));
      if (this.plugin.igHandle(c)) m.addItem((it) => it.setTitle(T('Recupera da Instagram')).setIcon('at-sign').onClick(() => this.plugin.fetchInstagramPhoto(c)));
      m.addItem((it) => it.setTitle(T('Incolla immagine dagli appunti')).setIcon('clipboard-paste').onClick(() => this.plugin.photoFromClipboard(c)));
      m.addItem((it) => it.setTitle(T('Incolla link immagine…')).setIcon('link').onClick(() => new TextPromptModal(this.app, T('Link o percorso dell’immagine'), 'https://…', '', async (v) => { if (v && /^https?:/.test(v)) { const ok = await this.plugin.photoFromUrl(c, v).catch(() => false); if (!ok) new Notice(T('Immagine non scaricabile da questo link')); } }).open()));
      if (c.s('foto')) m.addItem((it) => it.setTitle(T('Rimuovi foto')).setIcon('trash').onClick(async () => { await this.plugin.saveContact(c.file, { foto: '' }); }));
      m.showAtMouseEvent(e);
    });
    card.createDiv({ cls: 'crm-d-name', text: c.name });
    if (c.s('soprannome')) card.createDiv({ cls: 'crm-sub', text: `“${c.s('soprannome')}”` });
    card.createDiv({ cls: 'crm-sub', text: this.subline(c) });
    const tags = card.createDiv('crm-card-tags');
    this.relBadges(tags, c);
    this.badge(tags, c.s('vicinanza') && T`vicinanza ${dv(c.s('vicinanza'))}`);
    this.priChip(tags, c);
    if (c.archived) this.badge(tags, T('archiviato'), 'crm-pri crm-pri-bassa');
    this.quickActions(card, c);
    const acts = card.createDiv('crm-d-actions');
    const act = (text, cls, fn) => acts.createEl('button', { cls: 'crm-btn ' + cls, text }).addEventListener('click', fn);
    act(T('✓ Contattato oggi'), 'crm-btn-primary', async () => { await this.plugin.markContacted(c); new Notice(T`${c.name}: ultimo contatto = oggi`); });
    act(T('Modifica'), '', () => new ContactModal(this.app, this.plugin, c, () => {}).open());
    act(T('Apri nota'), '', () => this.app.workspace.getLeaf('tab').openFile(c.file));

    const mid = wrap.createDiv('crm-rec-col crm-rec-mid');
    const shown = FIELDS.filter((f) => !f.internal && (!isHidden(f.k) || f.k === 'nome' || f.k === 'cognome'));
    const groups = [...new Set(shown.map((f) => f.group))];
    const pool = all;
    const initOf = (f) => {
      let v = (f.type === 'list' || f.type === 'companylist') ? c.l(f.k).join(' | ') : c.s(f.k);
      if (f.type === 'date' && v) { const pd = parseDate(v); if (pd && fmtParts(pd)) v = fmtParts(pd); }
      return v;
    };
    const showOf = (f) => {
      const v = (f.type === 'list' || f.type === 'companylist') ? c.l(f.k).join(', ') : c.s(f.k);
      if (!v) return '';
      if (f.type === 'date') { const pd = parseDate(v); return (pd && fmtParts(pd)) || v; }
      return f.type === 'enum' ? cap(dv(v)) : v;
    };
    const save = async (f, raw) => {
      const v = raw.trim();
      if (v === initOf(f)) { this.adding.delete(f.k); this.render(); return; }
      let val = v;
      if (f.type === 'date' && v) { const pd = parseDate(v); val = (pd && toIsoParts(pd)) || v; }
      else if (f.type === 'list' || f.type === 'companylist') val = toList(v);
      try { await this.plugin.saveContact(c.file, { [f.k]: val }); new Notice(T('Contatto aggiornato')); }
      catch (e) { console.error(e); new Notice(T('Errore nel salvataggio: ') + e.message); }
      this.adding.delete(f.k);
      setTimeout(() => this.render(), 400);
    };
    const editor = (host, f) => {
      const w = host.createDiv('crm-form-item crm-rec-edit');
      const long = f.type === 'longtext';
      const inp = long ? w.createEl('textarea', { attr: { rows: '4' } }) : w.createEl('input', { type: 'text' });
      inp.value = initOf(f);
      if (f.type === 'date') inp.placeholder = datePh();
      if (f.type === 'list' || f.type === 'companylist') inp.placeholder = T('valori separati da |');
      const sopts = suggestOptions(this.plugin, f, pool, c);
      if (sopts) attachCombo(w, inp, sopts, { multi: f.type === 'companylist' || f.k === 'relazione' });
      let done = false;
      const finish = (ok) => { if (done) return; done = true; if (ok) save(f, inp.value); else { this.adding.delete(f.k); this.render(); } };
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !w.querySelector('.crm-combo-list.is-open')) { e.preventDefault(); finish(false); }
        else if (e.key === 'Enter' && (!long || e.metaKey || e.ctrlKey) && !w.querySelector('.crm-combo-item.is-sel')) { e.preventDefault(); finish(true); }
      });
      inp.addEventListener('blur', () => setTimeout(() => finish(true), 120));
      setTimeout(() => { inp.focus(); inp.select && inp.select(); }, 0);
    };
    const groupCard = (parent, g) => {
      const fs = shown.filter((f) => f.group === g && f.k !== 'note');
      const card = parent.createDiv('crm-rec-card');
      const head = card.createDiv('crm-rec-head');
      head.createSpan({ cls: 'crm-rec-h', text: g });
      const rows = card.createDiv('crm-rec-rows');
      let n = 0;
      for (const f of fs) {
        const val = showOf(f), editing = this.adding.has(f.k);
        if (!val && !editing) continue;
        n++;
        const r = rows.createDiv('crm-kv crm-rec-kv');
        r.createSpan({ cls: 'crm-k', text: f.label });
        const host = r.createSpan('crm-v');
        if (editing) { editor(host, f); continue; }
        const kind = { email: 'email', emaillavoro: 'email', telefono: 'tel', whatsapp: 'whatsapp', instagram: 'instagram', linkedin: 'linkedin' }[f.k];
        const href = kind ? linkFor(kind, val) : null;
        if (href) host.createEl('a', { text: val, href, attr: { target: '_blank', rel: 'noopener' } });
        else if (f.k === 'relazione') {
          const box = host.createDiv('crm-card-tags'); this.relBadges(box, c);
        }
        else if (f.k === 'citta') {
          const a = host.createEl('a', { cls: 'crm-int-title', text: val, attr: { 'aria-label': T`Mostra tutte le persone a ${val}` } });
          a.addEventListener('click', (ev) => { ev.preventDefault(); ev.stopPropagation(); this.plugin.navigate({ reset: true, toggle: { key: 'citta', v: c.s('citta') } }); });
        }
        else if (f.k === 'azienda' || f.k === 'aziendepassate') {
          const names = (f.k === 'azienda' ? [c.s('azienda')] : c.l('aziendepassate')).map((x) => String(x || '').replace(/^\[\[|\]\]$/g, '').split('|').pop().trim()).filter(Boolean);
          names.forEach((nm, i) => { if (i) host.appendText(', '); const a = host.createEl('a', { cls: 'crm-int-title', text: nm }); a.addEventListener('click', (ev) => { ev.preventDefault(); ev.stopPropagation(); this.plugin.openCompany(nm, c.file.path); }); });
        }
        else if (f.type === 'person') {
          val.split(/\s*[|,;]\s*/).filter(Boolean).forEach((nm, i) => {
            if (i) host.appendText(', ');
            const pc = this.plugin.findPerson(nm, c.file);
            if (pc) { const a = host.createEl('a', { cls: 'crm-int-title', text: pc.name }); a.addEventListener('click', (ev) => { ev.preventDefault(); ev.stopPropagation(); openRec(pc); }); }
            else host.appendText(nm);
          });
        }
        else host.createSpan({ text: val });
        if (f.k === 'compleanno' && c.bday) {
          const cb = host.createEl('button', { cls: 'crm-btn crm-mini crm-cal-btn', attr: { title: T('Calendario: compleanni e follow-up') } });
          setIcon(cb.createSpan('crm-bulk-ico'), 'calendar-plus'); cb.createSpan({ text: hasGcalMark(c) ? T('✓ In calendario') : T('Aggiungi al calendario') });
          cb.addEventListener('click', (ev) => { ev.stopPropagation(); this.plugin.calendarMenu([c], ev); });
        }
        const pen = r.createSpan({ cls: 'crm-rec-pen clickable-icon', attr: { 'aria-label': T('Modifica') } }); setIcon(pen, 'pencil');
        pen.addEventListener('click', () => { this.adding.add(f.k); this.render(); });
        host.addEventListener('dblclick', () => { this.adding.add(f.k); this.render(); });
      }
      const empty = fs.filter((f) => !showOf(f) && !this.adding.has(f.k));
      if (empty.length) {
        const add = head.createEl('button', { cls: 'clickable-icon crm-rec-add', attr: { 'aria-label': T('Aggiungi campo') } });
        setIcon(add, 'plus');
        add.addEventListener('click', (e) => {
          const m = new Menu();
          for (const f of empty) m.addItem((it) => it.setTitle(f.label).onClick(() => { this.adding.add(f.k); this.render(); }));
          m.showAtMouseEvent(e);
        });
      }
      if (!n && !empty.length) card.remove();
      return card;
    };
    const gIdx = (name) => groups.indexOf(name);
    const leftGroups = [T('Contatti'), T('Anagrafica')].filter((g) => gIdx(g) >= 0);
    for (const g of leftGroups) groupCard(left, g);
    if (c.due.due) { const r = left.createDiv('crm-rec-card'); const kv = r.createDiv('crm-kv'); kv.createSpan({ cls: 'crm-k', text: T('Prossimo contatto') }); this.dueChip(kv.createSpan('crm-v'), c); }

    /* centro: cronologia, note, altri gruppi */
    const tl = mid.createDiv('crm-rec-card');
    const th = tl.createDiv('crm-rec-head');
    th.createSpan({ cls: 'crm-rec-h', text: T('Cronologia') });
    th.createEl('button', { cls: 'crm-btn', text: T('+ Interazione') }).addEventListener('click', () => new InteractionModal(this.app, this.plugin, c).open());
    const ints = this.plugin.getInteractions(c);
    if (!ints.length) tl.createDiv({ cls: 'crm-muted', text: T('Nessuna interazione registrata.') });
    for (const it of ints) {
      const r = tl.createDiv('crm-int crm-rec-int');
      r.createSpan({ cls: 'crm-int-date', text: fmtDate(it.date) });
      if (it.tipo) this.badge(r, it.tipo);
      const a = r.createEl('a', { cls: 'crm-int-title', text: it.file.basename });
      a.addEventListener('click', (e) => { e.preventDefault(); this.app.workspace.getLeaf('tab').openFile(it.file); });
    }
    const nf = shown.find((f) => f.k === 'note');
    if (nf) {
      const n = mid.createDiv('crm-rec-card');
      const nh = n.createDiv('crm-rec-head'); nh.createSpan({ cls: 'crm-rec-h', text: nf.label });
      if (this.adding.has('note')) editor(n, nf);
      else {
        const v = c.s('note');
        if (v) n.createDiv({ cls: 'crm-note', text: v });
        else n.createDiv({ cls: 'crm-muted', text: '—' });
        const pen = nh.createEl('button', { cls: 'clickable-icon crm-rec-add', attr: { 'aria-label': T('Modifica') } }); setIcon(pen, 'pencil');
        pen.addEventListener('click', () => { this.adding.add('note'); this.render(); });
      }
    }
    for (const g of groups) if (!leftGroups.includes(g)) groupCard(mid, g);
    const cust = mid.createEl('button', { cls: 'crm-btn crm-rec-newfield', text: '+ ' + T('Nuovo campo personalizzato') });
    cust.addEventListener('click', () => new CustomizeModal(this.app, this.plugin).open());

    /* destra: persone collegate */
    const right = wrap.createDiv('crm-rec-col crm-rec-right');
    const person = (parent, x) => {
      const r = parent.createDiv('crm-rec-person'); r.tabIndex = 0;
      this.avatar(r, x);
      const t = r.createDiv('crm-nametext'); t.createDiv({ cls: 'crm-name', text: x.name }); t.createDiv({ cls: 'crm-sub', text: x.s('ruolo') || x.s('relazione') });
      r.addEventListener('click', () => openRec(x));
      r.addEventListener('keydown', (e) => { if (e.key === 'Enter') openRec(x); });
    };
    const cleanCo = (v) => String(v || '').replace(/^\[\[|\]\]$/g, '').split('|').pop().trim();
    const coCur = [...new Set((c.l('azienda') || []).map(cleanCo).filter(Boolean))];
    if (!coCur.length && c.s('azienda')) coCur.push(cleanCo(c.s('azienda')));
    const coPast = [...new Set((c.l('aziendepassate') || []).map(cleanCo).filter(Boolean))].filter((x) => !coCur.some((y) => norm(y) === norm(x)));
    const coRel = [...new Set(c.rels.map((r) => r.company).filter(Boolean))].filter((x) => ![...coCur, ...coPast].some((y) => norm(y) === norm(x)));
    const coList = [...coCur, ...coPast, ...coRel];
    const rel = (x, k) => (x.l(k) || []).map((v) => norm(cleanCo(v)));
    const coOf = (x) => ({ cur: [...rel(x, 'azienda'), ...(x.s('azienda') ? [norm(cleanCo(x.s('azienda')))] : [])], past: rel(x, 'aziendepassate') });
    if (coList.length) {
      const cc = right.createDiv('crm-rec-card');
      const ch = cc.createDiv('crm-rec-head');
      ch.createSpan({ cls: 'crm-rec-h', text: T('Aziende') });
      for (const co of coList) {
        const isPast = coPast.includes(co) || coRel.includes(co), k = norm(co);
        const peers = all.filter((x) => { if (x === c || x.archived) return false; const o = coOf(x); return o.cur.includes(k) || o.past.includes(k) || x.rels.some((r) => norm(r.company) === k); });
        const box = cc.createDiv('crm-co');
        const head = box.createDiv('crm-co-head'); head.tabIndex = 0;
        setIcon(head.createSpan('crm-co-ico'), 'building-2');
        const cn = head.createEl('a', { cls: 'crm-co-name', text: co }); cn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); this.plugin.openCompany(co, c.file.path); });
        if (isPast) head.createSpan({ cls: 'crm-co-past', text: coRel.includes(co) ? (c.rels.find((r) => norm(r.company) === norm(co)) || {}).label : T('Passata') });
        head.createSpan({ cls: 'crm-co-count', text: String(peers.length), attr: { title: T('Altri contatti in questa azienda') } });
        const tools = head.createSpan('crm-co-tools');
        const tb = (icon, tip, fn) => { const b = tools.createSpan({ cls: 'clickable-icon crm-co-btn', attr: { 'aria-label': tip, title: tip } }); setIcon(b, icon); b.addEventListener('click', (e) => { e.stopPropagation(); fn(); }); };
        tb('table', T('Mostra tutte le persone in Kith'), () => this.plugin.navigate({ reset: true, toggle: { key: 'azienda', v: co } }));
        const note = this.app.metadataCache.getFirstLinkpathDest(co, '');
        if (note) tb('file-text', T('Apri nota azienda'), () => this.app.workspace.getLeaf('tab').openFile(note));
        const list = box.createDiv('crm-co-list');
        if (!peers.length) list.createDiv({ cls: 'crm-muted', text: T('Nessun altro contatto') });
        for (const x of peers) {
          person(list, x);
          const o = coOf(x);
          if (!o.cur.includes(k)) { const sub = list.lastElementChild.querySelector('.crm-sub'); if (sub) sub.setText([x.s('ruolo'), T('ex')].filter(Boolean).join(' · ')); }
        }
        let open = !isPast;
        box.toggleClass('is-closed', !open);
        const toggle = () => { open = !open; box.toggleClass('is-closed', !open); };
        head.addEventListener('click', toggle);
        head.addEventListener('keydown', (e) => { if (e.key === 'Enter') toggle(); });
      }
    }
    const toks = (v) => String(v || '').split(/\s*[|,;]\s*/).map((t) => norm(t.replace(/^\[\[|\]\]$/g, ''))).filter(Boolean);
    const mine = toks(c.s('partner')), via = toks(c.s('conosciutitramite'));
    const isMe = (v) => toks(v).some((t) => t === norm(c.name) || t === norm(c.file.basename));
    const seen = new Map();
    const add = (x, why) => { if (x === c) return; if (!seen.has(x)) seen.set(x, []); if (!seen.get(x).includes(why)) seen.get(x).push(why); };
    for (const x of all) {
      if (x === c) continue;
      const nk = norm(x.name), bk = norm(x.file.basename);
      if (mine.some((t) => t === nk || t === bk)) add(x, T('Partner'));
      if (via.some((t) => t === nk || t === bk)) add(x, T('Te l’ha presentato/a'));
      if (isMe(x.s('conosciutitramite'))) add(x, T('Presentato/a da te'));
      if (isMe(x.s('partner'))) add(x, T('Partner'));
    }
    const lc = right.createDiv('crm-rec-card');
    lc.createDiv({ cls: 'crm-rec-h', text: T('Persone collegate') });
    if (!seen.size) lc.createDiv({ cls: 'crm-muted', text: T('Nessuna') });
    for (const [x, why] of seen) { person(lc, x); const last = lc.lastElementChild.querySelector('.crm-sub'); if (last) last.setText(why.join(' · ')); }
  }
}
for (const m of ['avatar', 'badge', 'relBadges', 'priChip', 'dueChip', 'quickActions', 'subline']) CRMRecordView.prototype[m] = CRMView.prototype[m];

/* ───────────────────────── Pagina azienda ───────────────────────── */
const miniView = (p) => { const v = Object.create(CRMView.prototype); v.plugin = p; v.app = p.app; return v; };
const coClean = (v) => String(v || '').replace(/^\[\[|\]\]$/g, '').split('|').pop().trim();
function companyPeople(plugin, name) {
  const k = norm(name);
  const cur = [], past = [], linked = [];
  for (const x of plugin.getContacts()) {
    const c1 = [x.s('azienda'), ...(x.l('azienda') || [])].map((v) => norm(coClean(v)));
    const p1 = (x.l('aziendepassate') || []).map((v) => norm(coClean(v)));
    if (c1.includes(k)) cur.push(x); else if (p1.includes(k)) past.push(x);
    else if (x.rels.some((r) => norm(r.company) === k)) linked.push(x);
  }
  return { cur, past, linked };
}
function allCompanyNames(plugin) {
  const m = new Map();
  for (const x of plugin.getContacts()) for (const v of [x.s('azienda'), ...(x.l('azienda') || []), ...(x.l('aziendepassate') || [])]) { const n = coClean(v); if (n && !m.has(norm(n))) m.set(norm(n), n); }
  return [...m.values()].sort((a, b) => a.localeCompare(b, LANG));
}
const CO_FIELDS = [
  { k: 'sito', label: () => T('Sito web'), keys: ['sitoweb', 'sito', 'website', 'url'], dk: () => (LANG === 'it' ? 'sito_web' : 'website'), kind: 'url' },
  { k: 'descrizione', label: () => T('Descrizione'), keys: ['descrizione', 'description', 'about'], dk: () => (LANG === 'it' ? 'descrizione' : 'description') },
  { k: 'linkedin', label: () => 'LinkedIn', keys: ['linkedin'], dk: () => 'linkedin', kind: 'linkedin' },
  { k: 'instagram', label: () => 'Instagram', keys: ['instagram'], dk: () => 'instagram', kind: 'instagram' },
  { k: 'settore', label: () => T('Settore'), keys: ['settore', 'industry'], dk: () => (LANG === 'it' ? 'settore' : 'industry'), derive: 'settore' },
  { k: 'citta', label: () => T('Città'), keys: ['citta', 'city'], dk: () => (LANG === 'it' ? 'citta' : 'city'), derive: 'citta' },
  { k: 'indirizzo', label: () => T('Indirizzo'), keys: ['indirizzo', 'address'], dk: () => (LANG === 'it' ? 'indirizzo' : 'address') },
  { k: 'telefono', label: () => T('Telefono'), keys: ['telefono', 'phone', 'tel'], dk: () => (LANG === 'it' ? 'telefono' : 'phone'), kind: 'tel' },
  { k: 'email', label: () => T('Email'), keys: ['email', 'mail'], dk: () => 'email', kind: 'email' },
];

/* ───────── Arricchimento automatico aziende (Wikidata + sito ufficiale) ───────── */
const CO_STOP = new Set(['srl', 'spa', 'sas', 'snc', 'inc', 'ltd', 'llc', 'gmbh', 'group', 'holding', 'italia', 'italy', 'the', 'di', 'and', 'co', 'company', 'corp', 'sa']);
const coTokens = (name) => String(name).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((t) => t && !CO_STOP.has(t));
async function httpText(url) {
  try {
    const r = await requestUrl({ url, throw: false, headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Kith-Obsidian)', 'Accept-Language': LANG === 'it' ? 'it,en;q=0.8' : 'en,it;q=0.6' } });
    return r.status >= 200 && r.status < 400 ? (r.text || '') : '';
  } catch (e) { return ''; }
}
async function httpJson(url) {
  try { const r = await requestUrl({ url, throw: false }); return r.status === 200 ? r.json : null; } catch (e) { return null; }
}
const wdApi = (params) => httpJson('https://www.wikidata.org/w/api.php?' + new URLSearchParams({ format: 'json', origin: '*', ...params }));
async function wikidataLookup(name) {
  const nk = norm(name);
  const s = await wdApi({ action: 'wbsearchentities', search: name, language: LANG, uselang: LANG, type: 'item', limit: '8' });
  const cands = ((s && s.search) || []).filter((c) => { const l = norm(c.label || ''); return l === nk || l.includes(nk) || nk.includes(l); }).slice(0, 5);
  if (!cands.length) return null;
  const ents = await wdApi({ action: 'wbgetentities', ids: cands.map((c) => c.id).join('|'), props: 'claims|descriptions', languages: 'it|en' });
  if (!ents || !ents.entities) return null;
  const val = (e, p) => ((e.claims && e.claims[p]) || []).map((c) => c.mainsnak && c.mainsnak.datavalue && c.mainsnak.datavalue.value).filter(Boolean);
  let pick = null;
  for (const c of cands) {
    const e = ents.entities[c.id]; if (!e) continue;
    if (val(e, 'P856').length) { pick = e; break; }
  }
  if (!pick) return null;
  const ids = [...val(pick, 'P452'), ...val(pick, 'P159')].map((v) => v && v.id).filter(Boolean);
  const labels = {};
  if (ids.length) {
    const l = await wdApi({ action: 'wbgetentities', ids: [...new Set(ids)].join('|'), props: 'labels', languages: LANG + '|en' });
    for (const [id, e] of Object.entries((l && l.entities) || {})) labels[id] = (e.labels && ((e.labels[LANG] || e.labels.en) || {}).value) || '';
  }
  const first = (p) => { const v = val(pick, p)[0]; return v && typeof v === 'object' && v.id ? (labels[v.id] || '') : (typeof v === 'string' ? v : ''); };
  const out = {
    sito: String(val(pick, 'P856')[0] || ''),
    settore: first('P452'),
    citta: first('P159'),
    telefono: String(val(pick, 'P1329')[0] || '').replace(/^tel:/i, ''),
    email: String(val(pick, 'P968')[0] || '').replace(/^mailto:/i, ''),
  };
  const li = val(pick, 'P4264')[0]; if (li) out.linkedin = 'https://www.linkedin.com/company/' + li;
  const ig = val(pick, 'P2003')[0]; if (ig) out.instagram = ig;
  return out;
}
const SKIP_DOMAINS = /(wikipedia|wikidata|linkedin|facebook|instagram|twitter|x\.com|youtube|crunchbase|bloomberg|glassdoor|indeed|paginegialle|pagine|tripadvisor|trustpilot|amazon|google|bing|duckduckgo|reddit|tiktok|pinterest)\./i;
function siteMatches(html, name, origin) {
  const toks = coTokens(name); if (!toks.length) return false;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const hay = norm([doc.title, (doc.querySelector('meta[property="og:site_name"]') || {}).content, origin].join(' ')).replace(/[^a-z0-9]/g, '');
  return hay.includes(toks[0]);
}
async function guessSite(name) {
  const toks = coTokens(name); if (!toks.length) return '';
  const slug = toks.join('');
  const doms = [...new Set([slug + '.com', slug + '.it', toks[0] + '.com', toks[0] + '.it'])].slice(0, 4);
  for (const d of doms) {
    const origin = 'https://www.' + d;
    const html = await httpText(origin);
    if (html && siteMatches(html, name, origin)) return origin;
  }
  return '';
}
async function searchSite(name) {
  const html = await httpText('https://html.duckduckgo.com/html/?q=' + encodeURIComponent(name + ' sito ufficiale'));
  if (!html) return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  for (const a of [...doc.querySelectorAll('a.result__a')].slice(0, 6)) {
    let href = a.getAttribute('href') || '';
    const m = href.match(/[?&]uddg=([^&]+)/); if (m) href = decodeURIComponent(m[1]);
    let u; try { u = new URL(href.startsWith('//') ? 'https:' + href : href); } catch (e) { continue; }
    if (SKIP_DOMAINS.test(u.hostname + '.')) continue;
    const origin = u.origin;
    const page = await httpText(origin);
    if (page && siteMatches(page, name, origin)) return origin;
  }
  return '';
}
function parseSitePage(html, origin, out) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const abs = (h) => { try { return new URL(h, origin).href; } catch (e) { return ''; } };
  const set = (k, v) => { v = String(v || '').replace(/\s+/g, ' ').trim(); if (v && !out[k]) out[k] = v; };
  // JSON-LD (schema.org)
  const walk = (n) => {
    if (!n || typeof n !== 'object') return;
    if (Array.isArray(n)) { n.forEach(walk); return; }
    const t = [].concat(n['@type'] || []).join(' ');
    if (/Organization|Corporation|LocalBusiness|Company|Store|NGO/i.test(t)) {
      set('descrizione', n.description); set('telefono', n.telephone); set('email', n.email);
      const ad = Array.isArray(n.address) ? n.address[0] : n.address;
      if (ad && typeof ad === 'object') { set('indirizzo', [ad.streetAddress, [ad.postalCode, ad.addressLocality].filter(Boolean).join(' ')].filter(Boolean).join(', ')); set('citta', ad.addressLocality); }
      else if (typeof ad === 'string') set('indirizzo', ad);
      for (const u of [].concat(n.sameAs || [])) { const s = String(u); if (/linkedin\.com\/company\//i.test(s)) set('linkedin', s.split('?')[0]); const ig = s.match(/instagram\.com\/([^/?#]+)/i); if (ig) set('instagram', ig[1]); }
      if (typeof n.logo === 'string') set('logo', abs(n.logo)); else if (n.logo && n.logo.url) set('logo', abs(n.logo.url));
    }
    if (n['@graph']) walk(n['@graph']);
  };
  for (const sc of doc.querySelectorAll('script[type="application/ld+json"]')) { try { walk(JSON.parse(sc.textContent)); } catch (e) { /* JSON-LD malformato */ } }
  // meta
  set('descrizione', (doc.querySelector('meta[property="og:description"]') || {}).content);
  set('descrizione', (doc.querySelector('meta[name="description"]') || {}).content);
  // link
  const hrefs = [...doc.querySelectorAll('a[href]')].map((a) => a.getAttribute('href') || '');
  const dom = new URL(origin).hostname.replace(/^www\./, '');
  const mails = hrefs.filter((h) => /^mailto:/i.test(h)).map((h) => decodeURIComponent(h.replace(/^mailto:/i, '').split('?')[0]).trim()).filter((m) => /@/.test(m) && !/noreply|no-reply|\.(png|jpg|gif)$/i.test(m));
  set('email', mails.find((m) => m.toLowerCase().endsWith(dom)) || mails[0]);
  set('telefono', (hrefs.find((h) => /^tel:/i.test(h)) || '').replace(/^tel:/i, ''));
  for (const h of hrefs) {
    const li = h.match(/linkedin\.com\/company\/[^/?#]+/i); if (li) set('linkedin', 'https://www.' + li[0].replace(/^.*?linkedin/i, 'linkedin'));
    const ig = h.match(/instagram\.com\/([^/?#]+)/i); if (ig && !/^(p|explore|reel|reels|accounts|tv|stories)$/i.test(ig[1])) set('instagram', ig[1]);
  }
  // logo
  const icon = doc.querySelector('link[rel="apple-touch-icon"], link[rel="apple-touch-icon-precomposed"]') || doc.querySelector('link[rel~="icon"]');
  if (icon && icon.getAttribute('href')) set('logo', abs(icon.getAttribute('href')));
  set('logo', abs((doc.querySelector('meta[property="og:image"]') || {}).content || ''));
  // indirizzo italiano nel testo
  if (!out.indirizzo) {
    const txt = (doc.body ? doc.body.textContent : '').replace(/\s+/g, ' ');
    const m = txt.match(/((?:Via|Viale|Piazza|Piazzale|Corso|Largo|Vicolo|Strada)\s+[^,\d]{2,50}?,?\s*\d{1,4}[A-Za-z]?)[\s,–-]+(\d{5})\s+([A-ZÀ-Ý][A-Za-zÀ-ÿ' ]{2,28})/);
    if (m) { set('indirizzo', `${m[1].trim().replace(/,$/, '')}, ${m[2]} ${m[3].trim()}`); set('citta', m[3].trim()); }
  }
}
async function scrapeSite(site) {
  let origin; try { origin = new URL(/^https?:/i.test(site) ? site : 'https://' + site).origin; } catch (e) { return {}; }
  const out = {};
  const home = await httpText(origin);
  if (home) parseSitePage(home, origin, out);
  for (const path of ['/contatti', '/contact', '/contacts', '/chi-siamo', '/about']) {
    if (out.email && out.telefono && out.indirizzo) break;
    const html = await httpText(origin + path);
    if (html) parseSitePage(html, origin, out);
  }
  return out;
}
async function enrichCompany(name, siteHint) {
  const found = {}, sources = [];
  let site = siteHint || '';
  if (!site) {
    const wd = await wikidataLookup(name);
    if (wd) { Object.assign(found, Object.fromEntries(Object.entries(wd).filter(([, v]) => v))); site = wd.sito || ''; sources.push('Wikidata'); }
  }
  if (!site) { site = await guessSite(name); if (!site) site = await searchSite(name); }
  if (site) {
    found.sito = found.sito || site;
    const sc = await scrapeSite(site);
    for (const [k, v] of Object.entries(sc)) if (v && !found[k]) found[k] = v;
    if (Object.keys(sc).length) sources.push(new URL(/^https?:/i.test(site) ? site : 'https://' + site).hostname.replace(/^www\./, ''));
  }
  return { found, sources };
}

function colHandle(wrap, rc, side, save) {
  const h = wrap.createDiv({ cls: 'crm-rec-handle h-' + side, attr: { 'aria-label': T('Trascina per ridimensionare'), role: 'separator' } });
  const prop = side === 'l' ? '--lf' : '--rf';
  h.addEventListener('dblclick', () => { rc[side] = 22; wrap.style.setProperty(prop, 22); save(); });
  h.addEventListener('pointerdown', (e) => {
    e.preventDefault(); h.setPointerCapture(e.pointerId); h.addClass('is-drag');
    const W = wrap.clientWidth, x0 = e.clientX, start = rc[side];
    const move = (ev) => {
      const dx = (ev.clientX - x0) / W * 100;
      let v = side === 'l' ? start + dx : start - dx;
      const other = side === 'l' ? rc.r : rc.l;
      v = Math.max(14, Math.min(v, Math.min(46, 68 - other)));
      rc[side] = Math.round(v * 10) / 10; wrap.style.setProperty(prop, rc[side]);
    };
    const up = () => { h.removeClass('is-drag'); h.removeEventListener('pointermove', move); h.removeEventListener('pointerup', up); try { h.releasePointerCapture(e.pointerId); } catch (er) { /* già rilasciato */ } save(); };
    h.addEventListener('pointermove', move); h.addEventListener('pointerup', up);
  });
}

const CO_SECTIONS = [['info', T('Informazioni')], ['summary', T('Riepilogo')], ['people', T('Persone')], ['past', T('Ex colleghi')], ['linked', T('Collegate via relazione')], ['timeline', T('Cronologia azienda')], ['note', T('Nota azienda')]];

class CRMCompanyView extends ItemView {
  constructor(leaf, plugin) { super(leaf); this.navigation = true; this.plugin = plugin; this.name = null; this.from = null; this.editing = null; this._t = null; this.enriching = false; this.status = ''; }
  getViewType() { return COMPANY_TYPE; }
  getIcon() { return 'building'; }
  getDisplayText() { return this.name || T('Azienda'); }
  getState() { return { name: this.name, from: this.from }; }
  async setState(state, result) { this.name = state && state.name; this.from = (state && state.from) || null; this.editing = null; await super.setState(state, result); this.render(); this.leaf.updateHeader && this.leaf.updateHeader(); }
  async onOpen() {
    this.contentEl.addClass('crm-root', 'crm-rec-root', 'crm-co-root');
    installSwipeBack(this, () => this.goBack());
    const later = (f) => { if (f && f.path) { clearTimeout(this._t); this._t = setTimeout(() => this.render(), 400); } };
    this.registerEvent(this.app.metadataCache.on('changed', later));
    this.registerEvent(this.app.vault.on('rename', later));
    this.registerEvent(this.app.vault.on('delete', later));
    this.render();
    this.plugin.syncSidebar();
  }
  note() { return this.plugin.findCompanyNote(this.name); }
  fmValue(f) {
    const file = this.note(); if (!file) return '';
    const fm = (this.app.metadataCache.getFileCache(file) || {}).frontmatter || {};
    for (const key of Object.keys(fm)) if (f.keys.includes(norm(key).replace(/\s|_/g, ''))) return toStr(fm[key]);
    return '';
  }
  async setFm(f, val) {
    let file = this.note();
    if (!file) { await this.plugin.ensureCompany(this.name, null, true); file = this.note(); }
    if (!file) return;
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      let key = Object.keys(fm).find((x) => f.keys.includes(norm(x).replace(/\s|_/g, ''))) || f.dk();
      if (val) fm[key] = val; else delete fm[key];
    });
    if (f.k === 'sito' && val) setTimeout(() => this.enrich(val, true), 200);
  }
  fmGet(keys) {
    const file = this.note(); if (!file) return '';
    const fm = (this.app.metadataCache.getFileCache(file) || {}).frontmatter || {};
    for (const key of Object.keys(fm)) if (keys.includes(norm(key).replace(/\s|_/g, ''))) return toStr(fm[key]);
    return '';
  }
  async writeFields(found, sources) {
    const entries = [...CO_FIELDS.filter((f) => found[f.k] && !this.fmValue(f)).map((f) => [f, found[f.k]])];
    if (found.logo && !this.fmGet(['logo'])) entries.push([{ keys: ['logo'], dk: () => 'logo' }, found.logo]);
    if (!entries.length) return 0;
    let file = this.note();
    if (!file) { await this.plugin.ensureCompany(this.name, null, true); file = this.note(); }
    if (!file) return 0;
    await this.app.fileManager.processFrontMatter(file, (fm) => {
      for (const [f, v] of entries) { const key = Object.keys(fm).find((x) => f.keys.includes(norm(x).replace(/\s|_/g, ''))) || f.dk(); if (!fm[key]) fm[key] = v; }
      fm[LANG === 'it' ? 'info_fonte' : 'info_source'] = `${sources.join(' + ')} · ${fmtDate(new Date())}`;
    });
    return entries.length;
  }
  async enrich(siteHint, manual) {
    if (this.enriching || !this.name) return;
    const name = this.name, key = norm(name);
    this.enriching = true; this.status = T('Recupero informazioni…'); this.render();
    let n = 0;
    try {
      const { found, sources } = await enrichCompany(name, siteHint);
      if (this.name === name) n = await this.writeFields(found, sources);
      this.plugin.settings.coEnrich[key] = { t: Date.now(), ok: n > 0 };
      this.plugin.saveData(this.plugin.settings);
      this.status = n ? T`Aggiunti ${n} campi (${sources.join(' + ')})` : (manual ? T('Nessuna nuova informazione trovata') : '');
    } catch (e) { console.error('Kith enrich', e); this.status = T('Recupero non riuscito'); }
    this.enriching = false;
    if (this.name === name) this.render();
  }
  maybeAutoEnrich() {
    const p = this.plugin;
    if (p.settings.autoEnrichCompanies === false || this.enriching || !this.name) return;
    const rec = p.settings.coEnrich[norm(this.name)];
    if (rec && Date.now() - rec.t < 30 * 86400000) return;
    if (this.fmValue(CO_FIELDS[0]) && this.fmValue(CO_FIELDS.find((f) => f.k === 'telefono')) && this.fmValue(CO_FIELDS.find((f) => f.k === 'email'))) return;
    setTimeout(() => this.enrich(this.fmValue(CO_FIELDS[0]) || '', false), 300);
  }
  async setLogo(val) {
    let file = this.note();
    if (!file) { if (!val) return; await this.plugin.ensureCompany(this.name, null, true); file = this.note(); }
    if (!file) return;
    await this.app.fileManager.processFrontMatter(file, (fm) => { if (val) fm.logo = val; else delete fm.logo; });
  }
  async setLogoFile(f) {
    let file = this.note();
    if (!file) { await this.plugin.ensureCompany(this.name, null, true); file = this.note(); }
    if (!file) return;
    const ext = (f.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '') || 'png';
    let path;
    try { path = await this.app.fileManager.getAvailablePathForAttachment(`${this.name} logo.${ext}`, file.path); }
    catch (e) { path = `${normalizePath(this.plugin.settings.aziendeFolder)}/${this.name} logo ${Date.now()}.${ext}`; }
    await this.app.vault.createBinary(path, await f.arrayBuffer());
    await this.setLogo(path);
  }
  layout() {
    const L = this.plugin.settings.coLayout || {};
    const eff = L[norm(this.name)] || L['*'] || {};
    return { hidden: new Set(eff.hidden || []), hiddenFields: new Set(eff.hiddenFields || []), own: !!L[norm(this.name)] };
  }
  async setLayout(lay) {
    const s = this.plugin.settings; s.coLayout = s.coLayout || {};
    s.coLayout[norm(this.name)] = { hidden: [...lay.hidden], hiddenFields: [...lay.hiddenFields] };
    await this.plugin.saveData(s); this.render();
  }
  layoutMenu(e) {
    const lay = this.layout(), s = this.plugin.settings;
    const m = new Menu();
    for (const [id, label] of CO_SECTIONS) m.addItem((it) => it.setTitle(label).setChecked(!lay.hidden.has(id)).onClick(() => { if (lay.hidden.has(id)) lay.hidden.delete(id); else lay.hidden.add(id); this.setLayout(lay); }));
    m.addSeparator();
    m.addItem((it) => it.setTitle(T('Usa questa disposizione per tutte le aziende')).setIcon('copy').onClick(async () => { s.coLayout = s.coLayout || {}; s.coLayout['*'] = { hidden: [...lay.hidden], hiddenFields: [...lay.hiddenFields] }; await this.plugin.saveData(s); new Notice(T('Disposizione salvata come predefinita')); }));
    if (lay.own) m.addItem((it) => it.setTitle(T('Ripristina questa pagina')).setIcon('rotate-ccw').onClick(async () => { delete s.coLayout[norm(this.name)]; await this.plugin.saveData(s); this.render(); }));
    if ((s.coLayout || {})['*']) m.addItem((it) => it.setTitle(T('Ripristina predefinito di tutte le aziende')).setIcon('eraser').onClick(async () => { delete s.coLayout['*']; await this.plugin.saveData(s); this.render(); }));
    m.showAtMouseEvent(e);
  }
  async goBack() {
    if (this.from) await this.leaf.setViewState({ type: RECORD_TYPE, active: true, state: { path: this.from, stack: [] } });
    else await this.leaf.setViewState({ type: VIEW_TYPE, active: true });
  }
  render() {
    const root = this.contentEl; if (!root.hasClass('crm-co-root')) return;
    root.empty();
    if (!this.name) { root.createDiv({ cls: 'crm-muted crm-rec-empty', text: T('Caricamento…') }); return; }
    const p = this.plugin, name = this.name;
    const { cur, past, linked } = companyPeople(p, name);
    const live = cur.filter((c) => !c.archived), archivedCur = cur.filter((c) => c.archived);
    const bar = root.createDiv('crm-rec-bar');
    bar.createEl('button', { cls: 'crm-btn', text: this.from ? T('← Indietro') : T('← Kith') }).addEventListener('click', () => this.goBack());
    const lay = this.layout();
    const cust = bar.createEl('button', { cls: 'crm-btn crm-co-cust', attr: { title: T('Personalizza questa pagina') } });
    setIcon(cust.createSpan('crm-bulk-ico'), 'sliders-horizontal'); cust.createSpan({ text: T('Personalizza pagina') });
    cust.addEventListener('click', (e) => this.layoutMenu(e));
    const wrap = root.createDiv('crm-co-page');
    const rc = Object.assign({ l: 22, r: 22 }, this.plugin.settings.coCols || {});
    wrap.style.setProperty('--lf', rc.l); wrap.style.setProperty('--rf', rc.r);
    const left = wrap.createDiv('crm-co-col co-left'), mid = wrap.createDiv('crm-co-col crm-co-mid co-mid'), right = wrap.createDiv('crm-co-col co-right');

    /* identità */
    const id = left.createDiv('crm-rec-card crm-d-head');
    const logo = id.createDiv('crm-co-logo');
    const logoRaw = this.fmGet(['logo']);
    const logoUrl = this.plugin.resolveImg(logoRaw, (this.note() || {}).path);
    const iconFallback = () => { logo.empty(); setIcon(logo, 'building-2'); if (!logo.querySelector('svg')) logo.setText(name.slice(0, 1).toUpperCase()); };
    if (logoUrl) { const im = logo.createEl('img', { attr: { src: logoUrl, alt: name } }); im.addEventListener('error', iconFallback); logo.addClass('has-img'); } else iconFallback();
    logo.addClass('crm-av-edit'); logo.setAttribute('title', T('Cambia logo'));
    const pickLogo = id.createEl('input', { type: 'file', attr: { accept: 'image/*', style: 'display:none' } });
    pickLogo.addEventListener('change', async () => { const f = pickLogo.files && pickLogo.files[0]; if (f) { await this.setLogoFile(f); this.render(); } });
    logo.addEventListener('click', (e) => {
      const m = new Menu();
      m.addItem((it) => it.setTitle(T('Carica immagine…')).setIcon('image-plus').onClick(() => pickLogo.click()));
      m.addItem((it) => it.setTitle(T('Incolla link immagine…')).setIcon('link').onClick(() => new TextPromptModal(this.app, T('Link o percorso dell’immagine'), 'https://…', /^https?:/.test(logoRaw) ? logoRaw : '', async (v) => { await this.setLogo(v); this.render(); }).open()));
      if (logoRaw) m.addItem((it) => it.setTitle(T('Rimuovi logo')).setIcon('trash').onClick(async () => { await this.setLogo(''); this.render(); }));
      m.showAtMouseEvent(e);
    });
    id.createDiv({ cls: 'crm-d-name', text: name });
    const descr = this.fmGet(['descrizione', 'description', 'about']);
    if (descr) id.createDiv({ cls: 'crm-sub crm-co-descr', text: descr });
    id.createDiv({ cls: 'crm-sub', text: `${live.length} ${T(live.length === 1 ? 'persona' : 'persone')}${past.length ? ` · ${past.length} ${T('ex')}` : ''}` });
    const acts = id.createDiv('crm-d-actions');
    const act = (text, cls, fn) => acts.createEl('button', { cls: 'crm-btn ' + cls, text }).addEventListener('click', fn);
    act(T('+ Persona'), 'crm-btn-primary', () => new ContactModal(this.app, p, null, async (f) => { await p.saveContact(f, { azienda: name }); this.render(); }).open());
    act(T('Mostra in Kith'), '', () => p.navigate({ reset: true, toggle: { key: 'azienda', v: name } }));
    const nf = this.note();
    act(this.enriching ? T('Recupero…') : T('Aggiorna info'), '', () => this.enrich(this.fmValue(CO_FIELDS[0]) || '', true));
    if (nf) act(T('Apri nota'), '', () => this.app.workspace.getLeaf('tab').openFile(nf));
    else act(T('Crea nota azienda'), '', async () => { await p.ensureCompany(name, null, true); this.render(); });
    if (this.status) id.createDiv({ cls: 'crm-muted crm-co-status', text: this.status });
    const srcInfo = this.fmGet(['infofonte', 'infosource']);
    if (srcInfo && !this.status) id.createDiv({ cls: 'crm-muted crm-co-status', text: T`Fonte: ${srcInfo}` });

    /* info */
    const info = left.createDiv('crm-rec-card'); info.dataset.section = 'info';
    info.createDiv({ cls: 'crm-rec-head' }).createSpan({ cls: 'crm-rec-h', text: T('Informazioni') });
    const top = (key) => { const m = new Map(); for (const c of live) { const v = c.s(key); if (v) m.set(v, (m.get(v) || 0) + 1); } return [...m.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || ''; };
    for (const f of CO_FIELDS) {
      if (lay.hiddenFields.has(f.k)) continue;
      const r = info.createDiv('crm-kv crm-rec-kv'); r.dataset.field = f.k;
      r.createSpan({ cls: 'crm-k', text: f.label() });
      const host = r.createSpan('crm-v');
      const val = this.fmValue(f);
      if (this.editing === f.k) {
        const inp = host.createEl('input', { type: 'text' }); inp.value = val;
        let done = false;
        const fin = async (ok) => { if (done) return; done = true; this.editing = null; if (ok && inp.value.trim() !== val) await this.setFm(f, inp.value.trim()); this.render(); };
        inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') fin(true); else if (e.key === 'Escape') fin(false); });
        inp.addEventListener('blur', () => fin(true));
        setTimeout(() => inp.focus(), 0);
        continue;
      }
      const hint = !val && f.derive ? top(f.derive) : '';
      if (f.k === 'citta' && (val || hint)) {
        const cityName = val || hint;
        const a = host.createEl('a', { cls: 'crm-int-title', text: cityName });
        a.addEventListener('click', (e) => { e.preventDefault(); this.plugin.navigate({ reset: true, toggle: { key: 'citta', v: cityName } }); });
        if (!val) host.createSpan({ cls: 'crm-muted crm-co-derived', text: ` (${T('dai contatti')})` });
        const pen2 = r.createSpan({ cls: 'crm-rec-pen clickable-icon', attr: { 'aria-label': T('Modifica') } }); setIcon(pen2, 'pencil');
        pen2.addEventListener('click', () => { this.editing = f.k; this.render(); });
        continue;
      }
      const href = val && f.kind ? (f.kind === 'url' ? (/^https?:/i.test(val) ? val : 'https://' + val) : linkFor(f.kind, val)) : null;
      if (href) host.createEl('a', { text: val, href, attr: { target: '_blank', rel: 'noopener' } });
      else if (val) host.setText(val);
      else if (hint) { host.createSpan({ cls: 'crm-muted', text: hint }); host.createSpan({ cls: 'crm-muted crm-co-derived', text: ` (${T('dai contatti')})` }); }
      else host.createSpan({ cls: 'crm-muted', text: '—' });
      const pen = r.createSpan({ cls: 'crm-rec-pen clickable-icon', attr: { 'aria-label': T('Modifica') } }); setIcon(pen, 'pencil');
      pen.addEventListener('click', () => { this.editing = f.k; this.render(); });
    }

    /* riepilogo */
    const sum = left.createDiv('crm-rec-card'); sum.dataset.section = 'summary';
    sum.createDiv({ cls: 'crm-rec-head' }).createSpan({ cls: 'crm-rec-h', text: T('Riepilogo') });
    const kv = (k, fn) => { const r = sum.createDiv('crm-kv'); r.createSpan({ cls: 'crm-k', text: k }); fn(r.createSpan('crm-v')); };
    const lasts = live.map((c) => c.due.last).filter(Boolean).sort((a, b) => b - a);
    kv(T('Ultimo contatto'), (v) => v.setText(lasts[0] ? `${fmtDate(lasts[0])} · ${relTime(lasts[0])}` : '—'));
    const nexts = live.filter((c) => c.due.due).sort((a, b) => a.due.due - b.due.due);
    kv(T('Prossimo follow-up'), (v) => { if (nexts[0]) { v.createSpan({ text: fmtDate(nexts[0].due.due) + ' · ' }); const a = v.createEl('a', { cls: 'crm-int-title', text: nexts[0].name }); a.addEventListener('click', (e) => { e.preventDefault(); p.openRecord(nexts[0].file); }); } else v.setText('—'); });
    const overdue = live.filter((c) => c.due.state === 'scaduto').length;
    kv(T('Follow-up scaduti'), (v) => v.setText(String(overdue)));
    const rel = new Map(); for (const c of live) for (const rr of c.rels) rel.set(rr.label, (rel.get(rr.label) || 0) + 1);
    if (rel.size) { const r = sum.createDiv('crm-card-tags'); for (const [k2, n] of [...rel.entries()].sort((a, b) => b[1] - a[1])) { const b = miniView(p).badge(r, k2); if (b) b.appendText(` ${n}`); } }

    /* persone */
    const peopleCard = (parent, title, list, isPast, secId) => {
      if (lay.hidden.has(secId)) return;
      const card = parent.createDiv('crm-rec-card'); card.dataset.section = secId;
      const h = card.createDiv('crm-rec-head'); h.createSpan({ cls: 'crm-rec-h', text: `${title} (${list.length})` });
      if (!list.length) { card.createDiv({ cls: 'crm-muted', text: T('Nessuna') }); return; }
      const wrapT = card.createDiv('crm-table-wrap'); const t = wrapT.createEl('table', { cls: 'crm-table crm-co-table' });
      const hr = t.createEl('thead').createEl('tr');
      for (const lab of [T('Contatto'), T('Ruolo'), T('Relazione'), T('Email'), T('Telefono'), T('Ultimo contatto'), T('Follow-up')]) hr.createEl('th', { text: lab });
      const tb = t.createEl('tbody');
      const view = miniView(p);
      for (const c of list) {
        const tr = tb.createEl('tr', { cls: 'crm-row' });
        const n = tr.createEl('td').createDiv('crm-namecell');
        view.avatar(n, c); n.createDiv('crm-nametext').createDiv({ cls: 'crm-name', text: c.name });
        n.addEventListener('click', () => p.openRecord(c.file, { company: name }));
        tr.createEl('td', { text: c.s('ruolo') || '—' });
        view.relBadges(tr.createEl('td'), c);
        const lk = (td, kind, val) => { const href = val && linkFor(kind, val); if (href) td.createEl('a', { cls: 'crm-cell-link', text: val, href, attr: { target: '_blank', rel: 'noopener' } }); else td.setText('—'); };
        lk(tr.createEl('td'), 'email', c.s('email') || c.s('emaillavoro'));
        lk(tr.createEl('td'), 'tel', c.s('telefono'));
        tr.createEl('td', { text: c.due.last ? relTime(c.due.last) : '—' });
        if (isPast) tr.createEl('td', { text: '—' }); else view.dueChip(tr.createEl('td'), c);
      }
    };
    peopleCard(mid, T('Persone'), [...live, ...archivedCur], false, 'people');
    if (past.length) peopleCard(mid, T('Ex colleghi'), past, true, 'past');
    if (linked.length) peopleCard(mid, T('Collegate via relazione'), linked, true, 'linked');

    /* cronologia aggregata */
    const tl = mid.createDiv('crm-rec-card'); tl.dataset.section = 'timeline';
    tl.createDiv({ cls: 'crm-rec-head' }).createSpan({ cls: 'crm-rec-h', text: T('Cronologia azienda') });
    const byPath = new Map([...cur, ...past, ...linked].map((c) => [c.file.path, c]));
    const entries = [];
    const folder = normalizePath(p.settings.interazioniFolder) + '/';
    for (const f of (lay.hidden.has('timeline') ? [] : this.app.vault.getMarkdownFiles())) {
      if (!f.path.startsWith(folder)) continue;
      const cache = this.app.metadataCache.getFileCache(f); if (!cache) continue;
      const ppl = new Set();
      for (const l of [...(cache.links || []), ...(cache.frontmatterLinks || [])]) { const d = this.app.metadataCache.getFirstLinkpathDest(String(l.link).split('#')[0], f.path); if (d && byPath.has(d.path)) ppl.add(d.path); }
      if (!ppl.size) continue;
      const fm = cache.frontmatter || {}; const nm = {}; for (const k2 of Object.keys(fm)) nm[norm(k2)] = fm[k2];
      entries.push({ file: f, tipo: toStr(nm.tipo || nm.type), date: toDate(parseDate(nm.data || nm.date)) || new Date(f.stat.ctime), ppl: [...ppl].map((x) => byPath.get(x)) });
    }
    entries.sort((a, b) => b.date - a.date);
    if (!entries.length) tl.createDiv({ cls: 'crm-muted', text: T('Nessuna interazione registrata.') });
    const view2 = miniView(p);
    for (const it of entries.slice(0, 40)) {
      const r = tl.createDiv('crm-int crm-rec-int');
      r.createSpan({ cls: 'crm-int-date', text: fmtDate(it.date) });
      if (it.tipo) view2.badge(r, it.tipo);
      const a = r.createEl('a', { cls: 'crm-int-title', text: it.file.basename });
      a.addEventListener('click', (e) => { e.preventDefault(); this.app.workspace.getLeaf('tab').openFile(it.file); });
      for (const c of it.ppl) { const chip = r.createSpan({ cls: 'crm-co-chip', text: c.name }); chip.addEventListener('click', () => p.openRecord(c.file)); }
    }

    /* note */
    const nc = right.createDiv('crm-rec-card'); nc.dataset.section = 'note';
    const nh = nc.createDiv('crm-rec-head'); nh.createSpan({ cls: 'crm-rec-h', text: T('Nota azienda') });
    const body = nc.createDiv('crm-note');
    if (nf) { this.app.vault.cachedRead(nf).then((txt) => { const t2 = txt.replace(/^---[\s\S]*?---\s*/, '').trim(); if (t2) body.setText(t2.slice(0, 1500)); else { body.className = 'crm-muted'; body.setText('—'); } }); }
    else { body.className = 'crm-muted'; body.setText(T('Nessuna nota. Creala dal pulsante a sinistra.')); }
    for (const card of [...root.querySelectorAll('[data-section]')]) {
      const id = card.dataset.section;
      if (lay.hidden.has(id)) { card.remove(); continue; }
      const head = card.querySelector('.crm-rec-head'); if (!head) continue;
      const tools = head.createSpan('crm-sec-tools');
      if (id === 'info' && lay.hiddenFields.size) {
        const plus = tools.createSpan({ cls: 'clickable-icon crm-sec-btn', attr: { 'aria-label': T('Aggiungi campo'), title: T('Aggiungi campo') } }); setIcon(plus, 'plus');
        plus.addEventListener('click', (e) => { const m = new Menu(); for (const f of CO_FIELDS.filter((x) => lay.hiddenFields.has(x.k))) m.addItem((it) => it.setTitle(f.label()).onClick(() => { lay.hiddenFields.delete(f.k); this.setLayout(lay); })); m.showAtMouseEvent(e); });
      }
      const x = tools.createSpan({ cls: 'clickable-icon crm-sec-btn', attr: { 'aria-label': T('Rimuovi sezione da questa pagina'), title: T('Rimuovi sezione da questa pagina') } }); setIcon(x, 'x');
      x.addEventListener('click', () => { lay.hidden.add(id); this.setLayout(lay); });
    }
    for (const r of [...root.querySelectorAll('[data-field]')]) {
      const fk = r.dataset.field;
      const hx = r.createSpan({ cls: 'crm-rec-pen clickable-icon', attr: { 'aria-label': T('Nascondi campo in questa pagina'), title: T('Nascondi campo in questa pagina') } }); setIcon(hx, 'eye-off');
      hx.addEventListener('click', () => { lay.hiddenFields.add(fk); this.setLayout(lay); });
    }
    const hasL = left.children.length > 0, hasR = right.children.length > 0;
    if (!hasL) left.remove(); if (!hasR) right.remove();
    wrap.toggleClass('no-left', !hasL); wrap.toggleClass('no-right', !hasR);
    const saveCols = () => { this.plugin.settings.coCols = { l: rc.l, r: rc.r }; this.plugin.saveData(this.plugin.settings); };
    if (hasL) colHandle(wrap, rc, 'l', saveCols);
    if (hasR) colHandle(wrap, rc, 'r', saveCols);
    this.maybeAutoEnrich();
  }
}

class CompanyPicker extends FuzzySuggestModal {
  constructor(app, names, onChoose) { super(app); this.names = names; this.onChoose = onChoose; this.setPlaceholder(T('Scegli un’azienda…')); }
  getItems() { return this.names; }
  getItemText(n) { return n; }
  onChooseItem(n) { this.onChoose(n); }
}

class KithSidebar extends ItemView {
  constructor(leaf, plugin) { super(leaf); this.plugin = plugin; this.closedGroups = new Set(); this.expand = new Set(); }
  getViewType() { return SIDE_TYPE; }
  getDisplayText() { return T('Kith'); }
  getIcon() { return 'users'; }
  async onOpen() {
    const root = this.contentEl;
    root.empty(); root.addClass('crm-side');
    root.createEl('h2', { cls: 'crm-side-title', text: T('Kith') });
    this.searchEl = root.createEl('input', { type: 'search', cls: 'crm-side-search', placeholder: T('Cerca contatti…') });
    this.searchEl.addEventListener('input', () => { const mv = this.mainView(); if (mv) mv.applyNav({ q: this.searchEl.value }); });
    this.searchEl.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !this.mainView()) this.plugin.navigate({ q: this.searchEl.value }); });
    this.bodyEl = root.createDiv('crm-side-body');
    this.update();
  }
  update() { try { this.render(); } catch (e) { console.error('Kith sidebar', e); if (this.bodyEl) { this.bodyEl.empty(); this.bodyEl.createEl('pre', { text: String((e && e.stack) || e) }); } } }
  mainView() { const l = this.plugin.app.workspace.getLeavesOfType(VIEW_TYPE)[0]; return l ? l.view : null; }
  render() {
    const p = this.plugin, root = this.bodyEl; if (!root) return;
    const top = this.contentEl.scrollTop;
    root.empty();
    const mv = this.mainView();
    const filters = mv ? mv.filters : { relazione: '', vicinanza: '', priorita: '', azienda: '', citta: '', stato: 'attivi' };
    const quick = mv ? mv.quick : '';
    if (mv && this.searchEl && document.activeElement !== this.searchEl && this.searchEl.value !== mv.q) this.searchEl.value = mv.q;
    const all = p.getContacts();
    const active = all.filter((c) => !c.archived);
    const win = p.settings.birthdayWindow;
    const facetOn = ['relazione', 'vicinanza', 'priorita', 'azienda', 'citta'].some((k) => filters[k]) || filters.stato !== 'attivi';
    const clean = !quick && !facetOn && !(mv && mv.q);
    const row = (parent, o) => {
      const r = parent.createDiv({ cls: 'crm-side-item' + (o.active ? ' is-active' : '') + (o.cls ? ' ' + o.cls : '') });
      r.tabIndex = 0;
      if (o.icon) setIcon(r.createSpan('crm-side-icon'), o.icon);
      r.createSpan({ cls: 'crm-side-label', text: o.label });
      if (o.count != null) r.createSpan({ cls: 'crm-side-count', text: String(o.count) });
      if (o.meta) r.createSpan({ cls: 'crm-side-meta' + (o.tone ? ' tone-' + o.tone : ''), text: o.meta });
      r.addEventListener('click', () => o.onClick());
      r.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); o.onClick(); } });
      return r;
    };
    const overdue = active.filter((c) => c.due.state === 'scaduto').sort(SORTS.followup);
    const bdays = active.filter((c) => c.bday && c.bday.days <= win).sort(SORTS.compleanno);
    const nav = root.createDiv('crm-side-section');
    const people = (list, key, metaFn, tone) => {
      if (!list.length) return;
      const sub = nav.createDiv('crm-side-sub');
      const open = this.expand.has(key), shown = open ? list : list.slice(0, 5);
      for (const c of shown) {
        const r = row(sub, { cls: 'is-person', label: c.name, meta: metaFn(c), tone, active: mv && mv.selected === c.file.path, onClick: () => p.focusContact(c.file) });
        const q = r.createSpan('crm-side-quick');
        const mk = (icon, tip, fn) => { const b = q.createEl('button', { cls: 'clickable-icon', attr: { 'aria-label': tip } }); setIcon(b, icon); b.addEventListener('click', (e) => { e.stopPropagation(); fn(); }); b.addEventListener('keydown', (e) => e.stopPropagation()); };
        mk('check', T('Contattato oggi'), () => p.markContacted(c));
        mk('message-square-plus', T('Registra interazione'), () => new InteractionModal(p.app, p, c).open());
      }
      if (list.length > 5) row(sub, { cls: 'is-more', label: open ? T('Mostra meno') : T`… e altri ${list.length - 5}`, onClick: () => { if (open) this.expand.delete(key); else this.expand.add(key); this.update(); } });
    };
    const item = (icon, label, count, on, onClick, always) => { if (count || on || always) row(nav, { icon, label, count, active: on, onClick }); };
    item('users', T('Contatti attivi'), active.length, clean, () => p.navigate({ reset: true }), true);
    item('alarm-clock', T('Follow-up scaduti'), overdue.length, quick === 'scaduti', () => p.navigate({ quick: 'scaduti' }));
    people(overdue, 'od', (c) => `${-c.due.days}${T(' gg')}`, 'danger');
    item('cake', T`Compleanni (${win} gg)`, bdays.length, quick === 'compleanni', () => p.navigate({ quick: 'compleanni' }));
    people(bdays, 'bd', (c) => (c.bday.days === 0 ? T('oggi') : T`tra ${c.bday.days} gg`), 'accent');
    item('star', T('Priorità alta'), active.filter((c) => cv(c.s('priorita')) === 'alta').length, quick === 'alta', () => p.navigate({ quick: 'alta' }));
    item('archive', T('Archiviati'), all.length - active.length, quick === 'archiviati', () => p.navigate({ quick: 'archiviati' }));

    const browse = root.createDiv('crm-side-section');
    const bh = browse.createDiv({ cls: 'crm-side-h crm-side-h-row' });
    bh.createSpan({ text: T('Esplora') });
    if (facetOn) { const x = bh.createEl('a', { cls: 'crm-side-clear', text: T('Azzera filtri') }); x.addEventListener('click', () => p.navigate({ reset: true })); }
    for (const [key, label] of [['relazione', T('Relazione')], ['vicinanza', T('Vicinanza')], ['priorita', T('Priorità')], ['azienda', T('Azienda')], ['citta', T('Città')], ['stato', T('Stato')]]) {
      const counts = new Map();
      for (const c of (key === 'stato' ? all : active)) {
        for (const v of (key === 'relazione' ? c.rels.map((r) => r.label) : [c.s(key)])) {
          if (!v) continue;
          const k = nv(v), e = counts.get(k);
          if (e) e.n++; else counts.set(k, { v: dv(v), n: 1 });
        }
      }
      if (!counts.size) continue;
      const g = browse.createEl('details', { cls: 'crm-side-group' });
      const sel = key === 'stato' ? (filters.stato !== 'attivi' && filters.stato !== 'tutti' ? filters.stato : '') : filters[key];
      g.open = !this.closedGroups.has(key) || !!sel;
      g.addEventListener('toggle', () => { if (g.open) this.closedGroups.delete(key); else this.closedGroups.add(key); });
      const sm = g.createEl('summary'); sm.createSpan({ text: label + (sel ? ': ' + cap(dv(sel)) : '') }); sm.createSpan({ cls: 'crm-side-count', text: String(counts.size) });
      if (sel) sm.addClass('has-filter');
      const vals = [...counts.values()].sort((a, b) => b.n - a.n || a.v.localeCompare(b.v));
      const fk = 'f-' + key, more = this.expand.has(fk), cut = !more && vals.length > 8 && !sel ? 8 : vals.length;
      for (const { v, n } of vals.slice(0, cut)) row(g, { label: cap(v), count: n, active: nv(sel || '') === nv(v), onClick: () => p.navigate({ toggle: { key, v } }) });
      if (vals.length > 8 && !sel) row(g, { cls: 'is-more', label: more ? T('Mostra meno') : T`… e altri ${vals.length - 8}`, onClick: () => { if (more) this.expand.delete(fk); else this.expand.add(fk); this.update(); } });
    }
    const foot = root.createDiv('crm-side-actions');
    foot.createEl('button', { cls: 'mod-cta', text: T('Nuovo contatto') }).addEventListener('click', () => new ContactModal(p.app, p, null, (f) => p.focusContact(f)).open());
    foot.createEl('button', { text: T('Personalizza') }).addEventListener('click', () => new CustomizeModal(p.app, p).open());
    this.contentEl.scrollTop = top;
  }
}

function companyOptions(plugin, pool, self) {
  const m = new Map();
  const mine = self ? [self.s('azienda'), ...self.l('azienda'), ...self.l('aziendepassate')].map(coClean).filter(Boolean) : [];
  for (const x of pool) for (const v of [x.s('azienda'), ...x.l('aziendepassate'), ...x.rels.map((r) => r.company)]) { const n = coClean(v); if (n) m.set(norm(n), n); }
  const folder = normalizePath(plugin.settings.aziendeFolder) + '/';
  for (const file of plugin.app.vault.getMarkdownFiles()) if (file.path.startsWith(folder)) m.set(norm(file.basename), file.basename);
  const first = [...new Set(mine.map((n) => m.get(norm(n)) || n))];
  return [...first, ...[...m.values()].filter((n) => !first.some((x) => norm(x) === norm(n))).sort((a, b) => a.localeCompare(b, LANG))];
}
function suggestOptions(plugin, f, pool, self) {
  if (f.k === 'relazione') {
    const vals = new Map();
    for (const p of PRESETS.relazione) vals.set(nv(p), p);
    for (const x of pool) for (const r of x.rels) if (!vals.has(nv(r.label))) vals.set(nv(r.label), dv(r.label));
    const arr = [...vals.values()];
    arr.companies = companyOptions(plugin, pool, self);
    return arr;
  }
  if (f.type === 'enum') {
    const vals = new Map();
    for (const p of PRESETS[f.k] || []) vals.set(nv(p), p);
    for (const x of pool) { const v = x.s(f.k); if (v && !vals.has(nv(v))) vals.set(nv(v), dv(v)); }
    return [...vals.values()];
  }
  if (f.type === 'person') return pool.filter((x) => !self || x.file.path !== self.file.path).map((x) => x.name).sort((a, b) => a.localeCompare(b, LANG));
  if (f.type === 'company' || f.type === 'companylist') {
    const m = new Map();
    for (const x of pool) for (const v of [x.s('azienda'), ...x.l('aziendepassate')]) if (v) m.set(norm(v), v);
    const folder = normalizePath(plugin.settings.aziendeFolder) + '/';
    for (const file of plugin.app.vault.getMarkdownFiles()) if (file.path.startsWith(folder)) m.set(norm(file.basename), file.basename);
    return [...m.values()].sort((a, b) => a.localeCompare(b, LANG));
  }
  return null;
}

/* Suggestion dropdown styled like Obsidian (replaces the native <datalist>) */
function attachCombo(wrap, inp, options, opts = {}) {
  const multi = !!opts.multi;
  const seg = () => (multi ? inp.value.split('|').pop().trim() : inp.value);
  const used = () => (multi ? inp.value.split('|').slice(0, -1).map((x) => norm(x)) : []);
  wrap.addClass('has-combo');
  const chev = wrap.createSpan('crm-combo-chev'); setIcon(chev, 'chevron-down');
  const list = wrap.createDiv('crm-combo-list');
  let idx = -1, shown = [];
  const close = () => { list.removeClass('is-open'); idx = -1; };
  const comps = options.companies || null;
  const pick = (v) => {
    const linkable = comps && !v.includes('@') && REL_LINKABLE.test(v);
    const val = linkable ? v + ' @ ' : v;
    if (multi) { const pre = inp.value.split('|').slice(0, -1).map((x) => x.trim()).filter(Boolean); inp.value = [...pre, val].join(' | '); } else inp.value = val;
    inp.dispatchEvent(new Event('input'));
    if (!linkable) close();
  };
  const render = (all) => {
    list.empty();
    const sg = seg();
    let labels;
    if (comps && sg.includes('@')) {
      const lab = sg.split('@')[0].trim(), rest = norm(sg.split('@').slice(1).join('@'));
      shown = comps.filter((co) => !rest || norm(co).includes(rest)).map((co) => `${lab} @ ${co}`);
      labels = shown.map((x) => x.split(/\s+@\s*/).slice(1).join(' @ '));
    } else {
      const q = all ? '' : norm(sg);
      const u = used();
      shown = options.filter((v) => (!q || norm(v).includes(q)) && !u.includes(norm(v)));
      labels = shown.map((v) => cap(v));
    }
    if (!shown.length) { close(); return; }
    shown.forEach((v, i) => {
      const it = list.createDiv({ cls: 'crm-combo-item' + (i === idx ? ' is-sel' : ''), text: labels[i] });
      it.addEventListener('mousedown', (e) => { e.preventDefault(); pick(v); });
    });
    list.addClass('is-open');
  };
  inp.addEventListener('focus', () => { idx = -1; render(true); });
  inp.addEventListener('input', () => { idx = -1; if (document.activeElement === inp) render(false); });
  inp.addEventListener('blur', close);
  inp.addEventListener('keydown', (e) => {
    const open = list.hasClass('is-open');
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) { render(true); return; }
      idx = (idx + (e.key === 'ArrowDown' ? 1 : -1) + shown.length) % shown.length;
      render(false); [...list.children][idx]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && open && idx >= 0) { e.preventDefault(); pick(shown[idx]); }
    else if (e.key === 'Escape' && open) { e.preventDefault(); e.stopPropagation(); close(); }
  });
  chev.addEventListener('mousedown', (e) => { e.preventDefault(); if (list.hasClass('is-open')) close(); else { inp.focus(); render(true); } });
}

class ContactModal extends Modal {
  constructor(app, plugin, contact, onDone) {
    super(app);
    this.plugin = plugin;
    this.contact = contact;
    this.onDone = onDone;
  }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    this.modalEl.addClass('crm-modal');
    this.titleEl.setText(this.contact ? T`Modifica ${this.contact.name}` : T('Nuovo contatto'));
    this.inputs = {};
    this.initial = {};

    const pool = this.plugin.getContacts();
    const shown = FIELDS.filter((f) => !f.internal && (!isHidden(f.k) || f.k === 'nome' || f.k === 'cognome'));
    const groups = [...new Set(shown.map((f) => f.group))];
    this.secs = [];
    for (const g of groups) {
      const det = contentEl.createEl('details', { cls: 'crm-form-sec' });
      const sum = det.createEl('summary');
      setIcon(sum.createSpan('crm-form-chev'), 'chevron-right');
      sum.createSpan({ cls: 'crm-form-sec-t', text: g });
      const cnt = sum.createSpan({ cls: 'crm-form-sec-n' });
      const grid = det.createDiv('crm-form-grid');
      this.secs.push({ det, cnt, keys: [], first: g === groups[0] });
      for (const f of shown.filter((x) => x.group === g)) {
        const w = grid.createDiv('crm-form-item' + (f.type === 'longtext' ? ' wide' : ''));
        w.createEl('label', { text: f.label });
        let init = this.contact ? (f.type === 'list' || f.type === 'companylist' ? this.contact.l(f.k).join(' | ') : this.contact.s(f.k)) : '';
        if (f.type === 'date' && init) { const pd = parseDate(init); if (pd && fmtParts(pd)) init = fmtParts(pd); }
        this.initial[f.k] = init;
        let inp;
        if (f.type === 'longtext') {
          inp = w.createEl('textarea', { attr: { rows: '3' } });
        } else {
          inp = w.createEl('input', { type: 'text' });
          if (f.type === 'date') inp.placeholder = datePh();
          if (f.type === 'list' || f.type === 'companylist') inp.placeholder = T('valori separati da |');
          const opts = suggestOptions(this.plugin, f, pool, this.contact);
          if (opts) attachCombo(w, inp, opts, { multi: f.type === 'companylist' || f.k === 'relazione' });
        }
        inp.value = init;
        this.inputs[f.k] = inp;
        this.secs[this.secs.length - 1].keys.push(f.k);
        inp.addEventListener('input', () => this.updateSecs());
      }
    }
    this.updateSecs();
    for (const sc of this.secs) sc.det.open = sc.first || sc.keys.some((k) => this.inputs[k].value.trim());
    const foot = contentEl.createDiv('crm-form-foot');
    const cancel = foot.createEl('button', { cls: 'crm-btn', text: T('Annulla') });
    cancel.addEventListener('click', () => this.close());
    const save = foot.createEl('button', { cls: 'crm-btn crm-btn-primary', text: this.contact ? T('Salva modifiche') : T('Crea contatto') });
    save.addEventListener('click', () => this.save());
  }
  updateSecs() {
    for (const sc of this.secs) { const n = sc.keys.filter((k) => this.inputs[k].value.trim()).length; sc.cnt.setText(n ? `${n}/${sc.keys.length}` : `${sc.keys.length}`); sc.cnt.toggleClass('has-values', n > 0); }
  }
  async save() {
    const values = {};
    for (const f of FIELDS) {
      if (!this.inputs[f.k]) continue;
      const v = this.inputs[f.k].value.trim();
      if (v === this.initial[f.k]) continue;
      if (!this.contact && !v) continue;
      if (f.type === 'date' && v) { const pd = parseDate(v); values[f.k] = (pd && toIsoParts(pd)) || v; continue; }
      values[f.k] = (f.type === 'list' || f.type === 'companylist') ? toList(v) : v;
    }
    if (!this.contact && !(values.nome || values.cognome)) { new Notice(T('Inserisci almeno nome o cognome')); return; }
    if (!Object.keys(values).length) { this.close(); return; }
    try {
      const file = await this.plugin.saveContact(this.contact ? this.contact.file : null, values);
      new Notice(this.contact ? T('Contatto aggiornato') : T('Contatto creato'));
      this.close();
      if (this.onDone) this.onDone(file);
      if (values.compleanno) {
        const nome = 'nome' in values ? values.nome : (this.contact ? this.contact.s('nome') : '');
        const cognome = 'cognome' in values ? values.cognome : (this.contact ? this.contact.s('cognome') : '');
        setTimeout(() => this.plugin.offerBirthday(file, nome, cognome, parseDate(values.compleanno)), 250);
      }
    } catch (e) {
      console.error(e);
      new Notice(T('Errore nel salvataggio: ') + e.message);
    }
  }
  onClose() { this.contentEl.empty(); }
}

class InteractionModal extends Modal {
  constructor(app, plugin, contact) { super(app); this.plugin = plugin; this.contact = contact; }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    this.modalEl.addClass('crm-modal');
    this.titleEl.setText(T`Nuova interazione con ${this.contact.name}`);
    const grid = contentEl.createDiv('crm-form-grid');
    const item = (label, wide) => { const w = grid.createDiv('crm-form-item' + (wide ? ' wide' : '')); w.createEl('label', { text: label }); return w; };

    this.tipo = item(T('Tipo')).createEl('select', { cls: 'dropdown' });
    for (const t of [T('Messaggio'), T('Chiamata'), T('Incontro'), T('Email'), T('Evento'), T('Altro')]) this.tipo.createEl('option', { value: t, text: t });
    this.data = item(T('Data')).createEl('input', { type: 'text' });
    this.data.value = fmtDate(new Date());
    this.fu = item(T('Prossimo follow-up (opzionale)')).createEl('input', { type: 'text', placeholder: datePh() });
    this.note = item(T('Cosa vi siete detti'), true).createEl('textarea', { attr: { rows: '5' } });

    const foot = contentEl.createDiv('crm-form-foot');
    foot.createEl('button', { cls: 'crm-btn', text: T('Annulla') }).addEventListener('click', () => this.close());
    foot.createEl('button', { cls: 'crm-btn crm-btn-primary', text: T('Registra') }).addEventListener('click', () => this.save());
  }
  async save() {
    const p = parseDate(this.data.value.trim());
    const dt = toDate(p);
    if (!dt) { new Notice(`${T('Data non valida')} (${datePh()})`); return; }
    const fuTxt = this.fu.value.trim();
    if (fuTxt && !toDate(parseDate(fuTxt))) { new Notice(`${T('Follow-up non valido')} (${datePh()})`); return; }
    try {
      const s = this.plugin.settings;
      await this.plugin.ensureFolder(s.interazioniFolder);
      const iso = isoDate(dt);
      const path = this.plugin.uniquePath(s.interazioniFolder, `${iso} ${this.tipo.value} - ${this.contact.name}`);
      const body = this.note.value.trim();
      const f = await this.app.vault.create(path, `\n${body}\n`);
      await this.app.fileManager.processFrontMatter(f, (fm) => {
        fm[LANG === 'it' ? 'persona' : 'person'] = `[[${this.contact.file.basename}]]`;
        fm[LANG === 'it' ? 'tipo' : 'type'] = this.tipo.value;
        fm[LANG === 'it' ? 'data' : 'date'] = isoDate(dt);
      });
      const upd = {};
      const last = this.contact.due.last;
      if (!last || dt >= last) upd.ultimocontatto = isoDate(dt);
      if (fuTxt) upd.prossimofollowup = toIsoParts(parseDate(fuTxt));
      else if (this.contact.raw(FM.prossimofollowup)) upd.prossimofollowup = '';
      await this.plugin.saveContact(this.contact.file, upd);
      new Notice(T('Interazione registrata'));
      this.close();
    } catch (e) {
      console.error(e);
      new Notice(T('Errore: ') + e.message);
    }
  }
  onClose() { this.contentEl.empty(); }
}

class ContactPicker extends FuzzySuggestModal {
  constructor(app, contacts, onChoose) { super(app); this.contacts = contacts; this.onChoose = onChoose; this.setPlaceholder(T('Scegli un contatto…')); }
  getItems() { return this.contacts; }
  getItemText(c) { return c.name; }
  onChooseItem(c) { this.onChoose(c); }
}

/* ───────────────────────── Importer: parser ───────────────────────── */

const SRC_LABEL = { linkedin: 'LinkedIn', phone: T('Telefono'), facebook: 'Facebook', csv: 'CSV' };

function parseCSV(text, delim) {
  const rows = [];
  let row = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) {
      if (ch === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; }
      else cur += ch;
    } else if (ch === '"') q = true;
    else if (ch === delim) { row.push(cur); cur = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cur); cur = ''; rows.push(row); row = [];
    } else cur += ch;
  }
  if (cur !== '' || row.length) { row.push(cur); rows.push(row); }
  return rows.filter((r) => r.some((c) => String(c).trim() !== ''));
}

function detectDelim(line) {
  const c = { ';': 0, ',': 0, '\t': 0 };
  let q = false;
  for (const ch of line) { if (ch === '"') q = !q; else if (!q && ch in c) c[ch]++; }
  return Object.entries(c).sort((a, b) => b[1] - a[1])[0][0];
}

/* righe → oggetti con intestazioni normalizzate (norm) */
function csvToObjects(text) {
  text = String(text).replace(/^\uFEFF/, '');
  const first = text.split(/\r?\n/).find((l) => l.trim()) || '';
  const rows = parseCSV(text, detectDelim(first));
  if (!rows.length) return [];
  const head = rows[0].map((h) => norm(h));
  return rows.slice(1).map((r) => {
    const o = {};
    head.forEach((h, i) => { if (h && !(h in o)) o[h] = String(r[i] == null ? '' : r[i]).trim(); });
    return o;
  });
}

const MONTHS_EN = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };

function anyDateToIt(s) {
  s = String(s || '').trim();
  if (!s) return '';
  let m;
  if ((m = s.match(/^(\d{1,2})\s+([A-Za-z]{3})[A-Za-z]*\.?,?\s+(\d{4})$/))) {
    const mo = MONTHS_EN[m[2].toLowerCase()];
    if (mo) return `${m[3]}-${pad(mo)}-${pad(+m[1])}`;
  }
  const pd = parseDate(s);
  if (pd && toIsoParts(pd)) return toIsoParts(pd);
  return s;
}

function bdayToIt(s) {
  s = String(s || '').trim();
  if (!s) return '';
  let m;
  if ((m = s.match(/^--(\d{2})-?(\d{2})$/))) return `--${m[1]}-${m[2]}`;
  if ((m = s.match(/^(\d{4})-?(\d{2})-?(\d{2})/))) {
    if (+m[1] < 1900) return `--${m[2]}-${m[3]}`;
    return `${m[1]}-${m[2]}-${m[3]}`;
  }
  return anyDateToIt(s);
}

function normPhone(v) {
  let s = String(v || '').trim().split(/\s*:::\s*/)[0].replace(/^tel:/i, '');
  if (!s) return '';
  let d = s.replace(/[^\d+]/g, '');
  if (!d) return '';
  if (d.startsWith('00')) d = '+' + d.slice(2);
  if (!d.startsWith('+')) {
    if (/^3\d{8,9}$/.test(d) || /^0\d{5,10}$/.test(d)) d = '+39' + d;
    else return s;
  }
  const m = d.match(/^\+39(3\d{2})(\d{3})(\d{3,4})$/);
  return m ? `+39 ${m[1]} ${m[2]} ${m[3]}` : d;
}

function splitName(full) {
  const t = String(full || '').trim().split(/\s+/).filter(Boolean);
  if (!t.length) return { nome: '', cognome: '' };
  return { nome: t[0], cognome: t.slice(1).join(' ') };
}

function mkRec(src, f) {
  const r = { _src: src };
  for (const [k, v] of Object.entries(f)) {
    if (v == null) continue;
    if (Array.isArray(v)) { if (v.length) r[k] = v; }
    else if (String(v).trim() !== '') r[k] = String(v).trim();
  }
  r._name = [r.nome, r.cognome].filter(Boolean).join(' ');
  return r;
}

function parseLinkedIn(text) {
  text = String(text).replace(/^\uFEFF/, '');
  const lines = text.split(/\r?\n/);
  const i = lines.findIndex((l) => /^"?first name"?\s*[,;]/i.test(l));
  const body = i >= 0 ? lines.slice(i).join('\n') : text;
  const out = [];
  for (const o of csvToObjects(body)) {
    const nome = o.firstname || '';
    const cognome = o.lastname || '';
    if (!nome && !cognome) continue;
    out.push(mkRec('linkedin', {
      nome, cognome,
      linkedin: o.url || o.profileurl || '',
      email: o.emailaddress || o.email || '',
      azienda: o.company || '',
      ruolo: o.position || '',
      conosciutiquando: anyDateToIt(o.connectedon || ''),
      conosciutidove: 'LinkedIn',
      relazione: 'contatto business',
    }));
  }
  return out;
}

function parseGoogleCsv(text) {
  const g = (o, ...ks) => { for (const k of ks) if (o[k]) return o[k]; return ''; };
  const out = [];
  for (const o of csvToObjects(text)) {
    let nome = g(o, 'firstname', 'givenname');
    let cognome = g(o, 'lastname', 'familyname');
    if (!nome && !cognome) { const sp = splitName(g(o, 'name', 'displayname', 'fileas')); nome = sp.nome; cognome = sp.cognome; }
    const org = g(o, 'organizationname', 'organization1name', 'company');
    if (!nome && !cognome && org) nome = org;
    const lbl2 = (g(o, 'email2label') || '').toLowerCase();
    const email2 = g(o, 'email2value');
    const rec = mkRec('phone', {
      nome, cognome,
      soprannome: g(o, 'nickname'),
      email: g(o, 'email1value', 'email1').split(/\s*:::\s*/)[0],
      emaillavoro: /work|lavoro/.test(lbl2) ? email2.split(/\s*:::\s*/)[0] : '',
      telefono: normPhone(g(o, 'phone1value', 'mobilephone', 'phone', 'primaryphone')),
      compleanno: bdayToIt(g(o, 'birthday')),
      azienda: org,
      ruolo: g(o, 'organizationtitle', 'organization1title', 'jobtitle'),
      citta: g(o, 'address1city'),
      paese: g(o, 'address1country'),
      note: g(o, 'notes'),
    });
    if (!rec.nome && !rec.cognome) continue;
    out.push(rec);
  }
  return out;
}

function decodeQP(s) {
  const bytes = [];
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '=' && /^[0-9A-Fa-f]{2}$/.test(s.substr(i + 1, 2))) { bytes.push(parseInt(s.substr(i + 1, 2), 16)); i += 2; }
    else bytes.push(s.charCodeAt(i) & 255);
  }
  try { return new TextDecoder('utf-8').decode(Uint8Array.from(bytes)); } catch (e) { return s; }
}

const vcUnesc = (s) => String(s).replace(/\\n/gi, '\n').replace(/\\([,;\\])/g, '$1');

function parseVCards(text) {
  text = String(text).replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').replace(/\n[ \t]/g, '');
  const raw = text.split('\n');
  const lines = [];
  for (let i = 0; i < raw.length; i++) {
    let l = raw[i];
    while (/QUOTED-PRINTABLE/i.test(l.split(':')[0]) && l.endsWith('=') && i + 1 < raw.length) l = l.slice(0, -1) + raw[++i];
    lines.push(l);
  }
  const cards = [];
  let cur = null;
  for (const line of lines) {
    if (/^BEGIN:VCARD/i.test(line)) { cur = {}; continue; }
    if (/^END:VCARD/i.test(line)) { if (cur) cards.push(cur); cur = null; continue; }
    if (!cur) continue;
    const idx = line.indexOf(':');
    if (idx < 0) continue;
    const parts = line.slice(0, idx).split(';');
    let name = parts[0].toUpperCase();
    if (name.includes('.')) name = name.split('.').pop();
    const params = parts.slice(1).join(';').toUpperCase();
    let v = line.slice(idx + 1);
    if (/ENCODING=QUOTED-PRINTABLE/.test(params)) v = decodeQP(v);
    (cur[name] = cur[name] || []).push({ v, params });
  }
  const out = [];
  for (const card of cards) {
    const first = (k) => (card[k] && card[k][0] ? vcUnesc(card[k][0].v) : '');
    let nome = '';
    let cognome = '';
    const n = card.N && card.N[0] ? card.N[0].v.split(';').map(vcUnesc) : null;
    if (n) { cognome = (n[0] || '').trim(); nome = (n[1] || '').trim(); }
    if (!nome && !cognome) { const sp = splitName(first('FN')); nome = sp.nome; cognome = sp.cognome; }
    const org = card.ORG && card.ORG[0] ? vcUnesc(card.ORG[0].v.split(';')[0]).trim() : '';
    if (!nome && !cognome && org) nome = org;
    const tels = card.TEL || [];
    const tel = tels.find((t) => /CELL|MOBILE|IPHONE/.test(t.params)) || tels[0];
    const emails = card.EMAIL || [];
    const work = emails.find((e) => /WORK/.test(e.params));
    const priv = emails.find((e) => !/WORK/.test(e.params));
    let linkedin = '';
    let instagram = '';
    for (const u of [...(card.URL || []), ...(card['X-SOCIALPROFILE'] || [])]) {
      const val = vcUnesc(u.v);
      if (/linkedin\.com/i.test(val) && !linkedin) linkedin = val;
      else if (/instagram\.com/i.test(val) && !instagram) instagram = val;
    }
    const adr = card.ADR && card.ADR[0] ? card.ADR[0].v.split(';').map(vcUnesc) : [];
    const rec = mkRec('phone', {
      nome, cognome,
      soprannome: first('NICKNAME'),
      email: priv ? vcUnesc(priv.v) : '',
      emaillavoro: work ? vcUnesc(work.v) : '',
      telefono: tel ? normPhone(vcUnesc(tel.v)) : '',
      compleanno: bdayToIt(first('BDAY')),
      azienda: org,
      ruolo: first('TITLE'),
      citta: (adr[3] || '').trim(),
      paese: (adr[6] || '').trim(),
      linkedin, instagram,
      note: first('NOTE'),
    });
    if (!rec.nome && !rec.cognome) continue;
    out.push(rec);
  }
  return out;
}

function fixFbEncoding(s) {
  if (!/[\u0080-\u00ff]/.test(s) || /[^\u0000-\u00ff]/.test(s)) return s;
  try { return new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(s, (c) => c.charCodeAt(0))); } catch (e) { return s; }
}

function parseFacebook(text) {
  const t = String(text).replace(/^\uFEFF/, '').trim();
  let items = [];
  if (t.startsWith('{') || t.startsWith('[')) {
    let j;
    try { j = JSON.parse(t); } catch (e) { return []; }
    const walk = (x) => {
      if (Array.isArray(x)) {
        if (x.length && x.every((i) => i && typeof i === 'object' && typeof i.name === 'string')) items.push(...x);
        else x.forEach(walk);
      } else if (x && typeof x === 'object') Object.values(x).forEach(walk);
    };
    walk(j);
    items = items.map((i) => ({ name: fixFbEncoding(i.name), ts: i.timestamp, email: (i.contact_info && /@/.test(i.contact_info)) ? i.contact_info : '' }));
  } else {
    const doc = new DOMParser().parseFromString(t, 'text/html');
    let els = [];
    for (const sel of ['div._2pio', 'div._a6-p > div > div:first-child', 'li', 'h2']) {
      els = [...doc.querySelectorAll(sel)];
      if (els.length) break;
    }
    const seen = new Set();
    for (const e of els) {
      const name = (e.textContent || '').trim();
      if (name.length < 2 || name.length > 70 || /^\d+$/.test(name) || seen.has(name)) continue;
      seen.add(name);
      items.push({ name, ts: 0, email: '' });
    }
  }
  const out = [];
  for (const it of items) {
    const sp = splitName(it.name);
    if (!sp.nome) continue;
    let when = '';
    if (it.ts) { const d = new Date(it.ts * 1000); when = `${pad(d.getMonth() + 1)}/${d.getFullYear()}`; }
    out.push(mkRec('facebook', { nome: sp.nome, cognome: sp.cognome, email: it.email, conosciutidove: 'Facebook', conosciutiquando: when }));
  }
  return out;
}

const ALIAS_MAP = {};
rebuildAliasMap();

function parseGenericCsv(text) {
  const out = [];
  for (const o of csvToObjects(text)) {
    const f = {};
    for (const [h, v] of Object.entries(o)) {
      const fld = ALIAS_MAP[h];
      if (!fld || !v) continue;
      let val = v;
      if (fld.type === 'list' || fld.type === 'companylist') val = toList(v);
      else if (fld.type === 'date') val = fld.k === 'compleanno' ? bdayToIt(v) : anyDateToIt(v);
      else if (fld.k === 'telefono' || fld.k === 'whatsapp') val = normPhone(v);
      else if (fld.type === 'company') val = stripLinks(v);
      f[fld.k] = val;
    }
    if (!f.nome && !f.cognome) {
      const sp = splitName(o.name || o.fullname || o.nomecompleto || '');
      f.nome = sp.nome; f.cognome = sp.cognome;
    }
    if (!f.nome && !f.cognome) continue;
    out.push(mkRec('csv', f));
  }
  return out;
}

function detectSource(name, text) {
  const ext = (name.split('.').pop() || '').toLowerCase();
  const head = String(text).slice(0, 4000);
  if (/BEGIN:VCARD/i.test(head)) return 'phone';
  if (ext === 'json' || /^\s*[\[{]/.test(head)) return 'facebook';
  if (ext === 'html' || ext === 'htm' || /<html/i.test(head)) return 'facebook';
  if (/^\s*Notes:/i.test(head) || (/first name/i.test(head) && /connected on/i.test(head))) return 'linkedin';
  if (/e-?mail 1 - value|given name|phone 1 - value|phone 1 - label/i.test(head)) return 'phone';
  return 'csv';
}

function parseSource(src, text) {
  switch (src) {
    case 'linkedin': return parseLinkedIn(text);
    case 'phone': return /BEGIN:VCARD/i.test(text) ? parseVCards(text) : parseGoogleCsv(text);
    case 'facebook': return parseFacebook(text);
    default: return parseGenericCsv(text);
  }
}

/* ── duplicati ── */
function keysFor(get, fallbackName) {
  const ks = [];
  for (const k of ['email', 'emaillavoro']) { const v = String(get(k) || '').toLowerCase().trim(); if (v) ks.push('e:' + v); }
  for (const k of ['telefono', 'whatsapp']) { const d = String(get(k) || '').replace(/\D/g, ''); if (d.length >= 7) ks.push('p:' + d.slice(-9)); }
  const li = String(get('linkedin') || '').toLowerCase().match(/linkedin\.com\/in\/([^\/?#\s]+)/);
  if (li) ks.push('l:' + li[1]);
  const nm = norm([get('nome'), get('cognome')].join('')) || norm(fallbackName || '');
  if (nm) ks.push('n:' + nm);
  return ks;
}
const KEY_WHY = { e: T('stessa email'), p: T('stesso telefono'), l: T('stesso LinkedIn'), n: T('stesso nome') };

function annotate(records, contacts) {
  const ex = new Map();
  for (const c of contacts) for (const k of keysFor((x) => c.s(x), c.name)) if (!ex.has(k)) ex.set(k, c);
  const seen = new Map();
  records.forEach((r, i) => {
    r._id = i;
    r.status = 'nuovo'; r.match = null; r.why = '';
    const ks = keysFor((x) => toStr(r[x]), r._name);
    for (const k of ks) { if (ex.has(k)) { r.status = 'esiste'; r.match = ex.get(k); r.why = KEY_WHY[k[0]]; break; } }
    if (r.status === 'nuovo') for (const k of ks) { if (seen.has(k)) { r.status = 'doppio'; r.why = KEY_WHY[k[0]]; break; } }
    for (const k of ks) if (!seen.has(k)) seen.set(k, i);
  });
  return records;
}

function mergeValues(c, r) {
  const vals = {};
  for (const f of FIELDS) {
    if (f.k === 'nome' || f.k === 'cognome') continue;
    const v = r[f.k];
    if (v == null || v === '' || (Array.isArray(v) && !v.length)) continue;
    const cur = (f.type === 'list' || f.type === 'companylist') ? c.l(f.k).length : c.s(f.k);
    if (cur) continue;
    vals[f.k] = v;
  }
  return vals;
}

function readFileText(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = () => reject(fr.error || new Error(T('lettura non riuscita')));
    fr.readAsText(file, 'utf-8');
  });
}

/* ───────────────────────── ICS (calendario) ───────────────────────── */

const icsDate = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
const icsEsc = (s) => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
function djb(s) { let h = 5381; for (const ch of String(s)) h = ((h << 5) + h + ch.charCodeAt(0)) >>> 0; return h.toString(16); }
function icsFold(line) {
  const cp = Array.from(line);
  const out = [cp.slice(0, 60).join('')];
  for (let i = 60; i < cp.length; i += 60) out.push(' ' + cp.slice(i, i + 60).join(''));
  return out;
}

function buildICS(contacts, o = {}) {
  const now = new Date();
  const stamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;
  const L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Kith//Obsidian//IT', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:Kith'];
  const t = today();
  let nb = 0;
  let nf = 0;
  const ev = (uid, start, summary, desc, rrule) => {
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    L.push('BEGIN:VEVENT', `UID:${uid}@crm-contatti`, `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${icsDate(start)}`, `DTEND;VALUE=DATE:${icsDate(end)}`);
    if (rrule) L.push(rrule);
    L.push(...icsFold(`SUMMARY:${icsEsc(summary)}`));
    if (desc) L.push(...icsFold(`DESCRIPTION:${icsEsc(desc)}`));
    L.push('TRANSP:TRANSPARENT', 'BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${icsEsc(summary)}`, 'TRIGGER:PT9H', 'END:VALARM', 'END:VEVENT');
  };
  for (const c of contacts) {
    const p = parseDate(c.raw(FM.compleanno));
    if (p && p.d && p.m) {
      const pick = (y) => new Date(y, p.m - 1, (p.m === 2 && p.d === 29) ? 28 : Math.min(p.d, new Date(y, p.m, 0).getDate()));
      let start = pick(t.getFullYear());
      if (start < t) start = pick(t.getFullYear() + 1);
      const desc = p.y ? T`Nato/a il ${fmtParts(p)}` : '';
      ev('crm-bday-' + djb(c.file.path), start, T`🎂 Compleanno di ${c.name}`, desc, 'RRULE:FREQ=YEARLY');
      nb++;
    }
    if (o.followups && c.due.due) {
      const late = c.due.due < t;
      const start = late ? t : c.due.due;
      const desc = [c.s('relazione') && T`Relazione: ${c.s('relazione')}`, c.s('canale') && T`Canale: ${c.s('canale')}`].filter(Boolean).join(' · ');
      ev('crm-fu-' + djb(c.file.path), start, T`📞 Ricontatta ${c.name}${late ? T(' (scaduto)') : ''}`, desc, '');
      nf++;
    }
  }
  L.push('END:VCALENDAR');
  return { text: L.join('\r\n') + '\r\n', nb, nf };
}

/* ───────────────────────── Widget "Oggi" ───────────────────────── */

function parseWidgetOpts(src) {
  const o = { giorni: 7, max: 6, titolo: '' };
  for (const l of String(src || '').split('\n')) {
    const m = l.match(/^\s*(\w+)\s*:\s*(.+?)\s*$/);
    if (!m) continue;
    const k = norm(m[1]);
    if (k === 'giorni') o.giorni = Math.max(1, parseInt(m[2], 10) || 7);
    else if (k === 'max') o.max = Math.max(1, parseInt(m[2], 10) || 6);
    else if (k === 'titolo') o.titolo = m[2];
  }
  return o;
}

class OggiWidget extends MarkdownRenderChild {
  constructor(el, plugin, opts) { super(el); this.el = el; this.plugin = plugin; this.opts = opts; this._t = null; }
  onload() {
    this.render();
    const trig = (f) => {
      const p = f && f.path;
      if (!p || !p.startsWith(normalizePath(this.plugin.settings.personeFolder) + '/')) return;
      clearTimeout(this._t);
      this._t = setTimeout(() => this.render(), 400);
    };
    this.registerEvent(this.plugin.app.metadataCache.on('changed', trig));
  }
  render() {
    const el = this.el;
    el.empty();
    el.addClass('crm-oggi');
    const { giorni, max } = this.opts;
    const cs = this.plugin.getContacts().filter((c) => !c.archived);
    const head = el.createDiv('crm-oggi-head');
    head.createSpan({ cls: 'crm-oggi-title', text: this.opts.titolo || T('CRM · Oggi') });
    const open = head.createEl('a', { cls: 'crm-oggi-open', text: T('Apri CRM') });
    open.addEventListener('click', (e) => { e.preventDefault(); this.plugin.activateView(); });

    const section = (title, items, rowFn) => {
      const s = el.createDiv('crm-oggi-sec');
      s.createDiv({ cls: 'crm-oggi-sec-title', text: `${title} (${items.length})` });
      if (!items.length) { s.createDiv({ cls: 'crm-muted', text: T('Nulla in programma ✨') }); return; }
      for (const c of items.slice(0, max)) {
        const r = s.createDiv('crm-oggi-row');
        const a = r.createEl('a', { cls: 'crm-oggi-name', text: c.name });
        a.addEventListener('click', (e) => { e.preventDefault(); this.plugin.app.workspace.getLeaf(false).openFile(c.file); });
        rowFn(r, c);
      }
      if (items.length > max) s.createDiv({ cls: 'crm-muted', text: T`… e altri ${items.length - max}` });
    };
    const dueText = (c) => (c.due.days < 0 ? T`scaduto da ${-c.due.days} gg` : c.due.days === 0 ? T('oggi') : T`tra ${c.due.days} gg`);
    const doneBtn = (r, c) => {
      const b = r.createEl('button', { cls: 'crm-oggi-done', text: '✓', attr: { 'aria-label': T('Contattato oggi') } });
      b.addEventListener('click', async () => { await this.plugin.markContacted(c); new Notice(T`${c.name}: contattato`); });
    };
    section(T('📞 Da ricontattare'), cs.filter((c) => c.due.due && c.due.days <= 0).sort(SORTS.followup), (r, c) => {
      r.createSpan({ cls: `crm-due due-${c.due.days < 0 ? 'scaduto' : 'presto'}`, text: dueText(c) });
      doneBtn(r, c);
    });
    section(T`🗓 Prossimi ${giorni} giorni`, cs.filter((c) => c.due.due && c.due.days > 0 && c.due.days <= giorni).sort(SORTS.followup), (r, c) => {
      r.createSpan({ cls: 'crm-due due-ok', text: dueText(c) });
      doneBtn(r, c);
    });
    section(T('🎂 Compleanni'), cs.filter((c) => c.bday && c.bday.days <= giorni).sort(SORTS.compleanno), (r, c) => {
      const age = c.bday.age != null ? T` · ${c.bday.age} anni` : '';
      r.createSpan({ cls: 'crm-bday', text: (c.bday.days === 0 ? T('oggi') : T`tra ${c.bday.days} gg`) + age });
    });
  }
}

/* ───────────────────────── Modale importazione ───────────────────────── */

class ImportModal extends Modal {
  constructor(app, plugin, onDone) {
    super(app);
    this.plugin = plugin;
    this.onDone = onDone;
    this.records = [];
    this.selected = new Set();
    this.q = '';
    this.statusF = '';
    this.srcF = '';
    this.limit = 200;
    this.opts = { relazione: '', merge: 'skip', companies: plugin.settings.createAziende };
    this.sourceSel = 'auto';
    this.cancelled = false;
  }

  onOpen() {
    this.modalEl.addClass('crm-modal');
    this.modalEl.addClass('crm-import');
    this.titleEl.setText(T('Importa contatti'));
    this.renderStart();
  }
  onClose() { this.cancelled = true; this.contentEl.empty(); }

  renderStart() {
    const c = this.contentEl;
    c.empty();
    c.createEl('p', { cls: 'crm-muted', text: T('Carica uno o più file esportati da LinkedIn, dalla rubrica del telefono o da Facebook. Nel passo successivo scegli esattamente chi importare: niente viene creato prima della tua conferma.') });
    const row = c.createDiv('crm-import-row');
    row.createSpan({ text: T('Origine: ') });
    const sel = row.createEl('select', { cls: 'dropdown' });
    for (const [v, t] of [['auto', T('Rileva automaticamente')], ['linkedin', T('LinkedIn (Connections.csv)')], ['phone', T('Telefono (.vcf oppure Google Contacts CSV)')], ['facebook', T('Facebook (friends .json / .html)')], ['csv', T('CSV generico / formato del vault')]]) {
      sel.createEl('option', { value: v, text: t });
    }
    sel.addEventListener('change', () => { this.sourceSel = sel.value; });

    const dz = c.createDiv('crm-dropzone');
    dz.createDiv({ text: T('Trascina qui i file oppure') });
    const btn = dz.createEl('button', { cls: 'crm-btn crm-btn-primary', text: T('Scegli file…') });
    const inp = dz.createEl('input', { type: 'file', attr: { multiple: 'true', accept: '.csv,.vcf,.vcard,.json,.html,.htm,.txt' } });
    inp.style.display = 'none';
    btn.addEventListener('click', () => inp.click());
    inp.addEventListener('change', () => this.loadFiles([...inp.files]));
    dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.addClass('is-over'); });
    dz.addEventListener('dragleave', () => dz.removeClass('is-over'));
    dz.addEventListener('drop', (e) => { e.preventDefault(); dz.removeClass('is-over'); this.loadFiles([...e.dataTransfer.files]); });

    const how = c.createEl('details', { cls: 'crm-import-how' });
    how.createEl('summary', { text: T('Come esportare i dati') });
    const ul = how.createEl('ul');
    ul.createEl('li', { text: T('LinkedIn: Impostazioni → Privacy dei dati → Ottieni una copia dei tuoi dati → seleziona “Collegamenti” → scarica lo zip e usa Connections.csv.') });
    ul.createEl('li', { text: T('iPhone: iCloud.com → Contatti → seleziona tutti → Esporta vCard. Android / Google: contacts.google.com → Esporta → vCard (.vcf) oppure Google CSV.') });
    ul.createEl('li', { text: T('Facebook: Impostazioni → Le tue informazioni → Scarica le tue informazioni → Amici e follower, formato JSON → file your_friends.json. Facebook esporta solo nome e data di amicizia: niente email, telefono o compleanni.') });
    ul.createEl('li', { text: T('CSV generico: qualsiasi CSV con intestazioni tipo Nome, Cognome, Email, Telefono, Azienda… (anche il formato del tuo contatti.csv, separatore ; o ,).') });
  }

  async loadFiles(files) {
    if (!files.length) return;
    const errs = [];
    const all = [];
    for (const f of files) {
      try {
        const text = await readFileText(f);
        const src = this.sourceSel === 'auto' ? detectSource(f.name, text) : this.sourceSel;
        const recs = parseSource(src, text);
        recs.forEach((r) => { r._file = f.name; });
        if (!recs.length) errs.push(T`${f.name}: nessun contatto riconosciuto (${SRC_LABEL[src]})`);
        all.push(...recs);
      } catch (e) { errs.push(`${f.name}: ${e.message}`); }
    }
    if (errs.length) new Notice(errs.join('\n'), 9000);
    if (!all.length) return;
    this.records = this.records.concat(all);
    annotate(this.records, this.plugin.getContacts());
    this.selected = new Set(this.records.filter((r) => r.status === 'nuovo').map((r) => r._id));
    this.limit = 200;
    this.renderPreview();
  }

  filtered() {
    const q = norm(this.q);
    return this.records.filter((r) => {
      if (this.statusF && r.status !== this.statusF) return false;
      if (this.srcF && r._src !== this.srcF) return false;
      if (q) {
        if (!r._hay) r._hay = norm([r._name, r.azienda, r.ruolo, r.email, r.telefono, r.citta].join(' '));
        if (!r._hay.includes(q)) return false;
      }
      return true;
    });
  }

  renderPreview() {
    const c = this.contentEl;
    c.empty();
    const srcs = [...new Set(this.records.map((r) => r._src))];
    const bar = c.createDiv('crm-imp-bar');
    this.countEl = bar.createDiv({ cls: 'crm-imp-count' });
    const q = bar.createEl('input', { type: 'search', cls: 'crm-imp-search', placeholder: T('Cerca nell’elenco…') });
    q.value = this.q;
    q.addEventListener('input', () => { this.q = q.value; this.limit = 200; this.renderRows(); });
    const st = bar.createEl('select', { cls: 'dropdown' });
    for (const [v, t] of [['', T('Tutti gli stati')], ['nuovo', T('Solo nuovi')], ['esiste', T('Già presenti')], ['doppio', T('Doppi nel file')]]) {
      const o = st.createEl('option', { value: v, text: t });
      if (v === this.statusF) o.selected = true;
    }
    st.addEventListener('change', () => { this.statusF = st.value; this.limit = 200; this.renderRows(); });
    if (srcs.length > 1) {
      const ss = bar.createEl('select', { cls: 'dropdown' });
      ss.createEl('option', { value: '', text: T('Tutte le fonti') });
      for (const s of srcs) { const o = ss.createEl('option', { value: s, text: SRC_LABEL[s] }); if (s === this.srcF) o.selected = true; }
      ss.addEventListener('change', () => { this.srcF = ss.value; this.limit = 200; this.renderRows(); });
    }

    const act = c.createDiv('crm-imp-actions');
    const mk = (text, fn) => act.createEl('button', { cls: 'crm-btn', text }).addEventListener('click', fn);
    mk(T('Seleziona visibili'), () => { for (const r of this.filtered()) this.selected.add(r._id); this.renderRows(); });
    mk(T('Deseleziona visibili'), () => { for (const r of this.filtered()) this.selected.delete(r._id); this.renderRows(); });
    mk(T('Solo i nuovi'), () => { this.selected = new Set(this.records.filter((r) => r.status === 'nuovo').map((r) => r._id)); this.renderRows(); });
    mk(T('＋ Aggiungi altri file'), () => {
      const inp = c.createEl('input', { type: 'file', attr: { multiple: 'true', accept: '.csv,.vcf,.vcard,.json,.html,.htm,.txt' } });
      inp.style.display = 'none';
      inp.addEventListener('change', () => this.loadFiles([...inp.files]));
      inp.click();
    });

    const opt = c.createDiv('crm-imp-opts');
    const f1 = opt.createDiv('crm-form-item');
    f1.createEl('label', { text: T('Relazione per i nuovi (vuoto = come da fonte)') });
    const rel = f1.createEl('input', { type: 'text' });
    rel.value = this.opts.relazione;
    attachCombo(f1, rel, PRESETS.relazione);
    rel.addEventListener('input', () => { this.opts.relazione = rel.value.trim(); });
    const f2 = opt.createDiv('crm-form-item');
    f2.createEl('label', { text: T('Contatti già presenti') });
    const mg = f2.createEl('select', { cls: 'dropdown' });
    for (const [v, t] of [['skip', T('Salta (non toccare)')], ['fill', T('Completa solo i campi vuoti')]]) { const o = mg.createEl('option', { value: v, text: t }); if (v === this.opts.merge) o.selected = true; }
    mg.addEventListener('change', () => { this.opts.merge = mg.value; this.updateCount(); });
    const f3 = opt.createDiv('crm-form-item');
    f3.createEl('label', { text: T('Aziende') });
    const lab = f3.createEl('label', { cls: 'crm-check' });
    const cb = lab.createEl('input', { type: 'checkbox' });
    cb.checked = this.opts.companies;
    cb.addEventListener('change', () => { this.opts.companies = cb.checked; });
    lab.createSpan({ text: T(' Crea le note azienda mancanti') });

    this.tableWrap = c.createDiv('crm-imp-table-wrap');
    const foot = c.createDiv('crm-form-foot');
    foot.createEl('button', { cls: 'crm-btn', text: T('Annulla') }).addEventListener('click', () => this.close());
    this.importBtn = foot.createEl('button', { cls: 'crm-btn crm-btn-primary', text: T('Importa') });
    this.importBtn.addEventListener('click', () => this.run());
    this.renderRows();
  }

  renderRows() {
    const w = this.tableWrap;
    w.empty();
    const list = this.filtered();
    this.shown = list;
    const t = w.createEl('table', { cls: 'crm-table crm-imp-table' });
    const hr = t.createEl('thead').createEl('tr');
    for (const h of ['', T('Nome'), T('Lavoro'), T('Contatti'), T('Fonte'), T('Stato')]) hr.createEl('th', { text: h });
    const tb = t.createEl('tbody');
    for (const r of list.slice(0, this.limit)) {
      const tr = tb.createEl('tr', { cls: 'crm-row' });
      const cb = tr.createEl('td', { cls: 'crm-imp-cb' }).createEl('input', { type: 'checkbox' });
      cb.checked = this.selected.has(r._id);
      cb.addEventListener('change', () => { if (cb.checked) this.selected.add(r._id); else this.selected.delete(r._id); this.updateCount(); });
      tr.addEventListener('click', (e) => { if (e.target !== cb) { cb.checked = !cb.checked; cb.dispatchEvent(new Event('change')); } });
      const n = tr.createEl('td');
      n.createDiv({ cls: 'crm-name', text: r._name || T('(senza nome)') });
      if (r.citta) n.createDiv({ cls: 'crm-sub', text: r.citta });
      const wk = tr.createEl('td');
      wk.createDiv({ text: r.azienda || '' });
      wk.createDiv({ cls: 'crm-sub', text: r.ruolo || '' });
      const ct = tr.createEl('td');
      ct.createDiv({ text: r.email || '' });
      ct.createDiv({ cls: 'crm-sub', text: r.telefono || (r.linkedin ? 'LinkedIn' : '') });
      tr.createEl('td', { text: SRC_LABEL[r._src] });
      const s = tr.createEl('td');
      if (r.status === 'nuovo') s.createSpan({ cls: 'crm-due due-ok', text: T('Nuovo') });
      else if (r.status === 'esiste') s.createSpan({ cls: 'crm-due due-presto', text: T`Già presente · ${r.why}` });
      else s.createSpan({ cls: 'crm-due', text: T`Doppio nel file · ${r.why}` });
    }
    if (list.length > this.limit) {
      const more = w.createEl('button', { cls: 'crm-btn crm-imp-more', text: T`Mostra altri ${Math.min(200, list.length - this.limit)} (${list.length - this.limit} nascosti)` });
      more.addEventListener('click', () => { this.limit += 200; this.renderRows(); });
    }
    if (!list.length) w.createDiv({ cls: 'crm-empty', text: T('Nessun contatto con questi filtri.') });
    this.updateCount();
  }

  updateCount() {
    const sel = this.records.filter((r) => this.selected.has(r._id));
    const exist = sel.filter((r) => r.status === 'esiste').length;
    const fresh = sel.length - exist;
    this.countEl.setText(T`${sel.length} selezionati su ${this.records.length} · ${this.shown ? this.shown.length : 0} visibili`);
    const upd = this.opts.merge === 'fill' ? exist : 0;
    this.importBtn.setText(T`Importa ${fresh} nuovi${upd ? T` e aggiorna ${upd}` : ''}`);
    this.importBtn.disabled = fresh + upd === 0;
  }

  renderProgress(total) {
    const c = this.contentEl;
    c.empty();
    c.createEl('h3', { text: T('Importazione in corso…') });
    const bar = c.createDiv('crm-progress');
    this.barFill = bar.createDiv('crm-progress-fill');
    this.progText = c.createDiv({ cls: 'crm-muted', text: `0 / ${total}` });
    const stop = c.createEl('button', { cls: 'crm-btn', text: T('Interrompi') });
    stop.addEventListener('click', () => { this.cancelled = true; });
  }

  async run() {
    const sel = this.records.filter((r) => this.selected.has(r._id));
    if (!sel.length) return;
    this.renderProgress(sel.length);
    const seenCompanies = new Set();
    let created = 0;
    let updated = 0;
    let skipped = 0;
    const errors = [];
    for (let i = 0; i < sel.length && !this.cancelled; i++) {
      const r = sel[i];
      try {
        if (r.status === 'esiste') {
          const vals = this.opts.merge === 'fill' ? mergeValues(r.match, r) : {};
          if (Object.keys(vals).length) { await this.plugin.saveContact(r.match.file, vals); updated++; } else skipped++;
        } else {
          const rec = Object.assign({}, r);
          if (this.opts.relazione) rec.relazione = this.opts.relazione;
          await this.plugin.createContactFast(rec, { companies: this.opts.companies, seen: seenCompanies });
          created++;
        }
      } catch (e) { errors.push(`${r._name}: ${e.message}`); }
      if (i % 10 === 0 || i === sel.length - 1) {
        this.barFill.style.width = `${Math.round(((i + 1) / sel.length) * 100)}%`;
        this.progText.setText(`${i + 1} / ${sel.length}`);
        await new Promise((res) => setTimeout(res, 0));
      }
    }
    this.renderDone({ created, updated, skipped, errors, stopped: this.cancelled });
  }

  renderDone(s) {
    this.cancelled = false;
    const c = this.contentEl;
    c.empty();
    c.createEl('h3', { text: s.stopped ? T('Importazione interrotta') : T('Importazione completata') });
    const ul = c.createEl('ul');
    ul.createEl('li', { text: T`${s.created} contatti creati` });
    ul.createEl('li', { text: T`${s.updated} contatti esistenti completati` });
    ul.createEl('li', { text: T`${s.skipped} saltati` });
    if (s.errors.length) {
      ul.createEl('li', { text: T`${s.errors.length} errori` });
      c.createEl('pre', { cls: 'crm-imp-errors', text: s.errors.slice(0, 20).join('\n') });
    }
    const foot = c.createDiv('crm-form-foot');
    foot.createEl('button', { cls: 'crm-btn', text: T('Chiudi') }).addEventListener('click', () => this.close());
    const go = foot.createEl('button', { cls: 'crm-btn crm-btn-primary', text: T('Apri il CRM') });
    go.addEventListener('click', () => { this.close(); this.plugin.activateView(); });
    if (this.onDone) this.onDone();
  }
}

/* ───────────────────────── Grafo delle relazioni ───────────────────────── */

class RelGraph {
  constructor(host, data, hooks) {
    this.host = host;
    this.nodes = data.nodes;
    this.hooks = hooks;
    this.cv = host.createEl('canvas', { cls: 'crm-graph-canvas' });
    this.ctx = this.cv.getContext('2d');
    this.k = 1; this.tx = 0; this.ty = 0;
    this.alpha = 1; this.ticks = 0; this.raf = 0; this.draws = 0;
    this.hover = null; this.sel = hooks.selected || null;
    this.dragNode = null; this.panning = false; this.moved = false;
    this.start = { x: 0, y: 0 }; this.last = { x: 0, y: 0 };
    this.inited = false;
    const byId = new Map(this.nodes.map((n) => [n.id, n]));
    this.byId = byId;
    this.adj = new Map();
    this.links = [];
    const addAdj = (a, b) => { if (!this.adj.has(a)) this.adj.set(a, new Set()); this.adj.get(a).add(b); };
    for (const e of data.edges) {
      const a = byId.get(e.a);
      const b = byId.get(e.b);
      if (!a || !b) continue;
      this.links.push({ a, b, kind: e.kind });
      addAdj(a.id, b.id); addAdj(b.id, a.id);
    }
    for (const l of this.links) { l.da = this.adj.get(l.a.id).size || 1; l.db = this.adj.get(l.b.id).size || 1; }
    const n = this.nodes.length;
    const R = 60 + Math.sqrt(n) * 30;
    let seeded = 0;
    this.nodes.forEach((nd, i) => {
      const p = hooks.pos.get(nd.id);
      if (p) { nd.x = p.x; nd.y = p.y; seeded++; }
      else { const ang = i * 2.399963; const r = Math.sqrt((i + 0.5) / n) * R; nd.x = Math.cos(ang) * r; nd.y = Math.sin(ang) * r; }
      nd.vx = 0; nd.vy = 0; nd.fixed = false;
    });
    this.restored = seeded > n * 0.5 && hooks.cam;
    this.autoFit = !this.restored;
    this.alpha = seeded > n * 0.5 ? 0.12 : 1;
    this.readColors();

    const cv = this.cv;
    cv.style.touchAction = 'none';
    cv.addEventListener('pointerdown', (e) => this.onDown(e));
    cv.addEventListener('pointermove', (e) => this.onMove(e));
    cv.addEventListener('pointerup', (e) => this.onUp(e));
    cv.addEventListener('pointercancel', (e) => this.onUp(e));
    cv.addEventListener('wheel', (e) => { e.preventDefault(); this.zoomAt(e.offsetX, e.offsetY, e.deltaY < 0 ? 1.12 : 1 / 1.12); }, { passive: false });
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(host);
    this.resize();
    this.kick();
  }

  readColors() {
    const cs = getComputedStyle(this.host.ownerDocument.body);
    const g = (v, d) => (cs.getPropertyValue(v) || d).trim() || d;
    this.col = {
      edge: g('--background-modifier-border-hover', '#8884'),
      text: g('--text-normal', '#222'),
      muted: g('--text-muted', '#777'),
      accent: g('--interactive-accent', '#7c5cff'),
      bg: g('--background-primary', '#fff'),
      font: g('--font-interface', 'sans-serif'),
    };
  }

  resize() {
    const w = this.host.clientWidth;
    const h = this.host.clientHeight;
    if (!w || !h) return;
    this.dpr = window.devicePixelRatio || 1;
    this.w = w; this.h = h;
    this.cv.width = Math.round(w * this.dpr);
    this.cv.height = Math.round(h * this.dpr);
    this.cv.style.width = w + 'px';
    this.cv.style.height = h + 'px';
    if (!this.inited) {
      this.inited = true;
      if (this.restored) { this.k = this.hooks.cam.k; this.tx = this.hooks.cam.tx; this.ty = this.hooks.cam.ty; }
      else { this.tx = w / 2; this.ty = h / 2; }
    }
    this.draw();
  }

  toWorld(e) { return { x: (e.offsetX - this.tx) / this.k, y: (e.offsetY - this.ty) / this.k }; }

  pick(p) {
    for (let i = this.nodes.length - 1; i >= 0; i--) {
      const n = this.nodes[i];
      const dx = p.x - n.x;
      const dy = p.y - n.y;
      const r = n.r + 4 / this.k;
      if (dx * dx + dy * dy <= r * r) return n;
    }
    return null;
  }

  onDown(e) {
    this.cv.setPointerCapture(e.pointerId);
    const n = this.pick(this.toWorld(e));
    this.moved = false;
    this.start = { x: e.offsetX, y: e.offsetY };
    this.last = { x: e.offsetX, y: e.offsetY };
    if (n) { this.dragNode = n; n.fixed = true; this.alpha = Math.max(this.alpha, 0.35); this.kick(); }
    else this.panning = true;
  }

  onMove(e) {
    const far = Math.abs(e.offsetX - this.start.x) + Math.abs(e.offsetY - this.start.y) > 4;
    if (this.dragNode) {
      const p = this.toWorld(e);
      this.dragNode.x = p.x; this.dragNode.y = p.y;
      this.dragNode.vx = 0; this.dragNode.vy = 0;
      if (far) this.moved = true;
      this.alpha = Math.max(this.alpha, 0.3);
      this.kick();
    } else if (this.panning) {
      this.tx += e.offsetX - this.last.x;
      this.ty += e.offsetY - this.last.y;
      if (far) this.moved = true;
      this.draw();
    } else {
      const n = this.pick(this.toWorld(e));
      if (n !== this.hover) { this.hover = n; this.cv.style.cursor = n ? 'pointer' : 'grab'; this.draw(); }
    }
    this.last = { x: e.offsetX, y: e.offsetY };
  }

  onUp() {
    if (this.dragNode) {
      const n = this.dragNode;
      n.fixed = false;
      this.dragNode = null;
      if (!this.moved) { this.sel = n.id; this.hooks.onSelect(n); }
    }
    this.panning = false;
    this.draw();
  }

  zoomAt(x, y, f) {
    const k2 = Math.min(4, Math.max(0.15, this.k * f));
    this.tx = x - (x - this.tx) * (k2 / this.k);
    this.ty = y - (y - this.ty) * (k2 / this.k);
    this.k = k2;
    this.draw();
  }
  zoomBy(f) { this.zoomAt(this.w / 2, this.h / 2, f); }

  fit() {
    if (!this.nodes.length || !this.w) return;
    let x0 = Infinity; let y0 = Infinity; let x1 = -Infinity; let y1 = -Infinity;
    for (const n of this.nodes) { x0 = Math.min(x0, n.x); y0 = Math.min(y0, n.y); x1 = Math.max(x1, n.x); y1 = Math.max(y1, n.y); }
    const bw = Math.max(80, x1 - x0);
    const bh = Math.max(80, y1 - y0);
    this.k = Math.min(3, Math.max(0.15, Math.min(this.w / bw, this.h / bh) * 0.82));
    this.tx = this.w / 2 - ((x0 + x1) / 2) * this.k;
    this.ty = this.h / 2 - ((y0 + y1) / 2) * this.k;
    this.draw();
  }

  setSelected(id) { this.sel = id; this.draw(); }

  kick() { if (!this.raf) this.raf = requestAnimationFrame(() => this.loop()); }

  loop() {
    this.raf = 0;
    const steps = this.ticks < 160 ? 2 : 1;
    for (let i = 0; i < steps; i++) this.step();
    if (this.autoFit && this.ticks >= 90 && this.ticks < 94) this.fit();
    this.draw();
    if (this.alpha > 0.015 || this.dragNode) this.kick();
  }

  step() {
    const N = this.nodes;
    const a = this.alpha;
    for (let i = 0; i < N.length; i++) {
      const p = N[i];
      for (let j = i + 1; j < N.length; j++) {
        const q = N[j];
        let dx = p.x - q.x;
        let dy = p.y - q.y;
        let d2 = dx * dx + dy * dy;
        if (d2 > 160000) continue;
        if (d2 < 16) { dx = Math.random() - 0.5; dy = Math.random() - 0.5; d2 = 16; }
        const s = (600 * a) / d2;
        p.vx += dx * s; p.vy += dy * s; q.vx -= dx * s; q.vy -= dy * s;
      }
    }
    for (const l of this.links) {
      const dx = l.b.x - l.a.x;
      const dy = l.b.y - l.a.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const L = l.kind === 'company' ? 55 : 75;
      const s = ((d - L) / d) * 0.3 * a;
      l.a.vx += (dx * s) / l.da; l.a.vy += (dy * s) / l.da; l.b.vx -= (dx * s) / l.db; l.b.vy -= (dy * s) / l.db;
    }
    for (const n of N) {
      n.vx -= n.x * 0.01 * a;
      n.vy -= n.y * 0.01 * a;
      if (n.fixed) continue;
      n.vx *= 0.78; n.vy *= 0.78;
      const sp = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
      if (sp > 30) { n.vx = (n.vx / sp) * 30; n.vy = (n.vy / sp) * 30; }
      n.x += n.vx; n.y += n.vy;
    }
    this.ticks++;
    if (!this.dragNode) this.alpha *= 0.982;
  }

  draw() {
    if (!this.w) return;
    if (this.draws++ % 90 === 0) this.readColors();
    const ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.save();
    ctx.translate(this.tx, this.ty);
    ctx.scale(this.k, this.k);
    const focus = this.hover || (this.sel ? this.byId.get(this.sel) : null);
    const nb = focus ? (this.adj.get(focus.id) || new Set()) : null;

    for (const l of this.links) {
      const hot = focus && (l.a === focus || l.b === focus);
      ctx.globalAlpha = focus && !hot ? 0.12 : 1;
      ctx.strokeStyle = hot ? this.col.accent : this.col.edge;
      ctx.lineWidth = (hot ? 2 : 1) / this.k;
      if (l.kind === 'tramite' || l.kind === 'partner') ctx.setLineDash([4 / this.k, 3 / this.k]); else ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(l.a.x, l.a.y); ctx.lineTo(l.b.x, l.b.y); ctx.stroke();
    }
    ctx.setLineDash([]);

    for (const n of this.nodes) {
      const dim = focus && n !== focus && !nb.has(n.id);
      ctx.globalAlpha = dim ? 0.25 : 1;
      ctx.fillStyle = n.color;
      ctx.beginPath();
      if (n.kind === 'company') ctx.rect(n.x - n.r, n.y - n.r, n.r * 2, n.r * 2);
      else ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
      if (n.id === this.sel) { ctx.lineWidth = 2.5 / this.k; ctx.strokeStyle = this.col.accent; ctx.stroke(); }
    }

    ctx.globalAlpha = 1;
    ctx.font = `${12 / this.k}px ${this.col.font}`;
    ctx.textAlign = 'center';
    for (const n of this.nodes) {
      const show = n === focus || (nb && nb.has(n.id)) || n.kind === 'company' || n.id === this.sel || this.k > 1.3;
      if (!show) continue;
      const dim = focus && n !== focus && !nb.has(n.id);
      if (dim) continue;
      ctx.fillStyle = this.col.text;
      ctx.fillText(n.label, n.x, n.y + n.r + 13 / this.k);
    }
    ctx.restore();
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    if (this.ro) this.ro.disconnect();
    for (const n of this.nodes) this.hooks.pos.set(n.id, { x: n.x, y: n.y });
    this.hooks.cam = { k: this.k, tx: this.tx, ty: this.ty };
    this.hooks.saveCam(this.hooks.cam);
  }
}

/* ───────────────────────── Impostazioni ───────────────────────── */

/* ───────────────────────── Personalizzazione: campi, colonne, tema, Google Calendar ───────────────────────── */

const BASE_FIELDS = FIELDS.slice();
for (const f of BASE_FIELDS) f.label0 = f.label;
let FIELD_CFG = { hidden: [], labels: {}, custom: [], tableCols: [] };
const isHidden = (k) => FIELD_CFG.hidden.includes(k);
const FL = (k, def) => FIELD_CFG.labels[k] || def;

const slugKey = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

function rebuildAliasMap() {
  for (const k of Object.keys(ALIAS_MAP)) delete ALIAS_MAP[k];
  for (const f of FIELDS) for (const a of f.al) ALIAS_MAP[a] = f;
}

/* Applica etichette, campi nascosti e campi personalizzati alla lista FIELDS (in place) */
function applyFieldConfig(cfg) {
  FIELD_CFG = {
    hidden: [...(cfg.hidden || [])],
    labels: { ...(cfg.labels || {}) },
    custom: [...(cfg.custom || [])],
    tableCols: [...(cfg.tableCols || [])],
  };
  FIELDS.length = BASE_FIELDS.length;
  for (const k of Object.keys(FM)) if (!BASE_FIELDS.some((f) => f.k === k)) delete FM[k];
  for (const f of BASE_FIELDS) f.label = FIELD_CFG.labels[f.k] || f.label0;
  for (const cf of FIELD_CFG.custom) {
    if (FM[cf.k]) continue;
    const f = {
      k: cf.k, label: FIELD_CFG.labels[cf.k] || cf.label, label0: cf.label, group: T(cf.group || T('Altri campi')),
      dk: cf.dk, al: [norm(cf.dk)], custom: true,
    };
    if (cf.type && cf.type !== 'text') f.type = cf.type;
    FIELDS.push(f);
    FM[f.k] = f;
  }
  rebuildAliasMap();
}

/* Colonne della tabella */
const COLS = {
  relazione: { label: T('Relazione'), cell: (v, td, c) => v.relBadges(td, c) },
  vicinanza: {
    label: T('Vicinanza'),
    cell: (v, td, c) => {
      const x = cv(c.s('vicinanza'));
      if (x) { td.createSpan({ cls: `crm-prox prox-${x}` }); td.createSpan({ cls: 'crm-prox-t', text: cap(dv(c.s('vicinanza'))) }); }
    },
  },
  citta: { label: T('Città'), cell: (v, td, c) => {
    const city = c.s('citta'); if (!city) { td.setText('—'); return; }
    const a = td.createEl('a', { cls: 'crm-cell-link', text: city, attr: { 'aria-label': T`Mostra tutte le persone a ${city}` } });
    a.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); v.plugin.navigate({ reset: true, toggle: { key: 'citta', v: city } }); });
  } },
  ultimo: { label: T('Ultimo contatto'), cell: (v, td, c) => td.setText(c.due.last ? relTime(c.due.last) : '—') },
  followup: { label: T('Follow-up'), cell: (v, td, c) => v.dueChip(td, c) },
  priorita: { label: T('Priorità'), cell: (v, td, c) => v.priChip(td, c) },
  compleanno: { label: T('Compleanno'), cell: (v, td, c) => {
    td.setText(c.bday ? `${fmtDM(c.bday.date)} · ${T`tra ${c.bday.days} gg`}` : '—');
    if (c.bday) { const ic = td.createSpan({ cls: 'crm-cell-cal clickable-icon', attr: { 'aria-label': T('Aggiungi al calendario') } }); setIcon(ic, hasGcalMark(c) ? 'calendar-check' : 'calendar-plus'); ic.addEventListener('click', (ev) => { ev.stopPropagation(); v.plugin.calendarMenu([c], ev); }); }
  } },
};
function colDef(key) {
  const label = (def) => FIELD_CFG.labels[key] || def;
  if (COLS[key]) return { label: label(COLS[key].label), cell: COLS[key].cell };
  const f = FM[key];
  if (!f) return null;
  return {
    label: f.label,
    cell: (v, td, c) => {
      const val = (f.type === 'list' || f.type === 'companylist') ? c.l(key).join(', ') : c.s(key);
      if (!val) { td.setText('—'); return; }
      const kind = { email: 'email', emaillavoro: 'email', telefono: 'tel', whatsapp: 'whatsapp', instagram: 'instagram', linkedin: 'linkedin' }[key];
      const href = kind ? linkFor(kind, val) : null;
      if (href) {
        const a = td.createEl('a', { cls: 'crm-cell-link', text: val, href, attr: { target: '_blank', rel: 'noopener' } });
        a.addEventListener('click', (e) => e.stopPropagation());
        return;
      }
      if (key === 'azienda' || key === 'aziendepassate') {
        const names = (key === 'azienda' ? [c.s('azienda')] : c.l(key)).map((x) => String(x || '').replace(/^\[\[|\]\]$/g, '').split('|').pop().trim()).filter(Boolean);
        names.forEach((co, i) => {
          if (i) td.appendText(', ');
          const mini = td.createSpan('crm-co-mini');
          const logo = v.plugin.companyLogo ? v.plugin.companyLogo(co) : '';
          const fallback = () => { mini.empty(); mini.removeClass('has-img'); setIcon(mini, 'building-2'); };
          if (logo) { mini.addClass('has-img'); const im = mini.createEl('img', { attr: { src: logo, alt: '' } }); im.addEventListener('error', fallback); } else fallback();
          const a = td.createEl('a', { cls: 'crm-cell-link', text: co });
          a.addEventListener('click', (e) => {
            e.preventDefault(); e.stopPropagation();
            v.plugin.openCompany(co);
          });
        });
        return;
      }
      td.setText(val);
    },
  };
}
function colText(c, key) {
  if (key === 'ultimo') return c.due.last ? `${fmtDate(c.due.last)} ${relTime(c.due.last)}` : '';
  if (key === 'followup') return c.due.due ? fmtDate(c.due.due) : '';
  if (key === 'compleanno') return c.bday ? fmtDM(c.bday.date) : '';
  const f = FM[key];
  const v = (f && (f.type === 'list' || f.type === 'companylist')) ? c.l(key).join(', ') : c.s(key);
  return ['relazione', 'vicinanza', 'priorita', 'stato', 'canale'].includes(key) ? `${v} ${dv(v)}` : v;
}
function colSortVal(c, key) {
  if (key === 'ultimo') return c.due.last ? c.due.last.getTime() : -BIG;
  if (key === 'followup') return c.due.due ? c.due.due.getTime() : BIG;
  if (key === 'compleanno') return c.bday ? c.bday.days : 1e9;
  if (key === 'priorita') return prioRank(c);
  return norm(colText(c, key));
}
function allColKeys() {
  return [...Object.keys(COLS), ...FIELDS.map((f) => f.k).filter((k) => !COLS[k] && !['nome', 'cognome', 'note'].includes(k))];
}

/* Tema: genera il CSS dalle impostazioni (tutto opzionale: vuoto = colori/font del tema Obsidian) */
const UI_FONTS = {
  sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  serif: 'Georgia, "Times New Roman", serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
};
const UI_ROW_H = { compact: 30, normal: 38, comfortable: 46 };
function buildThemeCss(u) {
  const r = Math.max(0, Math.min(20, Number(u.radius) || 0));
  const h = UI_ROW_H[u.density] || UI_ROW_H.normal;
  const k = (Number(u.scale) || 100) / 100;
  const scopes = ['.crm-root', '.crm-modal', '.crm-oggi', '.crm-import'].map((s) => 'body ' + s).join(', ');
  const d = [];
  if (u.accent) d.push(`--interactive-accent: ${u.accent}`, `--interactive-accent-hover: ${u.accent}`);
  if (u.cDanger) d.push(`--color-red: ${u.cDanger}`);
  if (u.cWarn) d.push(`--color-orange: ${u.cWarn}`);
  if (u.cOk) d.push(`--color-green: ${u.cOk}`);
  if (u.cBday) d.push(`--color-purple: ${u.cBday}`);
  const font = u.font === 'custom' ? (u.fontCustom || '').trim() : UI_FONTS[u.font];
  if (font) d.push(`--font-interface: ${font}`, `font-family: ${font}`);
  if (k !== 1) {
    d.push(`--font-ui-smaller: ${(12 * k).toFixed(1)}px`, `--font-ui-small: ${(13 * k).toFixed(1)}px`,
      `--font-ui-medium: ${(15 * k).toFixed(1)}px`, `--font-ui-large: ${(20 * k).toFixed(1)}px`);
  }
  let css = `body.theme-light, body.theme-dark { --crm-r: ${r}px; --crm-r-lg: ${r + 2}px; --crm-row-h: ${h}px; }\n`;
  if (d.length) css += `${scopes} { ${d.join('; ')}; }\n`;
  return css;
}

/* Google Calendar: link "crea evento" precompilato (evento annuale, tutto il giorno) */
const ymd = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
function fillTpl(tpl, o) {
  return String(tpl || '').replace(/\{(nome|first)\}/g, o.nome || '').replace(/\{(cognome|last)\}/g, o.cognome || '')
    .replace(/\{(eta|age)\}/g, o.eta || '').replace(/\s{2,}/g, ' ').trim();
}
function buildGcalUrl(info, g) {
  const nb = nextBirthday(info.date);
  if (!nb) return null;
  const end = new Date(nb.date.getFullYear(), nb.date.getMonth(), nb.date.getDate() + 1);
  const o = { nome: info.nome, cognome: info.cognome, eta: nb.age != null ? T`(${nb.age} anni)` : '' };
  const q = [
    ['action', 'TEMPLATE'],
    ['text', fillTpl(g.title, o) || T`Compleanno di ${info.nome}`],
    ['dates', `${ymd(nb.date)}/${ymd(end)}`],
    ['details', fillTpl(g.details, o)],
    ['recur', 'RRULE:FREQ=YEARLY'],
  ];
  return 'https://calendar.google.com/calendar/render?' + q.map(([a, b]) => `${a}=${encodeURIComponent(b)}`).join('&');
}
const hasGcalMark = (c) => Object.keys(c.fm || {}).some((k) => ['compleannoincalendario', 'birthdayincalendar'].includes(norm(k)));

class BulkDeleteModal extends Modal {
  constructor(app, plugin, list, done) { super(app); this.plugin = plugin; this.list = list; this.done = done; }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    const n = this.list.length;
    this.titleEl.setText(T`Eliminare ${n} contatti?`);
    contentEl.createEl('p', { text: T('Le note verranno spostate nel cestino secondo le impostazioni di Obsidian. Le interazioni collegate restano nel vault.') });
    const ul = contentEl.createEl('ul');
    for (const c of this.list.slice(0, 8)) ul.createEl('li', { text: c.name });
    if (n > 8) ul.createEl('li', { cls: 'crm-muted', text: `+${n - 8}` });
    const foot = contentEl.createDiv('crm-form-foot');
    foot.createEl('button', { cls: 'crm-btn', text: T('Annulla') }).addEventListener('click', () => this.close());
    const del = foot.createEl('button', { cls: 'crm-btn crm-btn-danger', text: T('Elimina') });
    del.addEventListener('click', async () => {
      this.close();
      for (const c of this.list) await this.app.fileManager.trashFile(c.file);
      new Notice(T`${n} contatti eliminati`);
      this.done();
    });
    setTimeout(() => del.focus(), 0);
  }
  onClose() { this.contentEl.empty(); }
}

class TextPromptModal extends Modal {
  constructor(app, title, placeholder, initial, onSubmit) { super(app); this.t = title; this.ph = placeholder; this.init = initial || ''; this.onSubmit = onSubmit; }
  onOpen() {
    const { contentEl } = this; contentEl.empty(); this.titleEl.setText(this.t);
    const inp = contentEl.createEl('input', { type: 'text', attr: { placeholder: this.ph, style: 'width:100%' } }); inp.value = this.init;
    const foot = contentEl.createDiv('crm-form-foot');
    foot.createEl('button', { cls: 'crm-btn', text: T('Annulla') }).addEventListener('click', () => this.close());
    const ok = foot.createEl('button', { cls: 'crm-btn crm-btn-primary', text: T('Salva') });
    const go = () => { const v = inp.value.trim(); this.close(); this.onSubmit(v); };
    ok.addEventListener('click', go);
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
    setTimeout(() => { inp.focus(); inp.select(); }, 0);
  }
  onClose() { this.contentEl.empty(); }
}

class RemoveContactModal extends Modal {
  constructor(app, plugin, c, onConfirm) { super(app); this.plugin = plugin; this.c = c; this.onConfirm = onConfirm; }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    this.titleEl.setText(T`Eliminare ${this.c.name}?`);
    let opt = 'system';
    try { opt = this.app.vault.getConfig('trashOption') || 'system'; } catch (e) { /* default */ }
    const where = { system: T('nel cestino di sistema (recuperabile)'), local: T('nella cartella .trash del vault (recuperabile)'), none: T('in modo definitivo (NON recuperabile)') }[opt] || T('nel cestino');
    contentEl.createEl('p', { text: T`La nota “${this.c.file.basename}” verrà spostata ${where}. Le interazioni collegate restano nel vault.` });
    if (opt === 'none') contentEl.createEl('p', { cls: 'crm-muted', text: T('Puoi cambiare questo comportamento in Impostazioni → File e collegamenti → File eliminati.') });
    const foot = contentEl.createDiv('crm-form-foot');
    foot.createEl('button', { cls: 'crm-btn', text: T('Annulla') }).addEventListener('click', () => this.close());
    if (!this.c.archived) {
      foot.createEl('button', { cls: 'crm-btn', text: T('Archivia invece') }).addEventListener('click', async () => { await this.plugin.setArchived(this.c, true); this.close(); });
    }
    const del = foot.createEl('button', { cls: 'crm-btn crm-btn-danger', text: T('Elimina') });
    del.addEventListener('click', async () => { this.close(); await this.onConfirm(); });
    setTimeout(() => del.focus(), 0);
  }
  onClose() { this.contentEl.empty(); }
}

class BirthdayCalModal extends Modal {
  constructor(app, plugin, info) { super(app); this.plugin = plugin; this.info = info; }
  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    this.titleEl.setText(T('Aggiungi il compleanno a Google Calendar'));
    const nb = nextBirthday(this.info.date);
    const name = [this.info.nome, this.info.cognome].filter(Boolean).join(' ');
    const when = nb ? `${fmtDate(nb.date)}${nb.age != null ? T` (${nb.age} anni)` : ''}` : '';
    contentEl.createEl('p', { text: T`${name}: prossimo compleanno ${when}.` });
    contentEl.createEl('p', {
      cls: 'crm-muted',
      text: T('Si apre Google Calendar con un evento annuale, tutto il giorno, già compilato: devi solo premere “Salva”.'),
    });
    const chk = contentEl.createEl('label', { cls: 'crm-check' });
    const cb = chk.createEl('input', { type: 'checkbox' });
    chk.createSpan({ text: T('Non chiedermelo più quando creo un contatto') });
    const foot = contentEl.createDiv('crm-form-foot');
    foot.createEl('button', { cls: 'crm-btn', text: T('Non ora') }).addEventListener('click', async () => {
      if (cb.checked) { this.plugin.settings.gcal.askOnCreate = false; await this.plugin.saveSettings(); }
      this.close();
    });
    foot.createEl('button', { cls: 'crm-btn crm-btn-primary', text: T('Apri Google Calendar') }).addEventListener('click', async () => {
      if (cb.checked) { this.plugin.settings.gcal.askOnCreate = false; await this.plugin.saveSettings(); }
      await this.plugin.openBirthday(this.info);
      this.close();
    });
  }
  onClose() { this.contentEl.empty(); }
}

/* ───────────────────────── Dialog "Personalizza" ───────────────────────── */

function toHex(css, fallback = '#888888') {
  try {
    const c = document.createElement('canvas').getContext('2d');
    c.fillStyle = '#000000';
    c.fillStyle = String(css).trim();
    return /^#[0-9a-f]{6}$/i.test(c.fillStyle) ? c.fillStyle : fallback;
  } catch (e) { return fallback; }
}
const themeColor = (v) => toHex(getComputedStyle(document.body).getPropertyValue(v));

function renderGeneral(el, plugin) {
  const s = plugin.settings;
  const save = async () => { await plugin.saveSettings(); plugin.refreshViews(); };
  const text = (name, desc, key) => new Setting(el).setName(name).setDesc(desc)
    .addText((t) => t.setValue(s[key]).onChange(async (v) => { s[key] = v.trim(); await save(); }));
  text(T('Cartella contatti'), T('Percorso (dalla radice del vault) delle note persona.'), 'personeFolder');
  text(T('Cartella interazioni'), T('Dove salvare le interazioni registrate.'), 'interazioniFolder');
  text(T('Cartella aziende'), T('Dove creare le note azienda mancanti.'), 'aziendeFolder');
  new Setting(el).setName(T('Lingua'))
    .setDesc(T('Automatica = segue la lingua di Obsidian. Dopo il cambio disattiva e riattiva il plugin (Impostazioni → Plugin della community).'))
    .addDropdown((d) => d.addOptions({ auto: T('Automatica'), it: 'Italiano', en: 'English' }).setValue(s.language || 'auto')
      .onChange(async (v) => {
        s.language = v;
        try { if (v === 'auto') localStorage.removeItem('crm-contatti-lang'); else localStorage.setItem('crm-contatti-lang', v); } catch (e) { /* ignore */ }
        await save();
        new Notice(T('Lingua salvata: riavvia il plugin per applicarla.'));
      }));
  new Setting(el).setName(T('Formato data (visualizzazione)'))
    .setDesc(T('Nelle note le date vengono sempre scritte in formato ISO (AAAA-MM-GG), che non è ambiguo.'))
    .addDropdown((d) => d.addOptions({ iso: '2025-03-14 (ISO)', dmy: '14/03/2025', mdy: '03/14/2025' }).setValue(s.dateFormat || 'iso')
      .onChange(async (v) => { s.dateFormat = v; setDateFormat(s.dateFormat, s.slashOrder); await save(); }));
  const orderSetting = new Setting(el).setName(T('Date con la barra (es. 03/04/2025)'))
    .setDesc(T('Come interpretare le date scritte con la barra nelle note esistenti.'))
    .addDropdown((d) => d.addOptions({ auto: T('Automatico (dalla lingua)'), dmy: T('giorno/mese/anno'), mdy: T('mese/giorno/anno') }).setValue(s.slashOrder || 'auto')
      .onChange(async (v) => { s.slashOrder = v; setDateFormat(s.dateFormat, s.slashOrder); await save(); }));
  orderSetting.addButton((b) => b.setButtonText(T('Analizza le note')).onClick(() => {
    const r = plugin.analyzeDates();
    const msg = r.total === 0 ? T('Nessuna data con la barra trovata: sei già a posto.')
      : r.dmy > r.mdy && r.mdy === 0 ? T`Trovate ${r.total} date con la barra: ${r.dmy} sono certamente giorno/mese. Imposto “giorno/mese/anno”.`
      : r.mdy > r.dmy && r.dmy === 0 ? T`Trovate ${r.total} date con la barra: ${r.mdy} sono certamente mese/giorno. Imposto “mese/giorno/anno”.`
      : T`Trovate ${r.total} date con la barra, ma i segnali sono misti o assenti (${r.dmy} giorno/mese, ${r.mdy} mese/giorno). Scegli a mano.`;
    new Notice(msg, 8000);
    const pick = r.total && r.dmy > r.mdy && r.mdy === 0 ? 'dmy' : r.total && r.mdy > r.dmy && r.dmy === 0 ? 'mdy' : null;
    if (pick) { s.slashOrder = pick; setDateFormat(s.dateFormat, s.slashOrder); save().then(() => { plugin.refreshViews(); }); }
  }));
  new Setting(el).setName(T('Collega le aziende con [[link]]'))
    .addToggle((t) => t.setValue(s.linkAziende).onChange(async (v) => { s.linkAziende = v; await save(); }));
  new Setting(el).setName(T('Crea nota azienda se manca'))
    .addToggle((t) => t.setValue(s.createAziende).onChange(async (v) => { s.createAziende = v; await save(); }));
  new Setting(el).setName(T('Arricchisci le aziende in automatico')).setDesc(T('Aprendo la pagina di un’azienda, Kith cerca sito, settore, contatti e logo su Wikidata e sul sito ufficiale. Invia in rete solo il nome dell’azienda. Spegni per usare solo i dati inseriti a mano.'))
    .addToggle((t) => t.setValue(s.autoEnrichCompanies !== false).onChange(async (v) => { s.autoEnrichCompanies = v; await save(); }));
  new Setting(el).setName(T('Finestra compleanni (giorni)'))
    .addText((t) => t.setValue(String(s.birthdayWindow)).onChange(async (v) => { s.birthdayWindow = Math.max(1, parseInt(v, 10) || 30); await save(); }));
  new Setting(el).setName(T('Vista predefinita'))
    .addDropdown((d) => d.addOptions({ tabella: T('Tabella'), schede: T('Schede'), kanban: T('Kanban'), rete: T('Rete') }).setValue(s.defaultMode)
      .onChange(async (v) => { s.defaultMode = v; await save(); }));
  new Setting(el).setName(T('Calendario .ics: includi i follow-up'))
    .setDesc(T('L’export .ics contiene sempre i compleanni (ricorrenti ogni anno); attiva per aggiungere anche le scadenze di ricontatto.'))
    .addToggle((t) => t.setValue(s.icsFollowup).onChange(async (v) => { s.icsFollowup = v; await save(); }));
  new Setting(el).setName(T('Conferma prima di eliminare un contatto'))
    .setDesc(T('Se spento, “Elimina” sposta subito la nota nel cestino senza chiedere.'))
    .addToggle((t) => t.setValue(s.confirmDelete).onChange(async (v) => { s.confirmDelete = v; await save(); }));
  new Setting(el).setName(T('Widget “Oggi” nelle nuove daily note (sperimentale)'))
    .setDesc(T('Aggiunge il blocco crm-oggi alle daily note appena create. Dipende dalle impostazioni del plugin Note giornaliere.'))
    .addToggle((t) => t.setValue(s.autoDailyWidget).onChange(async (v) => { s.autoDailyWidget = v; await save(); }));
}

/* selettore colore con conferma esplicita (Salva / Annulla) */
function addColorWithSave(setting, initial, onSave) {
  let cur = initial, pending = initial;
  const wrap = setting.controlEl.createDiv('crm-colorsave');
  const inp = wrap.createEl('input', { type: 'color', cls: 'crm-colorsave-inp' });
  inp.value = /^#[0-9a-f]{6}$/i.test(initial) ? initial : '#888888';
  const hex = wrap.createEl('input', { type: 'text', cls: 'crm-colorsave-hex', attr: { maxlength: '7', spellcheck: 'false' } });
  hex.value = inp.value;
  const ok = wrap.createEl('button', { cls: 'clickable-icon crm-colorsave-ok', attr: { 'aria-label': T('Salva colore'), title: T('Salva colore') } });
  setIcon(ok, 'check');
  const no = wrap.createEl('button', { cls: 'clickable-icon crm-colorsave-no', attr: { 'aria-label': T('Annulla'), title: T('Annulla') } });
  setIcon(no, 'x');
  const sync = () => { const dirty = pending.toLowerCase() !== cur.toLowerCase(); wrap.toggleClass('is-dirty', dirty); };
  const set = (v) => { pending = v; inp.value = v; hex.value = v; sync(); };
  let tm = null;
  const commit = async () => { clearTimeout(tm); if (pending.toLowerCase() === cur.toLowerCase()) return; cur = pending; sync(); await onSave(cur); };
  inp.addEventListener('input', () => { set(inp.value); clearTimeout(tm); tm = setTimeout(commit, 400); });
  inp.addEventListener('change', commit);
  hex.addEventListener('input', () => { let v = hex.value.trim(); if (v && v[0] !== '#') v = '#' + v; if (/^#[0-9a-f]{6}$/i.test(v)) { pending = v; inp.value = v; sync(); clearTimeout(tm); tm = setTimeout(commit, 600); } });
  ok.addEventListener('click', commit);
  no.addEventListener('click', () => set(cur));
  hex.addEventListener('keydown', (e) => { if (e.key === 'Enter') ok.click(); if (e.key === 'Escape') no.click(); });
}

class CustomizeModal extends Modal {
  constructor(app, plugin) { super(app); this.plugin = plugin; this.tab = 'aspetto'; this.draft = { label: '', key: '', type: 'text', group: T('Altri campi') }; }
  get s() { return this.plugin.settings; }
  onOpen() {
    this.modalEl.addClass('crm-modal', 'crm-custom');
    this.titleEl.setText(T('Personalizza Kith'));
    this.render();
  }
  onClose() { this.contentEl.empty(); }
  async changed(o = {}) {
    await this.plugin.saveSettings();
    if (o.fields) applyFieldConfig(this.s.fields);
    this.plugin.applyTheme();
    this.plugin.refreshViews();
    if (o.rerender) this.renderBody();
  }
  render() {
    const { contentEl } = this;
    contentEl.empty();
    const wrap = contentEl.createDiv('crm-cz');
    const nav = wrap.createDiv('crm-cz-nav');
    this.bodyEl = wrap.createDiv('crm-cz-body');
    const tabs = [['aspetto', T('Aspetto')], ['colori', T('Colori')], ['campi', T('Campi')], ['tabella', T('Tabella')], ['calendario', T('Google Calendar')], ['importa', T('Importa')], ['generale', T('Generale')]];
    for (const [id, label] of tabs) {
      const b = nav.createEl('button', { cls: 'crm-cz-tab' + (this.tab === id ? ' is-active' : ''), text: label });
      b.addEventListener('click', () => { this.tab = id; this.render(); });
    }
    this.renderBody();
  }
  renderBody() {
    this.bodyEl.empty();
    this['tab_' + this.tab](this.bodyEl);
  }
  reset(el, keys, label = T('Ripristina predefiniti')) {
    new Setting(el).addButton((b) => b.setButtonText(label).onClick(async () => {
      const def = JSON.parse(JSON.stringify(DEFAULT_SETTINGS.ui));
      for (const k of keys) this.s.ui[k] = def[k];
      await this.changed({ rerender: true });
    }));
  }

  tab_aspetto(el) {
    const u = this.s.ui;
    new Setting(el).setName(T('Font')).setDesc(T('“Come il tema” usa il font di Obsidian/Minimal.'))
      .addDropdown((d) => d.addOptions({ theme: T('Come il tema'), sans: T('Sans di sistema'), serif: 'Serif', mono: T('Monospazio'), custom: T('Personalizzato…') })
        .setValue(u.font).onChange(async (v) => { u.font = v; await this.changed({ rerender: true }); }));
    if (u.font === 'custom') {
      new Setting(el).setName(T('Famiglia font')).setDesc(T('Nome di un font installato, es. Inter o "SF Pro Text".'))
        .addText((t) => t.setValue(u.fontCustom).setPlaceholder('Inter').onChange(async (v) => { u.fontCustom = v; await this.changed(); }));
    }
    new Setting(el).setName(T('Dimensione testo')).setDesc(T('Scala tutta l’interfaccia del CRM (100% = dimensione del tema).'))
      .addSlider((sl) => sl.setLimits(85, 130, 5).setValue(u.scale).setDynamicTooltip().onChange(async (v) => { u.scale = v; await this.changed(); }));
    new Setting(el).setName(T('Densità righe')).setDesc(T('Altezza delle righe della tabella.'))
      .addDropdown((d) => d.addOptions({ compact: T('Compatta'), normal: T('Normale'), comfortable: T('Comoda') }).setValue(u.density)
        .onChange(async (v) => { u.density = v; await this.changed(); }));
    new Setting(el).setName(T('Arrotondamento angoli'))
      .addSlider((sl) => sl.setLimits(0, 14, 1).setValue(u.radius).setDynamicTooltip().onChange(async (v) => { u.radius = v; await this.changed(); }));
    new Setting(el).setName(T('Bordi tra le colonne'))
      .addToggle((t) => t.setValue(u.colBorders).onChange(async (v) => { u.colBorders = v; await this.changed(); }));
    new Setting(el).setName(T('Striscia KPI in alto'))
      .addToggle((t) => t.setValue(u.showKpi).onChange(async (v) => { u.showKpi = v; await this.changed(); }));
    this.reset(el, ['font', 'fontCustom', 'scale', 'density', 'radius', 'colBorders', 'showKpi']);
  }

  tab_colori(el) {
    const u = this.s.ui;
    el.createEl('p', { cls: 'crm-muted', text: T('Di base il CRM usa i colori del tema attivo (Minimal). Qui puoi sovrascriverli solo per il CRM.') });
    const color = (name, desc, key, cssVar) => { const st = new Setting(el).setName(name).setDesc(desc);
      addColorWithSave(st, u[key] || themeColor(cssVar), async (v) => { u[key] = v; await this.changed(); });
      st.addExtraButton((b) => b.setIcon('rotate-ccw').setTooltip(T('Usa il colore del tema')).onClick(async () => { u[key] = ''; await this.changed({ rerender: true }); })); };
    color(T('Accento'), T('Pulsanti principali, selezione, filtro attivo.'), 'accent', '--interactive-accent');
    color(T('Scaduto / priorità alta'), T('Follow-up scaduti e priorità alta.'), 'cDanger', '--color-red');
    color(T('In scadenza / priorità media'), T('Follow-up nei prossimi giorni.'), 'cWarn', '--color-orange');
    color(T('Ok'), T('Follow-up non urgenti, vicinanza stretta.'), 'cOk', '--color-green');
    color(T('Compleanni'), T('Evidenziazione dei compleanni.'), 'cBday', '--color-purple');
    new Setting(el).setName(T('Avatar')).setDesc(T('Colorati (tenui, in base al nome) oppure tutti neutri.'))
      .addDropdown((d) => d.addOptions({ tinted: T('Colorati'), neutral: T('Neutri') }).setValue(u.avatarStyle)
        .onChange(async (v) => { u.avatarStyle = v; await this.changed(); }));
    new Setting(el).setName(T('Etichette neutre')).setDesc(T('Spento: ogni valore (relazione, interessi…) prende un colore automatico dal tema.'))
      .addToggle((t) => t.setValue(u.neutralTags).onChange(async (v) => { u.neutralTags = v; await this.changed(); }));

    el.createEl('h4', { cls: 'crm-form-h', text: T('Colore per relazione') });
    const rels = new Map();
    const addRel = (v) => { const kk = cv(v); if (kk && !rels.has(kk)) rels.set(kk, v); };
    for (const c of this.plugin.getContacts()) for (const r of c.rels) addRel(r.label);
    for (const p of PRESETS.relazione) addRel(p);
    for (const [kk, raw] of rels) {
      const st = new Setting(el).setName(cap(dv(raw)));
      addColorWithSave(st, relTone(u, raw) || themeColor(relDefaultVar(raw)) || '#888888', async (v) => { u.relColors[kk] = v; delete u.relColors[norm(raw)]; await this.changed(); });
      st.addExtraButton((bt) => bt.setIcon('rotate-ccw').setTooltip(T('Neutro')).onClick(async () => { delete u.relColors[kk]; delete u.relColors[norm(raw)]; await this.changed({ rerender: true }); }));
    }
    this.reset(el, ['accent', 'cDanger', 'cWarn', 'cOk', 'cBday', 'avatarStyle', 'neutralTags', 'relColors']);
  }

  tab_campi(el) {
    const cfg = this.s.fields;
    el.createEl('p', {
      cls: 'crm-muted',
      text: T('Rinomina i campi, nascondili dal form e dalla scheda, o aggiungine di nuovi. I dati nelle note non vengono mai cancellati.'),
    });
    const groups = [...new Set(FIELDS.map((f) => f.group))];
    for (const g of groups) {
      el.createEl('h4', { cls: 'crm-form-h', text: g });
      for (const f of FIELDS.filter((x) => !x.internal && x.group === g && x.k !== 'nome' && x.k !== 'cognome')) {
        const st = new Setting(el).setName(f.label0 + (f.custom ? T(' · personalizzato') : '')).setDesc(T`Chiave nella nota: ${f.dk}`);
        st.addText((t) => t.setPlaceholder(f.label0).setValue(cfg.labels[f.k] || '').onChange(async (v) => {
          v = v.trim();
          if (v) cfg.labels[f.k] = v; else delete cfg.labels[f.k];
          await this.changed({ fields: true });
        }));
        st.addToggle((t) => t.setTooltip(T('Mostra nel form e nella scheda')).setValue(!cfg.hidden.includes(f.k)).onChange(async (on) => {
          cfg.hidden = cfg.hidden.filter((x) => x !== f.k);
          if (!on) cfg.hidden.push(f.k);
          await this.changed({ fields: true });
        }));
        if (f.custom) {
          st.addExtraButton((b) => b.setIcon('trash').setTooltip(T('Rimuovi il campo (i dati nelle note restano)')).onClick(async () => {
            cfg.custom = cfg.custom.filter((x) => x.k !== f.k);
            cfg.hidden = cfg.hidden.filter((x) => x !== f.k);
            cfg.tableCols = cfg.tableCols.filter((x) => x !== f.k);
            delete cfg.labels[f.k];
            await this.changed({ fields: true, rerender: true });
          }));
        }
      }
    }
    el.createEl('h4', { cls: 'crm-form-h', text: T('Nuovo campo personalizzato') });
    const dr = this.draft;
    new Setting(el).setName(T('Nome del campo')).addText((t) => t.setPlaceholder(T('Es. Taglia regalo')).setValue(dr.label).onChange((v) => { dr.label = v; }));
    new Setting(el).setName(T('Chiave nella nota')).setDesc(T('Nome della proprietà nel frontmatter. Vuoto = ricavata dal nome.'))
      .addText((t) => t.setPlaceholder('taglia_regalo').setValue(dr.key).onChange((v) => { dr.key = v; }));
    new Setting(el).setName(T('Tipo')).addDropdown((d) => d.addOptions({
      text: T('Testo'), longtext: T('Testo lungo'), date: T('Data'), list: T('Lista (valori separati da |)'), enum: T('Scelta (suggerisce i valori già usati)'),
    }).setValue(dr.type).onChange((v) => { dr.type = v; }));
    new Setting(el).setName(T('Sezione del form')).addDropdown((d) => {
      const opts = {};
      for (const g of groups) opts[g] = g;
      opts['Altri campi'] = T('Altri campi');
      d.addOptions(opts).setValue(dr.group).onChange((v) => { dr.group = v; });
    });
    new Setting(el).addButton((b) => b.setButtonText(T('Aggiungi campo')).setCta().onClick(async () => {
      const label = dr.label.trim();
      const dk = slugKey(dr.key.trim() || label);
      if (!label || !dk) { new Notice(T('Inserisci un nome per il campo')); return; }
      if (ALIAS_MAP[norm(dk)]) { new Notice(T`La chiave “${dk}” è già usata da “${ALIAS_MAP[norm(dk)].label}”`); return; }
      let k = 'x_' + norm(dk);
      while (FM[k]) k += '_';
      cfg.custom.push({ k, label, dk, type: dr.type, group: dr.group });
      this.draft = { label: '', key: '', type: 'text', group: T('Altri campi') };
      await this.changed({ fields: true, rerender: true });
    }));
  }

  tab_tabella(el) {
    const cfg = this.s.fields;
    el.createEl('p', { cls: 'crm-muted', text: T('Scegli quali colonne mostrare nella tabella e in che ordine. “Contatto” è sempre la prima.') });
    const move = async (i, d) => {
      const a = cfg.tableCols;
      const j = i + d;
      if (j < 0 || j >= a.length) return;
      [a[i], a[j]] = [a[j], a[i]];
      await this.changed({ rerender: true });
    };
    cfg.tableCols.forEach((key, i) => {
      const def = colDef(key);
      if (!def) return;
      new Setting(el).setName(def.label)
        .addExtraButton((b) => b.setIcon('arrow-up').setTooltip(T('Sposta a sinistra')).onClick(() => move(i, -1)))
        .addExtraButton((b) => b.setIcon('arrow-down').setTooltip(T('Sposta a destra')).onClick(() => move(i, 1)))
        .addExtraButton((b) => b.setIcon('x').setTooltip(T('Rimuovi colonna')).onClick(async () => {
          cfg.tableCols.splice(i, 1);
          await this.changed({ rerender: true });
        }));
    });
    const free = allColKeys().filter((k) => !cfg.tableCols.includes(k));
    let pick = free[0];
    if (free.length) {
      new Setting(el).setName(T('Aggiungi colonna'))
        .addDropdown((d) => {
          const o = {};
          for (const k of free) o[k] = colDef(k).label;
          d.addOptions(o).setValue(pick).onChange((v) => { pick = v; });
        })
        .addButton((b) => b.setButtonText(T('Aggiungi')).onClick(async () => {
          if (!pick) return;
          cfg.tableCols.push(pick);
          await this.changed({ rerender: true });
        }));
    }
    new Setting(el).addButton((b) => b.setButtonText(T('Ripristina colonne predefinite')).onClick(async () => {
      cfg.tableCols = [...DEFAULT_SETTINGS.fields.tableCols];
      await this.changed({ rerender: true });
    }));
  }

  tab_calendario(el) {
    const g = this.s.gcal;
    el.createEl('p', {
      cls: 'crm-muted',
      text: T('Il plugin apre Google Calendar con un evento annuale “tutto il giorno” già compilato; tu premi “Salva”. Non serve collegare nessun account al plugin.'),
    });
    new Setting(el).setName(T('Abilita “Aggiungi a Google Calendar”'))
      .setDesc(T('Mostra il pulsante nella scheda del contatto e il comando dedicato.'))
      .addToggle((t) => t.setValue(g.enabled).onChange(async (v) => { g.enabled = v; await this.changed({ rerender: true }); }));
    new Setting(el).setName(T('Proponi quando creo o modifico un contatto con compleanno'))
      .setDesc(T('Dopo il salvataggio compare una finestra con il pulsante per aprire Google Calendar.'))
      .addToggle((t) => t.setValue(g.askOnCreate).onChange(async (v) => { g.askOnCreate = v; await this.changed(); }));
    new Setting(el).setName(T('Titolo evento')).setDesc(T('Segnaposto: {nome} {cognome} {eta}'))
      .addText((t) => t.setValue(g.title).onChange(async (v) => { g.title = v; await this.changed(); }));
    new Setting(el).setName(T('Descrizione evento')).setDesc(T('Segnaposto: {nome} {cognome} {eta}'))
      .addText((t) => t.setValue(g.details).onChange(async (v) => { g.details = v; await this.changed(); }));
    el.createEl('p', {
      cls: 'crm-muted',
      text: T('Dopo l’inserimento la scheda riceve la proprietà compleanno_in_calendario, così il CRM sa che l’evento esiste. Promemoria e calendario di destinazione si scelgono su Google Calendar al momento del salvataggio.'),
    });
  }

  tab_importa(el) {
    new Setting(el).setName(T('Importa contatti'))
      .setDesc(T('Importa da LinkedIn, rubrica del telefono, Facebook o CSV. Scegli esattamente chi importare prima della conferma: niente viene creato prima.'))
      .addButton((b) => b.setButtonText(T('Apri importatore')).setCta().onClick(() => {
        this.close();
        new ImportModal(this.app, this.plugin, () => this.plugin.refreshViews()).open();
      }));
  }

  tab_generale(el) { renderGeneral(el, this.plugin); }
}

class CRMSettingTab extends PluginSettingTab {
  constructor(app, plugin) { super(app, plugin); this.plugin = plugin; }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    new Setting(containerEl).setName(T('Personalizzazione'))
      .setDesc(T('Colori, font, campi dei contatti, colonne della tabella e Google Calendar.'))
      .addButton((b) => b.setButtonText(T('Apri “Personalizza”')).setCta().onClick(() => new CustomizeModal(this.app, this.plugin).open()));
    renderGeneral(containerEl, this.plugin);
  }
}

module.exports = CRMPlugin;
module.exports.__helpers = { norm, parseDate, toDate, nextBirthday, toList, toStr, Contact, dueInfo, FIELDS, FM, relTime, linkFor, fmtDate, parseCSV, csvToObjects, anyDateToIt, bdayToIt, normPhone, parseLinkedIn, parseGoogleCsv, parseVCards, parseFacebook, parseGenericCsv, detectSource, parseSource, annotate, mergeValues, keysFor, buildICS, parseWidgetOpts, fixFbEncoding, applyFieldConfig, setDateFormat, isoDate, fmtParts, toIsoParts, T, cv, PRESETS, getLang: () => LANG, setLang: (l) => { LANG = l; }, buildThemeCss, buildGcalUrl, colDef, allColKeys, slugKey, DEFAULT_SETTINGS };
