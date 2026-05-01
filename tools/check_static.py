from pathlib import Path
root = Path(__file__).resolve().parents[1]
text = "\n".join(p.read_text(encoding="utf-8", errors="ignore") for p in root.rglob("*.html"))
for forbidden in ["Contact for details", "Before/After photos coming soon", "Simulate form submission"]:
    if forbidden in text:
        raise SystemExit(f"Forbidden text found: {forbidden}")
print("Static checks passed")
