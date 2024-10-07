use std::sync::Arc;
use actix_web::{get, post, web, HttpResponse, Responder};
use crate::db::repository::Repository;
use crate::models::server::NewServer;

#[get("/servers")]
pub async fn get_servers(repo: web::Data<Arc<Repository>>) -> impl Responder {
    match repo.servers.get_servers() {
        Ok(servers) => {
            println!("Servidores obtenidos exitosamente: {:?}", servers);
            HttpResponse::Ok().json(servers)
        },
        Err(e) => {
            eprintln!("Error al obtener servidores: {}", e);
            HttpResponse::InternalServerError().body(format!("Error al obtener servidores: {}", e))
        },
    }
}

#[post("/servers")]
pub async fn create_server(repo: web::Data<Arc<Repository>>, server: web::Json<NewServer>) -> impl Responder {
    match repo.servers.create_server(&server.into_inner()) {
        Ok(server) => HttpResponse::Ok().json(server),
        Err(e) => HttpResponse::InternalServerError().body(format!("Error al crear servidor: {}", e)),
    }
}

#[get("/servers/{id}")]
pub async fn get_server_by_id(repo: web::Data<Arc<Repository>>, path: web::Path<i32>) -> impl Responder {
    let server_id = path.into_inner();
    match repo.servers.get_server_by_id(server_id) {
        Ok(server) => {
            match server {
                Some(s) => HttpResponse::Ok().json(s),
                None => HttpResponse::NotFound().body(format!("Servidor con id {} no encontrado", server_id)),
            }
        },
        Err(e) => HttpResponse::InternalServerError().body(format!("Error al obtener servidor: {}", e)),
    }
}