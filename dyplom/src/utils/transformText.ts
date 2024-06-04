export function isSpecialCharacter(char: string) {
    // Проверка на специальные символы
    if (/[!@#$\n%^&*«»()_+\-=\[\]{};:"\\|,.<>\/?]/.test(char)) {
        return true;
    }

    // Проверка на знаки препинания
    if (/[.,\/#!$%\^&\*;:{}=\-_`~()]/.test(char)) {
        return true;
    }

    // Проверка на цифры
    if (/[0-9]/.test(char)) {
        return true;
    }

    // Проверка на пробельные символы
    // if (/\s/.test(char)) {
    //   return true;
    // }

    // Если символ не найден ни в одном из регулярных выражений, значит это буква или другой символ
    return false;
}
function stringToArrayString(str: string, N: number): string[] {
    //text to array of words and special symbols 
    let result = []
    let currentWord = ''
    for (let i = 0; i < str.length; i++) {
        if (str[i] == ' ') {
            if (currentWord.length > 0) {
                result.push(currentWord)
                currentWord = ''
            }
        } else {
            currentWord += str[i]
        }
    }
    console.log(result)
    return result
}

function splitTextToWordsArrays(text: string, level?: number, options: { pinWords?: boolean } = {}): string[][] {
    /**
     * Функция, которая разделяет текст на абзацы и слова.
     *
     * Параметры:
     * text (string): Исходный текст
     *
     * Возвращает:
     * array: Массив массивов слов, где каждый внутренний массив содержит слова одного абзаца
     */
    // Разделяем текст на абзацы

    let paragraphs = text.replaceAll('-', '‑').split('\n');

    // Разделяем каждый абзац на слова и формируем массив массивов
    let wordsArrays = paragraphs.map(paragraph => {
        if (options.pinWords == false)
            return paragraph.trim().split(' ')
        return pairWords(paragraph.trim().split(' '), level)
    });

    return wordsArrays;
}
function pairWords(words: string[], N?: number): string[] {
    let norm = []
    const pairs = [];
    let sort = ['/', '—', '‑', '–']
    for (let i = 0; i < words.length; i++) {
        let pair = words[i]
        if (words[i + 1])
            if (sort.includes(words[i + 1])) {
                pair = words.slice(i, i + 3).join(' ')
                norm.push(pair);
                continue
            }
        if (words[i - 1])
            if (sort.includes(words[i - 1]) || sort.includes(words[i]))
                continue
        norm.push(pair)
    }
    if (!N)
        return norm
    for (let i = 0; i < norm.length; i += N) {
        const pair = norm.slice(i, i + N).join(' ');
        pairs.push(pair);
    }
    return pairs;
}
export function getShowText(text: string, level?: number): { result: { minIndex: number, maxIndex: number, length: number, par: { word: string, index: number }[] }[], GlobalIndex: number } {
    console.log(level, 'level')
    let words = splitTextToWordsArrays(text, level, { pinWords: true })
    let GlobalIndex = 0
    let result = words.map(paragraph => {
        let minIndex = GlobalIndex
        let maxIndex = paragraph.length - 1 + GlobalIndex
        return {
            minIndex, maxIndex, length: paragraph.length, par:
                paragraph.map((word, index) => {
                    return { word, index: GlobalIndex++ }
                })
        }
    })
    console.log(result)
    return { result, GlobalIndex }
}
export function shuffleText(str: string, N: number): {
    word: string;
    shuffled: string;
}[][] {
    let words = splitTextToWordsArrays(str, undefined, { pinWords: false })
    let result = words.filter(par => par.length > 0).map(paragraph => paragraph.filter(word => word).map(word => {
        if (isUpperCase(word[0]))
            return { word: word, shuffled: word }
        return { word: word, shuffled: swapLetters(word, N) }
    }))
    return result;
}
let isUpperCase = (char: string) => char == char.toUpperCase()

function swapLetters(word: string, N: number): string {
    /**
     * Функция, которая N раз меняет местами 2 случайные буквы в заданном слове.
     *
     * Параметры:
     * word (string): Исходное слово
     * N (number): Количество раз, которое нужно поменять местами буквы
     *
     * Возвращает:
     * string: Новое слово с изменениями
     */
    let wordArray = word.split('');

    for (let i = 0; i < N; i++) {
        // Выбираем 2 случайных индекса
        let idx1 = Math.floor(Math.random() * wordArray.length);
        let idx2 = Math.floor(Math.random() * wordArray.length);
        // Меняем буквы местами
        if (isSpecialCharacter(wordArray[idx1]) || isSpecialCharacter(wordArray[idx2])) {
            continue
        } else
            [wordArray[idx1], wordArray[idx2]] = [wordArray[idx2], wordArray[idx1]];
    }

    return wordArray.join('');
}

export {
    stringToArrayString,
    splitTextToWordsArrays
}