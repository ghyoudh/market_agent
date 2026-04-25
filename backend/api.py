from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from market_intelligence.tools import MarketTools
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Market Intelligence API")

class SearchRequest(BaseModel):
    query: str
    max_results: int = 5

class ScrapeRequest(BaseModel):
    url: str

class ReportPayload(BaseModel):
    data: Dict[str, Any]
    filename: Optional[str] = None

@app.get("/")
async def root():
    return {"message": "Market Intelligence Backend is running"}

@app.post("/search")
async def search(req: SearchRequest):
    try:
        results = MarketTools.search_web(req.query, req.max_results)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/scrape")
async def scrape(req: ScrapeRequest):
    try:
        result = MarketTools.scrape_url(req.url)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/save-report")
async def save_report(req: ReportPayload):
    try:
        filepath = MarketTools.save_report(req.data, req.filename)
        return {"status": "success", "filepath": filepath}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
