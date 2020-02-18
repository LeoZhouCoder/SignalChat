namespace Api.Models
{
    public class ChatRequest
    {
        public ChatRequestType Type { get; set; }
        public object Data { get; set; }
    }

    public enum ChatRequestType 
    { 
        Message = 0, 
        CreateGroup, 
        ChangeGroupName, 
        AddUserToGroup, 
        RemoveUserFromGroup,
        GetUserProfile
    }
}
