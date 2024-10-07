use api::routes::channel_routes::{create_channel, get_channel_by_id, get_channels, get_channels_by_server};
use api::routes::messages_routes::{create_message, get_messages, get_messages_by_channel};
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use api::routes::server_routes::{create_server, get_server_by_id, get_servers};
use api::routes::user_routes::{create_user, get_users};
use db::connection::establish_connection;
use actix_web::{web, App, HttpServer};
use api::routes::util_routes::check;
use db::repository::Repository;
use rusqlite::Connection;
use actix_cors::Cors;
use std::path::Path;
use std::sync::Arc;
use std::thread;

mod api;
mod db;
mod models;
mod schema;

pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!("migrations");

fn start_api(repo: Arc<Repository>) -> std::io::Result<()> {
    println!("Iniciando API");
    let repo_data = web::Data::new(repo);
    thread::spawn(move || {
        let rt = actix_rt::Runtime::new().unwrap();
        rt.block_on(async {
            HttpServer::new(move || {
                let cors = Cors::default()
                    .allow_any_origin()
                    .allow_any_method()
                    .allow_any_header()
                    .max_age(3600);

                App::new()
                    .wrap(cors)
                    .app_data(repo_data.clone())
                    .service(check)
                    .service(get_users)
                    .service(create_user)
                    .service(get_messages)
                    .service(create_message)
                    .service(get_messages_by_channel)
                    .service(get_servers)
                    .service(create_server)
                    .service(get_server_by_id)
                    .service(get_channels)
                    .service(get_channel_by_id)
                    .service(get_channels_by_server)
                    .service(create_channel)
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

    let db_path = "offnet.db";

    // Verificar si la base de datos existe
    if !Path::new(db_path).exists() {
        println!("La base de datos no existe. Creando una nueva...");
        // Si no existe, crear la base de datos
        let conn = Connection::open(db_path).expect("Error al crear la base de datos");
        conn.close().expect("Error al cerrar la conexión");
        println!("Base de datos creada.");
    }

    // Establecer la conexión y ejecutar las migraciones
    let pool = establish_connection();
    let mut conn = pool
        .get()
        .expect("No se pudo obtener una conexión de la pool");

    match conn.run_pending_migrations(MIGRATIONS) {
        Ok(_) => println!("Migraciones ejecutadas correctamente"),
        Err(e) => eprintln!("Error al ejecutar las migraciones: {}", e),
    }

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
