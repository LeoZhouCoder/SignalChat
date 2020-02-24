using System.Collections.Generic;
namespace Api.Models
{
    public class UpdateGroupResponse
    {
        public GroupView Group { get; set; }
        public List<string> DeletedUsers { get; set; }
    }
}
