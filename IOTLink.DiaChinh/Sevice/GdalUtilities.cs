using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Xml;
using Ionic.Zip;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OSGeo.OGR;
using OSGeo.OSR;

namespace IOTLink.DiaChinh.Sevice
{
    public class GdalUtilities
    {
        public GdalUtilities()
        {
            GdalConfiguration.ConfigureGdal();
            GdalConfiguration.ConfigureOgr();
        }

        public bool convertJsonToShapeFile(string jsonFilePath, string shapeFilePath)
        {

            Driver jsonFileDriver = Ogr.GetDriverByName("GeoJSON");
            DataSource jsonFile = Ogr.Open(jsonFilePath, 0);
            if (jsonFile == null)
            {
                return false;
            }

            string filesPathName = shapeFilePath.Substring(0, shapeFilePath.Length - 4);
            removeShapeFileIfExists(filesPathName);

            Layer jsonLayer = jsonFile.GetLayerByIndex(0);

            Driver esriShapeFileDriver = Ogr.GetDriverByName("ESRI Shapefile");

            DataSource shapeFile = esriShapeFileDriver.CreateDataSource(shapeFilePath, new string[] { });
            Layer shplayer = shapeFile.CreateLayer(jsonLayer.GetName(), jsonLayer.GetSpatialRef(), jsonLayer.GetGeomType(), new string[] { });

            // create fields (properties) in new layer
            Feature jsonFeature = jsonLayer.GetNextFeature();
            for (int i = 0; i < jsonFeature.GetFieldCount(); i++)
            {
                FieldDefn fieldDefn = new FieldDefn(getValidFieldName(jsonFeature.GetFieldDefnRef(i)), jsonFeature.GetFieldDefnRef(i).GetFieldType());
                shplayer.CreateField(fieldDefn, 1);
            }

            while (jsonFeature != null)
            {
                Geometry geometry = jsonFeature.GetGeometryRef();
                Feature shpFeature = createGeometryFromGeometry(geometry, shplayer, jsonLayer.GetSpatialRef());

                // copy values for each field
                for (int i = 0; i < jsonFeature.GetFieldCount(); i++)
                {
                    if (FieldType.OFTInteger == jsonFeature.GetFieldDefnRef(i).GetFieldType())
                    {
                        shpFeature.SetField(getValidFieldName(jsonFeature.GetFieldDefnRef(i)), jsonFeature.GetFieldAsInteger(i));
                    }
                    else if (FieldType.OFTReal == jsonFeature.GetFieldDefnRef(i).GetFieldType())
                    {
                        shpFeature.SetField(getValidFieldName(jsonFeature.GetFieldDefnRef(i)), jsonFeature.GetFieldAsDouble(i));
                    }
                    else
                    {
                        shpFeature.SetField(getValidFieldName(jsonFeature.GetFieldDefnRef(i)), jsonFeature.GetFieldAsString(i));
                    }
                }
                shplayer.SetFeature(shpFeature);

                jsonFeature = jsonLayer.GetNextFeature();
            }
            shapeFile.Dispose();
            jsonFile.Dispose();
            // if you want to generate zip of generated files
            string zipName = filesPathName + ".zip";
            CompressToZipFile(new List<string>() { shapeFilePath, filesPathName + ".dbf", filesPathName + ".prj", filesPathName + ".shx" }, zipName);

            return true;
        }
        //public bool convertJsonToKML(string jsonFilePath, string kmlFilePath)
        //{
        //    Driver jsonFileDriver = Ogr.GetDriverByName("GeoJSON");
        //    DataSource jsonFile = Ogr.Open(jsonFilePath, 0);
        //    if (jsonFile == null)
        //    {
        //        return false;
        //    }

        //    string filesPathName = kmlFilePath.Substring(0, kmlFilePath.Length - 4);
        //    removeFileIfExists(kmlFilePath);

        //    Layer jsonLayer = jsonFile.GetLayerByIndex(0);

        //    Driver esriShapeFileDriver = Ogr.GetDriverByName("KML");

        //    DataSource kmlFile = esriShapeFileDriver.CreateDataSource(kmlFilePath, new string[] { });
        //    Layer shplayer = kmlFile.CreateLayer(jsonLayer.GetName(), jsonLayer.GetSpatialRef(), jsonLayer.GetGeomType(), new string[] { });

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
        //    kmlFile.Dispose();

        //    // if you want to generate zip of generated files
        //    //string zipName = filesPathName + ".zip";
        //    //CompressToZipFile(new List<string>() { shapeFilePath, filesPathName + ".dbf", filesPathName + ".prj", filesPathName + ".shx" }, zipName);

        //    return true;
        //}

