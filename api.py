import os
import shutil
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Import your existing engine
from ocr import pdf_to_images, extract_text_from_images
from parser import parse_with_llm

app = FastAPI(title="AI Finance Parser API")

# We must enable CORS so your React frontend (localhost:5173) can talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production we lock this down, but for local dev it's fine
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "System Online", "version": "1.0.0"}

@app.post("/api/parse")
async def parse_document(file: UploadFile = File(...)):
    print(f"\n[API] Received file: {file.filename}")
    
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    temp_path = f"temp_{file.filename}"
    
    try:
        # 1. Save the uploaded file locally so Tesseract can read it
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        print("[API] File saved, initiating OCR pipeline...")
        
        # 2. Run the exact same pipeline we built earlier
        images = pdf_to_images(temp_path)
        raw_text = extract_text_from_images(images)
        structured_data = parse_with_llm(raw_text)
        
        print("[API] Pipeline complete. Returning JSON payload.")
        return structured_data

    except Exception as e:
        print(f"[API ERROR] {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
        
    finally:
        # 3. Clean up the temp file so we don't clog up your hard drive
        if os.path.exists(temp_path):
            os.remove(temp_path)
            print(f"[API] Cleaned up temporary file: {temp_path}")

if __name__ == "__main__":
    import uvicorn
    # Run the server on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)