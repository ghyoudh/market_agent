from market_intelligence.tools import MarketTools
import json

def test():
    print("Testing Search...")
    search_results = MarketTools.search_web("top AI CRM competitors 2024", max_results=2)
    print(json.dumps(search_results, indent=2))
    
    if search_results:
        print("\nTesting Scrape...")
        scrape_result = MarketTools.scrape_url(search_results[0]['href'])
        print(f"Scraped Title: {scrape_result.get('title')}")
        print(f"Content Length: {len(scrape_result.get('content', ''))}")
        
    print("\nTesting Save Report...")
    mock_report = MarketTools.synthesize_to_json("Raw data here")
    filepath = MarketTools.save_report(mock_report, "test_report.json")
    print(f"Report saved to: {filepath}")

if __name__ == "__main__":
    test()
