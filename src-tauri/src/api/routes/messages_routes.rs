use std::sync::Arc;
use actix_web::{get, post, web, HttpResponse, Responder};
use crate::db::repository::Repository;
use crate::models::message::NewMessage;

#[get("/messages")]
pub async fn get_messages(repo: web::Data<Arc<Repository>>) -> impl Responder {
    match repo.messages.get_messages_with_user_and_channel() {
        Ok(messages) => {
            println!("Mensajes obtenidos exitosamente: {:?}", messages);
            HttpResponse::Ok().json(messages)
        },
        Err(e) => {
            eprintln!("Error al obtener mensajes: {}", e);
            HttpResponse::InternalServerError().body(format!("Error al obtener mensajes: {}", e))
        },
    }
}

#[post("/messages")]
pub async fn create_message(repo: web::Data<Arc<Repository>>, message: web::Json<NewMessage>) -> impl Responder {
    match repo.messages.create_message(&message.into_inner()) {
        Ok(message) => HttpResponse::Ok().json(message),
        Err(e) => HttpResponse::InternalServerError().body(format!("Error al crear mensaje: {}", e)),
    }
}

#[get("/messages/channels/{channel_id}")]
pub async fn get_messages_by_channel(
    repo: web::Data<Arc<Repository>>,
    path: web::Path<i32>
) -> impl Responder {
    let channel_id = path.into_inner();
    match repo.messages.get_messages_by_channel(channel_id) {
        Ok(messages) => {
            println!("Mensajes del canal {} obtenidos exitosamente: {:?}", channel_id, messages);
            HttpResponse::Ok().json(messages)
        },
        Err(e) => {
            eprintln!("Error al obtener mensajes del canal {}: {}", channel_id, e);
            HttpResponse::InternalServerError().body(format!("Error al obtener mensajes del canal: {}", e))
        },
    }
}