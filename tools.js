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
 * Вычисляет центр масс и момент инерции
 * @param {Array<Vector>} collider 
 */
function getColliderInfo(collider, mass) {
    let S = 0;
    let x = 0, y = 0;

    let len = collider.length;

    for (let i = 0; i < len; i++) {
        let curr = collider[i];
        let next = collider[(i + 1) % len];

        let scalar = curr.cross(next);

        S += scalar;
        x += (curr.x + next.x) * scalar;
        y += (curr.y + next.y) * scalar;
    }

    x /= S == 0 ? 0 : 3 * S;
    y /= S == 0 ? 0 : 3 * S;

    let center = new Vector(x, y);

    let sum = 0;
    for (let i = 0; i < len; i++) {
        let r = collider[i].new().remove(center);
        sum += r.x ** 2 + r.y ** 2;
    }

    let I = sum * mass / len;

    return [center, I > 0 ? I : 1];
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

/**
 * Ищет точку пересечения линий
 * @param {Vector} dot11 
 * @param {Vector} dot12 
 * @param {Vector} dot21 
 * @param {Vector} dot22 
 */
function findDot(dot11, dot12, dot21, dot22) {
    let d = (dot22.x - dot21.x) * (dot12.y - dot11.y) - (dot12.x - dot11.x) * (dot22.y - dot21.y);

    if (Math.abs(d) == 0)
        return null;

    let dt = (dot22.x - dot21.x) * (dot21.y - dot11.y) - (dot21.x - dot11.x) * (dot22.y - dot21.y);
    let du = (dot12.x - dot11.x) * (dot21.y - dot11.y) - (dot12.y - dot11.y) * (dot21.x - dot11.x);

    let t = dt / d;
    let u = du / d;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        let x = dot11.x + (dot12.x - dot11.x) * t;
        let y = dot11.y + (dot12.y - dot11.y) * t;
        return new Vector(x, y);
    }

    return null;
}

/**
 * 
 * @param {Vector} dot1 
 * @param {Vector} dot2 
 * @param {Vector} polygon 
 */
function hasDot(dot1, dot2, polygon) {
    let d = (dot2.x - dot1.x) * (polygon.y - dot1.y) - (dot2.y - dot1.y) * (polygon.x - dot1.x);

    return d <= 0;
}

/**
 * 
 * @param {Number} x1 
 * @param {Number} y1 
 * @param {Number} x2 
 * @param {Number} y2 
 */
function lengthBetween(x1, y1, x2, y2) {
    let x = x2 - x1;
    let y = y2 - y1;
    return (x ** 2 + y ** 2) ** 0.5;
}