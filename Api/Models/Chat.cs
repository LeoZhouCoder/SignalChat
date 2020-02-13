using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using Api.Contracts;

namespace Api.Models
{
    public class Chat : IMongoCommon
    {
        public Guid UId { get; set; }
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Uid { get; set; }
        public string Gid { get; set; }
        public int Type { get; set; }
        public string Content { get; set; }
        public DateTime CreatedOn { get; set; }
        public bool IsDeleted { get; set; }
    }

    public enum ChatType { System = 0, Message, Image }
}
