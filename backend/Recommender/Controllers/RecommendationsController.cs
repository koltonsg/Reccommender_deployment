using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace RecommendationsAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecommendationsController : ControllerBase
    {
        private readonly string collaborativeModelPath = "collaborative_model.sav";
        private readonly string contentSimilarityMatrixPath = "content_similarity_matrix.sav";
        private readonly string azureEndpoint = "YOUR_AZURE_ENDPOINT";
        private readonly string azureApiKey = "YOUR_AZURE_API_KEY";

        [HttpGet("recommendations")]
        public IActionResult GetRecommendations(long itemId)
        {
            // Load collaborative recommendations (pickle file)
            var collaborativeRecs = GetCollaborativeRecommendations(itemId);

            // Load content-based recommendations (cosine similarity)
            var contentRecs = GetContentRecommendations(itemId);

            // Call Azure ML API for recommendations
            var azureRecs = GetAzureRecommendations(itemId);

            return Ok(new
            {
                collaborative = collaborativeRecs,
                content = contentRecs,
                azure = azureRecs
            });
        }

        private List<string> GetCollaborativeRecommendations(long itemId)
        {
            // Load collaborative model and generate recommendations (example, pseudo code)
            // Use a Python or ML.NET package to load the .sav file and generate predictions.
            return new List<string> { "Item 1", "Item 2", "Item 3" }; // Placeholder
        }

        private List<string> GetContentRecommendations(long itemId)
        {
            // Load content similarity matrix and return top similar items
            return new List<string> { "Item A", "Item B", "Item C" }; // Placeholder
        }

        private List<string> GetAzureRecommendations(long itemId)
        {
            // Call Azure ML endpoint and return recommendations
            var client = new HttpClient();
            var requestBody = new StringContent(JsonConvert.SerializeObject(new { itemId }), Encoding.UTF8, "application/json");
            var response = client.PostAsync(azureEndpoint, requestBody).Result;
            var jsonResponse = response.Content.ReadAsStringAsync().Result;
            var recommendations = JsonConvert.DeserializeObject<JObject>(jsonResponse)["recommendations"].ToObject<List<string>>();
            return recommendations;
        }
    }
}
