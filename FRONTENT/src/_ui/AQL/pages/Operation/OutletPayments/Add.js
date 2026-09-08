/**
 * OutletPayments › Add — page contract (tier CP: resource + page specific).
 *
 * One progressive collection form. The outlet and invoice card stays at the top. The amount,
 * allocation, and receipt cards appear after the user chooses an outlet and an invoice.
 *
 *   SelectInvoices    the paying outlet, and which of its open invoices this settles
 *   PaymentDetails    how much was taken and how it splits across those invoices
 *   PaymentReview     the receipt as it will be written
 *
 * `sections` carries only the header: the form cards are `contents`, because they are
 * the page's subject rather than furniture around it.
 */
const RESOURCE = 'OutletPayments'

export default {
  sections: ['PageHeader'],
  contents: [
    'SelectInvoices',
    'PaymentDetails',
    'PaymentReview'
  ],

  PropsPageHeader: {
    title: 'Record Payment',
    reload: false
  },

  // Page.vue keeps ONE pageState per Page mount and never clears it, so the nodes of the
  // page visited before this one are still here (UI_PAGE_STATE_NODES §5.7A).
  ready ({ pageState }) {
    pageState.resetForResource(RESOURCE)
  }
}
