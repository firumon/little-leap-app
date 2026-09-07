/**
 * OutletPayments › ResourceActionEdit — JS modifier (tier 3: resource-wide).
 *
 * A payment receipt is money that already moved. Editing one would change an
 * invoice balance that was already reported, so the only correction is to
 * cancel the receipt and record a new one.
 *
 * `show` is a plain `false`, not a function: no state of any payment makes it
 * editable, so a closure would imply a condition that does not exist.
 */
export default {
  show: false
}
