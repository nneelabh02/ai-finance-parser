import os
import json

# Import our custom modules
from ocr import pdf_to_images, extract_text_from_images
from parser import parse_with_llm

def main():
    # The file we want to process
    test_pdf = "sample_statement.pdf"
    
    print("\n========================================")
    print("  🚀 AI FINANCE PARSER INITIALIZING...  ")
    print("========================================\n")
    
    if not os.path.exists(test_pdf):
        print(f"[!] SYSTEM HALT: Please place a file named '{test_pdf}' in this directory.")
        return

    try:
        # --- PHASE 1: OCR EXTRACTION ---
        print("\n=== PHASE 1: OCR EXTRACTION ===")
        images = pdf_to_images(test_pdf)
        raw_text = extract_text_from_images(images)

        print(f"\n[DEBUG] First 500 characters of OCR text:\n{raw_text[:500]}\n")
        
        # --- PHASE 2: LLM STRUCTURING ---
        print("\n=== PHASE 2: LLM STRUCTURING ===")
        structured_data = parse_with_llm(raw_text)
        
        # --- PHASE 3: OUTPUT & SAVE ---
        print("\n=== PHASE 3: SAVING DATA ===")
        output_file = "parsed_output.json"
        
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(structured_data, f, indent=4)
            
        print(f"[*] SUCCESS! Data successfully written to '{output_file}'.")
        print("\nHere is a preview of your structured data:")
        print("-" * 40)
        print(json.dumps(structured_data, indent=4))
        print("-" * 40)
        
    except Exception as e:
        print(f"\n[FATAL ERROR] The pipeline crashed: {str(e)}")

if __name__ == "__main__":
    main()