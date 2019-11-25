using System.Collections.Generic;
using Ionic.Zip;
using System.IO;
using Aspose.Gis;
using Microsoft.AspNetCore.Hosting;
using Aspose.Gis.Rendering.Symbolizers;
using Aspose.Gis.Rendering;
//using OSGeo.GDAL;

namespace IOTLink.DiaChinh.Sevice
{
    public class ConvertJsonToShapeFile
    {
        private IHostingEnvironment _hostingEnvironment;
        public ConvertJsonToShapeFile(IHostingEnvironment environment)
        {
            _hostingEnvironment = environment;
        }
        public void convertJson()
        {
            string filePath = Path.Combine(_hostingEnvironment.WebRootPath + "\\Document", "ThuaDatVN2000.json");
            string filePathShape = Path.Combine(_hostingEnvironment.WebRootPath + "\\Document\\Shape", "ThuaDat.shp");
            string filePathKML = Path.Combine(_hostingEnvironment.WebRootPath + "\\Document\\Shape", "ThuaDat.KML");
            string filePathSVG = Path.Combine(_hostingEnvironment.WebRootPath + "\\Document\\Shape", "ThuaDat.SVG");
            string filePathBmp = Path.Combine(_hostingEnvironment.WebRootPath + "\\Document\\Shape", "ThuaDat.Bmp");
            string filePathPng = Path.Combine(_hostingEnvironment.WebRootPath + "\\Document\\Shape", "ThuaDat.Png");
            VectorLayer.Convert(filePath, Drivers.GeoJson, filePathShape, Drivers.Shapefile);
           VectorLayer.Convert(filePath, Drivers.GeoJson, filePathKML, Drivers.Kml);
            using (var map = new Map(800, 600))
            {
                var layer = VectorLayer.Open(filePath, Drivers.GeoJson);
                //var style = new SimpleFill { FillColor = Color.Azure, StrokeWidth = 1.5 };
                map.Add(layer);
                map.Render(filePathSVG, Renderers.Svg);
                map.Render(filePathPng, Renderers.Png);
                map.Render(filePathBmp, Renderers.Bmp);
            }
        }
        //public ConvertJsonToShapeFile()
        //{
        //    //GdalConfiguration.ConfigureGdal();
        //    //GdalConfiguration.ConfigureOgr();
        //}
        //public bool convertJsonToShapeFile(string jsonFilePath, string shapeFilePath)
        //{

        //    Driver jsonFileDriver = Ogr.GetDriverByName("GeoJSON");
        //    DataSource jsonFile = Ogr.Open(jsonFilePath, 0);
        //    if (jsonFile == null)
        //    {
        //        return false;
        //    }

        //    string filesPathName = shapeFilePath.Substring(0, shapeFilePath.Length - 4);
        //    removeShapeFileIfExists(filesPathName);

        //    Layer jsonLayer = jsonFile.GetLayerByIndex(0);

        //    Driver esriShapeFileDriver = Ogr.GetDriverByName("ESRI Shapefile");

        //    DataSource shapeFile = esriShapeFileDriver.CreateDataSource(shapeFilePath, new string[] { });
        //    Layer shplayer = shapeFile.CreateLayer(jsonLayer.GetName(), jsonLayer.GetSpatialRef(), jsonLayer.GetGeomType(), new string[] { });

        //    // create fields (properties) in new layer
        //    Feature jsonFeature = jsonLayer.GetNextFeature();
        //    for (int i = 0; i < jsonFeature.GetFieldCount(); i++)
        //    {
        //        FieldDefn fieldDefn = new FieldDefn(getValidFieldName(jsonFeature.GetFieldDefnRef(i)), jsonFeature.GetFieldDefnRef(i).GetFieldType());
        //        shplayer.CreateField(fieldDefn, 1);
        //    }

        //    while (jsonFeature != null)
        //    {
        //        Geometry geometry = jsonFeature.GetGeometryRef();
        //        Feature shpFeature = createGeometryFromGeometry(geometry, shplayer, jsonLayer.GetSpatialRef());

        //        // copy values for each field
        //        for (int i = 0; i < jsonFeature.GetFieldCount(); i++)
        //        {
        //            if (FieldType.OFTInteger == jsonFeature.GetFieldDefnRef(i).GetFieldType())
        //            {
        //                shpFeature.SetField(getValidFieldName(jsonFeature.GetFieldDefnRef(i)), jsonFeature.GetFieldAsInteger(i));
        //            }
        //            else if (FieldType.OFTReal == jsonFeature.GetFieldDefnRef(i).GetFieldType())
        //            {
        //                shpFeature.SetField(getValidFieldName(jsonFeature.GetFieldDefnRef(i)), jsonFeature.GetFieldAsDouble(i));
        //            }
        //            else
        //            {
        //                shpFeature.SetField(getValidFieldName(jsonFeature.GetFieldDefnRef(i)), jsonFeature.GetFieldAsString(i));
        //            }
        //        }
        //        shplayer.SetFeature(shpFeature);

        //        jsonFeature = jsonLayer.GetNextFeature();
        //    }
        //    shapeFile.Dispose();

        //    // if you want to generate zip of generated files
        //    string zipName = filesPathName + ".zip";
        //    CompressToZipFile(new List<string>() { shapeFilePath, filesPathName + ".dbf", filesPathName + ".prj", filesPathName + ".shx" }, zipName);

