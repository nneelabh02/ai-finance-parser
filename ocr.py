import os
from pdf2image import convert_from_path
import pytesseract

def pdf_to_images(pdf_path: str) -> list:
    """
    Converts a PDF file into a list of high-resolution images.
    Returns a list of PIL Image objects.
    """
    print(f"[*] Converting PDF to images: {pdf_path}")
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"Could not find file at: {pdf_path}")
    
    # dpi=300 is the industry standard for OCR. Lower DPI causes errors, higher DPI wastes RAM.
    images = convert_from_path(pdf_path, dpi=300)
    print(f"[*] Successfully converted {len(images)} pages.")
    return images

def extract_text_from_images(images: list) -> str:
    """
    Runs local Tesseract OCR on a list of images and concatenates the text.
    """
    print("[*] Running local Tesseract OCR extraction...")
    full_text = ""
    
    for i, image in enumerate(images):
        print(f"[*] Processing page {i + 1}...")
        # config='--psm 6' tells Tesseract to assume a single uniform block of text. 
        # This is crucial for reading tabular data like bank statements.
        text = pytesseract.image_to_string(image, config='--psm 6')
        full_text += f"\n--- PAGE {i + 1} ---\n{text}"
        
    return full_text

if __name__ == "__main__":
    # ---------------------------------------------------------
    # LOCAL TESTING BLOCK
    # This only runs if you execute `python ocr.py` directly.
    # It will not run when we import these functions later.
    # ---------------------------------------------------------
    
    test_pdf = "sample_statement.pdf"
    
    if os.path.exists(test_pdf):
        try:
            # 1. Convert PDF
            pdf_images = pdf_to_images(test_pdf)
            
            # 2. Extract Text
            raw_text = extract_text_from_images(pdf_images)
            
            # 3. Save output to a text file for us to review
            output_file = "raw_ocr_output.txt"
            with open(output_file, "w", encoding="utf-8") as f:
                f.write(raw_text)
                
            print(f"\n[SUCCESS] Extraction complete. Check '{output_file}' for results.")
            
        except Exception as e:
            print(f"\n[ERROR] Something broke: {str(e)}")
    else:
        print(f"\n[!] Test aborted: Please place a file named '{test_pdf}' in this folder.")