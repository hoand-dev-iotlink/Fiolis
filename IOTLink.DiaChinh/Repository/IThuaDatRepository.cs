using IOTLink.DiaChinh.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace IOTLink.DiaChinh.Repository
{
    public interface IThuaDatRepository
    {
        List<ThuaDat> GetThuaDat();
    }
}
