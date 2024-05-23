import 'react-reflex/styles.css';
import { useEffect, useState } from 'react';
import { TextModelForReadEdit } from '../../models/Text';
import { Tooltip, Typography } from 'antd';
import { isSpecialCharacter, shuffleText } from '../../utils/transformText';
import Title from 'antd/es/typography/Title';

function Shuffle({ text, options }: { text?: TextModelForReadEdit | null, options?: { level?: number } }) {
    let [shuffled, setShuffled] = useState<{
        word: string;
        shuffled: string;
    }[][]>([])
    useEffect(() => {
        if (text) {
            let level = 1
            if (options?.level)
                level = options.level
            let shuffled = shuffleText(text.text, level)
            console.log(shuffled)
            setShuffled(shuffled)
        }
    }, [text, options])
    return text ? <Typography style={{ textIndent: '30px', textAlign: 'left', paddingLeft: '12px' }}>
        {shuffled.map((item, index) => {
            return <p>
                {item.map((word, index, array) => {
                    if (array[index + 1])
                        if (['/', '—'].includes(array[index + 1].word)) {
                            let words = word.shuffled + ' ' + array[index + 1].word + ' ' + array[index + 2].shuffled
                            return <Tooltip key={index} title={words}>
                                <span key={word.word} style={{ marginRight: '5px', whiteSpace: 'nowrap', textWrap: 'nowrap' }}>
                                    {words}
                                </span>
                            </Tooltip>
                        }
                    if (array[index - 1])
                        if (['/', '—'].includes(array[index - 1].word) || ['/', '—'].includes(word.word))
                            return null
                    return <Tooltip key={index} title={word.word}>
                        <span key={word.word} style={{ marginRight: '5px', whiteSpace: 'none' }}>{word.shuffled}</span>
                    </Tooltip>
                })}
            </p>
        }
        )}
    </Typography> : <Typography>
        <Title style={{ textAlign: 'left', marginTop: '0px' }} level={4}></Title>
    </Typography>
}

export default Shuffle