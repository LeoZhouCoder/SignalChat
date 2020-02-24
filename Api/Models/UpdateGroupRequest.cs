using System.Collections.Generic;
namespace Api.Models
{
    public class UpdateGroupRequest
    {
        public string Group { get; set; }
        public string Name { get; set; }
        public List<string> Users { get; set; }
    }
}
