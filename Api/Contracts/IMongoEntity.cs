namespace Api.Contracts
{
    public interface IMongoEntity<TId>
    {
        TId Id { get; set; }
    }
}
