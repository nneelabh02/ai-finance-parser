import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Load the API key from the .env file
load_dotenv(override=True)
API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise ValueError("[!] Missing GEMINI_API_KEY. Please add it to your .env file.")

# Initialize the new Client architecture
client = genai.Client(api_key=API_KEY)

def parse_with_llm(raw_text: str) -> dict:
    """
    Sends raw OCR text to Gemini using the modern google-genai SDK
    and forces a strict JSON response mime-type.
    """
    print("[*] Sending data to Gemini for structuring...")
    
    prompt = f"""
    You are an aggressive financial data extraction API. 
    I am providing you with raw OCR text from a document.
    
    1. Look for ANYTHING that resembles a transaction (a date, a vendor/description, and an amount).
    2. Even if the text is messy or slightly corrupted by OCR errors, do your best to clean it up and extract it.
    3. If you cannot find the account holder or statement period, leave them as null, but do NOT skip the transactions.
    
    Extract the data into this exact JSON structure:
    {{
        "account_holder": "Name or null",
        "statement_period": "Date range or null",
        "transactions": [
            {{
                "date": "YYYY-MM-DD or best guess",
                "description": "Cleaned up vendor name",
                "amount": 0.00,
                "type": "credit or debit"
            }}
        ]
    }}
    
    Raw OCR Text:
    {raw_text}
    """
    
    # We upgrade to 2.5-flash and force the response to be application/json
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
        )
    )
    
    try:
        # Since we forced JSON mime-type, we don't need to strip markdown backticks anymore
        parsed_data = json.loads(response.text)
        return parsed_data
    except json.JSONDecodeError as e:
        print(f"[ERROR] Failed to parse LLM response into JSON. Raw response:\n{response.text}")
        raise e