use std::sync::Arc;

use actix_web::{get, web, HttpResponse, Responder};
use crate::db::repository::Repository;

#[get("/")]
pub async fn check() -> impl Responder {
    HttpResponse::Ok().body("¡Hola desde la API de Offnet!")
}

#[get("/users")]
pub async fn get_users(repo: web::Data<Arc<Repository>>) -> impl Responder {
    match repo.get_users() {
        Ok(users) => {
            println!("Usuarios obtenidos exitosamente: {:?}", users);
            HttpResponse::Ok().json(users)
        },
        Err(e) => {
            eprintln!("Error al obtener usuarios: {}", e);
            HttpResponse::InternalServerError().body(format!("Error al obtener usuarios: {}", e))
        },
    }
}