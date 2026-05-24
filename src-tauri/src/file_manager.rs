use ropey::Rope;
use std::fs::File;
use std::io::{BufReader, BufWriter};

#[tauri::command]
pub fn load_file(path: String) -> Result<String, String> {
    let file = File::open(&path).map_err(|e| e.to_string())?;
    let rope = Rope::from_reader(BufReader::new(file)).map_err(|e| e.to_string())?;
    Ok(rope.to_string())
}

#[tauri::command]
pub fn save_file(path: String, content: String) -> Result<(), String> {
    let rope = Rope::from_str(&content);
    let file = File::create(&path).map_err(|e| e.to_string())?;
    rope.write_to(BufWriter::new(file)).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn process_text_with_ai(text: String, _prompt: String) -> Result<String, String> {
    // Stub — returns text unchanged, ready for future LLM integration
    Ok(text)
}
