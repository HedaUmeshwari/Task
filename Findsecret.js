const fs = require('fs');

// Function to load JSON files
function loadJson(filePath) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
        console.error(`Error reading JSON from ${filePath}:`, error.message);
        throw error; // Re-throw the error after logging it
    }
}

// Function to decode a value from a given base to decimal
function decodeValue(base, value) {
    return parseInt(value, base);
}

// Function for Lagrange interpolation
function lagrangeInterpolation(xValues, yValues, x) {
    let total = 0;
    const n = xValues.length;

    for (let i = 0; i < n; i++) {
        let xi = xValues[i];
        let yi = yValues[i];
        let term = yi;

        for (let j = 0; j < n; j++) {
            if (i !== j) {
                term *= (x - xValues[j]) / (xi - xValues[j]);
            }
        }
        total += term;
    }
    return total;
}

// Function to find the constant term 'c'
function findConstantTerm(data) {
    const n = data.keys.n;
    const k = data.keys.k;

    const xValues = [];
    const yValues = [];

    for (const key in data) {
        if (!isNaN(key)) { // Check if key is a number
            const base = parseInt(data[key].base);
            const value = data[key].value;
            const x = parseInt(key);
            const y = decodeValue(base, value);

            xValues.push(x);
            yValues.push(y);
        }
    }

    // We only need k values for interpolation
    if (xValues.length >= k) {
        // Calculate constant term (c) which is f(0)
        const c = lagrangeInterpolation(xValues.slice(0, k), yValues.slice(0, k), 0);
        return Math.round(c); // Return as integer
    } else {
        throw new Error("Not enough points to interpolate");
    }
}

// Load JSON data
const data1 = loadJson('./Testcase1.json');
const data2 = loadJson('./Testcase2.json');

// Find constants for both test cases
try {
    const secret1 = findConstantTerm(data1);
    const secret2 = findConstantTerm(data2);

    console.log(`Secret for Test Case 1: ${secret1}`);
    console.log(`Secret for Test Case 2: ${secret2}`);
} catch (error) {
    console.error(error.message);
}
