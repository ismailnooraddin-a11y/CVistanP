# Frontend User Acceptance Test Checklist

Use a current version of Chrome or Edge. Test once on desktop and once using a mobile-sized browser viewport.

## 1. Branding and settings

- Open Company Settings.
- Change the trading and legal names and save.
- Upload a wide logo, save, and confirm that it appears on the landing screen, login, sidebar, contract preview, Word export, and PDF export without stretching.
- Replace and remove the logo.
- Refresh the browser and confirm that saved branding remains.

## 2. Contacts

- Create, edit, search, filter, and view a contact.
- Confirm that at least one contact type is required.
- Try a budget-to value below budget-from.
- Try a duplicate primary phone or email.
- Mark a contact inactive or Do not contact and confirm a reason is required.
- Verify the mobile card layout.

## 3. Properties

- Create a property with several images.
- Confirm price-to cannot be lower than price-from.
- Edit and view the property.
- Reserve an available property, then confirm the client, dates, agent, deposit, and status are visible by tap/click.
- Release the reservation and confirm the property returns to Available.
- Test search and filters.
- Export filtered, all, and selected records to Excel and open the workbook.

## 4. Deals

- Create a deal and confirm it starts at New lead.
- Move it forward and backward one stage at a time.
- Confirm a property becomes Reserved when the deal reaches Reservation.
- Confirm Contract preparation requires a reservation for the same client.
- Close a deal as lost and record a reason.
- Advance another deal to Closed won and confirm the property becomes Sold or Rented.
- Open stage history.
- Test the mobile stage list and Advance one stage action.

## 5. Meetings

- Navigate backward and forward by week, then return to the current week.
- Schedule, edit, complete, mark no-show, and cancel a meeting.
- Confirm a cancellation reason is required.
- Attempt overlapping meetings for the same agent.
- Attempt overlapping viewings for the same property.
- Confirm mobile uses an agenda-oriented layout rather than the full desktop calendar.

## 6. Tasks

- Create and edit a task.
- Change assignee, priority, due date, reminder, and status.
- Confirm overdue tasks are visibly identified.
- Complete a task and confirm a completion time is recorded.
- Search and filter tasks.

## 7. Organization and employees

- Create and edit a branch and team.
- Create and edit an employee with branch, team, line manager, contract type, status, leave balances, and document state.
- Search and filter employees.
- Export filtered, all, and selected employees to Excel and open both sheets.
- Confirm no Excel export exists in other modules.

## 8. Contracts

- Select a sale or rental template.
- Select a client and property and confirm known variables populate.
- Change approved clause selections.
- Complete editable sections and any custom dynamic variables.
- Confirm missing values block export with a clear message.
- Review page boundaries and signatures in A4 preview.
- Export to Word and PDF and inspect logo, headings, paragraph spacing, margins, page numbers, contract number, and signature blocks.

## 9. Persistence and responsive behavior

- Refresh after creating records and confirm data remains.
- Switch the active branch and confirm dashboard/property context changes.
- Open and close the mobile navigation using the menu, backdrop, and Escape key where applicable.
- Test every modal with keyboard Tab navigation and Escape.
- Confirm tables become cards or readable mobile layouts instead of requiring excessive horizontal scrolling.

## 10. Reset

- Reset complete demo data in Company Settings.
- Confirm custom records and branding are removed and original sample data returns.
