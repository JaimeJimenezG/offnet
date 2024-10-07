use std::sync::Arc;
use actix_web::{get, post, web, HttpResponse, Responder};
use crate::db::repository::Repository;
use crate::models::user::NewUser;

#[get("/users")]
pub async fn get_users(repo: web::Data<Arc<Repository>>) -> impl Responder {
    match repo.users.get_users() {
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

#[post("/users")]
pub async fn create_user(repo: web::Data<Arc<Repository>>, user: web::Json<NewUser>) -> impl Responder {
    match repo.users.create_user(&user.into_inner()) {
        Ok(user) => HttpResponse::Ok().json(user),
        Err(e) => HttpResponse::InternalServerError().body(format!("Error al crear usuario: {}", e)),
    }
}