import { HashRouter, Route, Routes, useParams } from 'react-router-dom';
import { Button, ConfigProvider, Descriptions, FloatButton, Progress, Tooltip, theme } from 'antd';
import ru_RU from 'antd/locale/ru_RU';
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';
import 'react-reflex/styles.css';
import styles from '../../App.module.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
        setStart(false)
        setWord(-1)
        // clearTimeout(timeout)
        if (props.text) {
            setText(props.text)
            let normText = getShowText(props.text.text as string, props.options.level || 1)
            setNormTextLength(normText.GlobalIndex - 1)
            setNormalizeText(normText.result)
        }
    }, [props.text, props.options.level]);

    function setNextWord(word: number) {
        return setTimeout(() => {
            setWord(word + 1)
        }, 1000 * 60 / speed)
    }
    useEffect(() => {
        clearTimeout(timeout)
        if (start) {
            setTime(setNextWord(word))
        }
    }, [start, speed])
    let chooseWord = (index: number) => {
        clearTimeout(timeout)
        setStart(false)
        setWord(index)
    }
    useEffect(() => {
        if (text) {
            if (start && word != normTextLength) {
                clearTimeout(timeout)
                setTime(setNextWord(word))
            } else {
                if (start)
                    setStart(!start)
            }
        }
    }, [word])

    const {
        token: { colorBgContainer, borderRadiusLG, colorInfoBg, colorBgBase, colorBgContainerDisabled, colorBorderSecondary, colorPrimary, colorBorder },
    } = theme.useToken();
    let getText = useMemo(() => {
        return normalizeText.map((item, indexPar) => {
            return <p>
                {item.par.map((curWord, index, array) => {
                    return <Button className={'text-word-' + curWord.index} size='small' type='text' key={index} onClick={() => chooseWord(curWord.index)}
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
        )
    }, [normalizeText])
    return (
        <div style={{ height: '100%', display: 'flex', flex: 1, overflow: 'auto', flexDirection: 'column', width: '100%' }}>

            <ReflexContainer orientation='vertical' windowResizeAware={true} style={{ height: '100%', overflow: 'auto', border: '1px solid ' + colorBorderSecondary, display: 'flex', flex: 1 }} >
                <ReflexElement minSize={50} style={{ height: '100% ', width: '100%', display: 'flex', flex: 1, background: colorBgContainer }}>
                    <ShowWord fontSize={props?.options.fontSize || 4} textLength={normTextLength} text={normalizeText} word={word} start={start} setWord={setWord} setStart={setStart} />
                </ReflexElement>
                <ReflexSplitter />
                <ReflexElement minSize={50} style={{ height: '100%', width: '100%', overflow: 'auto', display: 'flex', flex: 1 }}>
                    <Layout style={{ height: '100%', overflow: 'auto', width: '100%', display: 'flex', flex: 1 }}>
                        <Header style={{ borderBottom: '1px solid ' + colorBorder, background: colorBgBase, overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', lineHeight: '100%', fontSize: '20px', fontWeight: 'bold', height: 'max-content', minHeight: '32px' }}> {text?.title}</Header>
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
                            {getText}
                        </Content>
                        <Footer
                            style={{
                                padding: 0,
                                overflowX: 'hidden',
                                overflowY: 'hidden',
                                // borderTop: '2px solid #dedede',
                                backgroundColor: colorBgBase,
                            }}
                        >
                            <Progress percent={word < 0 ? 0 : 100 * word / (normTextLength)} style={{ paddingLeft: '12px', paddingRight: '12px' }} />
                            <Descriptions
                                items={[
                                    { label: 'Слов в минуту', children: speed },
                                    { label: 'Время для прочетния', children: Math.round(((normTextLength / (speed)) * 100)) / 100 + ' мин.' }

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
