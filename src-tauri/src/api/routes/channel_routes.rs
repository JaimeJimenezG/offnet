use std::sync::Arc;
use actix_web::{get, post, web, HttpResponse, Responder};
use crate::db::repository::Repository;
use crate::models::channel::NewChannel;

#[get("/channels")]
pub async fn get_channels(repo: web::Data<Arc<Repository>>) -> impl Responder {
    match repo.channels.get_channels() {
        Ok(channels) => {
            println!("Canales obtenidos exitosamente: {:?}", channels);
            HttpResponse::Ok().json(channels)
        },
        Err(e) => {
            eprintln!("Error al obtener canales: {}", e);
            HttpResponse::InternalServerError().body(format!("Error al obtener canales: {}", e))
        },
    }
}

#[post("/channels")]
pub async fn create_channel(repo: web::Data<Arc<Repository>>, channel: web::Json<NewChannel>) -> impl Responder {
    match repo.channels.create_channel(&channel.into_inner()) {
        Ok(channel) => HttpResponse::Ok().json(channel),
        Err(e) => HttpResponse::InternalServerError().body(format!("Error al crear canal: {}", e)),
    }
}

#[get("/channels/{id}")]
pub async fn get_channel_by_id(repo: web::Data<Arc<Repository>>, path: web::Path<i32>) -> impl Responder {
    let channel_id = path.into_inner();
    match repo.channels.get_channel_by_id(channel_id) {
        Ok(channel) => {
            match channel {
                Some(c) => HttpResponse::Ok().json(c),
                None => HttpResponse::NotFound().body(format!("Canal con id {} no encontrado", channel_id)),
            }
        },
        Err(e) => HttpResponse::InternalServerError().body(format!("Error al obtener canal: {}", e)),
    }
}

#[get("/servers/{server_id}/channels")]
pub async fn get_channels_by_server(repo: web::Data<Arc<Repository>>, path: web::Path<i32>) -> impl Responder {
    let server_id = path.into_inner();
    match repo.channels.get_channels_by_server(server_id) {
        Ok(channels) => {
            println!("Canales del servidor {} obtenidos exitosamente: {:?}", server_id, channels);
            HttpResponse::Ok().json(channels)
        },
        Err(e) => {
            eprintln!("Error al obtener canales del servidor {}: {}", server_id, e);
            HttpResponse::InternalServerError().body(format!("Error al obtener canales del servidor: {}", e))
        },
    }
}