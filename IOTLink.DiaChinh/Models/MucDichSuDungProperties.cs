using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IOTLink.DiaChinh.Models
{
    public class MucDichSuDungProperties
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; }
        public string KyHieuMucDichSuDung { get; set; }
        public string properties { get; set; }
    }
}
