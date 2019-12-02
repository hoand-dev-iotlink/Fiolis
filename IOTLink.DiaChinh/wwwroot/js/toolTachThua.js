function convertToPoint(p) {
    let point = {
        x: 0,
        y: 0
    };
    if (p[0] !== undefined) {
        point.x = p[0];
        point.y = p[1];
    }
    return point;
}
//return {a,b,c}: ax + by = c
function duongThangQua2Diem(A, B) {
    let pA = convertToPoint(A);
    let pB = convertToPoint(B);
    let a = pB.y - pA.y;
    let b = pA.x - pB.x;
    let c = a * pA.x + b * pA.y;
    return {
        a: a + 0,
        b: b + 0,
        c: c + 0
    };
}
//d1,d2:{a,b,c}:ax+ by = c
//return {x,y}
function giaoHaiDuong(d1, d2) {
    let D = d1.a * d2.b - d2.a * d1.b;
    let Dx = d1.c * d2.b - d2.c * d1.b;
    let Dy = d1.a * d2.c - d2.a * d1.c;
    if (D === 0) {
        return false;
    }
    else {
        return {
            x: Dx / D + 0,
            y: Dy / D + 0
        };
    }
}
function gocDinhHuongVector(AB) {
    if (AB.x === 0 && AB.y > 0) {
        return Math.PI / 2;
    }
    if (AB.x === 0 && AB.y < 0) {
        return 3 * Math.PI / 2;
    }
    if (AB.y === 0 && AB.x > 0) {
        return 0;
    }
    if (AB.y === 0 && AB.x < 0) {
        return Math.PI;
    }
    if (AB.x > 0 && AB.y > 0) {
        return Math.atan(Math.abs(AB.y / AB.x));
    }
    if (AB.x < 0 && AB.y > 0) {
        return Math.PI - Math.atan(Math.abs(AB.y / AB.x));
    }
    if (AB.x < 0 && AB.y < 0) {
        return Math.PI + Math.atan(Math.abs(AB.y / AB.x));
    }
    if (AB.x > 0 && AB.y < 0) {
        return 2 * Math.PI - Math.atan(Math.abs(AB.y / AB.x));
    }
}
//A,B,C,D: point or array[y,x]
//return {x,y}
function giaoHoiHuong(A, B, C, D) {
    let pA = convertToPoint(A);
    let pB = convertToPoint(B);
    let pC = convertToPoint(C);
    let pD = convertToPoint(D);
    let d1 = duongThangQua2Diem(pA, pB);
    let d2 = duongThangQua2Diem(pC, pD);
    return giaoHaiDuong(d1, d2);

}
function giaoHoiThuanTheoCanh(A, rA, B, rB) {
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
}
function giaoHoiDocTheoCanh(A, B, h, fromB = false) {
    let pA = convertToPoint(A);
    let pB = convertToPoint(B);
    let vectorAB = {
        x: pB.x - pA.x,
        y: pB.y - pA.y
    };
    if (vectorAB.x === 0 && vectorAB.y === 0) {
        return false;
    }
    AB = Math.sqrt(vectorAB.x * vectorAB.x + vectorAB.y * vectorAB.y);
    let AC = h;
    if (fromB) {
        AC = AB + h;
    }
    let k = AC / AB;
    let vectorAC = {
        x: vectorAB.x * k,
        y: vectorAB.y * k
    };
    return {
        x: pA.x + vectorAC.x,
        y: pA.y + vectorAC.y
    };
}
function giaoHoiCachDuongThang(A, B, C, D, cachAB, cachCD) {
    let AB = duongThangQua2Diem(A, B);
    let CD = duongThangQua2Diem(C, D);
    let dAB = Math.sqrt(AB.a * AB.a + AB.b * AB.b);
    let dCD = Math.sqrt(CD.a * CD.a + CD.b * CD.b);
    let d1 = {
        a: AB.a,
        b: AB.b,
        c: dAB * cachAB + AB.c
    };
    let d2 = {
        a: AB.a,
        b: AB.b,
        c: dAB * cachAB * -1 + AB.c
    };
    let d3 = {
        a: CD.a,
        b: CD.b,
        c: dCD * cachCD + CD.c
    };
    let d4 = {
        a: CD.a,
        b: CD.b,
        c: dCD * cachCD * -1 + CD.c
    };
    let p1 = giaoHaiDuong(d1, d3);
    let p2 = giaoHaiDuong(d1, d4);
    let p3 = giaoHaiDuong(d2, d3);
    let p4 = giaoHaiDuong(d2, d4);
    let ps = [];
    if (p1) {
        return [p1, p2, p3, p4];
    }
    else {
        return false;
    }
}
function giaoHoiThuanTheoGoc(A, B, gocA, gocB) {
    let pA = convertToPoint(A);
    let pB = convertToPoint(B);
    if (gocA + gocB >= Math.PI) {
        return false;
    }
    let vectorAB = {
        x: pB.x - pA.x,
        y: pB.y - pA.y
    };
    AB = Math.sqrt(vectorAB.x * vectorAB.x + vectorAB.y * vectorAB.y);
    let AP = Math.sin(gocB) * AB / Math.sin(gocA + gocB);
    let BP = Math.sin(gocA) * AB / Math.sin(gocA + gocB);
    //truong hop P ở bên trái B so với A
    let x1A = pA.x + AP * Math.cos(gocDinhHuongVector(vectorAB) - gocA);
    let y1A = pA.y + AP * Math.sin(gocDinhHuongVector(vectorAB) - gocA);
    let x1B = pB.x + BP * Math.cos(gocDinhHuongVector(vectorAB) + Math.PI + gocB);
    let y1B = pB.y + BP * Math.sin(gocDinhHuongVector(vectorAB) + Math.PI + gocB);
    let p1 = {
        x: (x1A + x1B) / 2,
        y: (y1A + y1B) / 2
    };
    //truong hop P ở bên phải B so với A
    let x2A = pA.x + AP * Math.cos(gocDinhHuongVector(vectorAB) + gocA);
    let y2A = pA.y + AP * Math.sin(gocDinhHuongVector(vectorAB) + gocA);
    let x2B = pB.x + BP * Math.cos(gocDinhHuongVector(vectorAB) + Math.PI - gocB);
    let y2B = pB.y + BP * Math.sin(gocDinhHuongVector(vectorAB) + Math.PI - gocB);
    let p2 = {
        x: (x2A + x2B) / 2,
        y: (y2A + y2B) / 2
    };
    return [p1, p2];
}
function giaoHoiNghich(A, B, C, P1, P2) {
    let pA = convertToPoint(A);
    let pB = convertToPoint(B);
    let pC = convertToPoint(C);
    let vectorBA = {
        x: pA.x - pB.x,
        y: pA.y - pB.y
    };
    let vectorBC = {
        x: pC.x - pB.x,
        y: pC.y - pB.y
    };
    let gocB = Math.abs(gocDinhHuongVector(vectorBC) - gocDinhHuongVector(vectorBA));
    if (gocB > Math.PI) {
        gocB = 2 * Math.PI - gocB;
    }
    if (gocB === 0) {
        return false;
    }
    let tongGocAvaC = 2 * Math.PI - gocB - P1 - P2;
    if (tongGocAvaC <= 0) {
        return false;
    }
    let AB = Math.sqrt(vectorBA.x * vectorBA.x + vectorBA.y * vectorBA.y);
    let BC = Math.sqrt(vectorBC.x * vectorBC.x + vectorBC.y * vectorBC.y);
    let tanU = AB * Math.sin(P2) / (BC * Math.sin(P1));
    let hieuAvaC = 2 * Math.atan(Math.tan(tongGocAvaC / 2) * (1 - tanU) / (tanU + 1));
    let gocA = (tongGocAvaC + hieuAvaC) / 2;
    let gocC = (tongGocAvaC - hieuAvaC) / 2;
    let gocB1 = Math.PI - P1 - gocA;
    let gocB2 = Math.PI - P2 - gocC;
    let hieu = gocDinhHuongVector(vectorBC) - gocDinhHuongVector(vectorBA);
    if (hieu < -Math.PI||(0 < hieu && hieu < Math.PI)){
        let p1 = giaoHoiThuanTheoGoc(A, B, gocA, gocB1)[0];
        let p2 = giaoHoiThuanTheoGoc(B, C, gocB2, gocC)[0];
        let p = {
            x: (p1.x + p2.x) / 2,
            y: (p1.y + p2.y) / 2
        };
        return [p];
    }
    if (hieu > Math.PI || (0 > hieu && hieu > -Math.PI)) {
        let p1 = giaoHoiThuanTheoGoc(A, B, gocA, gocB1)[1];
        let p2 = giaoHoiThuanTheoGoc(B, C, gocB2, gocC)[1];
        let p = {
            x: (p1.x + p2.x) / 2,
            y: (p1.y + p2.y) / 2
        };
        return [p];
    }
}