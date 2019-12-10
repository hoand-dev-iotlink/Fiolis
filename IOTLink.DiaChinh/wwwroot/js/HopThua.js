var HopThua = {
    GLOBAL: {
        checkHopThua: false,
        listHopThua: [],
        listPolylineHopThua: [],
    },
    CONSTS: {},
    SELECTORS: {
        btnHopThua: ".btn-hop-thua",
        btnSaveHopThua: ".btn-save-hop-thua",
        btnHuyHopThua: ".btn-huy-hop-thua",
        formInforHopThua: ".form-infor-hop-thua",
        KHList: '.form-infor-hop-thua #KH-listselectid',
        SoToUpdate: ".form-infor-hop-thua #text-update-soTo",
        SoThuaUpdate: ".form-infor-hop-thua #text-update-soThua",
        SoToUpdateOld: ".form-infor-hop-thua #text-update-soTo-old",
        SoThuaUpdateOld: ".form-infor-hop-thua #text-update-soThua-old",
        DienTichUpdate: ".form-infor-hop-thua #text-update-dienTich",
        DienTichPhapLyUpdate: ".form-infor-hop-thua #text-update-dienTichPhapLy",
        TenChuUpdate: ".form-infor-hop-thua #text-update-chuNha",
        DiaChiUpdate: ".form-infor-hop-thua #text-update-diaChi",
        btnUpdateThuaDat: ".form-infor-hop-thua .btn-infor-hop-thua",
    },
    init: function () {
        HopThua.setEvent();
    },
    setEvent: function () {
        let eventClickPolygon = map.data.addListener("click", (args) => {
            //let checkHopThua = (typeof HopThua !== "undefined" && typeof HopThua.GLOBAL !== "undefined" && typeof HopThua.GLOBAL.checkHopThua !== "undefined") ? HopThua.GLOBAL.checkHopThua : false;
            if (HopThua.GLOBAL.checkHopThua) {
                HopThua.getInforThuaDat(args.location.lat, args.location.lng);
            } else {
                HopThua.GLOBAL.listHopThua = [];
            }
        });

        $(HopThua.SELECTORS.btnHopThua).on("click", function () {
            HopThua.GLOBAL.checkHopThua = !HopThua.GLOBAL.checkHopThua;
            if (HopThua.GLOBAL.checkHopThua) {
                $(this).attr("disabled", "disabled");
                $(HopThua.SELECTORS.btnSaveHopThua).removeAttr("disabled");
                $(HopThua.SELECTORS.btnHuyHopThua).removeAttr("disabled");
            }
        });
        $(HopThua.SELECTORS.btnHuyHopThua).on("click", function () {
            HopThua.GLOBAL.checkHopThua = false;
            if (!HopThua.GLOBAL.checkHopThua) {
                $(HopThua.SELECTORS.btnHopThua).removeAttr("disabled");
                $(HopThua.SELECTORS.btnSaveHopThua).attr("disabled", "disabled");
                $(HopThua.SELECTORS.btnHuyHopThua).attr("disabled", "disabled");
                HopThua.clearPolylineHopThua();
            }
        });
        $(HopThua.SELECTORS.btnSaveHopThua).on("click", function () {
            $(HopThua.SELECTORS.formInforHopThua).modal("show");
        });
        $(HopThua.SELECTORS.btnUpdateThuaDat).on("click", function () {
            if (HopThua.checkFormInfor()) {
                //list polygon from
                let maxa = "";
                let listPolygonHopThua = [];
                for (var i = 0; i < HopThua.GLOBAL.listHopThua.length; i++) {
                    let object = HopThua.GLOBAL.listHopThua[i].features[0].properties.info === "vn2000" ? HopThua.GLOBAL.listHopThua[i].features[0] : HopThua.GLOBAL.listHopThua[i].features[1];
                    maxa = object.properties.MaXa;
                    let check = {
                        id: object.properties.Id,
                        objectId: object.properties.ObjectId,
                        uuid: object.properties.UUID,
                        thoiDiemBatDau: object.properties.ThoiDiemBatDau,
                        thoiDiemKetThuc: object.properties.ThoiDiemKetThuc,
                        maXa: object.properties.MaXa,
                        maDoiTuong: object.properties.MaDoiTuong,
                        soHieuToBanDo: object.properties.SoHieuToBanDo,
                        soThuTuThua: object.properties.SoThuTuThua,
                        soHieuToBanDoCu: object.properties.SoHieuToBanDoCu,
                        soThuTuThuaCu: object.properties.SoThuTuThuaCu,
                        dienTich: object.properties.DienTich,
                        dienTichPhapLy: object.properties.DienTichPhapLy,
                        kyHieuMucDichSuDung: object.properties.KyHieuMucDichSuDung,
                        kyHieuDoiTuong: "",
                        tenChu: object.properties.TenChu,
                        diaChi: object.properties.DiaChi,
                        daCapGCN: 0,
                        tenChu2: object.properties.TenChu2,
                        namSinhC1: object.properties.NamSinhC1,
                        soHieuGCN: object.properties.SoHieuGCN,
                        soVaoSo: object.properties.SoVaoSo,
                        ngayVaoSo: object.properties.NgayVaoSo,
                        soBienNhan: 0,
                        nguoiNhanHS: object.properties.NguoiNhanHS,
                        coQuanThuLy: object.properties.CoQuanThuLy,
                        loaiHS: object.properties.LoaiHS,
                        maLienKet: object.properties.MaLienKet,
                        shapeSTArea: 0,
                        shapeSTLength: 0,
                        shapeLength: object.properties.ShapeArea,
                        shapeArea: object.properties.ShapeLength,
                        geometry: object.geometry,
                        tags: {}
                    };
                    listPolygonHopThua.push(check);
                }
                //polygo to
                let polygonHopThua = HopThua.getPolygonHopThua();
                polygonHopThua.push(polygonHopThua[0]);
                let geometryHopThua = {
                    coordinates: [],
                    type: "Polygon"
                };
                geometryHopThua.coordinates.push(polygonHopThua);
                let HopThuaTo = {
                    objectId: 0,
                    uuid: "",
                    thoiDiemBatDau: null,
                    thoiDiemKetThuc: null,
                    maXa: maxa,
                    maDoiTuong: "",
                    soHieuToBanDo: Number($(HopThua.SELECTORS.SoToUpdate).val()),
                    soThuTuThua: Number($(HopThua.SELECTORS.SoThuaUpdate).val()),
                    soHieuToBanDoCu: $(HopThua.SELECTORS.SoToUpdateOld).val(),
                    soThuTuThuaCu: $(HopThua.SELECTORS.SoThuaUpdateOld).val(),
                    dienTich: Number($(HopThua.SELECTORS.DienTichUpdate).val()),
                    dienTichPhapLy: Number($(HopThua.SELECTORS.DienTichPhapLyUpdate).val()),
                    kyHieuMucDichSuDung: $(HopThua.SELECTORS.KHList).val(),
                    kyHieuDoiTuong: "",
                    tenChu: $(HopThua.SELECTORS.TenChuUpdate).val(),
                    diaChi: $(HopThua.SELECTORS.DiaChiUpdate).val(),
                    daCapGCN: 0,
                    tenChu2: "",
                    namSinhC1: "",
                    soHieuGCN: "",
                    soVaoSo: "",
                    ngayVaoSo: "",
                    soBienNhan: 0,
                    nguoiNhanHS: "",
                    coQuanThuLy: "",
                    loaiHS: "",
                    maLienKet: "",
                    shapeSTArea: 0,
                    shapeSTLength: 0,
                    shapeLength: 0,
                    shapeArea: 0,
                    geometry: geometryHopThua,
                    tags: {}
                };

                let formHopThua = {
                    from: listPolygonHopThua,
                    to: HopThuaTo
                };
                //console.log(JSON.stringify(formHopThua));
                HopThua.updateHopThua(formHopThua);
            }
        });
        $(HopThua.SELECTORS.formInforHopThua).on('hide.bs.modal', function () {
            $(HopThua.SELECTORS.SoToUpdate).val(0);
            $(HopThua.SELECTORS.SoThuaUpdate).val(0);
            $(HopThua.SELECTORS.SoToUpdateOld).val(0);
            $(HopThua.SELECTORS.SoThuaUpdateOld).val(0);
            $(HopThua.SELECTORS.DienTichUpdate).val(0);
            $(HopThua.SELECTORS.DienTichPhapLyUpdate).val(0);
            $(HopThua.SELECTORS.TenChuUpdate).val("");
            $(HopThua.SELECTORS.DiaChiUpdate).val("");
        });
    },
    getInforThuaDat: function (lat, lng) {
        $.ajax({
            type: "GET",
            url: ViewMap.GLOBAL.url + "/v2/api/land/latlng",
            data: {
                lat: lat,
                lng: lng,
                key: ViewMap.CONSTS.key
            },
            success: function (data) {
                console.log(data);
                if (data.code === "ok" && data.result !== null && data.result.features.length > 0) {
                    let check = HopThua.checkHopThua(data.result);
                    if (check) {
                        HopThua.GLOBAL.listHopThua.push(data.result);
                        let geometry = data.result.features[0].properties.info === "wgs84" ? data.result.features[0].geometry : data.result.features[1].geometry;
                        HopThua.setSelectThuaDat(geometry);
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(messageErorr);
                ViewMap.showLoading(false);
            }
        });
    },
    checkHopThua: function (data) {
        let checkHopThua = false;
        if (ViewMap.GLOBAL.commonData !== null && ViewMap.GLOBAL.commonData.features !== "undefined" && ViewMap.GLOBAL.commonData.features.length > 0) {
            if (HopThua.GLOBAL.listHopThua.length === 0) {
                HopThua.GLOBAL.listHopThua.push(ViewMap.GLOBAL.commonData);
            }
            let dataVN2000 = data.features[0].properties.info === "vn2000" ? data.features[0] : data.features[1];
            let pathHopThua = HopThua.getCoordinatesSearch(dataVN2000.geometry)[0];
            for (var j = 0; j < HopThua.GLOBAL.listHopThua.length; j++) {
                let dataObj = HopThua.GLOBAL.listHopThua[j];
                let commonDataVN2000 = dataObj.features[0].properties.info === "vn2000" ? dataObj.features[0] : dataObj.features[1];
                let pathCommon = HopThua.getCoordinatesSearch(commonDataVN2000.geometry)[0];
                let listpoint = pathCommon.slice(0);
                listpoint.pop();
                for (var i = 0; i < pathHopThua.length; i++) {
                    let check = pathCommon.filter(x => x[0] === pathHopThua[i][0] && x[1] === pathHopThua[i][1]);
                    if (check.length > 0) {
                        checkHopThua = true;
                        break;
                    }
                }
                if (checkHopThua) {
                    break;
                }
            }
        }
        return checkHopThua;
    },
    getPolygonHopThua: function () {
        let point = [];
        let list = HopThua.GLOBAL.listHopThua;
        for (var i = 0; i < list.length; i++) {
            let data = list[i].features[0].properties.info === "vn2000" ? list[i].features[0] : list[i].features[1];
            let path = HopThua.getCoordinatesSearch(data.geometry)[0];
            let pathPoint = path.slice(0);
            if (pathPoint[0][0] === pathPoint[pathPoint.length - 1][0]) {
                pathPoint.pop();
            }
            if (point.length === 0) {
                point = pathPoint.slice(0);
            } else {
                for (var j = 0; j < pathPoint.length; j++) {
                    let check = point.filter(x => x[0] === pathPoint[j][0] && x[1] === pathPoint[j][1]);
                    if (check.length <= 0) {
                        point.push(pathPoint[j]);
                    }
                }
            }
        }
        console.log(JSON.stringify(point));
        if (point.length > 0) {
            point = HopThua.orderClockWiseVN2000(point);
        }
        console.log(JSON.stringify(point));
        return point;
    },
    setSelectThuaDat: function (data) {
        let Coordinates = HopThua.getCoordinatesSearch(data);
        let ListPolyline = [];
        for (var i = 0; i < Coordinates.length; i++) {
            polyline = new map4d.Polyline({
                path: Coordinates[i],
                strokeColor: "#00ffff",
                strokeOpacity: 1.0,
                strokeWidth: 2,
            });
            polyline.setMap(map);
        }
        HopThua.GLOBAL.listPolylineHopThua.push(polyline);
    },
    getCoordinatesSearch: function (geometry) {
        let data = [];
        if (geometry.type === "Polygon") {
            let lenght = geometry.coordinates.length;
            return geometry.coordinates;
        }
        if (geometry.type === "MultiPolygon") {
            let lenght = geometry.coordinates[0].length;
            for (var i = 0; i < lenght; i++) {
                let datatemp = geometry.coordinates[0][i];
                data.push(datatemp);
            }
            return data;
        }
    },
    orderClockWiseVN2000: function (listPoints) {
        var listTemp = listPoints.slice(0);
        var mX = 0;
        var mY = 0;
        $.each(listTemp, function (i, obj) {
            mX = mX + obj[0];//obj.y;
            mY = mY + obj[1];//obj.x;
        });
        mX = mX / listTemp.length;
        mY = mY / listTemp.length;
        listTemp.sort(function (a, b) {
            let at1 = (Math.atan2(a[1] - mY, a[0] - mX));//(Math.atan2(a.x - mY, a.y - mX));
            let at2 = (Math.atan2(b[1] - mY, b[0] - mX));//(Math.atan2(b.x - mY, b.y - mX));
            return at1 - at2;
        });
        return listTemp;
    },
    orderClockWiseWGS84: function (listPoints) {
        var listTemp = listPoints.slice(0);
        var mX = 0;
        var mY = 0;
        $.each(listTemp, function (i, obj) {
            mX = mX + obj[0];//obj.lng;
            mY = mY + obj[1];//obj.lat;
        });
        mX = mX / listTemp.length;
        mY = mY / listTemp.length;
        listTemp.sort(function (a, b) {
            let at1 = (Math.atan2(a[1] - mY, a[0] - mX));//(Math.atan2(a.lat - mY, a.lng - mX));
            let at2 = (Math.atan2(b[1] - mY, b[0] - mX));//(Math.atan2(b.lat - mY, b.lng - mX));
            return at1 - at2;
        });
        return listTemp;
    },
    clearPolylineHopThua: function () {
        $.each(HopThua.GLOBAL.listPolylineHopThua, function (i, obj) {
            obj.setMap(null);
        });
    },
    updateHopThua: function (data) {
        $.ajax({
            type: "POST",
            url: ViewMap.GLOBAL.url + "/v2/api/land/hop-thua?key=" + ViewMap.CONSTS.key,
            data: JSON.stringify(data),
            dataType: 'json',
            async: false,
            contentType: 'application/json-patch+json',
            success: function (data) {
                if (data.code === "ok") {
                    HopThua.GLOBAL.checkHopThua = !HopThua.GLOBAL.checkHopThua;
                    if (!HopThua.GLOBAL.checkHopThua) {
                        $(HopThua.SELECTORS.btnHopThua).removeAttr("disabled");
                        $(HopThua.SELECTORS.btnSaveHopThua).attr("disabled", "disabled");
                        $(HopThua.SELECTORS.btnHuyHopThua).attr("disabled", "disabled");
                    }
                    swal({
                        title: "Thông báo",
                        text: "Cập nhật thông tin hợp thửa thành công!",
                        icon: "success",
                        button: "Đóng",
                    }).then((value) => {
                        $(HopThua.SELECTORS.formInforHopThua).modal("hide");
                    });
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(messageErorr);
                ViewMap.showLoading(false);
            }
        });
    },
    checkFormInfor: function () {
        let check = true;
        let SoThua = $(HopThua.SELECTORS.SoThuaUpdate).val();
        if (!validateText(SoThua, "number", 0, 0) || SoThua === "0") { insertError($(HopThua.SELECTORS.SoThuaUpdate), "other"); check = false; }
        let SoTo = $(HopThua.SELECTORS.SoToUpdate).val();
        if (!validateText(SoTo, "number", 0, 0) || SoTo === "0") { insertError($(HopThua.SELECTORS.SoToUpdate), "other"); check = false; }
        let DienTichUpdate = $(HopThua.SELECTORS.DienTichUpdate).val();
        if (!validateText(DienTichUpdate, "float", 0, 0) || DienTichUpdate === "0") { insertError($(HopThua.SELECTORS.DienTichUpdate), "other"); check = false; }
        let DienTichPhapLyUpdate = $(HopThua.SELECTORS.DienTichPhapLyUpdate).val();
        if (!validateText(DienTichPhapLyUpdate, "float", 0, 0) || DienTichPhapLyUpdate === "0") { insertError($(HopThua.SELECTORS.DienTichPhapLyUpdate), "other"); check = false; }
        let TenChuUpdate = $(HopThua.SELECTORS.TenChuUpdate).val();
        if (!validateText(TenChuUpdate, "text", 0, 0)) { insertError($(HopThua.SELECTORS.TenChuUpdate), "other"); check = false; }
        return check;
    },
}