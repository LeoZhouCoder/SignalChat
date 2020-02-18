namespace Api.Models
{
    public class GetGroupChatsRequest
    {
        public string Group { get; set; }
        public int Position { get; set; }
        public int Limit { get; set; }
    }
}
