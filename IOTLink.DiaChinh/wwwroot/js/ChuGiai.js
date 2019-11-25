var ListChuGiai = [];
var CodeLoaiSuDung = "";
$(function () {
    $(".dieuKhienChuGiai").show();
    //$.ajax({
    //    url: urlGetListChuGiai,
    //    type: "Get",
    //    success: function (data) {
    //        if (data.success) {
    //            let html = "";
    //            for (let i = 0; i < data.listData.length; i++) {
    //                html += `
    //                    <div class="item">
    //                        <div class="viewColor" style="background-color: ${data.listData[i].Color}"></div>
    //                        <div class="name">${data.listData[i].Name}</div>
    //                    </div>
    //                `;
    //            }
    //            $(".listChuGiai").html(html);
    //        }
    //    }
    //});

    $(".dieuKhienChuGiai").click(function () {
        $(".chuGiai").addClass("opened");
    });
    $(".tatChuGiai").click(function () {
        $(".chuGiai").removeClass("opened");
        $(".loaisudung").removeClass("opened");
    });
    $(".btn_loaisudung").click(function () {
        GetListLoaiSuDung(CodeLoaiSuDung);
        $(".loaisudung").addClass("opened");
    });
    $(".btn-filter-loaisudung").click(function () {
        $("#loading-map").show();
        let $selectfilter = $("input[name='filterLSD']:checked");
        let cauhinhdoituong = "";
        $.each($selectfilter, function () {
            cauhinhdoituong += (cauhinhdoituong.length > 0) ? "," + $(this).val() : $(this).val();
        });
        if (cauhinhdoituong.length > 0) {
            GetDoiTuongVeByCauHinhDoiTuong(CodeLoaiSuDung, cauhinhdoituong);
        } else {
            $("#loading-map").hide();
        }
    });
    //$(".listChuGiai").niceScroll(".contentChuGiai");
    $(".noiDung").niceScroll(".listChuGiai");
    $('#ascrail2000').show();
    //$(".listLoaiSuDung").niceScroll();
});
function GetListChuGiai() {
    $.ajax({
        //url: urlGetListChuGiai,
        url: "/LoaiMucDichSuDung/GetLoaiSuDungAll",
        type: "Get",
        success: function (re) {
            var data = re.listChuGiai;
            if (data !== null && data.length > 0) {
                let html = "";
                $.each(data, function (i, obj) {
                    html += `
                        <div class="item">
                            <div class="viewColor" style="background-color: ${obj.Color}; border:1px solid ${obj.borderColor}"></div>
                            <div class="name">${obj.Name}</div>
                        </div>
                    `;
                });
                $(".listChuGiai").html(html);
                $(".dieuKhienChuGiai").show();
                ListChuGiai = data;
            }
        }
    });
}

function GetListLoaiSuDung(paramcode) {
    $.ajax({
        url: "/LoaiMucDichSuDung/GetLoaiMucDichSuDungByCodeCountry",
        type: 'GET',
        dataType: 'json',
        data: { code: paramcode, checkCauHinh: false },
        //contentType: false,
        //processData: false,
        async: true,
        success: function (re) {
            let data = re.list;
            let html = "";
            $.each(data, function (i, obj) {
                let ChuGiai = ListChuGiai.filter(x => x.kyHieuMucDich === obj.CauHinhDoiTuongId);
                if (ChuGiai !== null && ChuGiai.length > 0) {
                    html += `
                    <div class="item">
                        <input class="form-check-input" type="checkbox" name="filterLSD" id="inlineCheckbox-${ChuGiai[0].kyHieuMucDich}" value="${ChuGiai[0].kyHieuMucDich}" checked>
                        <div class="viewColor" style="background-color: ${ChuGiai[0].Color}; border: 1px solid ${ChuGiai[0].borderColor}"></div>
                        <label  class="name" for="inlineCheckbox-${ChuGiai[0].kyHieuMucDich}">${ChuGiai[0].Name}</label >
                    </div>
                    `;
                }
            });
            $(".listLoaiSuDung").children().remove();
            $(".listLoaiSuDung").append(html);
        }
    });
    CodeLoaiSuDung = paramcode;
}

function ShowHideLoaiSuDung(check) {
    if (check) $(".btn_loaisudung").show();
    else $(".btn_loaisudung").hide();
}

function GetDoiTuongVeByCauHinhDoiTuong(Code, cauhinh) {
    $.ajax({
        url: "/DoiTuongChinh/FilterLoaiSuDung",
        type: 'GET',
        dataType: 'json',
        data: { code: Code, cauhinhdoituong: cauhinh },
        //contentType: false,
        //processData: false,
        async: true,
        success: function (re) {
            layersChild.clearLayers();
            let geoJson = {
                type: "FeatureCollection",
                objectType: 'Polygon',
                features: ConvertObject(re.data)
            };
            setTimeout(function () {
                let featuresLayer = drawing(geoJson);
                layersChild.addLayer(featuresLayer);
                map.leaflet.addLayer(layersChild);
            }, 0);
            $("#loading-map").hide();
        }
    });
}
