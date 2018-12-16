import React, { Component } from 'react'

import actions from 'redux/actions'

import Link from 'sw-valuelink'
import { constants } from 'helpers'

import cssModules from 'react-css-modules'
import styles from './ImportKeys.scss'

import Group from './Group/Group'
import { Modal } from 'components/modal'
import { FieldLabel } from 'components/forms'
import { Button } from 'components/controls'
import { FormattedMessage } from 'react-intl'


window.actions = actions


@cssModules(styles)
export default class ImportKeys extends Component {

  state = {
    ethKey: '',
    btcKey: '',
    xlmKey: '',

    isSubmittedEth: false,
    isSubmittedBtc: false,
    isSubmittedXlm: false,

    isImportedEth: false,
    isImportedBtc: false,
    isImportedXlm: false,

    isDisabled: true,
    keySave: false,
  }

  componentWillMount() {
    const saveKeys = JSON.parse(localStorage.getItem(constants.localStorage.privateKeysSaved))

    if (saveKeys) {
      this.setState(() => ({ keySave: true }))
    }
  }

  handleEthImportKey = () => {
    let { ethKey } = this.state

    if (!ethKey || ethKey.length < 40) {
      this.setState({ isSubmittedEth: true })
      return
    }
    this.setState({ isDisabled: false })

    const withOx = ethKey.substring(0, 2)

    if (withOx !== '0x') {
      ethKey = `0x${ethKey}`
    }

    try {
      actions.eth.login(ethKey)
      this.setState({
        isImportedEth: true,
        isDisabled: false,
      })
    } catch (e) {
      this.setState({ isSubmittedEth: true })
    }
  }

  handleBtcImportKey = () => {
    const { btcKey } = this.state

    if (!btcKey || btcKey.length < 27) {
      this.setState({ isSubmittedBtc: true })
      return
    }
    this.setState({ isDisabled: false })


    try {
      actions.btc.login(btcKey)
      this.setState({
        isImportedBtc: true,
        isDisabled: false,
      })
    } catch (e) {
      this.setState({ isSubmittedBtc: true })
    }
  }

  handleXlmImportKey = () => {
    const { xlmKey } = this.state

    if (!xlmKey) {
      this.setState({ isSubmittedXlm: true })
      return
    }
    this.setState({ isDisabled: false })


    try {
      actions.xlm.login(xlmKey)
      this.setState({
        isImportedXlm: true,
        isDisabled: false,
      })
    } catch (e) {
      this.setState({ isSubmittedXlm: true })
    }
  }


  handleImportKeys = () => {
    const { isDisabled } = this.state

    if (!isDisabled) {
      window.location.reload()
      localStorage.setItem(constants.localStorage.testnetSkipPKCheck, 'true')
    }
  }

  handleCloseModal = () => {
    actions.modals.close(this.props.name)
  }

  render() {
    const {
      isSubmittedEth, isSubmittedBtc, isSubmittedXlm,
      isImportedEth, isImportedBtc, isImportedXlm, isDisabled, keySave,
    } = this.state

    const linked = Link.all(this, 'ethKey', 'btcKey', 'xlmKey')

    if (isSubmittedEth) {
      linked.ethKey.check((value) => value !== '', 'Please enter ETH private key')
      linked.ethKey.check((value) => value.length > 40, 'Please valid ETH private key')
    }

    if (isSubmittedBtc) {
      linked.btcKey.check((value) => value !== '', 'Please enter BTC private key')
      linked.btcKey.check((value) => value.length > 27, 'Please valid BTC private key')
    }

    if (isSubmittedXlm) {
      linked.xlmKey.check((value) => value !== '', 'Please enter XLM private key')
    }

    return (
      <Modal name={this.props.name} title="Import keys">
        <div styleName="modal">
          <FormattedMessage id="ImportKeys107" defaultMessage="This procedure will rewrite your private key. If you are not sure about it, we recommend to press cancel">
            {message => <p>{message}</p>}
          </FormattedMessage>
          <FormattedMessage id="ImportKeys110" defaultMessage="Please enter eth private key">
            {message => <FieldLabel>{message}</FieldLabel>}
          </FormattedMessage>
          <Group
            inputLink={linked.ethKey}
            placeholder="Key"
            disabled={isImportedEth}
            onClick={this.handleEthImportKey}
          />

          <FormattedMessage id="ImportKeys120" defaultMessage="Please enter btc private key in WIF format">
            {message => <FieldLabel>{message}</FieldLabel>}
          </FormattedMessage>
          <Group
            inputLink={linked.btcKey}
            placeholder="Key in WIF format"
            disabled={isImportedBtc}
            onClick={this.handleBtcImportKey}
          />

          <FormattedMessage id="ImportKeys176" defaultMessage="Please enter xlm private key">
            {message => <FieldLabel>{message}</FieldLabel>}
          </FormattedMessage>
          <Group
            inputLink={linked.xlmKey}
            placeholder="Key"
            disabled={isImportedXlm}
            onClick={this.handleXlmImportKey}
          />
          {
            !keySave && (
              <span styleName="error">
                <FormattedMessage id="errorImportKeys" defaultMessage=" Please save your private keys" />
              </span>
            )
          }
          <Button brand disabled={isDisabled || !keySave} styleName="button" onClick={this.handleImportKeys}>
            <FormattedMessage id="ImportKeys130" defaultMessage="Confirm" />
          </Button>
          <Button gray styleName="button" onClick={this.handleCloseModal}>
            <FormattedMessage id="ImportKeys133" defaultMessage="Cancel" />
          </Button>
        </div>
      </Modal>
    )
  }
}
