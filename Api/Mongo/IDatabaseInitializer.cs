using System.Threading.Tasks;

namespace Api.Mongo
{
    public interface IDatabaseInitializer
    {
        void Initialize();
    }
}
