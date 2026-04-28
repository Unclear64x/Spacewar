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
