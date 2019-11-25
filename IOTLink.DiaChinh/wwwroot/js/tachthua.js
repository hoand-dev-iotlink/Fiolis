convertToPoint = function (p) {
    let point = {
        x: 0,
        y: 0
    };
    if (p[0] != undefined) {
        point.x = p[1];
        point.y = p[0];
    }
    return point;
};
//return {a,b,c}: ax + by = c
duongThangQua2Diem = function (A, B) {
    let pA = convertToPoint(A);
    let pB = convertToPoint(B);
    let a = pB.y - pA.y;
    let b = pA.x - pB.x;
    let c = a * pA.x + b * pA.y;
    return {
        a: a,
        b: b,
        c: c
    };
};
//A,B,C,D: point or array[y,x]
//return {x,y}
giaoABvaCD = function (A, B, C, D) {
    let pA = convertToPoint(A);
    let pB = convertToPoint(B);
    let pC = convertToPoint(C);
    let pD = convertToPoint(D);
    let d1 = duongThangQua2Diem(pA, pB);
    let d2 = duongThangQua2Diem(pC, pD);
    return giaoHaiDuong(d1, d2);

};
//d1,d2:{a,b,c}:ax+ by = c
//return {x,y}
giaoHaiDuong = function (d1, d2) {
    let D = d1.a * d2.b - d2.a * d1.b;
    let Dx = d1.c * d2.b - d2.c * d1.b;
    let Dy = d1.a * d2.c - d2.a * d1.c;
    if (D === 0) {
        return false;
    }
    else {
        return {
            x: Dx / D,
            y: Dy / D
        };
    }
};
giaoHaiDuongTron = function (A, rA, B, rB) {
    let pA = convertToPoint(A);
    let pB = convertToPoint(B);
    let x0 = pA.x;
    let y0 = pA.y;
    let r0 = rA;
    let x1 = pB.x;
    let y1 = pB.y; 
    let r1 = rB;
    let a, dx, dy, d, h, rx, ry;
    let x2, y2;

    /* dx and dy are the vertical and horizontal distances between
     * the circle centers.
     */
    dx = x1 - x0;
    dy = y1 - y0;

    /* Determine the straight-line distance between the centers. */
    d = Math.sqrt(dy * dy + dx * dx);

    /* Check for solvability. */
    if (d > r0 + r1) {
        /* no solution. circles do not intersect. */
        return false;
    }
    if (d < Math.abs(r0 - r1)) {
        /* no solution. one circle is contained in the other */
        return false;
    }

    /* 'point 2' is the point where the line through the circle
     * intersection points crosses the line between the circle
     * centers.  
     */

    /* Determine the distance from point 0 to point 2. */
    a = (r0 * r0 - r1 * r1 + d * d) / (2.0 * d);

    /* Determine the coordinates of point 2. */
    x2 = x0 + dx * a / d;
    y2 = y0 + dy * a / d;

    /* Determine the distance from point 2 to either of the
     * intersection points.
     */
    h = Math.sqrt(r0 * r0 - a * a);

    /* Now determine the offsets of the intersection points from
     * point 2.
     */
    rx = -dy * (h / d);
    ry = dx * (h / d);

/* Determine the absolute intersection points. */
    let xi = x2 + rx;
    let xi_prime = x2 - rx;
    let yi = y2 + ry;
    let yi_prime = y2 - ry;
    let point1 = {
        x: xi,
        y: yi
    };
    let point2 = {
        x: xi_prime,
        y: yi_prime
    };
    if (rx === 0) {
        return [point1];
    }
    return [point1, point2];
};