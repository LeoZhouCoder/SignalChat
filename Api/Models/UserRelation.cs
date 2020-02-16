using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using Api.Contracts;

namespace Api.Models
{
    public class UserRelation : IMongoCommon
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Owner { get; set; }
        public string Target { get; set; }
        public int Type { get; set; }
        // The last read chat ID
        public string ReadChatID { get; set; }
        public bool IsDeleted { get; set; }
    }
    public enum UserRelationType { Friend = 0 }
}
