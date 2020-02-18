namespace Api.Models
{
    public class MessageRequest
    {
        public ChatType Type { get; set; }
        public string Content { get; set; }
        public string Group { get; set; }
        public string Receiver { get; set; }
    }
}
