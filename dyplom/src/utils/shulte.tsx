type ShulteMatrix = { number: number, deg: number }[][]
export function getShulteMatrix(size: number) {
    const matrix = [] as ShulteMatrix
    for (let i = 0; i < size; i++) {
        matrix.push([])
        for (let j = 0; j < size; j++) {
            matrix[i].push({ number: i * size + j, deg: getRandomFrom0To360() })
        }
    }
    console.log(matrix)
    return shuffleShulteMatrix(matrix)
}
function getRandomFrom0To360() {
    return Math.floor(Math.random() * 360)
}
function shuffleShulteMatrix(matrix: ShulteMatrix) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix.length; j++) {
            const index = Math.floor(Math.random() * matrix.length)
            const rindex = Math.floor(Math.random() * matrix.length)
            const temp = matrix[i][j]
            matrix[i][j] = matrix[rindex][index]
            matrix[rindex][index] = temp
        }
    }
    return swapWithCenter(matrix)
}

function swapWithCenter(matrix: ShulteMatrix) {
    // Находим размер матрицы
    const size = matrix.length;
    const center = Math.floor(size / 2);

    // Ищем элемент, равный 0
    let zeroRow = 0, zeroCol = 0;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (matrix[i][j].number === 0) {
                zeroRow = i;
                zeroCol = j;
                break;
            }
        }
    }
    // Меняем местами 0 и центральный элемент
    [matrix[zeroRow][zeroCol], matrix[center][center]] = [matrix[center][center], matrix[zeroRow][zeroCol]];

    return matrix;
}