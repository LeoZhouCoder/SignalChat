namespace Api.Models
{
    public class GetUserChatsRequest
    {
        public string User { get; set; }
        public int Position { get; set; }
        public int Limit { get; set; }
    }
}
