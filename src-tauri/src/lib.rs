mod file_manager;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            file_manager::load_file,
            file_manager::save_file,
            file_manager::process_text_with_ai,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
