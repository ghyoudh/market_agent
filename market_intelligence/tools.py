import json
import os
from typing import List, Dict, Any, Optional
from duckduckgo_search import DDGS
import trafilatura
import httpx
from datetime import datetime

class MarketTools:
    """Separated tools for market intelligence."""

    @staticmethod
    def search_web(query: str, max_results: int = 5) -> List[Dict[str, str]]:
        """Search the live web for competitors, pricing, and news."""
        print(f"Searching for: {query}")
        results = []
        try:
            with DDGS() as ddgs:
                ddgs_gen = ddgs.text(query, max_results=max_results)
                for r in ddgs_gen:
                    results.append({
                        "title": r.get("title", ""),
                        "href": r.get("href", ""),
                        "body": r.get("body", "")
                    })
        except Exception as e:
            print(f"Search error: {e}")
        return results

    @staticmethod
    def scrape_url(url: str) -> Dict[str, Any]:
        """Extract full text/markdown from a specific URL, ignoring ads and nav-bars."""
        print(f"Scraping URL: {url}")
        try:
            downloaded = trafilatura.fetch_url(url)
            if not downloaded:
                return {"error": "Could not fetch URL", "url": url}
            
            # Extract content as markdown
            content = trafilatura.extract(downloaded, include_links=True, output_format="markdown")
            metadata = trafilatura.extract_metadata(downloaded)
            
            return {
                "url": url,
                "content": content or "No content extracted",
                "title": metadata.title if metadata else "Unknown Title",
                "author": metadata.author if metadata else "Unknown",
                "date": metadata.date if metadata else "Unknown"
            }
        except Exception as e:
            return {"error": str(e), "url": url}

    @staticmethod
    def save_report(report_data: Dict[str, Any], filename: Optional[str] = None) -> str:
        """Save the synthesized report to a JSON file automatically."""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"report_{timestamp}.json"
        
        # Ensure directory exists
        if not os.path.exists("reports"):
            os.makedirs("reports")
            
        filepath = os.path.join("reports", filename)
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(report_data, f, ensure_ascii=False, indent=4)
        
        print(f"Report saved to: {filepath}")
        return filepath

    @staticmethod
    def synthesize_to_json(raw_data: str) -> Dict[str, Any]:
        """
        Synthesize raw text into the structured format requested.
        Note: Actual synthesis logic would use an LLM. This is a placeholder 
        for the structure the LLM should output.
        """
        # This is what the LLM should return via the synthesis engine
        structure = {
            "competitor_landscape": [
                {"name": "...", "market_share": "...", "description": "..."}
            ],
            "value_proposition": {"hook": "..."},
            "pricing_strategy": {"type": "...", "details": "..."},
            "customer_pain_points": ["..."],
            "the_gap": "...",
            "metadata": {
                "language": "en",
                "generated_at": datetime.now().isoformat()
            }
        }
        return structure
