using System.Collections.Generic;

namespace Api.Models
{
    public class CreateGroupRequest
    {
        public string Name { get; set; }
        public List<string> Users { get; set; }
    }
}
