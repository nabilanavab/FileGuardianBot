

/**
 * 
 * Edits a dictionary based on provided conditions.
 * front : user INterface
 * value : if you pass any single value then {} will be replaced by the value in key[value]
 * 
 * @param {object} inDict - Input dictionary.
 * @param {any} [value=false] - Value used for formatting dictionary values.
 * @param {boolean} [front=false] - Flag indicating whether to change cb in UI.
 * @returns {object} - Edited dictionary.
 * 
 */


async function editDict(inDict, value = false, front = false) {
    let outDict = {};
  
    if (front) {
        // Changes cb in UI
        for (const [i, j] of Object.entries(inDict)) {
            outDict[i.format(front)] = j;
        }
        inDict = outDict;
    }

    if (value && !Array.isArray(value)) {
        // Changes cb.data
        for (const [i, j] of Object.entries(inDict)) {
            outDict[i] = j.format(value);
        }
    } else if (Array.isArray(value)) {
        if (value.length === 2) {
            for (const [i, j] of Object.entries(inDict)) {
            outDict[i] = j.format(value[0], value[1]);
            }
        }

        if (value.length === 3) {
            for (const [i, j] of Object.entries(inDict)) {
            outDict[i] = j.format(value[0], value[1], value[2]);
            }
        }
    }

    return outDict;
}


module.exports = editDict;