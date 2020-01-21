using Microsoft.AspNetCore.Mvc;
//using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;

namespace Api.Controllers
{
    public class HomeController : Controller
    {
        public HomeController() {}
        public IActionResult Get()
        {
            return Content("Hello from SignalChat Api");
        }

        /*[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IActionResult AuthorizeGet()
        {
            return Content("Hello from SignalChat Authorize Api");
        }*/
    }
}
