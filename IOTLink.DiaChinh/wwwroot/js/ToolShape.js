var ToolShape = {
    GLOBAL: {
        isStartDistance: false,
        isStartArea: false,
        listDistance: {
            listMarkerDistance: [],
            listPolylineDistance: [],
            listMerterDistance: [],
        },
        listArea: {
            listMarkerArea: [],
            listMerterArea: [],
            polygonArea: null,
            PolylineArea: null,
        },
        polylineTemp: null,
    },
    CONSTS: {
    },
    SELECTORS: {
        btnExportFile: ".btn-export-file",
        btnPrint: ".btn-print",
        btnUpdateFile: ".btn-update-file",
        btnUpdateShape: ".btn-update-shape",
        btnRuleDistance: ".draw-width-height",
        btnRuleArea: ".draw-area",
        btnRuleReplay: ".draw-replay",
    },
    init: function () {
        ToolShape.setEvent();
    },
    setEvent: function () {
        listMarkerDrawLoDat = [];
        listDataFloor = [{
            objectId: "default",
            objectModel: null,
            polygon: null,
            marker: [],
            area: 0,
        }];
        //isStartDraw = false;
        //isStartDrawLoDat = false;
        //polylineMouseLoDat = null;
        markerMeter = null;
        //polylineDrawFirstLoDat = null;
        //polygonLoDat = null;
        //markerLoDat = null
        $(ToolShape.SELECTORS.btnExportFile).click(function () {
            ToolShape.selectExportFileShape();
        });
        $(ToolShape.SELECTORS.btnRuleDistance).on("click", function () {
            if (!ToolShape.GLOBAL.isStartDistance) {
                ToolShape.setShowHideDistance(true);
            }
            $(ViewMap.SELECTORS.inforThuaDat).addClass('detail-property-collapse');
            ViewMap.removeSelectThuaDat();
        });
        $(ToolShape.SELECTORS.btnRuleArea).on("click", function () {
            if (!ToolShape.GLOBAL.isStartArea) {
                ToolShape.setShowHideArea(true);
            }
            $(ViewMap.SELECTORS.inforThuaDat).addClass('detail-property-collapse');
            ViewMap.removeSelectThuaDat();
        });
        $(ToolShape.SELECTORS.btnRuleReplay).on("click", function () {
            ToolShape.replayRuleShape();
        });

        let eventMouseMove = map.addListener("mouseMove", (args) => {
            //if (isStartDraw) {
            //    //let listObjectSelected = map.getSelectedObjects();
            //    let listMarker = [];
            //    //if (listDataFloor.length > 0 && listObjectSelected.length > 0) {
            //    //    let objectId = listObjectSelected[0];
            //    //    listMarker = CreateObject.findObjectArrayById(objectId).marker;
            //    //} else {
            //    //    listMarker = CreateObject.findObjectArrayById("default").marker;
            //    //}

            //    if (listMarker.length > 0) {
            //        let path = [];
            //        let endPoint = [listMarker[listMarker.length - 1].getPosition().lng, listMarker[listMarker.length - 1].getPosition().lat];
            //        let mousePoint = [args.location.lng, args.location.lat];
            //        path.push(endPoint);
            //        path.push(mousePoint);
            //        ToolShape.createPolylineByMouseMove(path, 3.0, 0.5);
            //        ToolShape.ShowMeterDraw(endPoint, mousePoint);
            //    }
            //    else {
            //        if (!isStartDraw) {
            //            if (polylineMouse != null) {
            //                polylineMouse.setMap(null);
            //            }
            //        }
            //    }
            //}

            //if (isStartDrawLoDat && listMarkerDrawLoDat.length > 0) {
            //    let path = [];
            //    let endPoint = [listMarkerDrawLoDat[listMarkerDrawLoDat.length - 1].getPosition().lng, listMarkerDrawLoDat[listMarkerDrawLoDat.length - 1].getPosition().lat];
            //    let mousePoint = [args.location.lng, args.location.lat];
            //    path.push(endPoint);
            //    path.push(mousePoint);
            //    ToolShape.createPolylineByMouseMoveLoDat(path, 3.0, 0.5);
            //    ToolShape.ShowMeterDraw(endPoint, mousePoint);
            //} else {
            //    if (!isStartDrawLoDat) {
            //        if (polylineMouseLoDat != null) {
            //            polylineMouseLoDat.setMap(null);
            //        }
            //    }
            //}
            if (ToolShape.GLOBAL.isStartDistance && ToolShape.GLOBAL.listDistance.listMarkerDistance.length > 0) {
                let path = [];
                let listMarker = ToolShape.GLOBAL.listDistance.listMarkerDistance;
                let endPoint = [listMarker[listMarker.length - 1].getPosition().lng, listMarker[listMarker.length - 1].getPosition().lat];
                let mousePoint = [args.location.lng, args.location.lat];
                path.push(endPoint);
                path.push(mousePoint);
                ToolShape.createPolylineByMouseMoveLoDat(path, 3.0, 0.7);
                ToolShape.ShowMeterDraw(endPoint, mousePoint, true);
            }
            if (ToolShape.GLOBAL.isStartArea && ToolShape.GLOBAL.listArea.listMarkerArea.length > 0) {
                let path = [];
                let listMarker = ToolShape.GLOBAL.listArea.listMarkerArea;
                let endPoint = [listMarker[listMarker.length - 1].getPosition().lng, listMarker[listMarker.length - 1].getPosition().lat];
                let mousePoint = [args.location.lng, args.location.lat];
                path.push(endPoint);
                path.push(mousePoint);
                ToolShape.createPolylineByMouseMoveLoDat(path, 3.0, 0.7);
                ToolShape.ShowMeterDraw(endPoint, mousePoint, true);
            }
            if ((!ToolShape.GLOBAL.isStartDistance && !ToolShape.GLOBAL.isStartArea) && ToolShape.GLOBAL.polylineTemp != null) {
                ToolShape.GLOBAL.polylineTemp.setMap(null);
            }
            //else {
            //    console.log("else eventMouseMove");
            //    //if (!isStartDrawLoDat) {
            //    //    if (polylineMouseLoDat != null) {
            //    //        polylineMouseLoDat.setMap(null);
            //    //    }
            //    //}
            //}
        });
        //let clickMarkerEvent = map.addListener("click", (args) => {
        //    let latClick = args.marker.getPosition().lat;
        //    let lngClick = args.marker.getPosition().lng;
        //    let listObjectSelected = map.getSelectedObjects();
        //    let listMarker = [];
        //    //if (listDataFloor.length > 0 && listObjectSelected.length > 0) {
        //    //    let objectId = listObjectSelected[0];
        //    //    listMarker = CreateObject.findObjectArrayById(objectId).marker;
        //    //} else {
        //    //    listMarker = CreateObject.findObjectArrayById("default").marker;
        //    //}
        //    if (isStartDraw && listMarker.length > 0) {
        //        if (latClick == listMarker[0].getPosition().lat && lngClick == listMarker[0].getPosition().lng) {
        //            $(CreateObject.SELECTORS.btnEndDraw).trigger("click");
        //        }
        //    }
        //    if (isStartDrawLoDat && listMarkerDrawLoDat.length > 0) {
        //        if (latClick == listMarkerDrawLoDat[0].getPosition().lat && lngClick == listMarkerDrawLoDat[0].getPosition().lng) {
        //            $(CreateObject.SELECTORS.btnEndDrawLoDat).trigger("click");
        //        }
        //    }
        //    CheckTieuChi.HideMeterDraw();
        //}, { marker: true });
        let eventClickMap = map.addListener("click", (args) => {
            //if (isStartDrawLoDat) {
            //    ToolShape.createMarkerDrawLoDat(args.location.lat, args.location.lng);
            //    if (listMarkerDrawLoDat.length == 2) {
            //        let path = [];
            //        $.each(listMarkerDrawLoDat, function () {
            //            let item = [this.getPosition().lng, this.getPosition().lat];
            //            path.push(item);
            //        })
            //        ToolShape.createPolylineLoDat(path, 3.0, 1.0);
            //    }
            //    else {
            //        if (listMarkerDrawLoDat.length > 2) {
            //            let iLatLng = [];
            //            $.each(listMarkerDrawLoDat, function () {
            //                let latLng = { lat: this.getPosition().lat, lng: this.getPosition().lng };
            //                iLatLng.push(latLng);
            //            });
            //            iLatLng.push(iLatLng[0]);
            //            ToolShape.createPolygonLoDat(iLatLng);
            //        }
            //    }
            //}
            if (ToolShape.GLOBAL.isStartDistance) {
                ToolShape.createMarkerDrawLoDat(args.location.lat, args.location.lng, false);
                if (ToolShape.GLOBAL.listDistance.listMarkerDistance.length > 1) {
                    let iLatLng = [];
                    $.each(ToolShape.GLOBAL.listDistance.listMarkerDistance, function () {
                        let latLng = { lat: this.getPosition().lat, lng: this.getPosition().lng };
                        iLatLng.push(latLng);
                    });
                    //iLatLng.push(iLatLng[0]);
                    ToolShape.createPolylineLoDat(iLatLng, 3.0, 1.0, true);
                }
            }
            if (ToolShape.GLOBAL.isStartArea) {
                ToolShape.createMarkerDrawLoDat(args.location.lat, args.location.lng, true);
                if (ToolShape.GLOBAL.listArea.listMarkerArea.length > 1) {
                    let iLatLng = [];
                    $.each(ToolShape.GLOBAL.listArea.listMarkerArea, function () {
                        let latLng = { lat: this.getPosition().lat, lng: this.getPosition().lng };
                        iLatLng.push(latLng);
                    });
                    iLatLng.push(iLatLng[0]);
                    ToolShape.createPolygonArea(iLatLng);
                }
            }
        }, { map: true});
        let eventDoubleClickMap = map.addListener("dblClick", (args) => {
            if (ToolShape.GLOBAL.isStartDistance) {
                ToolShape.GLOBAL.isStartDistance = false;
                let list = ToolShape.GLOBAL.listDistance.listMerterDistance;
                let total = 0;
                $.each(list, function (i, obj) {
                    obj.setMap(map);
                    let merter = obj.getLabel().text;
                    total += ToolShape.splitStringDistance(merter);
                });
                let point = args.location;
                total = Math.round(total * 100) / 100
                ToolShape.showMerterTotal(point, total);
            }
            if (ToolShape.GLOBAL.isStartArea) {
                ToolShape.GLOBAL.isStartArea = false;
                ToolShape.GLOBAL.isStartDistance = false;
                let list = ToolShape.GLOBAL.listArea.listMerterArea;
                //let total = 0;
                $.each(list, function (i, obj) {
                    obj.setMap(map);
                    //let merter = obj.getLabel().text;
                    //total += ToolShape.splitStringDistance(merter);
                });
                if (ToolShape.GLOBAL.listArea.polygonArea != null && typeof ToolShape.GLOBAL.listArea.polygonArea != undefined) {
                    ToolShape.showMerterTotalArea();
                }
                //let point = args.location;
                //total = Math.round(total * 100) / 100
                //ToolShape.showMerterTotal(point, total);
            }
        }, { marker: true });
        let eventClickDraw = map.addListener("click", (args) => {
            //Distance
            if (ToolShape.GLOBAL.isStartDistance) {
                ToolShape.createMarkerDrawLoDat(args.location.lat, args.location.lng, false);
                let listMarker = ToolShape.GLOBAL.listDistance.listMarkerDistance;
                let iLatLng = [];
                $.each(listMarker, function (i, obj) {
                    let latLng = { lat: obj.getPosition().lat, lng: obj.getPosition().lng };
                    iLatLng.push(latLng);

                });
                if (iLatLng.length > 1) {
                    let startPoint = [iLatLng[iLatLng.length - 2].lng, iLatLng[iLatLng.length - 2].lat];
                    let endPoint = [iLatLng[iLatLng.length - 1].lng, iLatLng[iLatLng.length - 1].lat];
                    ToolShape.ShowMeterDraw(startPoint, endPoint, false);
                }
                ToolShape.createPolylineLoDat(iLatLng, 3.0, 1.0, true);
            }
            //Area
            if (ToolShape.GLOBAL.isStartArea) {
                ToolShape.createMarkerDrawLoDat(args.location.lat, args.location.lng, true);
                let iLatLng = [];
                if (ToolShape.GLOBAL.listArea.listMarkerArea.length == 2) {
                    //let path = [];
                    let listarea = ToolShape.GLOBAL.listArea.listMarkerArea;
                    $.each(listarea, function () {
                        let item = { lng: this.getPosition().lng, lat: this.getPosition().lat };
                        iLatLng.push(item);
                    })
                    //add marker merter
                    let startPoint = [iLatLng[iLatLng.length - 2].lng, iLatLng[iLatLng.length - 2].lat];
                    let endPoint = [iLatLng[iLatLng.length - 1].lng, iLatLng[iLatLng.length - 1].lat];
                    ToolShape.ShowMeterArea(startPoint, endPoint);
                    //drawing polyline
                    ToolShape.createPolylineLoDat(iLatLng, 3.0, 1.0, false);
                }
                else {
                    if (ToolShape.GLOBAL.listArea.listMarkerArea.length > 2) {
                        let listarea = ToolShape.GLOBAL.listArea.listMarkerArea;
                        //let iLatLng = [];
                        $.each(listarea, function () {
                            let latLng = { lng: this.getPosition().lng, lat: this.getPosition().lat };
                            iLatLng.push(latLng);
                        });
                        //add marker merter
                        let startPoint = [iLatLng[iLatLng.length - 2].lng, iLatLng[iLatLng.length - 2].lat];
                        let endPoint = [iLatLng[iLatLng.length - 1].lng, iLatLng[iLatLng.length - 1].lat];
                        ToolShape.ShowMeterArea(startPoint, endPoint);
                        //drawing polygon
                        iLatLng.push(iLatLng[0]);
                        ToolShape.createPolygonArea(iLatLng);
                        if (ToolShape.GLOBAL.listArea.PolylineArea != null) {
                            ToolShape.GLOBAL.listArea.PolylineArea.setMap(null);
                            ToolShape.GLOBAL.listArea.PolylineArea = null;
                        }
                    }
                }
            }
        }, { polyline: true });
        let eventClickPolygon = map.data.addListener("click", (args) => {
            if (ToolShape.GLOBAL.isStartDistance) {
                ToolShape.createMarkerDrawLoDat(args.location.lat, args.location.lng, false);
                if (ToolShape.GLOBAL.listDistance.listMarkerDistance.length > 1) {
                    let iLatLng = [];
                    $.each(ToolShape.GLOBAL.listDistance.listMarkerDistance, function () {
                        let latLng = { lat: this.getPosition().lat, lng: this.getPosition().lng };
                        iLatLng.push(latLng);
                    });
                    //iLatLng.push(iLatLng[0]);
                    ToolShape.createPolylineLoDat(iLatLng, 3.0, 1.0, true);
                }
            }
            if (ToolShape.GLOBAL.isStartArea) {
                ToolShape.createMarkerDrawLoDat(args.location.lat, args.location.lng, true);
                if (ToolShape.GLOBAL.listArea.listMarkerArea.length > 1) {
                    let iLatLng = [];
                    $.each(ToolShape.GLOBAL.listArea.listMarkerArea, function () {
                        let latLng = { lat: this.getPosition().lat, lng: this.getPosition().lng };
                        iLatLng.push(latLng);
                    });
                    iLatLng.push(iLatLng[0]);
                    ToolShape.createPolygonArea(iLatLng);
                }
            }
        });
    },
    selectExportFileShape: function () {
        bootbox.prompt({
            title: "Chọn file cần trích xuất",
            inputType: 'select',
            inputOptions: [
                {
                    text: 'Shape file',
                    value: 'SHP',
                },
                {
                    text: 'KML',
                    value: 'KML',
                },
                {
                    text: 'Text file',
                    value: 'TXT',
                }
            ],
            callback: function (result) {
                if (result != null) {
                    ToolShape.exportFileShape(result);
                }
            }
        });
    },
    exportFileShape: function (data) {
        if (ViewMap.GLOBAL.ThuaDatSelect != null) {
            var ListPolyline = ViewMap.GLOBAL.ThuaDatSelect;
            var id = ListPolyline[0].ObjectId;
            var shape = ToolShape.getShapeVN2000(id);
            switch (data) {
                case "TXT":
                    ToolShape.getExportFileTxt(JSON.stringify(shape), data);
                    break;
                case "SHP":
                    ToolShape.getExportFileShape(JSON.stringify(shape), data);
                    break;
                case "KML":
                    ToolShape.getExportFileShape(JSON.stringify(shape), data);
                    break;
                default:
                    break;
            }
        }
    },
    getShapeVN2000: function (objId) {
        var shape;
        $.ajax({
            type: "GET",
            url: ViewMap.GLOBAL.url + "/v2/api/land/find-info",
            data: {
                code: ViewMap.CONSTS.codeDefault,
                objectId: objId,
                key: ViewMap.CONSTS.key
            },
            async: false,
            success: function (data) {
                console.log(data);
                if (data.code == "ok" && data.result.features != null && data.result.features.length > 0) {
                    var objShape = []; //Object.assign({}, data.result);
                    $.each(data.result.features, function (i, obj) {
                        if (obj.properties.info === "vn2000") {
                            objShape.push(obj);
                        }
                    });
                    shape = {
                        "type": "FeatureCollection",
                        "features": objShape,
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(messageErorr);
            }
        });
        return shape;
    },
    getExportFileShape: function (data, type) {
        var param = {
            category: type,
            shapeJson: data
        }
        $.ajax({
            url: "/Home/ExportFileShape",
            type: "POST",
            data: JSON.stringify(param),
            contentType: "application/json",
            dataType: "json",
            async: true,
            success: function (data) {
                if (data.code) {
                    window.location = `/Home/DownloadFile?filePath=${data.result}&type=${type}`;
                }
                else {
                    bootbox.alert("Dữ liệu không hợp lệ");
                }
                //if (data.code == "ok" && data.result.features != null && data.result.features.length > 0) {
                //    var objShape = []; //Object.assign({}, data.result);
                //    $.each(data.result.features, function (i, obj) {
                //        if (obj.properties.info === "vn2000") {
                //            objShape.push(obj);
                //        }
                //    });
                //    var shape = {
                //        "type": "FeatureCollection",
                //        "features": objShape,
                //    }
                //}
            },
            error: function (jqXHR, textStatus, errorThrown) {
                let messageErorr = AppCommon.getMessageErrorReuqest(jqXHR, errorThrown);
                console.log(messageErorr);
            }
        });
    },
    getExportFileTxt: function (data, type) {
        var munber = Date.parse(new Date());
        $("<a />", {
            "download": "ThuaDat_" + munber + ".txt",
            "href": "data:application/json;charset=utf-8," + encodeURIComponent(data),
        }).appendTo("body")
            .click(function () {
                $(this).remove()
            })[0].click()
    },
    //tool rule width/heigth and area
    //Tạo polyline lo dat
    createPolylineByMouseMoveLoDat: function (path, strokeWidth, strokeOpacity) {
        if (ToolShape.GLOBAL.polylineTemp != null) {
            ToolShape.GLOBAL.polylineTemp.setMap(null);
        }
        //tạo đối tượng polyline từ PolylineOptions
        ToolShape.GLOBAL.polylineTemp = new map4d.Polyline({
            path: path, visible: true, strokeColor: "#FF8264", strokeWidth: strokeWidth, strokeOpacity: strokeOpacity,
            closed: false
        })
        //thêm polyline vào map
        ToolShape.GLOBAL.polylineTemp.setMap(map)
    },
    ShowMeterDraw: function (endPoint, mousePoint, check) {
        let projection = new map4d.Projection(map)
        let screenCoordinate1 = projection.fromLatLngToScreen([endPoint[0], endPoint[1]]);
        let screenCoordinate2 = projection.fromLatLngToScreen([mousePoint[0], mousePoint[1]]);
        let x = (screenCoordinate1.x + screenCoordinate2.x) / 2;
        let y = (screenCoordinate1.y + screenCoordinate2.y) / 2;
        let latLngCoordinate = projection.fromScreenToLatLng({ x: x, y: y })
        let measure = new map4d.Measure([endPoint, mousePoint,]);
        let length = (Math.round(measure.length * 100) / 100).toString();
        if (check) {
            if (markerMeter != null) markerMeter.setMap(null);
            markerMeter = new map4d.Marker({
                position: { lat: latLngCoordinate.lat, lng: latLngCoordinate.lng },
                anchor: [0.5, 1],
                visible: true,
                label: new map4d.MarkerLabel({ text: length + " m", color: "000000", fontSize: 12 }),
                icon: new map4d.Icon(32, 32, ""),
            })
            markerMeter.setMap(map);
        } else {
            ToolShape.GLOBAL.listDistance.listMerterDistance.push(markerMeter);
            if (markerMeter != null) markerMeter.setMap(null);
        }
    },
    ShowMeterArea: function (endPoint, mousePoint) {
        let projection = new map4d.Projection(map)
        let screenCoordinate1 = projection.fromLatLngToScreen([endPoint[0], endPoint[1]]);
        let screenCoordinate2 = projection.fromLatLngToScreen([mousePoint[0], mousePoint[1]]);
        let x = (screenCoordinate1.x + screenCoordinate2.x) / 2;
        let y = (screenCoordinate1.y + screenCoordinate2.y) / 2;
        let latLngCoordinate = projection.fromScreenToLatLng({ x: x, y: y })
        let measure = new map4d.Measure([endPoint, mousePoint,]);
        let length = (Math.round(measure.length * 100) / 100).toString();
        if (markerMeter != null) markerMeter.setMap(null);
        markerMeter = new map4d.Marker({
            position: { lat: latLngCoordinate.lat, lng: latLngCoordinate.lng },
            anchor: [0.5, 0.5],
            visible: true,
            label: new map4d.MarkerLabel({ text: length + " m", color: "000000", fontSize: 11 }),
            icon: new map4d.Icon(32, 32, ""),
        })
        markerMeter.setMap(map);
        ToolShape.GLOBAL.listArea.listMerterArea.push(markerMeter);
        if (markerMeter != null) markerMeter.setMap(null);
    },
    showMerterTotal: function (point, total) {
        let projection = new map4d.Projection(map)
        let totalMerter = null;
        totalMerter = new map4d.Marker({
            position: { lat: point.lat, lng: point.lng },
            anchor: [0.5, 0.5],
            visible: true,
            label: new map4d.MarkerLabel({ text: total + " m", color: "000000", fontSize: 11 }),
            icon: new map4d.Icon(32, 32, "")
        });
        totalMerter.setMap(map);
        ToolShape.GLOBAL.listDistance.listMerterDistance.push(totalMerter);
    },
    showMerterTotalArea: function () {
        var area = ToolShape.calculatorAraePolygon(ToolShape.GLOBAL.listArea.polygonArea.getPaths()[0]);
        area = Math.round(area * 100) / 100
        let coordinateTransformer = new map4d.CoordinateTransformer(ToolShape.GLOBAL.listArea.polygonArea.getPaths()[0])
        let pointCenter = coordinateTransformer.center;
        let totalMerter = null;
        totalMerter = new map4d.Marker({
            position: { lat: pointCenter.lat, lng: pointCenter.lng },
            anchor: [0.5, 0.5],
            visible: true,
            label: new map4d.MarkerLabel({ text: area + " m2", color: "000000", fontSize: 11 }),
            icon: new map4d.Icon(32, 32, "")
        });
        totalMerter.setMap(map);
        ToolShape.GLOBAL.listArea.listMerterArea.push(totalMerter);
    },
    //Tạo marker LoDat
    createMarkerDrawLoDat: function (lat, lng, check) {
        //tạo đối tượng marker từ MarkerOption
        let markerDraw = new map4d.Marker({
            position: { lat: lat, lng: lng },
            icon: new map4d.Icon(8, 8, "/images/yellow-point.png"),
            anchor: [0.5, 0.5],
            //title: name
        })
        //thêm marker vào map
        markerDraw.setMap(map);
        if (check) {
            ToolShape.GLOBAL.listArea.listMarkerArea.push(markerDraw);
        } else {
            ToolShape.GLOBAL.listDistance.listMarkerDistance.push(markerDraw);
        }
    },
    //createMarkerDrawAre: function (lat, lng) {
    //    //tạo đối tượng marker từ MarkerOption
    //    let markerDraw = new map4d.Marker({
    //        position: { lat: lat, lng: lng },
    //        icon: new map4d.Icon(8, 8, "/images/yellow-point.png"),
    //        anchor: [0.5, 0.5],
    //        //title: name
    //    })
    //    //thêm marker vào map
    //    markerDraw.setMap(map);
    //    ToolShape.GLOBAL.listDistance.listMarkerDistance.push(markerDraw);
    //    //listMarkerDrawLoDat.push(markerDraw);
    //},
    //Tạo polyline lo dat
    createPolylineLoDat: function (path, strokeWidth, strokeOpacity, check) {
        if (ToolShape.GLOBAL.polylineTemp != null) {
            ToolShape.GLOBAL.polylineTemp.setMap(null);
        }
        //if (ToolShape.GLOBAL.listDistance.listPolylineDistance != null) {
        //    ToolShape.GLOBAL.listDistance.listPolylineDistance.setMap(null);
        //}
        //tạo đối tượng polyline từ PolylineOptions
        var polylineDistance = new map4d.Polyline({
            path: path, visible: true, strokeColor: "#FF8264", strokeWidth: strokeWidth, strokeOpacity: strokeOpacity,
            closed: false
        })
        //thêm polyline vào map
        polylineDistance.setMap(map);
        if (check) {
            ToolShape.GLOBAL.listDistance.listPolylineDistance.push(polylineDistance)
        } else {
            ToolShape.GLOBAL.listArea.PolylineArea = polylineDistance;
        }
    },
    //Tạo polygon lo dat
    createPolygonArea: function (data) {
        //if (objectModel != null) {
        //    objectModel.setMap(null);
        //}
        //if (markerLoDat != null) {
        //    markerLoDat.setMap(null);
        //}
        if (ToolShape.GLOBAL.listArea.polygonArea != null) {
            ToolShape.GLOBAL.listArea.polygonArea.setMap(null);
        }
        //if (ToolShape.GLOBAL.listDistance.listPolylineDistance != null) {
        //    ToolShape.GLOBAL.listDistance.listPolylineDistance.setMap(null);
        //}
        if (ToolShape.GLOBAL.polylineTemp != null) {
            ToolShape.GLOBAL.polylineTemp.setMap(null);
        }

        let polygonOption = map4d.PolygonOptions = {
            paths: [data], fillOpacity: 0.5
        }

        ToolShape.GLOBAL.listArea.polygonArea = new map4d.Polygon(polygonOption)

        //thêm object vào map
        ToolShape.GLOBAL.listArea.polygonArea.setMap(map);
    },
    setShowHideDistance: function (check) {
        if (check) {
            $(ToolShape.SELECTORS.btnRuleDistance).addClass("btn-active");
            ToolShape.GLOBAL.isStartDistance = true;
        } else {
            $(ToolShape.SELECTORS.btnRuleDistance).removeClass("btn-active");
            ToolShape.GLOBAL.isStartDistance = false;
        }
    },
    setShowHideArea: function (check) {
        if (check) {
            $(ToolShape.SELECTORS.btnRuleArea).addClass("btn-active");
            ToolShape.GLOBAL.isStartArea = true;
        } else {
            $(ToolShape.SELECTORS.btnRuleArea).removeClass("btn-active");
            ToolShape.GLOBAL.isStartArea = false;
        }
    },
    splitStringDistance: function (str) {
        var list = str.split(' ');
        if (list.length > 0) {
            return Number(list[0]);
        }
        return 0;
    },
    replayRuleShape: function () {
        //replay distance
        let list = ToolShape.GLOBAL.listDistance;
        $.each(list.listMarkerDistance, function (i, obj) {
            obj.setMap(null);
            if (typeof list.listMerterDistance[i] != undefined && list.listMerterDistance[i] != null) {
                list.listMerterDistance[i].setMap(null);
            }
            if (typeof list.listPolylineDistance[i] != undefined && list.listPolylineDistance[i] != null) {
                list.listPolylineDistance[i].setMap(null);
            }
        });
        list.listMarkerDistance = [];
        list.listMerterDistance = [];
        list.listPolylineDistance = [];
        isStartDistance = false;
        ToolShape.setShowHideDistance(false);
        //replay area
        let listarea = ToolShape.GLOBAL.listArea;
        $.each(listarea.listMerterArea, function (i, obj) {
            obj.setMap(null);
            if (typeof listarea.listMarkerArea[i] != undefined && listarea.listMarkerArea[i] != null) {
                listarea.listMarkerArea[i].setMap(null);
            }
        });
        if (listarea.polygonArea != null) listarea.polygonArea.setMap(null);
        listarea.listMarkerArea = [];
        listarea.listMerterArea = [];
        listarea.polygonArea = null;
        isStartArea = false;
        ToolShape.setShowHideArea(false);
    },
    // calculator area polygon
    calculatorAraePolygon: function (latng) {
        let arrayLatLng = [];
        let latlng;
        $.each(latng, function (i, obj) {
            latlng = [obj.lng, obj.lat];
            arrayLatLng.push(latlng);
        })
        let measure = new map4d.Measure(arrayLatLng)
        return measure.area;
    },
}