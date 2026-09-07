const RESOURCE = 'OutletConsumptionInvoices'

// `/operation/outlet-consumption-invoices/{code}/_action/cancel`. What is voided, what goes
// back to the queue, and why. `InvoiceDetails` hydrates and keeps the live batch cut.
export default {
  sections: ['PageHeader'],
  contents: [
    'InvoiceDetails',
    'InvolvedConsumptions',
    'InvolvedReturns',
    'CancelReason'
  ],

  permissions: {
    InvoiceDetails: ['OutletConsumptionInvoices:cancel'],
    InvolvedConsumptions: ['OutletConsumptionInvoices:cancel'],
    InvolvedReturns: ['OutletConsumptionInvoices:cancel'],
    CancelReason: ['OutletConsumptionInvoices:cancel']
  },

  PropsPageHeader: {
    title: 'Cancel Invoice',
    reload: false
  },

  // Page.vue keeps ONE pageState per Page mount and never clears it, so the nodes of the
  // page visited before this one are still here (UI_PAGE_STATE_NODES §5.7A). The batch
  // itself is cut by the hydration card, once the invoice and its rows have landed.
  ready ({ pageState }) {
    pageState.resetForResource(RESOURCE)
  }
}
