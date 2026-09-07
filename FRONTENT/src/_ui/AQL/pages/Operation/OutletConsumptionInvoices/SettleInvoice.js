const RESOURCE = 'OutletConsumptionInvoices'

// `/operation/outlet-consumption-invoices/{code}/_action/settle-invoice`. The one route from
// a leftover balance to PAID, where the difference gets a name.
export default {
  sections: ['PageHeader'],
  contents: [
    'InvoiceDetails',
    'SettlementReason'
  ],

  permissions: {
    InvoiceDetails: ['OutletConsumptionInvoices:settleInvoice', 'OutletConsumptionInvoices:markPaid'],
    SettlementReason: ['OutletConsumptionInvoices:settleInvoice', 'OutletConsumptionInvoices:markPaid']
  },

  PropsPageHeader: {
    title: 'Settle Invoice',
    reload: false
  },

  // Page.vue keeps ONE pageState per Page mount and never clears it. The node itself is
  // mounted by the hydration card, once the invoice and its payments have landed.
  ready ({ pageState }) {
    pageState.resetForResource(RESOURCE)
  }
}
