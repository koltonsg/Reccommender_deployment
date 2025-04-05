using CsvHelper;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;

public static class RecommendationService
{
    public static Dictionary<long, List<string>> GetRecommendationsFromCsv(string filePath)
    {
        var recommendations = new Dictionary<long, List<string>>();

        // Read the CSV file and parse the recommendations
        using (var reader = new StreamReader(filePath))
        using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
        {
            var records = csv.GetRecords<RecommendationRecord>().ToList();

            foreach (var record in records)
            {
                // Add the recommendation to the dictionary
                recommendations[record.ItemId] = new List<string>
                {
                    record.Recommendation1,
                    record.Recommendation2,
                    record.Recommendation3,
                    record.Recommendation4,
                    record.Recommendation5
                };
            }
        }

        return recommendations;
    }
}

// This is the structure of each CSV row
public class RecommendationRecord
{
    public long ItemId { get; set; }    // Use long for item IDs as they are large
    public string Recommendation1 { get; set; }
    public string Recommendation2 { get; set; }
    public string Recommendation3 { get; set; }
    public string Recommendation4 { get; set; }
    public string Recommendation5 { get; set; }
}