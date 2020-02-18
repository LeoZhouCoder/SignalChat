namespace Api.Models
{
    public class ChatResponse
    {
        public ChatResponseType Type { get; set; }
        public object Data { get; set; }
    }

    public enum ChatResponseType 
    { 
        SystemMessage = 0, 
        SystemErrorMessage,
        UpdateRecentChatRecord,
        UpdateOnlineUsers,
        UpdateGroup,
        DeleteGroup,
        AddFriend,
        DeleteFriend,
        UpdateUserProfile,
        ChatMessage,
        UpdateGroupChats,
        UpdateUserChats,
    }
}