using System.Collections.Generic;

namespace Api.Models
{
    public class GroupView
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public List<string> Users {get;set;}
        public List<Chat> Chats {get;set;}
    }
}