        public bool ConvertJsonToKML(dynamic json, string kmlFilePath)
        {
            try
            {
                var features = json.features;
                XmlWriterSettings settings = new XmlWriterSettings();
                settings.Indent = true;
                using (XmlWriter writer = XmlWriter.Create(kmlFilePath, settings))
                {
                    writer.WriteStartDocument();
                    //kml
                    writer.WriteStartElement("kml");
                    writer.WriteAttributeString("Company", "IOTLINK");
                    //Document
                    writer.WriteStartElement("Document");
                    foreach (var item in features)
                    {
                        //Placemark
                        writer.WriteStartElement("Placemark");
                        //ExtendedData
                        writer.WriteStartElement("ExtendedData");
                        foreach (var key in item["properties"])
                        {
                            var name = Convert.ToString(key.Name);
                            var value = Convert.ToString(key.Value);
                            if (!string.IsNullOrEmpty(name))
                            {
                                //Data
                                writer.WriteStartElement("Data");
                                writer.WriteAttributeString("name", name);
                                    //Value
                                    writer.WriteStartElement("value");
                                    writer.WriteString(value);
                                    writer.WriteEndElement();//End Value
                                writer.WriteEndElement();// End Data
                            }
                        }
                        writer.WriteEndElement();// End ExtendedData
                        //MultiGeometry
                        writer.WriteStartElement("MultiGeometry");
                            //polygon
                            writer.WriteStartElement("Polygon");
                            var coordinates = item["geometry"];
                            List<string> list= ConvertCoordinates(coordinates);
                            for (int i = 0; i < list.Count(); i++)
                            {
                                if (i==0)writer.WriteStartElement("outerBoundaryIs");
                                else writer.WriteStartElement("innerBoundaryIs");
                                        writer.WriteStartElement("LinearRing");
                                            writer.WriteStartElement("coordinates");
                                            writer.WriteString(list[i]);
                                            writer.WriteEndElement();// End coordinates
                                        writer.WriteEndElement();// End LinearRing
                                    writer.WriteEndElement();// End outerBoundaryIs
                            }
                            writer.WriteEndElement();// End polygon
                        writer.WriteEndElement();// End MultiGeometry
                        writer.WriteEndElement();// End Placemark
                    }
                    writer.WriteEndElement();// End Document
                    writer.WriteEndElement();// End kml
                    writer.WriteEndDocument();
                    writer.Flush();
                }
                string filesPathName = kmlFilePath.Substring(0, kmlFilePath.Length - 4);
                // if you want to generate zip of generated files
                string zipName = filesPathName + ".zip";
                CompressToZipFile(new List<string>() { kmlFilePath }, zipName);
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        private List<string> ConvertCoordinates(dynamic geometryDy)
        {
            List<string> list = new List<string>();
            string str = "";
            var geometry = (JObject)geometryDy;
            if (geometry["type"].ToString() == "LineString")
            {
                for (int j = 0; j < geometry["coordinates"].Count(); j++)
                {
                    str += (j == 0) ? String.Format("{0},{1}", geometry["coordinates"][j][0], geometry["coordinates"][j][1]) : String.Format(" {0},{1}", geometry["coordinates"][j][0], geometry["coordinates"][j][1]);
                }
                list.Add(str);
                return list;
            }
            else if (geometry["type"].ToString() == "Polygon")
            {
                str = "";
                for (int j = 0; j < geometry["coordinates"].Count(); j++)
                {
                    for (int k = 0; k < geometry["coordinates"][j].Count(); k++)
                    {
                        //geometry["coordinates"][j][k][1] = bl[0];
                        //geometry["coordinates"][j][k][0] = bl[1];
                        str += (k == 0) ? String.Format("{0},{1}", geometry["coordinates"][j][k][0], geometry["coordinates"][j][k][1]) : String.Format(" {0},{1}", geometry["coordinates"][j][k][0], geometry["coordinates"][j][k][1]);
                    }
                    list.Add(str);
                }
                return list;
            }
            else if (geometry["type"].ToString() == "MultiPolygon")
            {
                for (int j = 0; j < geometry["coordinates"].Count(); j++)
                {
                    
                    for (int k = 0; k < geometry["coordinates"][j].Count(); k++)
                    {
                        str = "";
                        for (int l = 0; l < geometry["coordinates"][j][k].Count(); l++)
                        {
                            //double[] bl = MapTool.Coordinate.xyvn2000_2_blwgs84((double)geometry["coordinates"][j][k][l][1], (double)geometry["coordinates"][j][k][l][0], pdo, pphut, Convert.ToInt16(zone));

                            //geometry["coordinates"][j][k][l][1] = bl[0];
                            //geometry["coordinates"][j][k][l][0] = bl[1];
                            str += (l == 0) ? String.Format("{0},{1}", geometry["coordinates"][j][k][l][0], geometry["coordinates"][j][k][l][1]) : String.Format(" {0},{1}", geometry["coordinates"][j][k][l][0], geometry["coordinates"][j][k][l][1]);
                        }
                        list.Add(str);
                    }
                }
                return list;
            }
            return list;
        }

        public void removeShapeFileIfExists(string filesPathName)
        {
            removeFileIfExists(filesPathName + ".shp");
            removeFileIfExists(filesPathName + ".shx");
            removeFileIfExists(filesPathName + ".prj");
            removeFileIfExists(filesPathName + ".dbf");
        }

        public static bool removeFileIfExists(string filePath)
        {
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
                return true;
            }
            return false;
        }

        // the field names in shapefile have limit of 10 characteres
        private string getValidFieldName(FieldDefn fieldDefn)
        {
            string fieldName = fieldDefn.GetName();
            return fieldName.Length > 10 ? fieldName.Substring(0, 10) : fieldName;
        }

        private Feature createGeometryFromGeometry(Geometry geometry, Layer layer, SpatialReference reference)
        {
            Feature feature = new Feature(layer.GetLayerDefn());

            string wktgeometry = "";
            geometry.ExportToWkt(out wktgeometry);
            Geometry newGeometry = Geometry.CreateFromWkt(wktgeometry);
            newGeometry.AssignSpatialReference(reference);
            //newGeometry.SetPoint(0, geometry.GetX(0), geometry.GetY(0), 0);
            //newGeometry.se
            newGeometry.AddGeometry(geometry);
            feature.SetGeometry(newGeometry);
            layer.CreateFeature(feature);

            return feature;
        }

        public static void CompressToZipFile(List<string> files, string zipPath)
        {
            using (ZipFile zip = new ZipFile())
            {
                foreach (string file in files)
                {
                    zip.AddFile(file, "");
                }
                zip.Save(zipPath);
            }
        }

        // Layer shplayer = shapeFile.CreateLayer("name", convertWgs84ToSirgas2000UtmZone24(), wkbGeometryType.wkbPoint, new string[] { });
        public double[] convertWgs84ToSirgas2000UtmZone24(double x, double y)
        {
            SpatialReference currentReference = getWgs84Reference();
            SpatialReference newReference = getSirgas2000UtmZone24ReferenceInCentimeters();

            CoordinateTransformation ct = new CoordinateTransformation(currentReference, newReference);
            double[] point = new double[2] { x, y };
            ct.TransformPoint(point);

            return point;
        }

        public static SpatialReference getSirgas2000UtmZone24ReferenceInCentimeters()
        {
            SpatialReference reference = new SpatialReference("");
            string ppszInput = "PROJCS[\"UTM_Zone_24_Southern_Hemisphere\",GEOGCS[\"GCS_GRS 1980(IUGG, 1980)\",DATUM[\"unknown\",SPHEROID[\"GRS80\",6378137,298.257222101]],PRIMEM[\"Greenwich\",0],UNIT[\"Degree\",0.017453292519943295]],PROJECTION[\"Transverse_Mercator\"],PARAMETER[\"latitude_of_origin\",0],PARAMETER[\"central_meridian\",-39],PARAMETER[\"scale_factor\",0.9996],PARAMETER[\"false_easting\",50000000],PARAMETER[\"false_northing\",1000000000],UNIT[\"Centimeter\",0.01]]";
            reference.ImportFromWkt(ref ppszInput);

            return reference;
        }

        public static SpatialReference getSirgas2000UtmZone24Reference()
        {
            SpatialReference reference = new SpatialReference("");
            string epsg_31984_sirgas_proj4 = @"+proj=utm +zone=24 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
            reference.ImportFromProj4(epsg_31984_sirgas_proj4);

            return reference;
        }

        public static SpatialReference getWgs84Reference()
        {
            string epsg_wgs1984_proj4 = @"+proj=latlong +datum=WGS84 +no_defs";
            SpatialReference reference = new SpatialReference("");
            reference.ImportFromProj4(epsg_wgs1984_proj4);

            return reference;
        }

        private List<double[]> readImageCoordinatesBoundsInLonLat(OSGeo.GDAL.Dataset imageDataset)
        {
            var band = imageDataset.GetRasterBand(1);
            if (band == null)
            {
                return null;
            }

            var width = band.XSize;
            var height = band.YSize;

            double[] geoTransformerData = new double[6];
            imageDataset.GetGeoTransform(geoTransformerData);


            SpatialReference currentReference = new SpatialReference(imageDataset.GetProjectionRef());
            SpatialReference newReference = GdalUtilities.getWgs84Reference();
            CoordinateTransformation ct = new CoordinateTransformation(currentReference, newReference);

            double[] northWestPoint = new double[2] { geoTransformerData[0], geoTransformerData[3] };
            ct.TransformPoint(northWestPoint);

            double[] southEastPoint = new double[2] {
                geoTransformerData[0] + geoTransformerData[1] * width,
                geoTransformerData[3] + geoTransformerData[5] * height
            };
            ct.TransformPoint(southEastPoint);


            return new List<double[]> { northWestPoint, southEastPoint };
        }
    }
}
