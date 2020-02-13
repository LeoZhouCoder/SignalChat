using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using Api.Contracts;

namespace Api.Models
{
    public class GroupUser : IMongoCommon
    {
        public Guid UId { get; set; }
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Gid { get; set; }
        public string Uid { get; set; }
        public int ReadChats { get; set; }
        public bool IsDeleted { get; set; }
    }
}
