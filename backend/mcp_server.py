from mcp.server.fastmcp import FastMCP
from market_intelligence.tools import MarketTools
import json
import os

# Initialize FastMCP server
mcp = FastMCP("MarketIntelligence")

@mcp.tool()
def search_market(query: str, max_results: int = 5) -> str:
    """Search the web for market intelligence data."""
    results = MarketTools.search_web(query, max_results)
    return json.dumps(results, indent=2)

@mcp.tool()
def scrape_competitor(url: str) -> str:
    """Scrape content from a competitor URL."""
    result = MarketTools.scrape_url(url)
    return json.dumps(result, indent=2)

@mcp.tool()
def finalize_report(report_json: str, filename: str | None = None) -> str:
    """
    Finalize and save the market report to a file.
    Takes a JSON string of the synthesized report.
    """
    try:
        report_data = json.loads(report_json)
        filepath = MarketTools.save_report(report_data, filename)
        return f"Report successfully saved to {filepath}"
    except Exception as e:
        return f"Error saving report: {e}"

if __name__ == "__main__":
    mcp.run()
