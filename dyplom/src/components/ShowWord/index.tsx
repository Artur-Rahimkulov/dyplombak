import { HashRouter, Route, Routes } from 'react-router-dom';
import { Button, ConfigProvider } from 'antd';
import ru_RU from 'antd/locale/ru_RU';
import { ReflexContainer, ReflexSplitter, ReflexElement } from 'react-reflex';
import 'react-reflex/styles.css';
import { useState } from 'react';
import ButtonGroup from 'antd/es/button/button-group';
import { CaretRightOutlined, LeftOutlined, PauseOutlined, RedoOutlined, RightOutlined } from '@ant-design/icons';

/**
 * Renders the main component of the application.
 * 
 * @returns {JSX.Element} The rendered component.
 */
interface Props {
    text: { minIndex: number, maxIndex: number, length: number, par: { word: string, index: number }[] }[],
    word: number,
    setStart: (start: boolean) => void,
    setWord: (word: number) => void,
    start: boolean,
    textLength: number,
    fontSize: number,

}
function ShowWord({ fontSize, text, word, setStart, setWord, start, textLength }: Props) {
    let getWord = (index: number) => {
        //find word by index
        for (let i = 0; i < text.length; i++) {
            let minIndex = text[i].minIndex
            let maxIndex = text[i].maxIndex
            if (index >= minIndex && index <= maxIndex) {
                return text[i].par.find(word => word.index == index)?.word
            }
        }
        return null
    }
    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'spaec-between' }}>
            <div style={{ width: '100%', flex: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <p onClick={() => {
                    if (text.length > 0)
                        setStart(!start)
                }}>
                    {
                        word >= 0 ?
                            <h1 style={{ fontSize: '' + fontSize + 'rem' }}>{getWord(word)}</h1>
                            : text.length > 0 ? <h1>Нажмите чтобы начать</h1> : <h1>Выберите текст</h1>
                    }
                </p>
            </div>
            <ButtonGroup size='large' style={{ position: 'relative', bottom: '10px' }}>
                <Button onClick={() => setWord(-1)} disabled={word == -1 || text.length == 0} icon={<RedoOutlined />} />
                <Button onClick={() => setWord(word - 1)} disabled={word <= 0 || text.length == 0} icon={<LeftOutlined />} />
                <Button onClick={() => setStart(!start)} disabled={word >= textLength || text.length == 0} icon={start ? <PauseOutlined /> : <CaretRightOutlined />} />
                <Button onClick={() => setWord(word + 1)} disabled={word >= textLength || text.length == 0} icon={<RightOutlined />} />
            </ButtonGroup>
        </div>
    )
}

export default ShowWord;
