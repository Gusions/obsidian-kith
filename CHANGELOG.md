# Changelog

## 0.7.0

### Table & views
- HubSpot-style table: tabs with counts, pill filters, row checkboxes, CSV export
- Customizable columns with a header menu: sort, filter, pin, move, add and remove fields; table scrolls horizontally instead of clipping
- Bulk action bar above the table (contacted today, interaction, edit, delete, archive, calendar); delete with confirmation
- Detail side pane removed from Table / Cards / Kanban (kept in Network); icon-only view switcher; collapsible header (collapsed by default)
- Clickable company, email and city cells (a city shows everyone living there); mini company icon next to the company name
- Calendar button in the toolbar and next to the birthday date (table and contact page): Google Calendar event or `.ics` export for one contact, a selection, or everyone

### Contact page
- Full-page record (click a name): inline editing, add-field menu, resizable columns, larger photo (96 px)
- Custom photo, or fetch it from the contact's Instagram handle, paste from clipboard, or paste an image link
- Connected people with the reason (partner, introduced you / introduced by you); partner and "met through" suggest existing contacts, save as links and are clickable
- Multi-select relationship with linked company (`Former colleague @ Lexroom`), with default colors per relationship and a working color picker; bold, tinted badges with spacing
- Companies card: current, past and relationship companies, each linked to everyone in that company. Past companies are shown collapsed by default
- Back button / swipe back through record, company and table

### Company page
- Dedicated page per company: people, info, notes, timeline
- Automatic enrichment from the name or website (Wikidata + website data); only fills empty fields
- Per-company show/hide of sections and fields, with an optional "use for all"
- Resizable columns; empty side columns collapse and the table expands
- Manual logo: upload an image or paste a link when automatic fetching finds nothing

### Forms & language
- New/Edit contact form: collapsible sections with filled-field counters; Obsidian-styled suggestion menu
- Preset values (relationship, closeness, priority, status…) follow the UI language

## 0.6.0
- **Sidebar panel** (desktop): opening Kith adds a Kith tab to the left sidebar, next to Files/Search/Bookmarks. Quick views (active, overdue follow-ups, birthdays, high priority, archived) and filters by relationship, closeness, priority and status, with counts. Closes together with the Kith tab
- New quick view: Archived
- Panel lists the overdue follow-ups and upcoming birthdays by name (click to open, "… and N more")
- Cumulative filters (e.g. Close friends + High priority), "Clear filters", search box in the panel
- The panel appears only while a Kith tab is active and disappears when you switch to another tab (the left sidebar returns to Files)
- Company and City facets; hover quick actions (Contacted today, Log interaction); empty rows hidden
- New/Edit contact form: collapsible sections with filled-field counters; Obsidian-styled suggestion menu replaces the native datalist
- Preset values (relationship, closeness, priority, status…) and a few leftover strings now follow the UI language

## 0.5.1
- Header: **New contact** is now the first button; "Calendar .ics" renamed **Add to calendar**
- **Import** moved into *Customize → Import* (also shown on the empty state and as a command)

## 0.5.0
- Renamed to **Kith** (plugin id `kith`)
- English / Italian UI (follows Obsidian), English + Italian frontmatter keys, bilingual presets
- Date format setting (ISO default), slash-date order detection ("Analyze notes"); notes always store ISO dates
- Red delete button under the Minimal theme

## 0.4.1
- Quick delete with confirmation / archive; right-click menus with copy actions; selectable text in the side panel

## 0.4.0
- Customize dialog: colors, fonts, density, radius, custom / hidden / renamed fields, table columns, Google Calendar birthday link

## 0.3.0
- Flat redesign (Attio / HubSpot inspired), follows the active theme

## 0.2.0
- Importer (LinkedIn, phone, Facebook, CSV), relationship graph, .ics export, "Today" widget
