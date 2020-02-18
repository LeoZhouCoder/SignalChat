using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using Api.Contracts;

namespace Api.Models
{
    public class Chat : IMongoCommon
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Sender { get; set; }
        public string Gid { get; set; }
        public string Receiver { get; set; }
        public ChatType Type { get; set; }
        public string Content { get; set; }
        public DateTime CreatedOn { get; set; }
        public bool IsDeleted { get; set; }
    }

    public enum ChatType { System = 0, Message, Image }
}
