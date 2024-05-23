import { HashRouter, Route, Routes, useParams } from 'react-router-dom';
import { Button, ConfigProvider, Descriptions, FloatButton, Progress, Tooltip, theme } from 'antd';
import ru_RU from 'antd/locale/ru_RU';
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';
import 'react-reflex/styles.css';
import styles from '../../App.module.css';
import { useEffect, useState } from 'react';
import ShowWord from '../../components/ShowWord';
import { Layout } from 'antd';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { text } from 'stream/consumers';
import { getShowText, isSpecialCharacter, splitTextToWordsArrays, stringToArrayString } from '../../utils/transformText';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { FullscreenOutlined } from '@ant-design/icons';
import { TextModelForReadEdit } from '../../models/Text';
import { set } from 'mobx';
/**
 * Renders the main component of the application.
 * 
 * @returns {JSX.Element} The rendered component.
 */
interface Props {
    text?: TextModelForReadEdit,
    options?: any
}
function ShowText(props: Props) {
    const { id } = useParams();
    const [word, setWord] = useState<number>(-1)
    const [start, setStart] = useState<boolean>(false)
    const [timeout, setTime] = useState<NodeJS.Timeout | undefined>(undefined)
    const [text, setText] = useState<TextModelForReadEdit | null>(null);
    const [normTextLength, setNormTextLength] = useState<number>(0)
    const [normalizeText, setNormalizeText] = useState<{ minIndex: number, maxIndex: number, length: number, par: { word: string, index: number }[] }[]>([]);
    const [speed, setSpeed] = useState<number>(100)

    useEffect(() => {
        setSpeed(props.options.speed ? props.options.speed : 100)
    }, [props.options.speed])
    useEffect(() => {
        console.log('normalizeText', normalizeText)
        if (text) {
            clearTimeout(timeout)
            setWord(-1)
            setStart(false)
            let normText = getShowText(text?.text as string, props.options.level || 1)
            setNormTextLength(normText.GlobalIndex - 1)
            setNormalizeText(normText.result)
        }
    }, [text, props.options.level]);

    useEffect(() => {
        if (props.text) {
            clearTimeout(timeout)
            setWord(-1)
            setStart(false)
            setText(props.text)
        }
    }, [props.text, props.options.level])
    const nextWord = () => {
        setWord(word + 1)
    }
    useEffect(() => {
        clearTimeout(timeout)
        if (start) {
            setTime(setTimeout(() => nextWord(), 1000 * 60 / speed))
        }
    }, [start, speed])
    let chooseWord = (index: number) => {
        clearTimeout(timeout)
        setWord(index)
    }
    useEffect(() => {
        clearTimeout(timeout)
        if (text) {
            if (start && word != normTextLength) {
                setTime(setTimeout(() => nextWord(), 1000 * 60 / speed))
            } else {
                if (start)
                    setStart(!start)
            }
        }
    }, [word])
    useEffect(() => {
        if (start) {
        }
        else {
            clearTimeout(timeout)
        }
    }, [timeout])
    const {
        token: { colorBgContainer, borderRadiusLG, colorInfoBg, colorBgBase, colorBgContainerDisabled, colorBorderSecondary, colorPrimary, colorBorder },
    } = theme.useToken();
    return (
        <div style={{ height: '100%', display: 'flex', flex: 1, overflow: 'auto', flexDirection: 'column', width: '100%' }}>

            <ReflexContainer orientation='vertical' windowResizeAware={true} style={{ height: '100%', overflow: 'auto', border: '1px solid ' + colorBorderSecondary, display: 'flex', flex: 1 }} >
                <ReflexElement minSize={50} style={{ height: '100% ', width: '100%', display: 'flex', flex: 1, background: colorBgContainer }}>
                    <ShowWord textLength={normTextLength} text={normalizeText} word={word} start={start} setWord={setWord} setStart={setStart} />
                </ReflexElement>
                <ReflexSplitter />
                <ReflexElement minSize={50} style={{ height: '100%', width: '100%', overflow: 'auto', display: 'flex', flex: 1 }}>
                    <Layout style={{ height: '100%', overflow: 'auto', width: '100%', display: 'flex', flex: 1 }}>
                        <Header style={{ borderBottom: '1px solid ' + colorBorder, background: colorBgBase, overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', lineHeight: '100%', fontSize: '20px', fontWeight: 'bold', height: '32px' }}> {text?.title}</Header>
                        <Content
                            style={{
                                borderBottom: '1px solid ' + colorBorder,
                                height: '100%',
                                maxWidth: '100%',
                                whiteSpace: 'pre-wrap',
                                background: colorBgBase,
                                // textAlign: 'left',
                                flex: 1,
                                overflow: 'auto',
                                textIndent: '30px',
                                textAlign: 'left',
                                paddingLeft: '12px'
                            }}
                        >
                            {normalizeText.map((item, indexPar) => {
                                return <p>
                                    {item.par.map((curWord, index, array) => {
                                        // if (array[index + 1])
                                        //     if (['/', '—'].includes(array[index + 1])) {
                                        //         let words = word + ' ' + array[index + 1] + ' ' + array[index + 2]
                                        //         return <Tooltip key={index} title={words}>
                                        //             <span key={word.word} style={{ marginRight: '5px', whiteSpace: 'nowrap', textWrap: 'nowrap' }}>
                                        //                 {words}
                                        //             </span>
                                        //         </Tooltip>
                                        //     }
                                        // if (array[index - 1])
                                        //     if (['/', '—'].includes(array[index - 1]) || ['/', '—'].includes(word))
                                        //         return null
                                        return <Button size='small' type='text' key={index} onClick={() => chooseWord(curWord.index)}
                                            style={{
                                                marginRight: 5,
                                                marginLeft: 0,
                                                backgroundColor: word === curWord.index ? colorPrimary : '',
                                                padding: 0,

                                            }}>
                                            {curWord.word}
                                        </Button>
                                    })}
                                </p>
                            }
                            )}



                        </Content>
                        <Footer
                            style={{
                                padding: 4,
                                overflowX: 'hidden',
                                overflowY: 'hidden',
                                // borderTop: '2px solid #dedede',
                                backgroundColor: colorBgBase,
                            }}
                        >
                            <Progress percent={word < 0 ? 0 : 100 * word / (normTextLength)} />
                            <Descriptions
                                items={[
                                    { label: 'Слов в минуту', children: speed },
                                    { label: 'Время для прочетния', children: Math.round(((normTextLength / (speed + 0.1)) * 100)) / 100 + ' мин.' }

                                ]}
                            />
                        </Footer>
                    </Layout>
                </ReflexElement>
            </ReflexContainer >
        </div >
    )
}

export default ShowText;
