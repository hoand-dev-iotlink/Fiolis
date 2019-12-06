var UpdateThuaDat = {
    GLOBAL: {
        KHSelected: null
    },
    CONSTS: {},
    SELECTORS: {
        KHList: '#KH-listselectid',
        SoToUpdate: "#text-update-soTo",
        SoThuaUpdate: "#text-update-soThua",
        SoToUpdateOld: "#text-update-soTo-old",
        SoThuaUpdateOld: "#text-update-soThua-old",
        DienTichUpdate: "#text-update-dienTich",
        DienTichPhapLyUpdate: "#text-update-dienTichPhapLy",
        TenChuUpdate: "#text-update-chuNha",
        DiaChiUpdate: "#text-update-diaChi",
        btnUpdateThuaDat: "#btn-update-thua-dat",
        modalUpdate: '#myModal'
    },
    init: function () {
        UpdateThuaDat.setEvent();
    },
    setEvent: function () {
        //$("#testselectset").selectBoxIt({
        //    theme: "default",
        //    defaultText: "Make a selection...",
        //    autoWidth: false
        //});
        $(ToolShape.SELECTORS.btnUpdateShape).on("click", function () {
            $(UpdateThuaDat.SELECTORS.modalUpdate).modal('show');
            if (ViewMap.GLOBAL.ThuaDatSelect != null) {
                UpdateThuaDat.getFindInfo(ViewMap.GLOBAL.ThuaDatSelect[0].ObjectId);
                if (UpdateThuaDat.GLOBAL.KHSelected != null) {
                    $(UpdateThuaDat.SELECTORS.KHList).val(UpdateThuaDat.GLOBAL.KHSelected.properties.KyHieuMucDichSuDung).change();
                    if ($(UpdateThuaDat.SELECTORS.KHList).val() == "" || $(UpdateThuaDat.SELECTORS.KHList).val() == null) {
                        $(UpdateThuaDat.SELECTORS.KHList).attr("disabled", "disabled");
                        $(UpdateThuaDat.SELECTORS.KHList).append(`<option value="${UpdateThuaDat.GLOBAL.KHSelected.properties.KyHieuMucDichSuDung}"> 
                                       ${UpdateThuaDat.GLOBAL.KHSelected.properties.KyHieuMucDichSuDung} 
                                  </option>`);
                        $(UpdateThuaDat.SELECTORS.KHList).val(UpdateThuaDat.GLOBAL.KHSelected.properties.KyHieuMucDichSuDung).change();
                    }
                    $(UpdateThuaDat.SELECTORS.SoToUpdate).val(UpdateThuaDat.GLOBAL.KHSelected.properties.SoHieuToBanDo);
                    $(UpdateThuaDat.SELECTORS.SoThuaUpdate).val(UpdateThuaDat.GLOBAL.KHSelected.properties.SoThuTuThua);
                    $(UpdateThuaDat.SELECTORS.SoToUpdateOld).val(UpdateThuaDat.GLOBAL.KHSelected.properties.SoHieuToBanDoCu);
                    if ($(UpdateThuaDat.SELECTORS.SoToUpdateOld).val() == "") {
                        $(UpdateThuaDat.SELECTORS.SoToUpdateOld).val("0");
                    }
                    $(UpdateThuaDat.SELECTORS.SoThuaUpdateOld).val(UpdateThuaDat.GLOBAL.KHSelected.properties.SoThuTuThuaCu);
                    if ($(UpdateThuaDat.SELECTORS.SoThuaUpdateOld).val() == "") {
                        $(UpdateThuaDat.SELECTORS.SoThuaUpdateOld).val("0");
                    }
                    $(UpdateThuaDat.SELECTORS.DienTichUpdate).val(UpdateThuaDat.GLOBAL.KHSelected.properties.DienTich);
                    $(UpdateThuaDat.SELECTORS.DienTichPhapLyUpdate).val(UpdateThuaDat.GLOBAL.KHSelected.properties.DienTichPhapLy);
                    $(UpdateThuaDat.SELECTORS.TenChuUpdate).val(UpdateThuaDat.GLOBAL.KHSelected.properties.TenChu);
                    $(UpdateThuaDat.SELECTORS.DiaChiUpdate).val(UpdateThuaDat.GLOBAL.KHSelected.properties.DiaChi);
                }
            } else {
                swal({
                    title: "Thông báo",
                    text: "Không tìm thấy dữ liệu",
                    icon: "warning",
                    button: "Đóng",
                }).then((value) => {
                });
                return;
            }

        });

        $(UpdateThuaDat.SELECTORS.btnUpdateThuaDat).on('click', function () {
            var tobando = $(UpdateThuaDat.SELECTORS.SoToUpdate).val();
            var thua = $(UpdateThuaDat.SELECTORS.SoThuaUpdate).val();
            var tobandoold = $(UpdateThuaDat.SELECTORS.SoToUpdateOld).val();
            var thuaold = $(UpdateThuaDat.SELECTORS.SoThuaUpdateOld).val();
            var dientich = $(UpdateThuaDat.SELECTORS.DienTichUpdate).val();
            var dientichphaply = $(UpdateThuaDat.SELECTORS.DienTichPhapLyUpdate).val();
            var tenchu = $(UpdateThuaDat.SELECTORS.TenChuUpdate).val();
            var diachi = $(UpdateThuaDat.SELECTORS.DiaChiUpdate).val();
            var khmucdichsudung = $(UpdateThuaDat.SELECTORS.KHList).val();
            if (tobando === "" || thua === "" || tobandoold === "" || thuaold === "" || dientich === "" || dientichphaply === "") {
                swal({
                    title: "Thông báo",
                    text: "Dữ liệu nhập không đúng",
                    icon: "warning",
                    button: "Đóng",
                }).then((value) => {
                });
                return;
            }

            var dientichnumber = parseFloat(dientich);
            var dientichphaplynumber = parseFloat(dientichphaply);
            var object = {
                id: UpdateThuaDat.GLOBAL.KHSelected.properties.Id,
                objectId: ViewMap.GLOBAL.ThuaDatSelect[0].ObjectId,
                index: UpdateThuaDat.GLOBAL.KHSelected.properties.Index,
                uuid: UpdateThuaDat.GLOBAL.KHSelected.properties.UUID,
                thoiDiemBatDau: UpdateThuaDat.GLOBAL.KHSelected.properties.ThoiDiemBatDau,
                thoiDiemKetThuc: UpdateThuaDat.GLOBAL.KHSelected.properties.ThoiDiemKetThuc,
                maXa: UpdateThuaDat.GLOBAL.KHSelected.properties.MaXa,
                maDoiTuong: UpdateThuaDat.GLOBAL.KHSelected.properties.MaDoiTuong,
                soHieuToBanDo: tobando,
                soThuTuThua: thua,
                soHieuToBanDoCu: tobandoold,
                soThuTuThuaCu: thuaold,
                dienTich: dientichnumber,
                dienTichPhapLy: dientichphaplynumber,
                kyHieuMucDichSuDung: khmucdichsudung,
                kyHieuDoiTuong: UpdateThuaDat.GLOBAL.KHSelected.properties.KyHieuDoiTuong,
                tenChu: tenchu,
                diaChi: diachi,
                daCapGCN: UpdateThuaDat.GLOBAL.KHSelected.properties.DaCapGCN,
                tenChu2: UpdateThuaDat.GLOBAL.KHSelected.properties.TenChu2,
                namSinhC1: UpdateThuaDat.GLOBAL.KHSelected.properties.NamSinhC1,
                soHieuGCN: UpdateThuaDat.GLOBAL.KHSelected.properties.SoHieuGCN,
                soVaoSo: UpdateThuaDat.GLOBAL.KHSelected.properties.SoVaoSo,
                ngayVaoSo: UpdateThuaDat.GLOBAL.KHSelected.properties.NgayVaoSo,
                soBienNhan: UpdateThuaDat.GLOBAL.KHSelected.properties.SoBienNhan,
                nguoiNhanHS: UpdateThuaDat.GLOBAL.KHSelected.properties.NguoiNhanHS,
                coQuanThuLy: UpdateThuaDat.GLOBAL.KHSelected.properties.CoQuanThuLy,
                loaiHS: UpdateThuaDat.GLOBAL.KHSelected.properties.LoaiHS,
                maLienKet: UpdateThuaDat.GLOBAL.KHSelected.properties.MaLienKet,
                shapeSTArea: UpdateThuaDat.GLOBAL.KHSelected.properties.ShapeSTArea,
                shapeSTLength: UpdateThuaDat.GLOBAL.KHSelected.properties.ShapeSTLength,
                shapeLength: UpdateThuaDat.GLOBAL.KHSelected.properties.ShapeLength,
                shapeArea: UpdateThuaDat.GLOBAL.KHSelected.properties.ShapeArea,
                geometry: UpdateThuaDat.GLOBAL.KHSelected.geometry,
                tags: UpdateThuaDat.GLOBAL.KHSelected.properties.Tags
            };
            console.log(object);

            ViewMap.showLoading(true);
            $.ajax({
                type: "POST",
                url: ViewMap.GLOBAL.url + "/v2/api/land/update?key=" + ViewMap.CONSTS.key,
                data: JSON.stringify(object),
                dataType: 'json',
                async: false,
                contentType: 'application/json-patch+json',
                success: function (data) {
                    if (data.code == "ok") {
                        swal({
                            title: "Thông báo",
                            text: "Cập nhật thông tin thửa đất thành công!",
                            icon: "success",
                            button: "Đóng",
                        }).then((value) => {
                            UpdateThuaDat.updateThuaDat(parseInt(tobando), parseInt(thua));
                            $(UpdateThuaDat.SELECTORS.modalUpdate).modal('hide');
                        });
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                    console.log(messageErorr);
                    ViewMap.showLoading(false);
                }
            });
        });

        $(UpdateThuaDat.SELECTORS.DienTichUpdate).keyup(function (evt) {
            var text = $(this).val();
            var splittext = text.split('.');
            if (splittext.length > 2) {
                for (var i = 2; i < splittext.length; i++) {
                    splittext[1] += splittext[i];
                }
                $(this).val(splittext[0] + '.' + splittext[1]);
            }
        });

        $(UpdateThuaDat.SELECTORS.DienTichPhapLyUpdate).keyup(function (evt) {
            var text = $(this).val();
            var splittext = text.split('.');
            if (splittext.length > 2) {
                for (var i = 2; i < splittext.length; i++) {
                    splittext[1] += splittext[i];
                }
                $(this).val(splittext[0] + '.' + splittext[1]);
            }
        });

        //$(".KH-select").select2({
        //    language: "vi",
        //    placeholder: 'Chọn',
        //    width: '100%',
        //    allowClear: true,
        //    ajax:
        //    {
        //        url: ViewMap.GLOBAL.url + "/v2/api/land/all-muc-dich-su-dung?key" + ViewMap.CONSTS.key,
        //        dataType: 'json',
        //        type: 'POST',
        //        delay: 250,
        //        data: function (params) {
        //            var query = {
        //                q: params.term
        //            }
        //            return query;
        //        },
        //        processResults: function (data, params) {
        //            debugger;
        //            return {
        //                results: data.select2,
        //            };
        //        },
        //        cache: false
        //    },
        //    theme: "bootstrap",
        //    minimumInputLength: 3
        //}).on("change", function (e) {

        //});
    },
    getFindInfo: function (objectId) {
        ViewMap.showLoading(true);
        $.ajax({
            type: "GET",
            url: ViewMap.GLOBAL.url + "/v2/api/land/find-info",
            data: {
                code: ViewMap.CONSTS.codeDefault,
                objectId: objectId,
                key: ViewMap.CONSTS.key
            },
            async: false,
            success: function (data) {
                console.log(data);
                if (data.code == "ok" && data.result != null && data.result.features.length > 0) {
                    console.log(data.result.features);
                    UpdateThuaDat.GLOBAL.KHSelected = data.result.features.find(x => x.properties.info === "vn2000");
                } else {
                    swal({
                        title: "Thông báo",
                        text: "Không tìm thấy kết quả",
                        icon: "warning",
                        button: "Đóng",
                    }).then((value) => {
                    });
                }
                ViewMap.showLoading(false);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(messageErorr);
                ViewMap.showLoading(false);
            }
        });
    },
    updateThuaDat: function (soTo, soThua) {
        ViewMap.showLoading(true);
        $.ajax({
            type: "GET",
            url: ViewMap.GLOBAL.url + "/v2/api/land/find",
            data: {
                code: ViewMap.CONSTS.codeDefault,
                soTo: soTo,
                soThua: soThua,
                key: ViewMap.CONSTS.key
            },
            success: function (data) {
                console.log(data);
                if (data.code == "ok" && data.result != null && data.result.features.length > 0) {
                    let propertie = data.result.features[0].properties;
                    $(ViewMap.SELECTORS.MaXa).text(propertie.MaXa);
                    $(ViewMap.SELECTORS.TenChu).text(propertie.TenChu);
                    $(ViewMap.SELECTORS.DiaChi).text(propertie.DiaChi);
                    $(ViewMap.SELECTORS.SoThuaBD).text(propertie.SoThuTuThua);
                    $(ViewMap.SELECTORS.SoToBD).text(propertie.SoHieuToBanDo);
                    $(ViewMap.SELECTORS.SoThuaOld).text((propertie.SoThuTuThuaCu != null) ? propertie.SoThuTuThuaCu : 0);
                    $(ViewMap.SELECTORS.SoToOld).text((propertie.SoHieuToBanDoCu != null) ? propertie.SoHieuToBanDoCu : 0);
                    $(ViewMap.SELECTORS.DientichBD).text(propertie.DienTich);
                    $(ViewMap.SELECTORS.DientichPL).text(propertie.DienTichPhapLy);
                    $(ViewMap.SELECTORS.KHDTC).text(propertie.KyHieuDoiTuong);
                    $(ViewMap.SELECTORS.MucDichSuDung).text(propertie.KyHieuMucDichSuDung);
                    $(ViewMap.SELECTORS.NameMucDichSuDung).text(propertie.TenMucDichSuDung);
                    ViewMap.showHideViewProperty(true);
                } else {
                    swal({
                        title: "Thông báo",
                        text: "Không tìm thấy kết quả",
                        icon: "warning",
                        button: "Đóng",
                    }).then((value) => {
                    });
                }
                ViewMap.showLoading(false);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(messageErorr);
                ViewMap.showLoading(false);
            }
        });
    }
};