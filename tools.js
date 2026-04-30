/**
 * Удаляет объект из массива
 * @param {Array} array 
 * @param {*} object 
 */
function removeFromArray(array, object) {
    let index = array.indexOf(object);
    if (index >= 0) {
        array.splice(index, 1);
        return true;
    }
    return false;
}

/**
 * Вычисляет центр масс
 * @param {Array<Array<Number>>} vertices вершины фигуры
 */
function getCentreOfMass(vertices) {
    let S = 0;
    let x = 0, y = 0;

    let len = vertices.length;

    for (let i = 0; i < len; i++) {
        let currX = vertices[i][0], currY = vertices[i][1];
        let nextX = vertices[(i + 1) % len][0], nextY = vertices[(i + 1) % len][1];

        let scalar = currX * nextY - nextX * currY;

        S += scalar;
        x += (currX + nextX) * scalar;
        y += (currY + nextY) * scalar;
    }

    if (S == 0)
        return [0, 0];

    // S = 1/2 * Сумма( скалярные произведения точек )
    // Cx = 1/6 * 1/2S * Сумма( (x1 + x2) * скалярное произведение )
    // просто все коэффициенты перемножил и получил 3
    x /= 3 * S;
    y /= 3 * S

    return [x, y];
}

/**
 * Возвращает длину вектора
 * @param {Array<Number>} vector 
 */
function getVectorLength(vector) {
    return (vector[0] ** 2 + vector[1] ** 2) ** 0.5;
}

/**
 * Возвращает векторное произведение векторов
 * @param {Array<Number>} vector1 
 * @param {Array<Number>} vector2 
 */
function getVectorProduct(vector1, vector2) {
    return (vector1[0] * vector2[1]) - (vector1[1] * vector2[0]);
}

/**
 * Возвращает скалярное произведение векторов
 * @param {Array<Number>} vector1 
 * @param {Array<Number>} vector2 
 */
function getScalarProduct(vector1, vector2) {
    return (vector1[0] * vector2[0]) + (vector1[1] * vector2[1]);
}

function getCosFromVectors(vector1, vector2) {
    let len1 = getVectorLength(vector1);
    let len2 = getVectorLength(vector2);

    if (len1 == 0 || len2 == 0) {
        return 0;
    }

    return getScalarProduct(vector1, vector2) / (len1 * len2);
}

/**
 * Возвращает нормализованный вектор
 * @param {Array<Number>} vector 
 */
function getNormalizedVector(vector) {
    if (vector[0] == 0 && vector[1] == 1)
        return [0, 0];

    let len = getVectorLength(vector);
    
    return [vector[0] / len, vector[1] / len];
}