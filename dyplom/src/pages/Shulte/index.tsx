import 'react-reflex/styles.css';
import { useEffect, useState } from 'react';
import { Button, Col, Row } from 'antd';
import { getShulteMatrix } from '../../utils/shulte';
import { set } from 'mobx';

function Shulte({ options }: { options?: any }) {
    // const [size, setSize] = useState(3)
    const [matrix, setMatrix] = useState<{ number: number,deg: number }[][]>([])
    const [value, setValue] = useState<number>(-1)
    const [err, setErr] = useState<number>(-1)
    const [restart, setRestart] = useState<boolean>(false)
    const [errCount, setErrCount] = useState<number>(0)
    const [successCount, setSuccessCount] = useState<number>(0)
    useEffect(() => {
        // setSize(options?.size ?? 5)
        setValue(-1)
        setErr(-1)
        let size = 3
        if (options?.size)
            size = options?.size * 2 + 1
        setMatrix(getShulteMatrix(size))
    }, [options.size, restart])
    let handleShulte = (number: number, rindex: number, index: number) => {
        if (value + 1 == number) {
            setValue(value + 1)
            setErr(-1)
            if (matrix.length * matrix.length - 1 == value + 1) {
                setRestart(!restart)
                setSuccessCount(successCount + 1)
            }
        } else {
            setErr(number)
            setErrCount(errCount + 1)
        }
    }
   
    return <div
        //responsive square
        style={{
            height: '100%',
            aspectRatio: '1',
            width: '100%'
        }}
    >
        <div
            style={{
                height: '100%',
                aspectRatio: '1',
                // width: '100%',
                margin: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
            }}
        >
            {matrix.map((row, rindex) => <Row gutter={4}
                style={{ flex: 1, display: 'flex', flexDirection: 'row', width: '100%', flexWrap: 'nowrap' }}
            >
                {
                    row.map((cell, index) =>
                        <Col flex={'1 1'} key={index}>
                            <Button
                                type='dashed'
                                color='primary'
                                onClick={() => handleShulte(cell.number, rindex, index)}
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    display: 'flex',
                                    transition: 'all 0.5s',
                                    // border: '1px solid black',
                                    backgroundColor: value >= cell.number ? 'lightgreen' : err == cell.number ? 'coral' : 'white',
                                    flexDirection: 'column',

                                    borderRadius: '0px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    overflow: 'hidden',
                                }} >
                                <span style={{
                                    position: 'absolute',
                                    display: 'block',
                                    transform: (options.rotate) ? 'rotate(' + cell.deg + 'deg)' : '',
                                    lineHeight: '100%',
                                    borderBottom: (cell.number + '').split('').every(value => value == '6' || value == '9') ? '1px solid black' : 'none',
                                    fontSize: options.fontSize ? options.fontSize + 'cqmin' : 10 + 'cqmin',
                                    // border: '1px solid black',
                                }}>

                                    {cell.number}
                                </span>
                            </Button>
                        </Col>
                    )
                }
            </Row>)}


            {/* {Array.from({ length: size }, (_, rindex) => <Row
                style={{ flex: 1 }}
            >
                {
                    Array.from({ length: size }, (_, index) =>
                        <Col flex={1} key={index}>
                            <Button
                                type='dashed'
                                color='primary'
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    display: 'flex',
                                    fontSize: '5em',
                                    // border: '1px solid black',
                                    flexDirection: 'column',
                                    borderRadius: '0px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }} >
                                {index}
                            </Button>

                        </Col>
                    )
                }
            </Row>)} */}
        </div>
    </div>
}

export default Shulte