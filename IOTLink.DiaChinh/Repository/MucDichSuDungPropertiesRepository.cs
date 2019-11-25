using IOTLink.DiaChinh.DatabaseContext;
using IOTLink.DiaChinh.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;

namespace IOTLink.DiaChinh.Repository
{
    public class MucDichSuDungPropertiesRepository : IMucDichSuDungPropertiesRepository
    {
        private readonly Context context;

        public MucDichSuDungPropertiesRepository()
        {
            context = new Context();
        }

        public List<MucDichSuDungProperties> GetAllProperties()
        {
            try
            {
                var list = context.MucDichSuDungPropertie.Find(_ => true).ToList();
                return list;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
