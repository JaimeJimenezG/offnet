use db::connection::establish_connection;
use actix_web::{web, App, HttpServer};
use db::repository::Repository;
use std::sync::Arc;
use std::thread;

mod api;
mod db;
mod models;
mod schema;


fn start_api(repo: Arc<Repository>) -> std::io::Result<()> {
    println!("Iniciando API");
    let repo_data = web::Data::new(repo);
    thread::spawn(move || {
        let rt = actix_rt::Runtime::new().unwrap();
        rt.block_on(async {
            HttpServer::new(move || {
                App::new()
                    .app_data(repo_data.clone())
                    .service(api::routes::check)
                    .service(api::routes::get_users)
            })
            .bind("127.0.0.1:8080")
            .unwrap()
            .run()
            .await
            .unwrap();
        });
    });
    println!("API iniciada en un hilo separado");
    Ok(())
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("¡Hola, {}! Has sido saludado desde Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    std::env::set_var("RUST_LOG", "debug");
    env_logger::init();

    let pool = establish_connection();
    let repo = Arc::new(Repository::new(pool));

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet])
        .setup(move |_| {
            let repo_clone = repo.clone();
            match start_api(repo_clone) {
                Ok(_) => println!("API iniciada correctamente"),
                Err(e) => eprintln!("Error al iniciar la API: {}", e),
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error al ejecutar la aplicación tauri");
}