import PropTypes from 'prop-types'
import {memo} from 'react'
import {Table} from 'antd'

const CryptoTable = memo(({data, loading, onClickRow}) => {

        const dataSource = data.map((coin) => {
            return {
                key: coin.id,
                ...coin,
            }
        })

        const columns = [
            {
                dataIndex: 'imageUrl',
                key: 'imageUrl',
                render(value) {
                    return <img alt={''} width={30} height={30} src={value} />
                },
            },
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'FullName',
                dataIndex: 'fullName',
                key: 'fullName',
            },
            {
                title: 'Price',
                dataIndex: 'price',
                key: 'price',
                align: 'right',
            },
            {
                title: 'Volume 24h',
                dataIndex: 'volume24hour',
                key: 'volume24hour',
                align: 'right',
            },
        ]

        const handleClickRow = (coin) => {
            onClickRow(coin)
        }

        return (
            <Table
                dataSource={dataSource}
                columns={columns}
                loading={loading}
                onRow={(coin) => {
                    return {
                        onClick: () => {
                            handleClickRow(coin)
                        },
                    };
                }}
                rowClassName={(record) => {
                    const price = record?.priceRaw
                    const prevPrice = record?.prev?.priceRaw

                    if(!price || !prevPrice || (price === prevPrice)) {
                        return ''
                    } else {
                        return price > prevPrice ? 'bg-green' : 'bg-red'
                    }
                }}
                pagination={false}
            />
        )
    }
)

CryptoTable.propTypes = {
    data: PropTypes.array,
    loading: PropTypes.bool,
    selectedCoin: PropTypes.object,
    onChangeSelectedCoin: PropTypes.func,
}

export default CryptoTable
