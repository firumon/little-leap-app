const RESOURCE = 'OutletConsumptionInvoices'

// OutletConsumptionInvoices > Edit - the live invoice node. The cards mount it through
// `useInvoiceEditContext`, write one column each, and `Edit/PageAction.js` only validates.
export default {
  sections: ['PageHeader', 'EditLockBanner'],
  contents: [
    'InvoiceBasic',
    'InvoiceTerms',
    'InvoiceItems',
    'InvoiceDiscounts',
    'InvoiceReturns',
    'InvoiceSummary'
  ],

  PropsPageHeader: {
    title: 'Edit Invoice',
    // pageState owns the live figures; a reload would throw them away.
    reload: false
  },

  // Page.vue keeps ONE pageState per Page mount, and an action route for the SAME record
  // leaves a node with the SAME code. Flush first (UI_PAGE_STATE_NODES.md §5.7A).
  ready ({ pageState }) {
    pageState.resetForResource(RESOURCE)
  }
}
