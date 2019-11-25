using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IOTLink.DiaChinh.Models
{
    public class AllMucDichSuDungModel
    {
        [JsonProperty("code")]
        public string code { get; set; }

        [JsonProperty("result")]
        public List<Result> result { get; set; }

        public class Result
        {
            [JsonProperty("fill")]
            public string Fill { get; set; }

            [JsonProperty("fill-opacity")]
            public int FillOpacity { get; set; }

            [JsonProperty("stroke")]
            public string Stroke { get; set; }

            [JsonProperty("stroke-width")]
            public int StrokeWidth { get; set; }

            [JsonProperty("stroke-opacity")]
            public int StrokeOpacity { get; set; }

            [JsonProperty("description")]
            public string Description { get; set; }

            [JsonProperty("name")]
            public string Name { get; set; }

            [JsonProperty("mucDichSuDung")]
            public string MucDichSuDung { get; set; }

            [JsonProperty("line-style")]
            public string LineStyle { get; set; }
        }
    }
}
