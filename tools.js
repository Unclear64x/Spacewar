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
 * @param {Array<Vector>} vertices вершины фигуры
 */
function getCentreOfMass(vertices) {
    let S = 0;
    let x = 0, y = 0;

    let len = vertices.length;

    for (let i = 0; i < len; i++) {
        let curr = vertices[i];
        let next = vertices[(i + 1) % len];

        let scalar = curr.cross(next);

        S += scalar;
        x += (curr.x + next.x) * scalar;
        y += (curr.y + next.y) * scalar;
    }

    if (S == 0)
        return new Vector(0, 0);

    // S = 1/2 * Сумма( скалярные произведения точек )
    // Cx = 1/6 * 1/2S * Сумма( (x1 + x2) * скалярное произведение )
    // просто все коэффициенты перемножил и получил 3
    x /= 3 * S;
    y /= 3 * S

    return new Vector(x, y);
}

/**
 * Возвращает число, плавно приближающееся к целевому значению
 * @param {Number} start 
 * @param {Number} end 
 * @param {Number} k 
 */
function lerp(start, end, k) {
    console.log(`${start} + (${end - start}) * ${k}`);
    return start + (end - start) * k;
}