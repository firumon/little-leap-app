import { isOpen } from 'src/_resource/Operation/OutletConsumptionInvoices/composables/useInvoiceWorkflow'

// A LOCAL action: taking money writes the payments resource, so it is gated on that
// resource's own create right and hands the invoice over to the payment Add page, which
// reads both codes off the query and pre-selects the bill.
export default {
  label: 'Make Payment',
  icon: 'payments',
  color: 'primary',
  permission: { outletPayment: 'create' },
  show: (record) => isOpen(record),
  run: ({ record, nav }) => {
    const outletCode = record?.OutletCode || record?.outletCode || ''
    const invoiceCode = record?.Code || record?.code || ''
    nav.goTo('add', {
      scope: 'operation',
      resourceSlug: 'outlet-payments',
      query: { outletCode, invoiceCode }
    })
  }
}
