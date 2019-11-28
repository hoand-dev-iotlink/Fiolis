var TachThua = {
    GLOBAL: {
        ThuaDat: null,
        polygon: null,
        path: null,
        listMarkerDiem: [],
        listDiem:[],
    },
    CONSTS: {},
    SELECTORS: {
        modalTachThua: ".modal-tach-thua",
        btnTachThua: ".btn-tach-thua",
        formGiaoHoi: ".form-giao-hoi",
        menuCachDuongThang: ".menu-cach-duong-thang",
        menuHoiThuan: ".menu-hoi-thuan",
        menuHoiNghich: ".menu-hoi-nghich",
        menuHoiHuong: ".menu-hoi-huong",
        menuDocTheoCanh: ".menu-doc-theo-canh",
        selectDinhA: "#sel_GHCDTDinhA",
        selectDinhB: "#sel_GHCDTDinhB",
        selectDinhC: "#sel_GHCDTDinhC",
        selectDinhD: "#sel_GHCDTDinhD",
        inputCachAB: "#inp_CachAB",
        inputCachCD: "#inp_CachCD",
        inputCachAC: "#inp_CanhAC",
        inputCachBC: "#inp_CanhBC",
        inputGocCAB: "#inp_GocCAB",
        inputGocCBA: "#inp_GocCBA",
        inputGocAPB: "#inp_GocAPB",
        inputGocAPC: "#inp_GocAPC",
        inputKhoangCach: "#inp_KhoangCach",
        radioGiaoHoiThuan: "input[name='loaiGiaoHoiThuan']",
        radioGiaoHoiThuanCheck: "input[name='loaiGiaoHoiThuan']:checked",
        radioDiem: "input[name='rad_diem']",
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
                    TachThua.setMarkerDiem(TachThua.GLOBAL.ThuaDat);
                }, 1000);
            }, 1);
            $(TachThua.SELECTORS.modalTachThua).modal('show');
        });
        $(TachThua.SELECTORS.modalTachThua).on('hide.bs.modal', function () {
            TachThua.removeMaker();
        });
        $(TachThua.SELECTORS.modalTachThua).on('shown.bs.modal', function () {
            TachThua.showHtmlGiaoHoi(1);
        });
        

        $(TachThua.SELECTORS.menuCachDuongThang).on("click", function () {
            TachThua.showHtmlGiaoHoi(1);
        });
        $(TachThua.SELECTORS.menuHoiThuan).on("click", function () {
            TachThua.showHtmlGiaoHoi(2);
            $(TachThua.SELECTORS.radioGiaoHoiThuan).change(function () {
                let check = $(TachThua.SELECTORS.radioGiaoHoiThuanCheck).val();
                if (check === "angle") {
                    $(TachThua.SELECTORS.inputGocCAB).removeAttr("disabled");
                    $(TachThua.SELECTORS.inputGocCBA).removeAttr("disabled");
                    $(TachThua.SELECTORS.inputCachAC).attr("disabled", "");
                    $(TachThua.SELECTORS.inputCachBC).attr("disabled", "");
                }
                if (check === "edge") {
                    $(TachThua.SELECTORS.inputGocCAB).attr("disabled", "");
                    $(TachThua.SELECTORS.inputGocCBA).attr("disabled", "");
                    $(TachThua.SELECTORS.inputCachAC).removeAttr("disabled");
                    $(TachThua.SELECTORS.inputCachBC).removeAttr("disabled");
                }
            });
        });
        $(TachThua.SELECTORS.menuHoiNghich).on("click", function () {
            TachThua.showHtmlGiaoHoi(3);
        });
        $(TachThua.SELECTORS.menuHoiHuong).on("click", function () {
            TachThua.showHtmlGiaoHoi(4);
        });
        $(TachThua.SELECTORS.menuDocTheoCanh).on("click", function () {
            TachThua.showHtmlGiaoHoi(5);
        });
    },
    showTachThua: function (code, objectId) {
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
                        TachThua.GLOBAL.ThuaDat = data.result;
                        let path = TachThua.drawPolygon(TachThua.GLOBAL.ThuaDat);
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
        if (TachThua.GLOBAL.polygon !== null) {
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
    showHtmlGiaoHoi: function (giaohoi) {
        let html = "";
        $(TachThua.SELECTORS.formGiaoHoi).children().remove();
        switch (giaohoi) {
            case 1:
                // giao hoi cách đường thẳng
                html = `<div class="col-xs-12 col-sm-10">
                            <div class="form-group row">
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc1" class="col-sm-4 control-label no-padding-right">Đỉnh A</label>
                                    <select class="col-sm-8" id="sel_GHCDTDinhA"></select>
                                </div>
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc2" class="col-sm-4 control-label no-padding-right">Đỉnh B</label>
                                    <select class="col-sm-8" id="sel_GHCDTDinhB"></select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc1" class="col-sm-4 control-label no-padding-right">Đỉnh C</label>
                                    <select class="col-sm-8" id="sel_GHCDTDinhC"></select>
                                </div>
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc2" class="col-sm-4 control-label no-padding-right">Đỉnh D</label>
                                    <select class="col-sm-8" id="sel_GHCDTDinhD"></select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="col-xs-12 col-sm-6">
                                    <label for="form-field-9" class="col-sm-4 control-label no-padding-right">Cách AB</label>
                                    <input type="text" class="col-sm-8 input-mask-distance" placeholder="Khoảng cách (m)" id="inp_CachAB">
                                </div>
                                <div class="col-xs-12 col-sm-6">
                                    <label for="form-field-9" class="col-sm-4 control-label no-padding-right">Cách CD</label>
                                    <input type="text" class="col-sm-8 input-mask-distance" placeholder="Khoảng cách (m)" id="inp_CachCD">
                                </div>
                            </div></div>
                            <div class="col-xs-12 col-sm-2">
                                <div class="control-group">
                                    <div class="radio">
                                        <label>
                                            <input name="rad_diem" type="radio" class="ace" value="1">
                                            <span class="lbl"> Điểm 1</span>
                                        </label>
                                    </div>
                                    <div class="radio">
                                        <label>
                                            <input name="rad_diem" type="radio" class="ace" value="2">
                                            <span class="lbl"> Điểm 2</span>
                                        </label>
                                    </div>
                                    <div class="radio">
                                        <label>
                                            <input name="rad_diem" type="radio" class="ace" value="3">
                                            <span class="lbl"> Điểm 3</span>
                                        </label>
                                    </div>
                                    <div class="radio">
                                        <label>
                                            <input name="rad_diem" type="radio" class="ace" value="4">
                                            <span class="lbl"> Điểm 4</span>
                                        </label>
                                    </div>
                                </div>
                            </div>`;
                $(TachThua.SELECTORS.formGiaoHoi).append(html);
                $(TachThua.SELECTORS.inputCachAB).inputmask('9{1,5}.9{1,5}');
                $(TachThua.SELECTORS.inputCachCD).inputmask('9{1,5}.9{1,5}');
                break;
            case 2:
                // giao hội thuận
                html = `<div class="col-xs-12 col-sm-10"><div class="form-group row">
                            <div class="col-xs-12 col-sm-6">
                                <label for="sel_GHDoc1" class="col-sm-4 control-label no-padding-right">Đỉnh A</label>
                                <select class="col-sm-8" id="sel_GHCDTDinhA"></select>
                            </div>
                            <div class="col-xs-12 col-sm-6">
                                <label for="sel_GHDoc2" class="col-sm-4 control-label no-padding-right">Đỉnh B</label>
                                <select class="col-sm-8" id="sel_GHCDTDinhB"></select>
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-xs-12 col-sm-6">
                                <label for="form-field-9" class="col-sm-4 control-label no-padding-right">Cạnh A-C</label>
                                <input type="text" class="col-sm-8 input-mask-distance" placeholder="Độ dài cạnh (m)" id="inp_CanhAC">
                            </div>

                            <div class="col-xs-12 col-sm-6">
                                <label for="form-field-9" class="col-sm-4 control-label no-padding-right">Cạnh B-C</label>
                                <input type="text" class="col-sm-8 input-mask-distance" placeholder="Độ dài cạnh (m)" id="inp_CanhBC">
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-xs-12 col-sm-6">
                                <label for="form-field-select-1" class="col-sm-4 control-label no-padding-right">Góc CAB</label>
                                <input class="col-sm-8 input-mask-angle" type="text" id="inp_GocCAB" disabled="">
                            </div>
                            <div class="col-xs-12 col-sm-6">
                                <label for="form-field-select-1" class="col-sm-4 control-label no-padding-right">Góc CBA</label>
                                <input class="col-sm-8 input-mask-angle" type="text" id="inp_GocCBA" disabled="">
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-xs-12 col-sm-4">
                                <div class="checkbox">
                                    <label>
                                        <input id="chk_GHThuan_RightSide" type="checkbox" class="ace" checked="">
                                        <span class="lbl"> Phía phải</span>
                                    </label>
                                </div>
                            </div>
                        </div></div>
                        <div class="col-xs-12 col-sm-2">
                            <div class="control-group">
                                <label class="control-label bolder blue">Giao hội theo</label>

                                <div class="radio">
                                    <label>
                                        <input name="loaiGiaoHoiThuan" type="radio" class="ace" value="edge" checked>
                                        <span class="lbl"> Cạnh</span>
                                    </label>
                                </div>

                                <div class="radio">
                                    <label>
                                        <input name="loaiGiaoHoiThuan" type="radio" class="ace" value="angle">
                                        <span class="lbl"> Góc</span>
                                    </label>
                                </div>
                            </div>
                        </div>`;
                $(TachThua.SELECTORS.formGiaoHoi).append(html);
                $(TachThua.SELECTORS.inputCachAC).inputmask('9{1,5}.9{1,5}');
                $(TachThua.SELECTORS.inputCachBC).inputmask('9{1,5}.9{1,5}');
                $(TachThua.SELECTORS.inputGocCAB).inputmask('9{1,3}º9{1,2}\'9{1,2}.9{1,2}"');
                $(TachThua.SELECTORS.inputGocCBA).inputmask('9{1,3}º9{1,2}\'9{1,2}.9{1,2}"');

                break;
            case 3:
                // giao hội nghịch
                html = `<div class="col-xs-12 col-sm-10"><div class="form-group row">
                            <div class="col-xs-12 col-sm-6">
                                <label for="sel_GHDoc1" class="col-sm-4 control-label no-padding-right">Đỉnh A</label>
                                <select class="col-sm-8" id="sel_GHCDTDinhA"></select>
                            </div>
                            <div class="col-xs-12 col-sm-6">
                                <label for="sel_GHDoc2" class="col-sm-4 control-label no-padding-right">Đỉnh B</label>
                                <select class="col-sm-8" id="sel_GHCDTDinhB"></select>
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-xs-12 col-sm-6">
                                <label for="sel_GHDoc1" class="col-sm-4 control-label no-padding-right">Đỉnh C</label>
                                <select class="col-sm-8" id="sel_GHCDTDinhC"></select>
                            </div>
                        </div>
                        <div class="form-group row">
                            <div class="col-xs-12 col-sm-6">
                                <label for="form-field-select-1" class="col-sm-4 control-label no-padding-right">Góc APB</label>
                                <input class="col-sm-8 input-mask-angle" type="text" id="inp_GocAPB">
                            </div>
                            <div class="col-xs-12 col-sm-6">
                                <label for="form-field-select-1" class="col-sm-4 control-label no-padding-right">Góc APC</label>
                                <input class="col-sm-8 input-mask-angle" type="text" id="inp_GocAPC">
                            </div>
                        </div></div>`;
                $(TachThua.SELECTORS.formGiaoHoi).append(html);
                $(TachThua.SELECTORS.inputGocAPB).inputmask('9{1,3}º9{1,2}\'9{1,2}.9{1,2}"');
                $(TachThua.SELECTORS.inputGocAPC).inputmask('9{1,3}º9{1,2}\'9{1,2}.9{1,2}"');
                break;
            case 4:
                // giao hội hướng
                html = `<div class="col-xs-12 col-sm-10">
                            <div class="form-group row">
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc1" class="col-sm-4 control-label no-padding-right">Đỉnh A</label>
                                    <select class="col-sm-8" id="sel_GHCDTDinhA"></select>
                                </div>
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc2" class="col-sm-4 control-label no-padding-right">Đỉnh B</label>
                                    <select class="col-sm-8" id="sel_GHCDTDinhB"></select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc1" class="col-sm-4 control-label no-padding-right">Đỉnh C</label>
                                    <select class="col-sm-8" id="sel_GHCDTDinhC"></select>
                                </div>
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc2" class="col-sm-4 control-label no-padding-right">Đỉnh D</label>
                                    <select class="col-sm-8" id="sel_GHCDTDinhD"></select>
                                </div>
                            </div></div>`;
                $(TachThua.SELECTORS.formGiaoHoi).append(html);
                break;
            default:
                // giao hội dọc
                html = `<div class="col-xs-12 col-sm-10">
                            <div class="form-group row">
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc1" class="col-sm-4 control-label no-padding-right">Đỉnh A</label>
                                    <select class="col-sm-8" id="sel_GHCDTDinhA"></select>
                                </div>
                                <div class="col-xs-12 col-sm-6">
                                    <label for="sel_GHDoc2" class="col-sm-4 control-label no-padding-right">Đỉnh B</label>
                                    <select class="col-sm-8" id="sel_GHCDTDinhB"></select>
                                </div>
                            </div>
                            <div class="form-group row">
                                <div class="col-xs-12 col-sm-6">
                                    <label for="form-field-9" class="col-sm-4 control-label no-padding-right">Khoảng cách</label>
                                    <input type="text" class="col-sm-8 input-mask-distance" placeholder="Khoảng cách (m)" id="inp_KhoangCach">
                                </div>
                            </div></div>`;
                $(TachThua.SELECTORS.formGiaoHoi).append(html);
                $(TachThua.SELECTORS.inputKhoangCach).inputmask('9{1,5}.9{1,5}');
        }
    },
    setMarkerDiem: function (data) {
        let check = data.features[0].geometry.type;
        if (check.toLowerCase() === "multipolygon") {
            let point84 = data.features[0].geometry.coordinates[0];
            for (var i = 0; i < point84.length; i++) {
                for (var j = 0; j < point84[i].length-1; j++) {
                    let lat = point84[i][j][1];
                    let lng = point84[i][j][0];
                    let markerPoint = new map4d.Marker({
                        position: { lat: lat, lng: lng },
                        icon: new map4d.Icon(10, 10, "/images/yellow-point.png"),
                        anchor: [0.5, 0.5],
                        //title: name
                    });
                    //thêm marker vào map
                    markerPoint.setMap(maptachthua);
                    let countPoint = (i+j+1).toString();
                    let markerTitelPoint = new map4d.Marker({
                        position: { lat: lat, lng: lng },
                        anchor: [0.5, 1],
                        visible: true,
                        label: new map4d.MarkerLabel({ text: countPoint, color: "ff0000", fontSize: 13 }),
                        icon: new map4d.Icon(32, 32, "")
                    });
                    //thêm marker vào map
                    markerTitelPoint.setMap(maptachthua);
                    let marker = {
                        markerPoint: markerPoint,
                        markerTitelPoint: markerTitelPoint
                    };
                    TachThua.GLOBAL.listMarkerDiem.push(marker);
                }
            }
        }
    },
    removeMaker: function () {
        $.each(TachThua.GLOBAL.listMarkerDiem, function (i, obj) {
            obj.markerPoint.setMap(null);
            obj.markerTitelPoint.setMap(null);
        });
        TachThua.GLOBAL.listMarkerDiem = [];
    }
}