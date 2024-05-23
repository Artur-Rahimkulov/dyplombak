import 'react-reflex/styles.css';
import { useEffect, useState } from 'react';
import { Typography } from 'antd';
import { splitTextToWordsArrays } from '../../utils/transformText';
import { TextModelForReadEdit } from '../../models/Text';
import styles from './reverse.module.css';
function ReverseText({ text, options }: { text?: TextModelForReadEdit | null, options?: { level?: number } }) {
    let [normText, setNormText] = useState<string[][]>([])
    useEffect(() => {
        if (text) {
            let shuffled = splitTextToWordsArrays(text.text, undefined, { pinWords: options?.level !== 3 })
            setNormText(shuffled)
        }
    }, [text,options])
    return <Typography className={(options?.level == 1 || !options?.level) ? styles.revert : ''} style={
        {
            textIndent: options?.level == 3 ? '0px' : '30px',
            textAlign: 'left',
            paddingLeft: '12px'
        }
    }>
        {normText.map((item, index) => {
            return <p className={options?.level == 2 ? styles.revert : ''} key={index}>
                {item.map((word, index, array) => {

                    return <span className={options?.level == 3 ? styles.revert : ''} key={index} style={{
                        margin: 0,
                        padding: 0,
                        display: options?.level == 3 ? 'inline-block' : 'inline',
                        marginRight: '5px',
                        whiteSpace: 'nowrap',

                        // display:'inline-block',
                        // transform: 'rotateX(-45deg) rotateY(180deg) rotateZ(0deg)',
                    }}>{word}</span>

                })}
            </p>
        }
        )}
    </Typography >
}

export default ReverseText