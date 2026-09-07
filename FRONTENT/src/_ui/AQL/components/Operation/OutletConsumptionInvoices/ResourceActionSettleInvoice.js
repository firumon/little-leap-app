import { canSettleInvoice } from 'src/_resource/Operation/OutletConsumptionInvoices/composables/useInvoiceWorkflow'

// The sheet's `visibleWhen` reads the Progress column alone and cannot see the permission
// this settlement needs. Function-valued, so a payment that clears the balance while the
// page is open takes the button away without a reload.
export default {
  show: (record) => canSettleInvoice(record),
  label: 'Settle Invoice'
}
