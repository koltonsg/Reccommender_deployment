using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Recommender.Controllers
{
    [Route("/[controller]")]
    [ApiController]
    public class AzureController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;

        public AzureController(IHttpClientFactory httpClientFactory, IConfiguration config)
        {
            _httpClient = httpClientFactory.CreateClient();
            _config = config;
        }

        [HttpPost("call")]
        public async Task<IActionResult> CallAzure([FromBody] object payload)
        {
            var azureUrl = _config["AzureML:Url"];
            var azureKey = _config["AzureML:Key"];

            var request = new HttpRequestMessage(HttpMethod.Post, azureUrl);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", azureKey);
            request.Content = new StringContent(payload.ToString(), Encoding.UTF8, "application/json");

            var response = await _httpClient.SendAsync(request);

            var responseContent = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, responseContent);

            return Ok(JsonSerializer.Deserialize<object>(responseContent));
        }
    }
}
