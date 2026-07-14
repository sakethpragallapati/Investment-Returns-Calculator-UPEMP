"""
UPEMP 2020 Incentive Calculator — FastAPI Application
Stateless API: No database, no persistent storage.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import CalculateRequest, CalculateResponse
from calculator import calculate_all

app = FastAPI(
    title="UPEMP 2020 Incentive Calculator API",
    description="Calculates all 13+ incentives under the UP Electronics Manufacturing Policy 2020.",
    version="1.0.0",
)

# CORS — allow Next.js dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "UPEMP 2020 Incentive Calculator"}


@app.post("/api/calculate", response_model=CalculateResponse)
def calculate(request: CalculateRequest):
    try:
        result = calculate_all(request)
        return result
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calculation error: {str(e)}")
