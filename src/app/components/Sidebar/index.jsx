
import React, { Fragment } from 'react'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { ListGroup, ListGroupItem, Row, Col, Card, 
  Media, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Badge } from 'reactstrap'
import { compose, setDisplayName, withState } from 'recompose'
import { getWatchlist, getTrendingPositive, getTrendingNegative, 
  getAllWalletsArray, getWalletWithHoldings } from 'Selectors'

import ChangePercent from 'Components/ChangePercent'
import ChangeFiat from 'Components/ChangeFiat'
import WatchlistStar from 'Components/WatchlistStar'
import CoinIcon from 'Components/CoinIcon'
import Icon from 'Components/Icon'

import chart from 'Img/chart.svg?inline'
import display from 'Utilities/display'
import withToggle from 'Hoc/withToggle'
import classNames from 'class-names'

import { sidebarLabel } from './style'

const Sidebar = ({ watchlist, trendingPositive, 
  trendingNegative, toggleDropdownOpen, isDropdownOpen, wallets, selectWallet, selectedWallet,
  timeFrame, updateTimeFrame, className, push }) => {
  const { totalFiat, totalChange, totalFiat24hAgo, label } = selectedWallet
  return (
    <Row style={{ maxWidth: '275px', flex: '0 0 100%' }} className={classNames('gutter-3 align-items-end', className)}>
      <Col xs='12'>
        <Card>
          <ListGroup>
            <ListGroupItem className='text-center position-relative'>
              <Icon style={{ top: '2px', left: 0, width: '100%', zIndex: 0 }} className='position-absolute' src={chart} />
              <Dropdown group isOpen={isDropdownOpen} size="sm" toggle={toggleDropdownOpen}>
                <DropdownToggle className='m-0 cursor-pointer' tag='p' caret>
                  <small>{label}</small>
                </DropdownToggle>
                <DropdownMenu>
                  {wallets.map(({ label, id }) => (
                    <DropdownItem key={label} onClick={() => selectWallet(id)}>{label}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              <div style={{ zIndex: 99 }} className='position-relative'>
                <h2 className='m-0 mt-2 font-weight-bold'>{display.fiat(totalFiat)}</h2>
                <ChangeFiat>{totalFiat.minus(totalFiat24hAgo)}</ChangeFiat>
                <small> <ChangePercent parentheses>{totalChange}</ChangePercent></small>
                <div>
                  <Badge 
                    className='mr-2 cursor-pointer' 
                    color={timeFrame == '7d' ? 'light' : 'ultra-dark'}
                    onClick={() => updateTimeFrame('7d')}
                  >
                    7d
                  </Badge>
                  <Badge 
                    className='mr-2 cursor-pointer' 
                    color={timeFrame == '1d' ? 'light' : 'ultra-dark'}
                    onClick={() => updateTimeFrame('1d')}
                  >
                    1d
                  </Badge>
                  <Badge 
                    className='cursor-pointer' 
                    color={timeFrame == '1h' ? 'light' : 'ultra-dark'}
                    onClick={() => updateTimeFrame('1h')}
                  >
                    1h
                  </Badge>
                </div>
              </div>
            </ListGroupItem>
            <ListGroupItem className='p-0 text-center'>
              <small><p className={sidebarLabel}>Watchlist</p></small>
              <div style={{ maxHeight: '171px', overflowY: 'auto' }}>
                {watchlist.map((asset) => {
                  const { symbol, price, change24, change7d, change1, price24hAgo, price7dAgo, price1hAgo } = asset
                  const percentChange = timeFrame === '1d' ? change24 : timeFrame === '7d' ? change7d : change1
                  const priceChangeBasedOnTime = timeFrame === '1d' ? price24hAgo : timeFrame === '7d' ? price7dAgo : price1hAgo
                  return (
                    <Fragment key={symbol}>
                      <Media style={{ borderBottom: '1px solid #292929' }} className='text-left px-3 py-0 cursor-pointer'>
                        <Media left>
                          <WatchlistStar className='pt-2 mt-1' symbol={symbol}/>
                        </Media>
                        <Media onClick={() => push(`/assets/${symbol}`)}>
                          <Media style={{ width: '35px' }} className='ml-4 mr-3' left>
                            <CoinIcon 
                              symbol={symbol} 
                              inline
                              size='sm'
                            /> 
                            <Media className='m-0'>
                              <span className='font-xxs'>{symbol}</span>
                            </Media>
                          </Media>
                          <Media body>
                            <Media className='m-0' heading>
                              <span className='font-xxs'>{display.fiat(price)}</span>
                            </Media>
                            <Media style={{ top: '-2px' }} className='position-relative'>
                              <span className='font-xs mr-1'><ChangeFiat>{price.minus(priceChangeBasedOnTime)}</ChangeFiat></span>
                              <span className='font-xs'><ChangePercent parentheses>{percentChange}</ChangePercent></span>
                            </Media>
                          </Media>
                        </Media>
                      </Media>
                    </Fragment>
                  )
                })}
              </div>
            </ListGroupItem>
            <ListGroupItem className='border-bottom-0 p-0 text-center'>
              <small><p className={sidebarLabel}>Trending</p></small>
              <div style={{ maxHeight: '214px', overflowY: 'auto' }}>
                {trendingPositive.map((asset, i) => {
                  const { symbol, price, change24, change7d, change1, price24hAgo, price7dAgo, price1hAgo } = asset
                  const percentChange = timeFrame === '1d' ? change24 : timeFrame === '7d' ? change7d : change1
                  const priceChangeBasedOnTime = timeFrame === '1d' ? price24hAgo : timeFrame === '7d' ? price7dAgo : price1hAgo
                  return (
                    <Fragment key={symbol}>
                      <Media 
                        onClick={() => push(`/assets/${symbol}`)}
                        style={i !== trendingPositive.length - 1 ? { borderBottom: '1px solid #292929' } : {}} 
                        className='text-left px-3 py-0 cursor-pointer'
                      >
                        <Media left>
                          <small className='pt-2 mt-1 d-inline-block'>{i + 1}</small>
                        </Media>
                        <Media className='ml-3 mr-4 text-center' left>
                          <CoinIcon 
                            symbol={symbol} 
                            inline
                            size='sm'
                          /> 
                          <Media className='m-0'>
                            <span className='font-xxs'>{symbol}</span>
                          </Media>
                        </Media>
                        <Media body>
                          <Media style={{ top: '1px' }} className='m-0 position-relative' heading>
                            <small className='font-xs'>{display.fiat(price)}</small>
                          </Media>
                          <Media style={{ top: '-2px' }} className='position-relative'>
                            <span className='font-xs mr-1'><ChangeFiat>{price.minus(priceChangeBasedOnTime)}</ChangeFiat></span>
                            <span className='font-xs'><ChangePercent parentheses>{percentChange}</ChangePercent></span>
                          </Media>
                        </Media>
                      </Media>
                    </Fragment>
                  )
                })}
                <div style={{ borderTop: '1px dashed #292929' }} className='p-0 text-center'>
                  {trendingNegative.map((asset, i) => {
                    const { symbol, price, change24, price24hAgo } = asset
                    return (
                      <Fragment key={symbol}>
                        <Media style={{ borderBottom: '1px solid #292929' }} className='text-left px-3 py-0'>
                          <Media left>
                            <small className='pt-2 mt-1 d-inline-block'>{i + 1}</small>
                          </Media>
                          <Media className='ml-3 mr-4 text-center' left>
                            <CoinIcon 
                              symbol={symbol} 
                              inline
                              size='sm'
                            /> 
                            <Media className='m-0'>
                              <span className='font-xxs'>{symbol}</span>
                            </Media>
                          </Media>
                          <Media body>
                            <Media style={{ top: '1px' }} className='m-0 position-relative' heading>
                              <small className='font-xs'>{display.fiat(price)}</small>
                            </Media>
                            <Media style={{ top: '-2px' }} className='position-relative'>
                              <span className='font-xs mr-1'><ChangeFiat>{price24hAgo.minus(price)}</ChangeFiat></span>
                              <span className='font-xs'><ChangePercent parentheses>{change24}</ChangePercent></span>
                            </Media>
                          </Media>
                        </Media>
                      </Fragment>
                    )
                  })}
                </div>
              </div>
            </ListGroupItem>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  )
}

export default compose(
  setDisplayName('Sidebar'),
  withToggle('dropdownOpen'),
  withState('selectedWalletId', 'selectWallet', 'default'),
  withState('timeFrame', 'updateTimeFrame', '1d'),
  connect(createStructuredSelector({
    selectedWallet: (state, { selectedWalletId }) => getWalletWithHoldings(state, selectedWalletId),
    watchlist: getWatchlist,
    trendingPositive: getTrendingPositive,
    trendingNegative: getTrendingNegative,
    wallets: getAllWalletsArray
  }), {
    push: push,
  }),
)(Sidebar)
