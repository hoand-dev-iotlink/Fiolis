using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using IOTLink.DiaChinh.DatabaseContext;
using IOTLink.DiaChinh.Models;
using IOTLink.DiaChinh.Repository;
using IOTLink.DiaChinh.Sevice;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.Internal;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using IOTLink.ConvertDataVilis;

namespace IOTLink.DiaChinh.Controllers
{
    public class QuanLyThuaDatController : Controller
    {
        private Context context;
        private IHostingEnvironment _hostingEnvironment;
        private IMucDichSuDungPropertiesRepository mucDichSuDungPropertiesRepository = new MucDichSuDungPropertiesRepository();
        private IThuaDatRepository thuaDatRepository = new ThuaDatRepository();
        private GdalUtilities gdalUtilities = new GdalUtilities();
        public QuanLyThuaDatController(IHostingEnvironment environment)
        {
            context = new Context();
            _hostingEnvironment = environment;
        }
        public IActionResult Index()
        {
            //ConvertJsonToShapeFile convertJsonToShapeFile = new ConvertJsonToShapeFile(_hostingEnvironment);
            //convertJsonToShapeFile.convertJson();

            string filePath = Path.Combine(_hostingEnvironment.WebRootPath + "\\Document", "ThuaDatVN2000.json");
            string filePathKML = Path.Combine(_hostingEnvironment.WebRootPath + "\\Document\\Shape", "ThuaDatGDAL.KML");
            string filePathShape = Path.Combine(_hostingEnvironment.WebRootPath + "\\Document\\Shape", "ThuaDatGDAL.shp");
            gdalUtilities.convertJsonToShapeFile(filePath, filePathShape);
            //gdalUtilities.convertJsonToKML(filePath, filePathKML);
            return View();
        }
        public IActionResult Viewtesst()
        {
            return View();
        }
        public IActionResult ConvertData()
        {
            string filePath = Path.Combine(_hostingEnvironment.WebRootPath + "\\Document", "ThuaDat.json");
            InsertFileAttachment(filePath);
            return View();
        }

        private void InsertFileAttachment(string filePath)
        {
            List<ThuaDat> listThuaDat = new List<ThuaDat>();
            var listmucdichsudung = mucDichSuDungPropertiesRepository.GetAllProperties();
            using (TextReader textReader = new StreamReader(filePath, System.Text.Encoding.Default) as TextReader)
            {
                string line;
                string KyHieuMucDichSuDung = "";
                int count = 0;
                while ((line = textReader.ReadLine()) != null)
                {
                    var result = line.Split(System.Environment.NewLine.ToCharArray())[0];

                    if (result.EndsWith(",", StringComparison.Ordinal))
                    {
                        result = result.Substring(0, result.LastIndexOf(",", StringComparison.Ordinal));
                    }

                    if (IsValidJson(result))//nếu là json
                    {
                        ThuaDat thuadat = new ThuaDat();
                        JObject jsonObject = JObject.Parse(result);
                        var geometry = (JObject)jsonObject["geometry"];
                        var properties = (JObject)jsonObject["properties"];
                        KyHieuMucDichSuDung = (properties["KyHieuMucDichSuDung"] != null && !string.IsNullOrWhiteSpace(properties["KyHieuMucDichSuDung"].ToString())) ? properties["KyHieuMucDichSuDung"].ToString() : "";
                        if (!string.IsNullOrEmpty(KyHieuMucDichSuDung))
                        {
                            var pro = listmucdichsudung.Where(x => x.KyHieuMucDichSuDung == KyHieuMucDichSuDung).FirstOrDefault();
                            if (pro != null)
                            {
                                JObject jsonPro = JObject.Parse(pro.properties);
                                properties["stroke"] = jsonPro["stroke"];
                                properties["fill"] = jsonPro["fill"];
                                properties["fill-opacity"] = jsonPro["fill-opacity"];
                                properties["stroke-width"] = jsonPro["stroke-width"];
                            }
                            thuadat.thuaDatID = properties["id"].ToString();
                            thuadat.loaiDat = properties["KyHieuMucDichSuDung"].ToString();
                            thuadat.maXa = properties["MaXa"].ToString();
                            thuadat.soHieuToBanDo = Convert.ToInt16(properties["SoHieuToBanDo"].ToString());
                            thuadat.soThuTuThua = Convert.ToInt16(properties["SoThuTuThua"].ToString());
                            thuadat.dienTich = Convert.ToDouble(properties["DienTich"].ToString());
                            thuadat.geo = jsonObject.ToString(Formatting.None);
                            count++;
                            listThuaDat.Add(thuadat);
                            if (listThuaDat.Count() ==10)
                            {
                                count = 0;
                                context.ThuaDats.InsertMany(listThuaDat);
                                listThuaDat = new List<ThuaDat>();
                            }
                        }
                    }
                }
                if (listThuaDat.Count() > 0)
                {
                    context.ThuaDats.InsertMany(listThuaDat);
                }
            }
        }

        private static bool IsValidJson(string strInput)
        {
            strInput = strInput.Trim();
            if ((strInput.StartsWith("{") && strInput.EndsWith("}")) || //For object
                (strInput.StartsWith("[") && strInput.EndsWith("]"))) //For array
            {
                try
                {
                    var obj = JToken.Parse(strInput);
                    return true;
                }
                catch (JsonReaderException jex)
                {
                    //Exception in parsing json
                    Console.WriteLine(jex.Message);
                    return false;
                }
                catch (Exception ex) //some other exception
                {
                    Console.WriteLine(ex.ToString());
                    return false;
                }
            }
            else
            {
                return false;
            }
        }

        [HttpGet]
        public IActionResult GetDataColor()
        {
            var posts = context.MucDichSuDungPropertie.Find(_ => true).ToList();
            return Json(posts);
        }
        [HttpGet]
        public IActionResult GetThuaDat()
        {
            try
            {
                var list = thuaDatRepository.GetThuaDat();
                return Json(list);
            }
            catch (Exception)
            {
                throw;
            }
        }

    }
}