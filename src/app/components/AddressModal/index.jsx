import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import AddressModalView from './view'

const AddressModal = (props) => (
  <AddressModalView
    address={props.address || props.wallet.address}
    showDownloadKeystore={props.wallet.isBlockstack}
    {...props}
  />
)

AddressModal.propTypes = {
  wallet: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  wallet: state.wallet
})

export default connect(mapStateToProps)(AddressModal)