        //    return true;
        //}

        //private void removeShapeFileIfExists(string filesPathName)
        //{
        //    removeFileIfExists(filesPathName + ".shp");
        //    removeFileIfExists(filesPathName + ".shx");
        //    removeFileIfExists(filesPathName + ".prj");
        //    removeFileIfExists(filesPathName + ".zip");
        //}

        //public bool removeFileIfExists(string filePath)
        //{
        //    if (File.Exists(filePath))
        //    {
        //        File.Delete(filePath);
        //        return true;
        //    }
        //    return false;
        //}

        //// the field names in shapefile have limit of 10 characteres
        //private string getValidFieldName(FieldDefn fieldDefn)
        //{
        //    string fieldName = fieldDefn.GetName();
        //    return fieldName.Length > 10 ? fieldName.Substring(0, 10) : fieldName;
        //}

        //private Feature createGeometryFromGeometry(Geometry geometry, Layer layer, SpatialReference reference)
        //{
        //    Feature feature = new Feature(layer.GetLayerDefn());

        //    string wktgeometry = "";
        //    geometry.ExportToWkt(out wktgeometry);
        //    Geometry newGeometry = Geometry.CreateFromWkt(wktgeometry);
        //    newGeometry.AssignSpatialReference(reference);
        //    newGeometry.SetPoint(0, geometry.GetX(0), geometry.GetY(0), 0);

        //    feature.SetGeometry(newGeometry);
        //    layer.CreateFeature(feature);

        //    return feature;
        //}

        //public void CompressToZipFile(List<string> files, string zipPath)
        //{
        //    using (ZipFile zip = new ZipFile())
        //    {
        //        foreach (string file in files)
        //        {
        //            zip.AddFile(file, "");
        //        }
        //        zip.Save(zipPath);
        //    }
        //}

        //// Layer shplayer = shapeFile.CreateLayer("name", convertWgs84ToSirgas2000UtmZone24(), wkbGeometryType.wkbPoint, new string[] { });
        //public double[] convertWgs84ToSirgas2000UtmZone24(double x, double y)
        //{
        //    SpatialReference currentReference = getWgs84Reference();
        //    SpatialReference newReference = getSirgas2000UtmZone24ReferenceInCentimeters();

        //    CoordinateTransformation ct = new CoordinateTransformation(currentReference, newReference);
        //    double[] point = new double[2] { x, y };
        //    ct.TransformPoint(point);

        //    return point;
        //}

        //public SpatialReference getSirgas2000UtmZone24ReferenceInCentimeters()
        //{
        //    SpatialReference reference = new SpatialReference("");
        //    string ppszInput = "PROJCS[\"UTM_Zone_24_Southern_Hemisphere\",GEOGCS[\"GCS_GRS 1980(IUGG, 1980)\",DATUM[\"unknown\",SPHEROID[\"GRS80\",6378137,298.257222101]],PRIMEM[\"Greenwich\",0],UNIT[\"Degree\",0.017453292519943295]],PROJECTION[\"Transverse_Mercator\"],PARAMETER[\"latitude_of_origin\",0],PARAMETER[\"central_meridian\",-39],PARAMETER[\"scale_factor\",0.9996],PARAMETER[\"false_easting\",50000000],PARAMETER[\"false_northing\",1000000000],UNIT[\"Centimeter\",0.01]]";
        //    reference.ImportFromWkt(ref ppszInput);

        //    return reference;
        //}

        //public SpatialReference getSirgas2000UtmZone24Reference()
        //{
        //    SpatialReference reference = new SpatialReference("");
        //    string epsg_31984_sirgas_proj4 = @"+proj=utm +zone=24 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
        //    reference.ImportFromProj4(epsg_31984_sirgas_proj4);

        //    return reference;
        //}

        //public SpatialReference getWgs84Reference()
        //{
        //    string epsg_wgs1984_proj4 = @"+proj=latlong +datum=WGS84 +no_defs";
        //    SpatialReference reference = new SpatialReference("");
        //    reference.ImportFromProj4(epsg_wgs1984_proj4);

        //    return reference;
        //}

        //private List<double[]> readImageCoordinatesBoundsInLonLat(Dataset imageDataset)
        //{
        //    var band = imageDataset.GetRasterBand(1);
        //    if (band == null)
        //    {
        //        return null;
        //    }

        //    var width = band.XSize;
        //    var height = band.YSize;

        //    double[] geoTransformerData = new double[6];
        //    imageDataset.GetGeoTransform(geoTransformerData);


        //    SpatialReference currentReference = new SpatialReference(imageDataset.GetProjectionRef());
        //    SpatialReference newReference = getWgs84Reference();
        //    CoordinateTransformation ct = new CoordinateTransformation(currentReference, newReference);

        //    double[] northWestPoint = new double[2] { geoTransformerData[0], geoTransformerData[3] };
        //    ct.TransformPoint(northWestPoint);

        //    double[] southEastPoint = new double[2] {
        //        geoTransformerData[0] + geoTransformerData[1] * width,
        //        geoTransformerData[3] + geoTransformerData[5] * height
        //    };
        //    ct.TransformPoint(southEastPoint);


        //    return new List<double[]> { northWestPoint, southEastPoint };
        //}

    }
}
