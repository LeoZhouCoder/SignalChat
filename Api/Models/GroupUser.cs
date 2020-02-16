using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using Api.Contracts;

namespace Api.Models
{
    public class GroupUser : IMongoCommon
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Gid { get; set; }
        public string Uid { get; set; }
        // The last read chat ID
        public string ReadChatID { get; set; }
        public bool IsDeleted { get; set; }
    }
}
