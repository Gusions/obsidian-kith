# Changelog

## 0.9.5

### Community plugin release
- Prepared for the Obsidian community plugin directory
- **Removed** fetching profile pictures from Instagram. Photos and logos can still be uploaded, pasted from the clipboard, or loaded from an image link you provide
- **UI language** now always follows Obsidian's language (the manual language override was removed)
- Dialog sizes are remembered through Obsidian's own storage API instead of the browser's
- Icons are built with the DOM instead of `innerHTML`

## 0.9.0

### Contacts and graph
- Table is now a card list on phones; Settings and Customize adapt to small screens
- Contact record: company logo in the Companies card, full-page link from the graph side panel, double-click a node in the graph to open its record
- Graph also links people who share a past company or a relationship tag such as *former colleague @ Company*
- **Contacted today** refreshes the views immediately; the birthday calendar button sits on its own centered row

## 0.8.5

### Contacts and companies
- **Same city, different spelling**: Milano and Milan (and about 30 other Italian/English pairs: Roma/Rome, Torino/Turin, Firenze/Florence, Monaco di Baviera/Munich…) are now treated as one city in the **Browse** sidebar (counts are merged), the city filter, the search and the column filter. The label follows the UI language; your notes are never rewritten
- **Text can be selected and copied** on the contact record and the company page (it was blocked by the theme); buttons, icons and resize handles behave as before

### Docs
- README: new **Gallery** (table, kanban, contact record, company page, importer), the *file over app* philosophy, comma-separated lists, updated import path and Italian section

## 0.8.0

### Home
- New header: round buttons (settings, collapse) and a **New contact ▾** pill with *New contact* and *Import contacts*
- Pill search and filters, sort control with icon, saved-view tabs with icons
- Sticky footer with the contact count, refresh and **Export CSV**. CSV exports only the selected contacts; with nothing selected you get a notice instead of a download. *Select all* in the table header selects every contact in the current filter
- Redesigned bulk action bar (pill, icon buttons, selection count)
- The calendar button appears only when contacts are selected; the "download .ics for everyone" action moved to **Settings → General → Reminders and calendar**

### Importer
- **One importer with automatic detection** of LinkedIn, phone (`.vcf` / Google CSV), Facebook and generic CSV files
- Load LinkedIn and your address book together and Kith **cross-checks them** by email, LinkedIn profile and name (accent- and abbreviation-tolerant); homonyms are flagged, existing contacts are detected, and you confirm each row before anything is created
- Merge rules: LinkedIn wins for role, company and profile; the address book wins for phone and personal data
- The importer and every Kith dialog share the same look: white surface, divided header, pill fields and buttons, dashed drop zone

### Customization and settings
- Customize Kith and Settings redesigned: grouped cards, uniform spacing, one font and one control width everywhere
- **Menus**: drop-downs are now Kith pills that open the same popover as every other menu; a second click on a button closes its menu
- **Resizable dialogs** (Customize and Import): drag the corner handle, double-click it to reset; the content adapts and the size is remembered
- Lists (relationship, interests, past companies…) are separated with **commas** when editing; `|` is still understood and used only when a value contains a comma

### Contact page
- Header chips (closeness, priority) removed; the same information stays in the list and the card views
- Field rows aligned: label, value and edit button share one baseline, clearer labels
- *+ New custom field* now opens Customize directly on **Fields**, scrolled to the form with the name focused

### Company page
- *Hidden items (N)* shortcut next to the sections; logo fetch from Instagram; people list integrated in the page

### Fixes
- Side panel starts collapsed and closes when you leave Kith
- Fixed doubled controls, mis-centered text and missing arrows in drop-downs under some themes
- Fixed uneven spacing in settings cards (first and last row touching the border)
- Icons no longer depend on the theme's sizing; fixed text scaling inside dialogs when the text-size setting is above 100%

## 0.7.5

### Navigation
- **Side panel** in the left sidebar: search, filters and quick access. It opens with Kith, stays collapsed until you open it, and closes when you leave Kith
- **Saved views**: save filters, quick filter, search, sort, mode and column filters as tabs; update, rename, delete
- Startup alert for overdue follow-ups and upcoming birthdays

### Contact page
- Redesigned header: large photo, name, role, round action buttons (contacted today, interaction, email, call, edit, other) and an *Actions* menu
- *Other* popover with grouped actions and search: communicate, log a call / meeting / message / email, calendar, photo, copy
- Photo: upload, paste from the clipboard, paste a link, or fetch from Instagram (several fallback sources); the camera badge only shows on hover when a photo exists
- Adding a partner asks whether to add that person to your contacts
- Fixed the *connected people* label (introduced by / introduced you to) when viewing the other side of a link

### Company page
- Same header as the contact page: back button, *Actions* menu, round action buttons and *Edit* for all company fields
- People list integrated in the page (no inner scrolling, aligned columns, email and phone shortcuts)
- Fetch the company logo from Instagram
- Hidden sections and fields can be restored from *Actions → Customize page* or the *Hidden items* shortcut; section and field controls are always visible

### Interface
- Every menu uses the same popover (context menus, column headers, bulk edit with drill-in submenus, calendar menu)
- Consistent buttons across all views; icons no longer depend on the theme's sizing

## 0.7.0

### Table & views
- Table: tabs with counts, pill filters, row checkboxes, CSV export
- Customizable columns with a header menu: sort, filter, pin, move, add and remove fields; table scrolls horizontally instead of clipping
- Bulk action bar above the table (contacted today, interaction, edit, delete, archive, calendar); delete with confirmation
- Detail side pane removed from Table / Cards / Kanban (kept in Network); icon-only view switcher; collapsible header (collapsed by default)
- Clickable company, email and city cells (a city shows everyone living there); mini company icon next to the company name
- Calendar button in the toolbar and next to the birthday date (table and contact page): Google Calendar event or `.ics` export for one contact, a selection, or everyone

### Contact page
- Full-page record (click a name): inline editing, add-field menu, resizable columns, larger photo (96 px)
- Custom photo, or fetch it from the contact's Instagram handle, paste from clipboard, or paste an image link
- Connected people with the reason (partner, "introduced you to X" / "introduced by X"); partner and "met through" suggest existing contacts, save as links and are clickable
- Multi-select relationship with linked company (`Former colleague @ Google`), with default colors per relationship and a working color picker; bold, tinted badges with spacing
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
- Flat redesign, follows the active theme

## 0.2.0
- Importer (LinkedIn, phone, Facebook, CSV), relationship graph, .ics export, "Today" widget
