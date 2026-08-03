import { DemoState } from './types';

const dateInput = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const isoToday = () => dateInput(new Date());
const plusDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return dateInput(date);
};

export function createSeedState(): DemoState {
  const today = isoToday();
  return {
    company: {
      legalName: 'EstateFlow Real Estate LLC',
      tradingName: 'EstateFlow',
      registrationNumber: 'ERB-RE-2026-0142',
      taxNumber: 'TX-982140',
      address: 'Empire Pearl, Erbil, Kurdistan Region of Iraq',
      phone: '+964 750 000 0000',
      email: 'contracts@estateflow.demo',
      website: 'www.estateflow.demo',
      defaultCurrency: 'USD',
      defaultLanguage: 'English',
      signatoryName: 'Ismail Nooraddin',
      signatoryTitle: 'Managing Director',
      logoDataUrl: '',
      logoWidth: 0,
      logoHeight: 0,
    },
    branches: [
      { id: 'branch-1', name: 'Empire Pearl', city: 'Erbil', address: 'Empire Pearl, Erbil', status: 'Active' },
      { id: 'branch-2', name: 'Dream City', city: 'Erbil', address: 'Dream City, Erbil', status: 'Active' },
    ],
    teams: [
      { id: 'team-1', name: 'Sales Team', branchId: 'branch-1', managerId: 'emp-1', status: 'Active' },
      { id: 'team-2', name: 'Property Operations', branchId: 'branch-1', managerId: 'emp-3', status: 'Active' },
    ],
    employees: [
      { id: 'emp-1', employeeNumber: 'EF-001', name: 'Roj Ahmed', title: 'Sales Manager', teamId: 'team-1', branchId: 'branch-1', contractType: 'Permanent', status: 'Active', startDate: '2024-02-01', phone: '+964 750 111 2200', email: 'roj@estateflow.demo', annualLeave: 18, sickLeave: 8, documentsComplete: true },
      { id: 'emp-2', employeeNumber: 'EF-002', name: 'Sara Karim', title: 'Property Consultant', teamId: 'team-1', branchId: 'branch-1', managerId: 'emp-1', contractType: 'Permanent', status: 'Active', startDate: '2025-01-15', phone: '+964 750 111 2201', email: 'sara@estateflow.demo', annualLeave: 16, sickLeave: 7, documentsComplete: true },
      { id: 'emp-3', employeeNumber: 'EF-003', name: 'Dilan Ahmed', title: 'Operations Coordinator', teamId: 'team-2', branchId: 'branch-1', managerId: 'emp-1', contractType: 'Permanent', status: 'Active', startDate: '2025-05-10', phone: '+964 750 111 2202', email: 'dilan@estateflow.demo', annualLeave: 15, sickLeave: 7, documentsComplete: false },
      { id: 'emp-4', employeeNumber: 'EF-004', name: 'Narin Mustafa', title: 'Office Assistant', teamId: 'team-2', branchId: 'branch-2', managerId: 'emp-3', contractType: 'Temporary', status: 'On hold', startDate: '2026-03-01', phone: '+964 750 111 2203', email: 'narin@estateflow.demo', annualLeave: 10, sickLeave: 4, documentsComplete: false },
    ],
    contacts: [
      { id: 'contact-1', name: 'Ari Hassan', phone1: '+964 750 240 1111', phone2: '', email: 'ari@example.com', city: 'Erbil', source: 'Instagram', types: ['Buyer'], status: 'Active', statusReason: '', budgetFrom: 140000, budgetTo: 180000, currency: 'USD', assignedTo: 'emp-2', notes: 'Interested in Empire World and prefers a quiet floor.', createdAt: today },
      { id: 'contact-2', name: 'Lana Kareem', phone1: '+964 751 340 2222', phone2: '', email: 'lana@example.com', city: 'Erbil', source: 'Friend referral', types: ['Seller', 'Landlord'], status: 'Active', statusReason: '', budgetFrom: 0, budgetTo: 0, currency: 'USD', assignedTo: 'emp-1', notes: 'Owner of the Dream City villa.', createdAt: today },
      { id: 'contact-3', name: 'Omar Salih', phone1: '+964 750 440 3333', phone2: '', email: 'omar@example.com', city: 'Erbil', source: 'Networking event', types: ['Tenant'], status: 'Do not contact', statusReason: 'Requested no marketing communication.', budgetFrom: 900, budgetTo: 1300, currency: 'USD', assignedTo: 'emp-2', notes: '', createdAt: today },
    ],
    properties: [
      { id: 'property-1', reference: 'EF-P-0001', title: 'Empire Pearl 2BR Apartment', type: 'Apartment', purpose: 'Sale', status: 'Available', city: 'Erbil', district: 'Empire World', address: 'Empire Pearl, Building B, Floor 7', area: 138, bedrooms: 2, bathrooms: 2, priceFrom: 155000, priceTo: 165000, currency: 'USD', ownerId: 'contact-2', assignedTo: 'emp-2', branchId: 'branch-1', description: 'Bright two-bedroom apartment with balcony and underground parking.', photoDataUrls: [], createdAt: today, updatedAt: today },
      { id: 'property-2', reference: 'EF-P-0002', title: 'Dream City Villa 14', type: 'Villa', purpose: 'Sale', status: 'Reserved', city: 'Erbil', district: 'Dream City', address: 'Dream City, Street 4, Villa 14', area: 410, bedrooms: 5, bathrooms: 4, priceFrom: 420000, priceTo: 445000, currency: 'USD', ownerId: 'contact-2', assignedTo: 'emp-1', branchId: 'branch-1', description: 'Family villa with landscaped garden and separate guest room.', photoDataUrls: [], reservation: { clientId: 'contact-1', reservedBy: 'emp-1', from: today, to: plusDays(7), depositAmount: 5000, status: 'Confirmed' }, createdAt: today, updatedAt: today },
      { id: 'property-3', reference: 'EF-P-0003', title: '100m Road Commercial Shop', type: 'Commercial', purpose: 'Rent', status: 'Available', city: 'Erbil', district: '100m Road', address: '100m Road, Block 12', area: 92, bedrooms: 0, bathrooms: 1, priceFrom: 2200, priceTo: 2500, currency: 'USD', ownerId: 'contact-2', assignedTo: 'emp-3', branchId: 'branch-1', description: 'Street-facing commercial unit with strong visibility.', photoDataUrls: [], createdAt: today, updatedAt: today },
    ],
    deals: [
      { id: 'deal-1', contactId: 'contact-1', propertyId: 'property-1', assignedTo: 'emp-2', stage: 'Viewing scheduled', valueFrom: 155000, valueTo: 165000, currency: 'USD', expectedClose: plusDays(30), nextAction: 'Confirm viewing feedback', lossReason: '', createdAt: today, updatedAt: today, history: [{ at: today, to: 'New lead', note: 'Deal created' }, { at: today, from: 'New lead', to: 'Qualified', note: 'Budget confirmed' }, { at: today, from: 'Qualified', to: 'Property matched', note: 'Property selected' }, { at: today, from: 'Property matched', to: 'Viewing scheduled', note: 'Viewing arranged' }] },
      { id: 'deal-2', contactId: 'contact-3', propertyId: 'property-3', assignedTo: 'emp-1', stage: 'Negotiation', valueFrom: 2200, valueTo: 2400, currency: 'USD', expectedClose: plusDays(14), nextAction: 'Owner response on rent', lossReason: '', createdAt: today, updatedAt: today, history: [{ at: today, to: 'New lead', note: 'Deal created' }, { at: today, from: 'New lead', to: 'Negotiation', note: 'Demo history' }] },
    ],
    meetings: [
      { id: 'meeting-1', contactId: 'contact-1', propertyId: 'property-1', type: 'Property viewing', agentId: 'emp-2', date: plusDays(1), time: '16:00', duration: 45, locationType: 'Property', location: 'Empire Pearl lobby', reminder: true, notes: 'Bring printed property summary.', status: 'Scheduled', cancelReason: '' },
      { id: 'meeting-2', contactId: 'contact-2', propertyId: 'property-2', type: 'Owner meeting', agentId: 'emp-1', date: plusDays(2), time: '11:30', duration: 60, locationType: 'Office', location: 'Empire Pearl meeting room', reminder: true, notes: 'Discuss reservation extension rules.', status: 'Scheduled', cancelReason: '' },
    ],
    tasks: [
      { id: 'task-1', title: 'Call Ari after property viewing', assigneeId: 'emp-2', assignedById: 'emp-1', dueDate: plusDays(2), dueTime: '13:00', priority: 'High', status: 'Not started', relatedType: 'Contact', relatedId: 'contact-1', notes: '', reminder: true, completedAt: '' },
      { id: 'task-2', title: 'Prepare owner documents checklist', assigneeId: 'emp-3', assignedById: 'emp-1', dueDate: plusDays(1), dueTime: '09:30', priority: 'Normal', status: 'In progress', relatedType: 'Property', relatedId: 'property-2', notes: 'Confirm ID and ownership deed.', reminder: true, completedAt: '' },
      { id: 'task-3', title: 'Update commercial property photos', assigneeId: 'emp-4', assignedById: 'emp-3', dueDate: plusDays(-1), dueTime: '11:00', priority: 'Urgent', status: 'Waiting', relatedType: 'Property', relatedId: 'property-3', notes: '', reminder: true, completedAt: '' },
    ],
    contractTemplates: [
      {
        id: 'template-sale',
        name: 'Property Sale Agreement',
        description: 'Standard agreement for the sale of a listed property.',
        active: true,
        version: 1,
        sections: [
          { id: 'sale-parties', title: '1. Parties', type: 'protected', required: true, options: [], body: 'This Property Sale Agreement is made on {{contract_date}} between {{company_name}}, represented by {{signatory_name}}, and {{client_name}}, phone {{client_phone}} (the “Buyer”).' },
          { id: 'sale-property', title: '2. Property', type: 'protected', required: true, options: [], body: 'The subject of this agreement is property {{property_reference}}, known as {{property_title}}, located at {{property_address}}, with an approximate area of {{property_area}} square metres.' },
          { id: 'sale-price', title: '3. Purchase Price', type: 'protected', required: true, options: [], body: 'The agreed purchase price is {{property_price}} {{currency}}. The selected payment terms below form an integral part of this agreement.' },
          { id: 'sale-payment', title: '4. Payment Terms', type: 'clause-group', required: true, body: '', options: [
            { id: 'payment-full', label: 'Full payment', body: 'The Buyer shall pay the full purchase price upon execution and completion of the required transfer documents.' },
            { id: 'payment-two', label: 'Two installments', body: 'The Buyer shall pay 30% upon signing and the remaining 70% upon completion of the ownership transfer.' },
            { id: 'payment-schedule', label: 'Approved installment schedule', body: 'Payment shall be made according to the approved schedule attached to and signed with this agreement.' },
          ] },
          { id: 'sale-cancellation', title: '5. Cancellation', type: 'clause-group', required: true, body: '', options: [
            { id: 'cancel-nonref', label: 'Non-refundable deposit', body: 'The reservation deposit is non-refundable if the Buyer withdraws without a documented contractual cause.' },
            { id: 'cancel-window', label: 'Three-day review period', body: 'The Buyer may cancel within three calendar days of signing, subject to documented administrative costs.' },
          ] },
          { id: 'sale-additional', title: '6. Additional Conditions', type: 'editable', required: false, options: [], body: 'Add only approved transaction-specific conditions here.' },
          { id: 'sale-law', title: '7. Governing Law', type: 'protected', required: true, options: [], body: 'This agreement shall be interpreted in accordance with the applicable laws and regulations of the Kurdistan Region of Iraq.' },
          { id: 'sale-signatures', title: '8. Signatures', type: 'protected', required: true, options: [], body: 'By signing below, the parties confirm that they have read, understood, and accepted the complete agreement.' },
        ],
      },
      {
        id: 'template-rent',
        name: 'Residential Rental Agreement',
        description: 'Standard residential rental agreement with selectable payment and deposit clauses.',
        active: true,
        version: 1,
        sections: [
          { id: 'rent-parties', title: '1. Parties', type: 'protected', required: true, options: [], body: 'This Rental Agreement is made on {{contract_date}} between the property owner represented through {{company_name}} and {{client_name}} (the “Tenant”).' },
          { id: 'rent-property', title: '2. Premises', type: 'protected', required: true, options: [], body: 'The premises are {{property_title}}, reference {{property_reference}}, located at {{property_address}}.' },
          { id: 'rent-term', title: '3. Term', type: 'editable', required: true, options: [], body: 'The rental period begins on [START DATE] and ends on [END DATE].' },
          { id: 'rent-payment', title: '4. Rent Payment', type: 'clause-group', required: true, body: '', options: [
            { id: 'rent-monthly', label: 'Monthly payment', body: 'Rent shall be paid monthly in advance no later than the fifth calendar day of each month.' },
            { id: 'rent-quarterly', label: 'Quarterly payment', body: 'Rent shall be paid in four equal quarterly installments in advance.' },
            { id: 'rent-annual', label: 'Annual payment', body: 'The full annual rent shall be paid upon signing this agreement.' },
          ] },
          { id: 'rent-deposit', title: '5. Security Deposit', type: 'clause-group', required: true, body: '', options: [
            { id: 'deposit-one', label: 'One month deposit', body: 'The Tenant shall provide a refundable security deposit equal to one month of rent.' },
            { id: 'deposit-two', label: 'Two month deposit', body: 'The Tenant shall provide a refundable security deposit equal to two months of rent.' },
          ] },
          { id: 'rent-law', title: '6. Governing Law', type: 'protected', required: true, options: [], body: 'This agreement shall be governed by the applicable laws and regulations of the Kurdistan Region of Iraq.' },
          { id: 'rent-signatures', title: '7. Signatures', type: 'protected', required: true, options: [], body: 'The parties confirm acceptance of all selected and completed terms by signing below.' },
        ],
      },
    ],
  };
}
