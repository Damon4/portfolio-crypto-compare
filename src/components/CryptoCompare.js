import PropTypes from 'prop-types'
import {Col, Form, InputNumber, Row, Select, Spin} from 'antd'
import {memo, useEffect, useMemo, useState} from 'react'
const {Option} = Select

const CryptoCompare = memo(({selectedCoin, loading, data, onChangeSelectedCoin}) => {

        const [form] = Form.useForm()

        const options = data.map(({name}) => {
            return name
        })

        const [value1, setValue1] = useState(1)
        const [value2, setValue2] = useState(1)
        const [curr1, setCurr1] = useState(selectedCoin?.name)
        const [curr2, setCurr2] = useState()

        const coin1 = useMemo(() => {
            return data.find((f) => {
                return f.name === curr1
            })
        }, [curr1, data])

        const coin2 = useMemo(() => {
            return data.find((f) => {
                return f.name === curr2
            })
        }, [curr2, data])

        const price1 = useMemo(() => {
            return coin1?.priceRaw
        }, [coin1])

        const price2 = useMemo(() => {
            return coin2?.priceRaw
        }, [coin2])

        useEffect(() => {
            const newValue2 = value1 * price1 / price2
            setValue2(newValue2)
        }, [price1, price2, value1])

        useEffect(() => {
            setCurr1(selectedCoin?.name)
        }, [selectedCoin])

        useEffect(() => {
            if(coin1) {
                onChangeSelectedCoin(coin1)
            }
        }, [onChangeSelectedCoin, coin1])

        const initialValues = {
            value1,
            value2,
            curr1,
            curr2,
        }

        useEffect(() => {
            form.setFieldsValue({
                curr1,
                curr2,
                value1,
                value2,
            })
        }, [curr1, curr2, form, value1, value2])

        const onValuesChange = (changedValues) => {
            const [name, value] = Object.entries(changedValues)[0]
            switch(name) {
                case 'value1': {
                    setValue1(value)
                    break
                }
                case 'value2': {
                    setValue2(value)
                    break
                }
                case 'curr1': {
                    setCurr1(value)
                    break
                }
                case 'curr2': {
                    setCurr2(value)
                    break
                }
                default:
                    break
            }
        }

        return (
            <Spin spinning={loading}>
                <Form
                    form={form}
                    layout="vertical"
                    autoComplete="off"
                    size={'large'}
                    initialValues={initialValues}
                    onValuesChange={onValuesChange}
                >
                    <Row gutter={20}>
                        <Col span={16}>
                            <Form.Item
                                name="value1"
                                label="Сумма"
                            >
                                <InputNumber
                                    addonAfter={price1 ? `$ ${price1}` : '$'}
                                    min={0}
                                    placeholder={'Сумма'}
                                    style={{
                                        width: '100%',
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="curr1"
                                label="Валюта"
                            >
                                <Select
                                    placeholder={'Валюта'}
                                    style={{
                                        width: '100%',
                                    }}
                                >
                                    {options.map((name) => {
                                        return (
                                            <Option key={name} value={name}>{name}</Option>
                                        )
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={20}>
                        <Col span={16}>
                            <Form.Item
                                name="value2"
                                label="Сумма"
                            >
                                <InputNumber
                                    addonAfter={price2 ? `$ ${price2}` : '$'}
                                    min={0}
                                    placeholder={'Сумма'}
                                    style={{
                                        width: '100%',
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="curr2"
                                label="Валюта"
                            >
                                <Select
                                    placeholder={'Валюта'}
                                    style={{
                                        width: '100%',
                                    }}
                                >
                                    {options.map((name) => {
                                        return (
                                            <Option key={name} value={name}>{name}</Option>
                                        )
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Spin>
        )
    }
)

CryptoCompare.propTypes = {
    data: PropTypes.array,
    loading: PropTypes.bool,
    onClickRow: PropTypes.func,
}

export default CryptoCompare
