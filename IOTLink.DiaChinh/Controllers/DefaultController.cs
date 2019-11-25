using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IOTLink.DiaChinh.DatabaseContext;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;


namespace IOTLink.DiaChinh.Controllers
{
    public class DefaultController : Controller
    {
        private Context context;

        public DefaultController()
        {
            context = new Context();
        }
        public IActionResult Index()
        {
            
            return View();
        }
    }
}