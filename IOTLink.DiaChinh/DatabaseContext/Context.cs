using IOTLink.DiaChinh.Models;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IOTLink.DiaChinh.DatabaseContext
{
    public class Context
    {
        private readonly IMongoDatabase database;
        private IConfiguration configuration;
        public Context()
        {
            //database = new MongoClient(configuration.GetValue<string>("MongoConnection:ConnectionString")).GetDatabase(configuration.GetValue<string>("MongoConnection:Database"));
            database = new MongoClient("mongodb://localhost:27017").GetDatabase("DiaChinhDaNang");
        }

        public IMongoCollection<MucDichSuDungProperties> MucDichSuDungPropertie
        {
            get
            {
                return database.GetCollection<MucDichSuDungProperties>("MucDichSuDungProperties");
            }
        }
        public IMongoCollection<ThuaDat> ThuaDats
        {
            get
            {
                return database.GetCollection<ThuaDat>("ThuaDat");
            }
        }
    }
}
