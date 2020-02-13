using System.Collections.Generic;

namespace Api.Models
{
    public class ChatGroupView
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public Chat LastChat { get; set; }
        public List<string> Users {get;set;}
    }
}
