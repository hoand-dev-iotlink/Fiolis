using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using IOTLink.DiaChinh.Models;
using IOTLink.DiaChinh.Sevice;
using IOTLink.DiaChinh.Models.ViewModels;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using Newtonsoft.Json;
using System.Net.Http;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace IOTLink.DiaChinh.Controllers
{
    public class HomeController : Controller
    {
        private GdalUtilities gdalUtilities = new GdalUtilities();
        private IHostingEnvironment _hostingEnvironment;
        public HomeController(IHostingEnvironment environment)
        {
            _hostingEnvironment = environment;
        }
        public async Task<IActionResult> Index()
        {
            var a = await GetList();
            ViewBag.listofitem = a.Select(x => new SelectListItem { Value = x.MucDichSuDung, Text = x.Name }).ToList();
            return View();
        }

        private async Task<List<AllMucDichSuDungModel.Result>> GetList()
        {
            List<AllMucDichSuDungModel.Result> results = new List<AllMucDichSuDungModel.Result>();
            try
            {
                var endpoint = "https://api-fiolis.map4d.vn";
                var uri = "/v2/api/land/all-muc-dich-su-dung?key=8bd33b7fd36d68baa96bf446c84011da";
                using (var client = new HttpClient())
                {
                    client.BaseAddress = new Uri(endpoint);
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    HttpResponseMessage response = new HttpResponseMessage();
                    response = await client.GetAsync(uri).ConfigureAwait(false);
                    if (response.IsSuccessStatusCode)
                    {
                        var result = await response.Content.ReadAsStringAsync();
                        AllMucDichSuDungModel pointstart1 = JsonConvert.DeserializeObject<AllMucDichSuDungModel>(result);

                        if (pointstart1 != null && pointstart1.result.Count > 0)
                        {
                            return pointstart1.result;
                        }
                    }
                }
                return results;
            }
            catch
            {
                return results;
            }
        }

        [HttpPost]
        public IActionResult ExportFileShape([FromBody] ExportFileViewModel exportFile)
        {
            try
            {
                string IdGui = Guid.NewGuid().ToString();
                string filePath = Path.Combine(_hostingEnvironment.WebRootPath + "\\Document", "ThuaDat_"+ IdGui + ".json");
                System.IO.File.WriteAllText(filePath, exportFile.shapeJson);
                bool check = false;
                if (exportFile.category=="SHP")
                {
                    string filePathShape = Path.Combine(_hostingEnvironment.WebRootPath + "\\Document\\ShapeFile", "ThuaDat_" + IdGui + ".shp");
                    string filePathZip = Path.Combine(_hostingEnvironment.WebRootPath + "\\Document\\ShapeFile", "ThuaDat_" + IdGui + ".zip");
                    check= gdalUtilities.convertJsonToShapeFile(filePath, filePathShape);
                    if (check)
                    {
                        string filesPathName = filePathShape.Substring(0, filePathShape.Length - 4);
                        gdalUtilities.removeShapeFileIfExists(filesPathName);
                        return Json(new {code="ok",result= "ThuaDat_" + IdGui + ".zip" });
                    }
                }
                if(exportFile.category == "KML")
                {
                    string filePathKML = Path.Combine(_hostingEnvironment.WebRootPath + "\\Document\\KML", "ThuaDat_" + IdGui + ".KML");
                    dynamic json = JsonConvert.DeserializeObject(exportFile.shapeJson);
                    check = gdalUtilities.ConvertJsonToKML(json, filePathKML);
                    if (check)
                    {
                        if (System.IO.File.Exists(filePathKML))
                        {
                            System.IO.File.Delete(filePathKML);
                        }
                    }
                    return Json(new { code = "ok", result = "ThuaDat_" + IdGui + ".zip" });
                }
                
                return Json(true);
            }
            catch (Exception ex)
            {
                return Json(new { code = "fail", result = ex.Message.ToString() });
                throw;
            }
            
        }
        public IActionResult DownloadFile(string filePath,string type)
        {
            try
            {
                if (type =="SHP")
                {
                    string filePathZip = Path.Combine(_hostingEnvironment.WebRootPath + "\\Document\\ShapeFile", filePath);
                    byte[] finalResult = System.IO.File.ReadAllBytes(filePathZip);
                    //if (System.IO.File.Exists(filePathZip))
                    //{
                    //    System.IO.File.Delete(filePathZip);
                    //}
                    return File(finalResult, "application/zip", Path.GetFileName(filePathZip));
                }
                if (type== "KML")
                {
                    string filePathZip = Path.Combine(_hostingEnvironment.WebRootPath + "\\Document\\KML", filePath);
                    byte[] finalResult = System.IO.File.ReadAllBytes(filePathZip);
                    //if (System.IO.File.Exists(filePathZip))
                    //{
                    //    System.IO.File.Delete(filePathZip);
                    //}
                    return File(finalResult, "application/zip", Path.GetFileName(filePathZip));
                }
                byte[] s1 = new byte[] { };
                return File(s1, "application/zip", filePath);
            }
            catch (Exception ex)
            {
                byte[] s = new byte[] { };
                return File(s, "application/zip", filePath);
            }
            
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
