var buttonTachThua = {
    global: {
        list2000: [],
        list84: [],
        validate: {
            valid: true,
            error: ""
        },
        listMarker: [],
    },
    selector: {
        xemThu: "#btn_Preview",
        chonDiem: ".form-giao-hoi .chon-diem",
        error: ".error",
        ghiNhan: "#btn_Submit",
        notification: ".notification",
        listGhiNhan:".table-point tbody"
    },
    reset: function () {
        $(buttonTachThua.selector.error).remove();
        $(buttonTachThua.selector.notification).remove();
        removeMarkers();
        buttonTachThua.global.list84 = [];
        buttonTachThua.global.list2000 = [];
        buttonTachThua.global.validate = {
            valid: true,
            error: ""
        };
        $(buttonTachThua.selector.chonDiem).children().remove();
    }
};
$(function () {
    $(".menu-tach-thua>ul").click(function () {
        buttonTachThua.reset();
    })
    $(buttonTachThua.selector.xemThu).click(function (e) {
        buttonTachThua.reset();
        let phuongThuc = $(TachThua.SELECTORS.checkGiaoHoi).val();
        let giaos;
        if (phuongThuc === "giaohoicachduongthang") {
            let idDiemA = parseInt($(TachThua.SELECTORS.selectDinhA).val());
            let diemA = TachThua.GLOBAL.listDiem.find(function (item) {
                return item.id === idDiemA;
            });
            let idDiemB = parseInt($(TachThua.SELECTORS.selectDinhB).val());
            let diemB = TachThua.GLOBAL.listDiem.find(function (item) {
                return item.id === idDiemB;
            });
            let idDiemC = parseInt($(TachThua.SELECTORS.selectDinhC).val());
            let diemC = TachThua.GLOBAL.listDiem.find(function (item) {
                return item.id === idDiemC;
            });
            let idDiemD = parseInt($(TachThua.SELECTORS.selectDinhD).val());
            let diemD = TachThua.GLOBAL.listDiem.find(function (item) {
                return item.id === idDiemD;
            });
            let cachAB = parseFloat($(TachThua.SELECTORS.inputCachAB).val().replace("_", "0"));
            let cachCD = parseFloat($(TachThua.SELECTORS.inputCachCD).val().replace("_", "0"));
            if (!diemA || !diemB || !diemC || !diemD || !cachAB || !cachCD) {
                buttonTachThua.global.validate.valid = false;
                buttonTachThua.global.validate.error = "Dữ liệu đầu vào chưa đủ";
            }
            if (buttonTachThua.global.validate.valid) {
                giaos = giaoHoiCachDuongThang(diemA.xy, diemB.xy, diemC.xy, diemD.xy, cachAB, cachCD);
            }
        }
        if (phuongThuc === "giaohoithuan") {
            let type = $(TachThua.SELECTORS.radioGiaoHoiThuanCheck).val();
            let idDiemA = parseInt($(TachThua.SELECTORS.selectDinhA).val());
            let diemA = TachThua.GLOBAL.listDiem.find(function (item) {
                return item.id === idDiemA;
            });
            let idDiemB = parseInt($(TachThua.SELECTORS.selectDinhB).val());
            let diemB = TachThua.GLOBAL.listDiem.find(function (item) {
                return item.id === idDiemB;
            });
            if (type === "edge") {
                let canhAC = parseFloat($(TachThua.SELECTORS.inputCachAC).val().replace("_", "0"));
                let canhBC = parseFloat($(TachThua.SELECTORS.inputCachBC).val().replace("_", "0"));
                if (!diemA || !diemB || !canhAC || !canhBC) {
                    buttonTachThua.global.validate.valid = false;
                    buttonTachThua.global.validate.error = "Dữ liệu đầu vào chưa đủ";
                }
                if (buttonTachThua.global.validate.valid) {
                    giaos = giaoHoiThuanTheoCanh(diemA.xy, canhAC, diemB.xy, canhBC);
                }
            }
            if (type === "angle") {
                let gocA = getGocRadian($(TachThua.SELECTORS.inputGocCAB).val());
                let gocB = getGocRadian($(TachThua.SELECTORS.inputGocCBA).val());
                if (!diemA || !diemB || !gocA || !gocB) {
                    validate.valid = false;
                    validate.error = "Dữ liệu đầu vào chưa đủ";
                }
                if (gocA && gocB && (gocA + gocB >= Math.PI)) {
                    buttonTachThua.global.validate.valid = false;
                    buttonTachThua.global.validate.error = "Tổng hai góc nhập vào phải nhỏ hơn 180º";
                }
                if (buttonTachThua.global.validate.valid) {
                    giaos = giaoHoiThuanTheoGoc(diemA.xy, diemB.xy, gocA, gocB);
                }
            }
        }
        if (phuongThuc === "giaohoinghich") {
            let idDiemA = parseInt($(TachThua.SELECTORS.selectDinhA).val());
            let diemA = TachThua.GLOBAL.listDiem.find(function (item) {
                return item.id === idDiemA;
            });
            let idDiemB = parseInt($(TachThua.SELECTORS.selectDinhB).val());
            let diemB = TachThua.GLOBAL.listDiem.find(function (item) {
                return item.id === idDiemB;
            });
            let idDiemC = parseInt($(TachThua.SELECTORS.selectDinhC).val());
            let diemC = TachThua.GLOBAL.listDiem.find(function (item) {
                return item.id === idDiemC;
            });
            let gocAPB = getGocRadian($(TachThua.SELECTORS.inputGocAPB).val());
            let gocAPC = getGocRadian($(TachThua.SELECTORS.inputGocAPC).val());
            if (!diemA || !diemB || !diemC || !gocAPB || !gocAPC) {
                buttonTachThua.global.validate.valid = false;
                buttonTachThua.global.validate.error = "Dữ liệu đầu vào chưa đủ";
            }
            if (gocAPB && gocAPC && (gocAPB >= Math.PI || gocAPC >= Math.PI)) {
                buttonTachThua.global.validate.valid = false;
                buttonTachThua.global.validate.error = "Góc nhập vào phải nhỏ hơn 180º";
            }
            if (buttonTachThua.global.validate.valid) {
                giaos = giaoHoiNghich(diemA.xy, diemB.xy, diemC.xy, gocAPB, gocAPC);
            }
        }
        if (phuongThuc === "giaohoihuong") {
            let idDiemA = parseInt($(TachThua.SELECTORS.selectDinhA).val());
            let diemA = TachThua.GLOBAL.listDiem.find(function (item) {
                return item.id === idDiemA;
            });
            let idDiemB = parseInt($(TachThua.SELECTORS.selectDinhB).val());
            let diemB = TachThua.GLOBAL.listDiem.find(function (item) {
                return item.id === idDiemB;
            });
            let idDiemC = parseInt($(TachThua.SELECTORS.selectDinhC).val());
            let diemC = TachThua.GLOBAL.listDiem.find(function (item) {
                return item.id === idDiemC;
            });
            let idDiemD = parseInt($(TachThua.SELECTORS.selectDinhD).val());
            let diemD = TachThua.GLOBAL.listDiem.find(function (item) {
                return item.id === idDiemD;
            });
            if (!diemA || !diemB || !diemC || !diemD) {
                buttonTachThua.global.validate.valid = false;
                buttonTachThua.global.validate.error = "Dữ liệu đầu vào chưa đủ";
            }
            if (buttonTachThua.global.validate.valid) {
                giaos = giaoHoiHuong(diemA.xy, diemB.xy, diemC.xy, diemD.xy);
            }
        }
        if (phuongThuc === "giaohoidoctheocanh") {
            let idDiemA = parseInt($(TachThua.SELECTORS.selectDinhA).val());
            let diemA = TachThua.GLOBAL.listDiem.find(function (item) {
                return item.id === idDiemA;
            });
            let idDiemB = parseInt($(TachThua.SELECTORS.selectDinhB).val());
            let diemB = TachThua.GLOBAL.listDiem.find(function (item) {
                return item.id === idDiemB;
            });
            let cach = parseFloat($(TachThua.SELECTORS.inputKhoangCach).val().replace("_", "0"));
            if (!diemA || !diemB || !cach) {
                buttonTachThua.global.validate.valid = false;
                buttonTachThua.global.validate.error = "Dữ liệu đầu vào chưa đủ";
            }
            let fromB = $(TachThua.SELECTORS.radioTuDiemCheck).val() === "B";
            if (buttonTachThua.global.validate.valid) {
                giaos = giaoHoiDocTheoCanh(diemA.xy, diemB.xy, cach, fromB);
            }
        }
        if (buttonTachThua.global.validate.valid && !giaos) {
            buttonTachThua.global.validate.valid = false;
            buttonTachThua.global.validate.error = "Không tìm thấy điểm nào thỏa mãn, hãy kiểm tra lại dữ liệu";
        }
        if (!buttonTachThua.global.validate.valid) {
            $(TachThua.SELECTORS.formGiaoHoi).append(`
                <div class="col-xs-12 error">
                    <p class="text-danger">${buttonTachThua.global.validate.error}</p>
                </div>
            `);
        }
        if (giaos) {
            convertVN2000ToWGS84(giaos, function (data) {
                if (data.code === "ok") {
                    if (data.result.features[0].properties.info === "vn2000") {
                        buttonTachThua.global.list2000 = data.result.features[0].geometry.coordinates;
                        buttonTachThua.global.list84 = data.result.features[1].geometry.coordinates;
                    }
                    else {
                        buttonTachThua.global.list2000 = data.result.features[1].geometry.coordinates;
                        buttonTachThua.global.list84 = data.result.features[0].geometry.coordinates;
                    }
                    for (let i = 0; i < buttonTachThua.global.list84.length; i++) {
                        let marker = new map4d.Marker({
                            position: buttonTachThua.global.list84[i],
                            anchor: [0.5, 0.5],
                            visible: true,
                            labelAnchor: [0.5, -1],
                            label: new map4d.MarkerLabel({ text: "Điểm " + (i + 1), color: "ff0000", fontSize: 13 }),
                            icon: new map4d.Icon(10, 10, "/images/iconPoint.png"),
                        });
                        //thêm marker vào map
                        marker.setMap(TachThua.GLOBAL.maptachthua);
                        buttonTachThua.global.listMarker.push(marker);
                    };
                    if (giaos.length === 1) {
                        $(TachThua.SELECTORS.formGiaoHoi).append(`
                            <div class="col-xs-12 notification">
                                <p class="text-primary">Tìm thấy 1 điểm duy nhất</p>
                            </div>
                        `);
                    }
                    else {
                        $(TachThua.SELECTORS.formGiaoHoi).append(`
                            <div class="col-xs-12 notification">
                                <p class="text-primary">Tìm thấy ${giaos.length} điểm thỏa mãn, vui lòng chọn điểm</p>
                            </div>
                        `);
                        let html = "";
                        for (let i = 0; i < buttonTachThua.global.list84.length; i++) {
                            html += `
                                <div class="radio">
                                    <label>
                                        <input name="rad_diem" type="radio" class="ace" value="${i}">
                                        <span class="lbl"> Điểm ${i+1}</span>
                                    </label>
                                </div>
                            `
                        }
                        $(buttonTachThua.selector.chonDiem).html(html);
                    }
                }
            });
        }
    });
    $(buttonTachThua.selector.ghiNhan).click(function () {
        if (buttonTachThua.global.list84.length === 0) {
            $(buttonTachThua.selector.error).remove();
            $(TachThua.SELECTORS.formGiaoHoi).append(`
                 <div class="col-xs-12 error">
                     <p class="text-danger">Không có điểm nào để ghi nhận!</p>
                 </div>
             `);
        }  
        if (buttonTachThua.global.list84.length === 1) {
            let phuongThuc = $(TachThua.SELECTORS.checkGiaoHoi).val();
            let a = {
                phuongThuc: phuongThuc,
                diem84: buttonTachThua.global.list84[0],
                diem2000: buttonTachThua.global.list2000[0]
            }
            TachThua.GLOBAL.listKetQuaGhiNhan.push(a);
            buttonTachThua.reset();
            updateListGhiNhan();
        }
        if (buttonTachThua.global.list84.length > 1) {
            let phuongThuc = $(TachThua.SELECTORS.checkGiaoHoi).val();
            let i = $(TachThua.SELECTORS.radioDiemCheck).val()
            if (i != undefined) {
                let a = {
                    phuongThuc: phuongThuc,
                    diem84: buttonTachThua.global.list84[i],
                    diem2000: buttonTachThua.global.list2000[i]
                }
                TachThua.GLOBAL.listKetQuaGhiNhan.push(a);
                buttonTachThua.reset();
                updateListGhiNhan()
            }
            else {
                $(buttonTachThua.selector.error).remove();
                $(TachThua.SELECTORS.formGiaoHoi).append(`
                    <div class="col-xs-12 error">
                        <p class="text-danger">Hãy chọn điểm trước khi ghi nhận!</p>
                    </div>
                `);
            }
        }   
    });
});
function updateListGhiNhan() {
    $(buttonTachThua.selector.listGhiNhan).children().remove();
    let html = "";
    for (let i = 0; i < TachThua.GLOBAL.listKetQuaGhiNhan.length; i++) {
        let phuongThuc = "";
        switch (TachThua.GLOBAL.listKetQuaGhiNhan[i].phuongThuc) {
            case "giaohoicachduongthang":
                phuongThuc ="Giao hội cách đường thẳng"
                break
            case "giaohoithuan":
                phuongThuc = "Giao hội thuận"
                break
            case "giaohoinghich":
                phuongThuc = "Giao hội nghịch"
                break
            case "giaohoihuong":
                phuongThuc ="Giao hội hướng"
                break
            case "giaohoidoctheocanh":
                phuongThuc = "Giao hội dọc theo cạnh"
                break
            default:
        }
        html += `
            <tr>
                <th scope="row">${i + 1}</th>
                <td>${phuongThuc}</td>
            </tr>
        `;
    }
    $(buttonTachThua.selector.listGhiNhan).html(html);
}
function getGocRadian(val) {
    if (val === "") {
        return null
    }
    deg = parseInt(val.substring(0, val.indexOf('º')).replace("_", "0"));
    min = parseInt(val.substring(val.indexOf('º') + 1, val.indexOf("'")).replace("_", "0"));
    sec = parseFloat(val.substring(val.indexOf("'") + 1, val.indexOf("\"")).replace("_", "0"));
    degval = deg + min / 60 + sec / 3600;
    return degval * Math.PI / 180;
}
function convertVN2000ToWGS84(listPoint, callback) {
    $.ajax({
        url: ViewMap.GLOBAL.url + "/v2/api/land/vn2000-wgs84" + "?key=" + ViewMap.CONSTS.key,
        type: "POST",
        async: true,
        contentType: "application/json",
        data: JSON.stringify({
            code: TachThua.GLOBAL.codeMaXaThuaDat,
            geometry: {
                type: "MultiPoint",
                coordinates: convertListPointTo2000(listPoint)
            }
        }),
        success: function (data) {
            callback(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
            console.log(messageErorr);
            ViewMap.showLoading(false);
        }
    });
}
function removeMarkers() {
    for (let i = 0; i < buttonTachThua.global.listMarker.length; i++) {
        buttonTachThua.global.listMarker[i].setMap(null);
    }
    buttonTachThua.global.listMarker = [];
}