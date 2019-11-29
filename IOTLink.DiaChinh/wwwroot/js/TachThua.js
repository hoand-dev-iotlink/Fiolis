var TachThua = {
    GLOBAL: {
        ThuaDat: null,
        polygon: null,
        path: null,
        listMarkerDiem: [],
        listDiem: [],
        //listGiaoHoi: {
        //    giaohoicachduongthang: true,
        //    giaohoithuan: false,
        //    giaohoinghich: false,
        //    giaohoihuong: false,
        //    giaohoidoctheocanh: false,
        //}
    },
    CONSTS: {},
    SELECTORS: {
        checkGiaoHoi:".giao-hoi",
        modalTachThua: ".modal-tach-thua",
        btnTachThua: ".btn-tach-thua",
        formGiaoHoi: ".form-giao-hoi",
        noteGiaoHoi:".note-giao-hoi",
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
        titleGiaoHoi:".title-giao-hoi",
    },
    init: function () {
        maptachthua = new map4d.Map(document.getElementById("madTachThua"), {
            zoom: 15,
            center: { lat: 10.678087311284315, lng: 105.08063708265138 },
            geolocate: true,
            minZoom: 3,
            maxZoom: 22,
            tilt: 0,
            controls: true,
            controlOptions: map4d.ControlOptions.TOP_RIGHT,
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
            //setTimeout(function () {
                TachThua.showTachThua(ViewMap.CONSTS.codeDefault, objectId);
                
                setTimeout(function () {
                    TachThua.fitBoundsThuaDat(TachThua.GLOBAL.path);
                    var camera = maptachthua.getCamera();
                    let zoom = camera.getZoom();
                    camera.setZoom(zoom - 1);
                    maptachthua.setCamera(camera);
                    TachThua.setMarkerDiem(TachThua.GLOBAL.ThuaDat);
                }, 1000);
            //}, 1);
            $(TachThua.SELECTORS.modalTachThua).modal('show');
        });
        $(TachThua.SELECTORS.modalTachThua).on('hide.bs.modal', function () {
            TachThua.removeMaker();
            TachThua.removerOptionDiem([1,2,3,4])
        });
        $(TachThua.SELECTORS.modalTachThua).on('show.bs.modal', function () {
            $(TachThua.SELECTORS.menuCachDuongThang).trigger("click");
        });


        $(TachThua.SELECTORS.menuCachDuongThang).on("click", function () {
            TachThua.showHtmlGiaoHoi(1);
            TachThua.setEventChangeAllDiem(1);
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
            TachThua.setEventChangeAllDiem(2);
        });
        $(TachThua.SELECTORS.menuHoiNghich).on("click", function () {
            TachThua.showHtmlGiaoHoi(3);
            TachThua.setEventChangeAllDiem(3);
        });
        $(TachThua.SELECTORS.menuHoiHuong).on("click", function () {
            TachThua.showHtmlGiaoHoi(4);
            TachThua.setEventChangeAllDiem(4);
        });
        $(TachThua.SELECTORS.menuDocTheoCanh).on("click", function () {
            TachThua.showHtmlGiaoHoi(5);
            TachThua.setEventChangeAllDiem(5);
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
        let note = "";
        $(TachThua.SELECTORS.formGiaoHoi).children().remove();
        $(TachThua.SELECTORS.noteGiaoHoi).children().remove();
        switch (giaohoi) {
            case 1:
                // giao hoi cách đường thẳng
                html = `<div class="col-xs-12 col-sm-10">
                            <input type="text" class="giao-hoi" value="giaohoicachduongthang" style="display:none" />
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
                note = `<img class="media-object" alt="100%x200" src="/images/GiaoHoi/ghcachduongthang.png" data-holder-rendered="true" style="width: 100%; display: block;">
                        <div class="caption">
                            <p>Lấy ra điểm cách đường AB, CD lần lượt các khoảng là d1 và d2. Kết quả sẽ thu được là 4 điểm 1,2,3,4.</p>
                        </div>`;
                $(TachThua.SELECTORS.formGiaoHoi).append(html);
                $(TachThua.SELECTORS.noteGiaoHoi).append(note);
                $(TachThua.SELECTORS.inputCachAB).inputmask('9{1,5}.9{1,5}');
                $(TachThua.SELECTORS.inputCachCD).inputmask('9{1,5}.9{1,5}');
                $(TachThua.SELECTORS.titleGiaoHoi).text("Giao hội cách đường thẳng")
                break;
            case 2:
                // giao hội thuận
                html = `<div class="col-xs-12 col-sm-10"><div class="form-group row">
                            <input type="text" class="giao-hoi" value="giaohoithuan" style="display:none" />
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
                note = `<img class="media-object"  alt="100%x200" src="/images/GiaoHoi/ghthuan.png" data-holder-rendered="true" style="width: 75%; display: block;">
                            <div class="caption">
                                <p>Từ hai đỉnh đã biết tọa độ cộng thêm hai số đo khác của tam giác giao hội, ta có thể tính được tọa độ điểm giao hội. Bài toán giao hội thuận luôn thu được hai kết quả: đỉnh C ở bên trái hay C' ở bên phải so với hướng cạnh gốc AB.</p>
                            </div>`;
                
                $(TachThua.SELECTORS.formGiaoHoi).append(html);
                $(TachThua.SELECTORS.noteGiaoHoi).append(note);
                $(TachThua.SELECTORS.inputCachAC).inputmask('9{1,5}.9{1,5}');
                $(TachThua.SELECTORS.inputCachBC).inputmask('9{1,5}.9{1,5}');
                $(TachThua.SELECTORS.inputGocCAB).inputmask('9{1,3}º9{1,2}\'9{1,2}.9{1,2}"');
                $(TachThua.SELECTORS.inputGocCBA).inputmask('9{1,3}º9{1,2}\'9{1,2}.9{1,2}"');
                $(TachThua.SELECTORS.titleGiaoHoi).text("Giao hội thuận")
                break;
            case 3:
                // giao hội nghịch
                html = `<div class="col-xs-12 col-sm-10"><div class="form-group row">
                            <input type="text" class="giao-hoi" value="giaohoinghịch" style="display:none" />
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
                note = `<img class="media-object"  alt="100%x200" src="/images/GiaoHoi/GiaoHoiNghich_3DiemGoc.png" data-holder-rendered="true" style="width: 60%; display: block;">
                                <div class="caption">
                                    <p>Từ ba đỉnh đã biết tọa độ cộng thêm hai số đo góc từ điểm giao hội P ngắm về ABC, ta xác định được tọa độ điểm giao hội P. Góc giao hội sử dụng để tính toán là các góc ngược chiều kim đồng hồ.</p>
                                </div>`
                
                $(TachThua.SELECTORS.formGiaoHoi).append(html);
                $(TachThua.SELECTORS.noteGiaoHoi).append(note);
                $(TachThua.SELECTORS.inputGocAPB).inputmask('9{1,3}º9{1,2}\'9{1,2}.9{1,2}"');
                $(TachThua.SELECTORS.inputGocAPC).inputmask('9{1,3}º9{1,2}\'9{1,2}.9{1,2}"');
                $(TachThua.SELECTORS.titleGiaoHoi).text("Giao hội nghịch")
                break;
            case 4:
                // giao hội hướng
                html = `<div class="col-xs-12 col-sm-10">
                            <input type="text" class="giao-hoi" value="giaohoihuong" style="display:none" />
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
                note = `<img class="media-object" alt="100%x200" src="/images/GiaoHoi/ghhuong.png" data-holder-rendered="true" style="width: 100%; display: block;">
                            <div class="caption">
                                <p>Điểm kết quả là giao điểm của hai đường thẳng AB và CD.</p>
                            </div>`;
                
                $(TachThua.SELECTORS.formGiaoHoi).append(html);
                $(TachThua.SELECTORS.noteGiaoHoi).append(note);
                $(TachThua.SELECTORS.titleGiaoHoi).text("Giao hội hướng")
                break;
            default:
                // giao hội dọc
                html = `<div class="col-xs-12 col-sm-10">
                            <input type="text" class="giao-hoi" value="giaohoidoctheocanh" style="display:none" />
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
                note = `<img class="media-object" alt="100%x200" src="/images/GiaoHoi/ghdoctheocanh.png" data-holder-rendered="true" style="width: 75%; display: block;">
                            <div class="caption">
                                <p>Lấy một điểm C trên đường thẳng AB cách đỉnh A hoặc đỉnh B một khoảng d.</p>
                            </div>`;
                $(TachThua.SELECTORS.formGiaoHoi).append(html);
                $(TachThua.SELECTORS.noteGiaoHoi).append(note);
                $(TachThua.SELECTORS.inputKhoangCach).inputmask('9{1,5}.9{1,5}');
                $(TachThua.SELECTORS.titleGiaoHoi).text("Giao hội dọc theo cạnh");
        }
    },
    setMarkerDiem: function (data) {
        TachThua.GLOBAL.listDiem = [];
        let check = data.features[0].geometry.type;
        if (check.toLowerCase() === "multipolygon") {
            let point84 = data.features[0].geometry.coordinates[0];
            let point2000 = data.features[1].geometry.coordinates[0];
            for (var i = 0; i < point84.length; i++) {
                for (var j = 0; j < point84[i].length-1; j++) {
                    let lat = point84[i][j][1];
                    let lng = point84[i][j][0];
                    let markerPoint = new map4d.Marker({
                        position: { lat: lat, lng: lng },
                        icon: new map4d.Icon(10, 10, "/images/iconPoint.png"),
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
                    //add diem
                    let xVN2000 = point2000[i][j][1];
                    let yVN2000 = point2000[i][j][0];
                    let diem = {
                        id: Number(countPoint),
                        name: "Điểm " + countPoint,
                        xy: {
                            x: xVN2000,
                            y: yVN2000
                        },
                        latlng: {
                            lat: lat,
                            lng:lng
                        }
                    }
                    TachThua.GLOBAL.listDiem.push(diem);
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
    },
    setEventChangeAllDiem: function (check) {
        let listSelectPoint = [];
        let html = TachThua.getHtmlSelectDiem(listSelectPoint, true);
        $(TachThua.SELECTORS.selectDinhA).append(html);
        $(TachThua.SELECTORS.selectDinhA).change(function () {
            listSelectPoint = [];
            listSelectPoint.push(Number($(this).val()));
            if (check == 1 || check == 2 || check == 5) {
                let pointselect = Number($(this).val()) - 1;
                let listDiem = TachThua.GLOBAL.listDiem;
                let pointStart = pointselect == 0 ? listDiem[listDiem.length - 1].id : listDiem[pointselect - 1].id;
                let pointEnd = pointselect == (listDiem.length - 1) ? listDiem[0].id : listDiem[pointselect + 1].id;
                let listDinhB = [pointStart, pointEnd];
                TachThua.removerOptionDiem([2,3,4])
                html = TachThua.getHtmlSelectDiem(listDinhB,false);
                $(TachThua.SELECTORS.selectDinhB).append(html);
            } else {
                TachThua.removerOptionDiem([2, 3, 4])
                html = TachThua.getHtmlSelectDiem(listSelectPoint,true);
                $(TachThua.SELECTORS.selectDinhB).append(html);
            }
        });
        if (check == 1 || check==3 || check == 4) {
            $(TachThua.SELECTORS.selectDinhB).change(function () {
                TachThua.removerOptionDiem([3, 4])
                listSelectPoint.push(Number($(this).val()));
                html = TachThua.getHtmlSelectDiem(listSelectPoint,true);
                $(TachThua.SELECTORS.selectDinhC).append(html);
            });
        }
        if (check == 1 || check == 4) {
            $(TachThua.SELECTORS.selectDinhC).change(function () {
                if (check == 1) {
                    let pointselect = Number($(this).val()) - 1;
                    let listDiem = TachThua.GLOBAL.listDiem;
                    let pointStart = pointselect == 0 ? listDiem[listDiem.length - 1].id : listDiem[pointselect - 1].id;
                    let pointEnd = pointselect == (listDiem.length - 1) ? listDiem[0].id : listDiem[pointselect + 1].id;
                    let listDinhD = [];
                    if (listSelectPoint.includes(pointStart) == false) listDinhD.push(pointStart);
                    if (listSelectPoint.includes(pointEnd) == false) listDinhD.push(pointEnd);
                    TachThua.removerOptionDiem([4])
                    html = TachThua.getHtmlSelectDiem(listDinhD, false);
                    $(TachThua.SELECTORS.selectDinhD).append(html);
                } else {
                    TachThua.removerOptionDiem([4])
                    listSelectPoint.push(Number($(this).val()));
                    html = TachThua.getHtmlSelectDiem(listSelectPoint, true);
                    $(TachThua.SELECTORS.selectDinhD).append(html);
                }

            });
        }
    },
    getHtmlSelectDiem: function (listPointSelected,check) {
        let str = '<option selected>- Chọn điểm -</option>';
        if (TachThua.GLOBAL.listDiem != null && TachThua.GLOBAL.listDiem.length > 0) {
            let list = TachThua.GLOBAL.listDiem;
            
            for (var i = 0; i < list.length; i++) {
                if (check) {
                    if (listPointSelected.includes(list[i].id) == false) {
                        str += '<option value="' + list[i].id + '">' + list[i].name + '</option>';
                    }
                } else {
                    if (listPointSelected.includes(list[i].id) == true) {
                        str += '<option value="' + list[i].id + '">' + list[i].name + '</option>';
                    }
                }
            }
            //} else {
            //    for (var i = 0; i < listPointSelected.length; i++) {
            //        let obj = list[];
            //        str += '<option value="' + obj.id + '">' + obj.name + '</option>';
            //    }
            //}
            
        }
        return str;
    },
    removerOptionDiem: function (check) {
        if (check.includes(1)) $(TachThua.SELECTORS.selectDinhA).children().remove();
        let select = $(TachThua.SELECTORS.selectDinhB);
        if (check.includes(2) && select.length > 0) {
            $(TachThua.SELECTORS.selectDinhB).children().remove();
        }
        select = $(TachThua.SELECTORS.selectDinhC);
        if (check.includes(3) && select.length > 0) {
            $(TachThua.SELECTORS.selectDinhC).children().remove();
        }
        select = $(TachThua.SELECTORS.selectDinhD);
        if (check.includes(4) && select.length > 0) {
            $(TachThua.SELECTORS.selectDinhD).children().remove();
        }
    }
}