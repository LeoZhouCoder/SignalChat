using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using Api.Contracts;

namespace Api.Models
{
    public class OnlineUser : IMongoCommon
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Uid { get; set; }
        public string ConnectionId { get; set; }
        public DateTime ActiveTime { get; set; }
        public bool IsDeleted { get; set; }
    }
}
