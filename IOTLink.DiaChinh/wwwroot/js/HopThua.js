var HopThua={
    GLOBAL: {
        checkHopThua:false,
    },
    CONSTS: {},
    SELECTORS: {
        btnHopThua:".btn-hop-thua",
    },
    init: function () {
        HopThua.setEvent();
    },
    setEvent: function () {
        let eventClickPolygon = map.data.addListener("click", (args) => {
            //let checkHopThua = (typeof HopThua !== "undefined" && typeof HopThua.GLOBAL !== "undefined" && typeof HopThua.GLOBAL.checkHopThua !== "undefined") ? HopThua.GLOBAL.checkHopThua : false;
            if (HopThua.GLOBAL.checkHopThua) {

                //ViewMap.showHideMenuClick(false, null);
                //ViewMap.showHideMenu(false, null);
                //setTimeout(function () {
                //    let obj = args.feature;
                //    ViewMap.setSelectThuaDat(obj);
                //}, 1);
                //setTimeout(function () {
                //    ViewMap.getInforThuaDat(args.location.lat, args.location.lng);
                //}, 1);
                HopThua.getInforThuaDat(args.location.lat, args.location.lng);
            }
        });

        $(HopThua.SELECTORS.btnHopThua).on("click", function () {
            HopThua.GLOBAL.checkHopThua = !HopThua.GLOBAL.checkHopThua;
            if (HopThua.GLOBAL.checkHopThua) {
                $(this).addClass("active");
            }
            else {
                $(this).removeClass("active");
            }
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
                //if (data.code == "ok" && data.result != null && data.result.features.length > 0) {
                //    let propertie = data.result.features[0].properties;
                //    $(ViewMap.SELECTORS.MaXa).text(propertie.MaXa);
                //    $(ViewMap.SELECTORS.TenChu).text(propertie.TenChu);
                //    $(ViewMap.SELECTORS.DiaChi).text(propertie.DiaChi);
                //    $(ViewMap.SELECTORS.SoThuaBD).text(propertie.SoThuTuThua);
                //    $(ViewMap.SELECTORS.SoToBD).text(propertie.SoHieuToBanDo);
                //    $(ViewMap.SELECTORS.SoThuaOld).text((propertie.SoThuTuThuaCu != null) ? propertie.SoThuTuThuaCu : 0);
                //    $(ViewMap.SELECTORS.SoToOld).text((propertie.SoHieuToBanDoCu != null) ? propertie.SoHieuToBanDoCu : 0);
                //    $(ViewMap.SELECTORS.DientichBD).text(propertie.DienTich);
                //    $(ViewMap.SELECTORS.DientichPL).text(propertie.DienTichPhapLy);
                //    $(ViewMap.SELECTORS.KHDTC).text(propertie.KyHieuDoiTuong);
                //    $(ViewMap.SELECTORS.MucDichSuDung).text(propertie.KyHieuMucDichSuDung);
                //    $(ViewMap.SELECTORS.NameMucDichSuDung).text(propertie.TenMucDichSuDung);
                //    ViewMap.showHideViewProperty(true);
                //}
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(messageErorr);
                ViewMap.showLoading(false);
            }
        });
    },
    //select color thua dat select
    setSelectThuaDat: function (data) {
        ViewMap.removeSelectThuaDat();
        if (ViewMap.GLOBAL.ThuaDatSelect == null) {
            geometry = data.geometry;
            let Coordinates = ViewMap.getCoordinatesSearch(geometry);
            let ListPolyline = [];
            for (var i = 0; i < Coordinates.length; i++) {
                polyline = new map4d.Polyline({
                    path: Coordinates[i],
                    strokeColor: "#00ffff",
                    strokeOpacity: 1.0,
                    strokeWidth: 2,
                });
                polyline["ObjectId"] = data.properties.ObjectId;
                polyline.setMap(map);
                ListPolyline.push(polyline);
            }
            ViewMap.GLOBAL.ThuaDatSelect = ListPolyline;
        }
    },
    checkHopThua: function (data) {
        if (ViewMap.GLOBAL.commonData !== null && ViewMap.GLOBAL.commonData.features !== "undefined" && ViewMap.GLOBAL.commonData.features.length > 0) {
            let geometry = data.geometry;
            let pathHop= HopThua.getCoordinatesSearch(geometry);
        }
    },
    setSelectThuaDat: function (data) {
        if (ViewMap.GLOBAL.ThuaDatSelect == null) {
            geometry = data.geometry;
            let Coordinates = ViewMap.getCoordinatesSearch(geometry);
            //let ListPolyline = [];
            //for (var i = 0; i < Coordinates.length; i++) {
            //    polyline = new map4d.Polyline({
            //        path: Coordinates[i],
            //        strokeColor: "#00ffff",
            //        strokeOpacity: 1.0,
            //        strokeWidth: 2,
            //    });
            //    polyline["ObjectId"] = data.properties.ObjectId;
            //    polyline.setMap(map);
            //    ListPolyline.push(polyline);
            //}
            //ViewMap.GLOBAL.ThuaDatSelect = ListPolyline;
        }
    },
    getCoordinatesSearch: function (geometry) {
        let data = [];
        let lenght = geometry.coordinates[0].length;
        for (var i = 0; i < lenght; i++) {
            let datatemp = geometry.coordinates[0][i];
            data.push(datatemp);
        }
        return data;
    },

}