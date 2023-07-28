const cos = Math.cos;
const sin = Math.sin;
const pi = Math.PI;

exports.transpose = function(mat) {
    let mat_t = [];
    for(let i = mat.length-1; i>=0; i--) {
        mat_t.push([]);
        for(let j = mat[i].length-1; j>=0; j--) {
            mat_t.push(mat[i][j]);
        }
    }
    return mat_t;
}

exports.R_z = function(theta) {
    return [
        [cos(theta),    -1*sin(theta),  0],
        [sin(theta),    cos(theta),     0],
        [0,             0,              1]
    ];
}

exports.R_y = function(theta) {
    return [
        [cos(theta),    0, sin(theta)],
        [0,             1, 0],
        [-1*sin(theta), 0, cos(theta)]
    ];
}

exports.R_x = function(theta) {
    return [
        [1, 0,          0],
        [0, cos(theta), -1*sin(theta)],
        [0, sin(theta), cos(theta)]
    ];
}

exports.matMult = function(mat, vec) {
    let res = [];
    let i = 0;
    let j = 0;
    
    mat.forEach((row) => {
        res.push(0);
        j = 0;
        vec.forEach((col) => {
            res[i] += row[j]*col;
            j++;
        });
        i++;
    });

    return res;
}

//https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles
exports.R_fromEuler = function(x, y, z) {
    /*
        x: phi
        y: theta
        z: psi
        R = R_z(psi)*R_y(theta)*R_x(phi)
    */
    return [
        [cos(y)*cos(z), -1*cos(x)*sin(z)+sin(x)*sin(y)*cos(x),  sin(x)*sin(z)+cos(x)*sin(y)*cos(z)],
        [cos(y)*sin(z), cos(x)*cos(z)+sin(x)*sin(y)*sin(z),     -1*sin(x)*cos(z)+cos(x)*sin(y)*sin(z)],
        [-1*sin(y),     sin(x)*cos(y),                          cos(x)*cos(y)]
    ];
}