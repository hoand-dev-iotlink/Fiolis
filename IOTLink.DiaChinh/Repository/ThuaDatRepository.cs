using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IOTLink.DiaChinh.DatabaseContext;
using IOTLink.DiaChinh.Models;
using MongoDB.Driver;

namespace IOTLink.DiaChinh.Repository
{
    public class ThuaDatRepository : IThuaDatRepository
    {
        private readonly Context context;

        public ThuaDatRepository()
        {
            context = new Context();
        }
        public List<ThuaDat> GetThuaDat()
        {
            try
            {
                var list = context.ThuaDats.Find(_ => true).ToList();
                return list;
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}
