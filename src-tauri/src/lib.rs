mod file_manager;

use tauri::Manager;

#[tauri::command]
async fn close_splash(app: tauri::AppHandle) -> Result<(), String> {
    if let Some(splash) = app.get_webview_window("splash") {
        splash.close().map_err(|e| e.to_string())?;
    }
    if let Some(main) = app.get_webview_window("main") {
        main.show().map_err(|e| e.to_string())?;
        main.set_focus().map_err(|e| e.to_string())?;
    }
    Ok(())
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            file_manager::load_file,
            file_manager::save_file,
            file_manager::process_text_with_ai,
            close_splash,
        ])
        .setup(|app| {
            tauri::WebviewWindowBuilder::new(
                app,
                "splash",
                tauri::WebviewUrl::App("splash".into()),
            )
            .title("")
            .inner_size(800.0, 480.0)
            .decorations(false)
            .center()
            .resizable(false)
            .always_on_top(true)
            .build()?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
