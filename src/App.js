import {useCallback, useEffect, useMemo, useReducer, useState} from 'react'
import {Button, Col, Divider, Layout, Row, Typography} from 'antd'
import axios from 'axios'
import {usePrevious} from 'react-use'
import CryptoTable from './components/CryptoTable'
import CryptoCompare from './components/CryptoCompare'
import './App.css'

const {Content} = Layout
const {Text} = Typography

const initialState = {
    coins: [],
    loading: false,
    selectedCoin: undefined,
}

const types = {
    LOADING_START: 'LOADING_START',
    LOADING_FINISH: 'LOADING_FINISH',
    SET_COINS: 'SET_COINS',
    SET_DICTIONARY: 'SET_DICTIONARY',
    SET_SELECTED_COIN: 'SET_SELECTED_COIN',
}

function reducer(state, {type, payload}) {
    switch(type) {
        case types.LOADING_START:
            return {
                ...state,
                loading: true,
            }
        case types.LOADING_FINISH:
            return {
                ...state,
                loading: false,
            }
        case types.SET_COINS:
            return {
                ...state,
                coins: payload,
            }
        case types.SET_SELECTED_COIN:
            return {
                ...state,
                selectedCoin: payload,
            }
        default:
            throw new Error()
    }
}

function getData() {
    return axios.get(`https://min-api.cryptocompare.com/data/top/totalvolfull?limit=10&tsym=USD`)
        .then(({data: {Data: data}, status}) => {
            const coins = data.map((coin) => {
                return {
                    id: coin['CoinInfo']['Id'],
                    name: coin['CoinInfo']['Name'],
                    fullName: coin['CoinInfo']['FullName'],
                    imageUrl: `https://cryptocompare.com${coin['CoinInfo']['ImageUrl']}`,
                    price: coin['DISPLAY']['USD']['PRICE'],
                    priceRaw: coin['RAW']['USD']['PRICE'],
                    volume24hour: coin['DISPLAY']['USD']['VOLUME24HOURTO'],
                }
            })
            return {coins}
        })
}

const diffCoins = (coins, prevCoins = []) => {
    if(prevCoins.length) {
        return coins.map((coin) => {
            const coinPrev = prevCoins.find(({name}) => {
                return name === coin.name
            })
            return {
                ...coin,
                prev: {
                    price: coinPrev.price,
                    priceRaw: coinPrev.priceRaw,
                },
            }
        })
    } else {
        return coins
    }
}

function App() {
    const [state, dispatch] = useReducer(reducer, initialState, undefined)
    const [lastUpdateTime, setLastUpdateTime] = useState()
    const prevState = usePrevious(state) || {}

    const coinsWithDiff = useMemo(() => {
        return diffCoins(state.coins, prevState.coins)
    }, [state.coins, prevState.coins])

    const fetch = () => {
        dispatch({type: types.LOADING_START})
        getData().then(({coins}) => {
            dispatch({type: types.LOADING_FINISH})
            dispatch({type: types.SET_COINS, payload: coins})
            setLastUpdateTime((new Date()).toLocaleString())
        })
    }

    useEffect(() => {
        fetch()

        const interval = setInterval(() => {
            fetch()
        }, 120000)

        return () => {
            clearInterval(interval)
        }
    }, [])

    const handleChangeSelectedCoin = useCallback((coin) => {
        dispatch({type: types.SET_SELECTED_COIN, payload: coin})
    }, [])

    return (
        <Layout className="App">
            <Content>
                <Row gutter={40}>
                    <Col span={14}>
                        <CryptoTable
                            loading={state.loading}
                            data={coinsWithDiff}
                            onClickRow={handleChangeSelectedCoin}
                        />
                        <Divider />
                        <Row align="space-between">
                            <Col>
                                <Text type={'secondary'}>
                                    Caching interval 120 seconds | Last update: {lastUpdateTime}
                                </Text>
                            </Col>
                            <Col>
                                <Button
                                    loading={state.loading}
                                    onClick={() => {
                                        fetch()
                                    }}
                                >
                                    Refresh
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={10}>
                        <CryptoCompare
                            loading={state.loading}
                            data={coinsWithDiff}
                            selectedCoin={state.selectedCoin}
                            onChangeSelectedCoin={handleChangeSelectedCoin}
                        />
                    </Col>
                </Row>
            </Content>
        </Layout>
    )
}

export default App
