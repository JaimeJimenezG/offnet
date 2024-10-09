use actix_cors::Cors;
use actix_web::{web, App, HttpServer};
use api::routes::channel_routes::{
    create_channel, get_channel_by_id, get_channels, get_channels_by_server,
};
use api::routes::messages_routes::{create_message, get_messages, get_messages_by_channel};
use api::routes::server_routes::{create_server, get_server_by_id, get_servers};
use api::routes::user_routes::{create_user, get_users};
use api::routes::util_routes::check;
use db::connection::establish_connection;
use db::repository::Repository;
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use rusqlite::Connection;
use serde::{Deserialize, Serialize};
use socketioxide::extract::{Data, SocketRef};
use socketioxide::SocketIo;
use std::path::Path;
use std::sync::Arc;
use std::thread;
#[allow(non_snake_case)]
#[derive(Debug, Serialize, Deserialize)]
struct IceCandidate {
    candidate: String,
    sdpMLineIndex: i32,
    sdpMid: String,
    usernameFragment: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct SdpType {
    sdp: String,
    r#type: String,
}

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
            let (layer, io) = SocketIo::new_layer();

            io.ns("/", |s: SocketRef| {
                println!("socket connected0: {}", s.id);

                s.on("offer", |_socket: SocketRef, Data(offer): Data<SdpType>| async move {
                    println!("Oferta recibida: {:?}", offer);
                    _socket.broadcast().emit("offer", offer).ok();
                });

                s.on("answer", |socket: SocketRef, Data(answer): Data<SdpType>| async move {
                    println!("Oferta recibida: {:?}", answer);
                    socket.broadcast().emit("answer", answer).ok();
                });

                s.on("ice-candidate", |socket: SocketRef, Data(candidate): Data<IceCandidate>| async move {
                    println!("Oferta recibida: {:?}", candidate);
                    socket.broadcast().emit("ice-candidate", candidate).ok();
                });
            });

            let app = axum::Router::new()
                .nest_service("/", tower_http::services::ServeDir::new("dist"))
                .layer(
                    tower::ServiceBuilder::new()
                        .layer(tower_http::cors::CorsLayer::permissive()) // Habilitar política CORS
                        .layer(layer),
                );

            let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
            let socket_server = axum::serve(listener, app);

            let http_server = HttpServer::new(move || {
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
            .run();
            println!("API HTTP iniciada en puerto 8080 y servidor SocketIO en puerto 3000");

            // Ejecutar ambos servidores concurrentemente y manejar los resultados
            if let Err(e) = tokio::try_join!(socket_server, http_server) {
                eprintln!("Error al ejecutar los servidores: {}", e);
            }
        });
    });
    
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
