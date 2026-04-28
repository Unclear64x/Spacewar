/**
 * 
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