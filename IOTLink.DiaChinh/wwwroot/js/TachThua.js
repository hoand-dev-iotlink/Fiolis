var TachThua = {
    GLOBAL: {
        ThuaDat: null,
        polygon: null,
        path: null,
    },
    CONSTS: {},
    SELECTORS: {
        modalTachThua: ".modal-tach-thua",
        btnTachThua: ".btn-tach-thua",
    },
    init: function () {
        maptachthua = new map4d.Map(document.getElementById("madTachThua"), {
            zoom: 15,
            //center: { lat: 16.074340234841884, lng: 108.2358471048052 },
            center: { lat: 10.678087311284315, lng: 105.08063708265138 },
            geolocate: true,
            minZoom: 3,
            maxZoom: 22,
            tilt: 0,
            controls: true,
            controlOptions: map4d.ControlOptions.BOTTOM_RIGHT,
            accessKey: "208e1c99aa440d8bc2847aafa3bc0669",
        });
        maptachthua.setTileUrl("http://61.28.233.229:8080/all/2d/{z}/{x}/{y}.png");
        maptachthua.setTileUrl("http://61.28.233.229:8080/all/2d/{z}/{x}/{y}.png", true);
        maptachthua.setPlacesEnabled(false);
        //$(TachThua.SELECTORS.modalTachThua).modal({ backdrop: 'static', keyboard: false });
        TachThua.setEvent();
    },
    setEvent: function () {
        $('.menu-tach-thua ul li a').click(function () {
            $('li a').removeClass("active");
            $(this).addClass("active");
        });
        $(TachThua.SELECTORS.btnTachThua).on("click", function () {
            let objectId = ViewMap.GLOBAL.ThuaDatSelect[0].ObjectId;
            setTimeout(function () {
                TachThua.showTachThua(ViewMap.CONSTS.codeDefault, objectId);
                setTimeout(function () {
                    TachThua.fitBoundsThuaDat(TachThua.GLOBAL.path);
                    var camera = maptachthua.getCamera();
                    let zoom = camera.getZoom();
                    camera.setZoom(zoom - 1);
                    maptachthua.setCamera(camera);
                }, 1000);
            }, 1);
            $(TachThua.SELECTORS.modalTachThua).modal('show');
        });
        //$(document.getElementById("inp_CachAB")).inputmask('9{1,5}.9{1,5}');
        //$(document.getElementById("inp_CachCD")).inputmask('9{1,5}.9{1,5}');
    },
    showTachThua: function (code,objectId) {
        $.ajax({
            type: "GET",
            url: ViewMap.GLOBAL.url + "/v2/api/land/find-info",
            data: {
                code: code,
                objectId: objectId,
                key: ViewMap.CONSTS.key
            },
            async: true,
            success: function (data) {
                if (data.result !== null && typeof data.result !== "undefined") {
                    if (data.result.features.length > 0) {
                        ThuaDat = data.result;
                        let path = TachThua.drawPolygon(ThuaDat);
                        
                        //map.data.clear();
                        //ViewMap.drawThuaDat(data.result);
                    } else {
                        bootbox.alert("Phường/Xã này chưa có dữ liệu");
                    }
                } else {
                    bootbox.alert("Lỗi hệ thông");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(messageErorr);
                ViewMap.showLoading(false);
            }
        });
    },
    drawPolygon: function (data) {
        let feature = data.features[0];
        let paths = TachThua.convertCoordinate(data.features[0]);
        if (TachThua.GLOBAL.polygon !==null) {
            TachThua.GLOBAL.polygon.setMap(null);
        }
        TachThua.GLOBAL.polygon = new map4d.Polygon({
            paths: paths,
            fillColor: "#0000ff",
            fillOpacity: 0,
            strokeColor: "#ea5252",
            strokeOpacity: 1.0,
            strokeWidth: 1
        });
        TachThua.GLOBAL.polygon.setMap(maptachthua);
        TachThua.GLOBAL.path = paths;
        //TachThua.fitBoundsThuaDat(paths);
        //return paths;
        //maptachthua.fitBounds(paths[0]);
        //var camera = maptachthua.getCamera();
        //let zoom = camera.getZoom();
        //camera.setZoom(zoom - 1);
        //maptachthua.setCamera(camera);
    },
    convertCoordinate: function (data) {
        if (data.geometry.type.toLocaleLowerCase() === "multipolygon") {
            let count = data.geometry.coordinates[0].length;
            let path = [];
            for (var i = 0; i < count; i++) {
                let datatemp = data.geometry.coordinates[0][i];
                path.push(datatemp);
            }
            return path;
        }
    },
    fitBoundsThuaDat: function (data) {
        let latLngBounds = new map4d.LatLngBounds();
        let paddingOptions = {
            top: 10,
            bottom: 50,
            left: 50,
            right: 50
        };

        for (var i = 0; i < data[0].length; i++) {
            latLngBounds.extend(data[0][i]);
        }
        maptachthua.fitBounds(latLngBounds);
    },
}