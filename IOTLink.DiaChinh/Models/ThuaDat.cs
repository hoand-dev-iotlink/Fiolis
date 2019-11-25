using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IOTLink.DiaChinh.Models
{
    public class ThuaDat
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string Id { get; set; }
        public string thuaDatID { get; set; }
        public string maXa { get; set; }
        public int soHieuToBanDo { get; set; }
        public int soThuTuThua { get; set; }

        public int trangThaiDangKy { get; set; }
        public double dienTich { get; set; }
        public string loaiDat { get; set; }
        public string geo { get; set; }
    }
}
