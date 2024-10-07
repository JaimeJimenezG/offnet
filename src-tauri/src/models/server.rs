use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use crate::schema::servers;

#[derive(Debug, Serialize, Deserialize, Queryable, Insertable, Clone)]
#[diesel(table_name = servers)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Server {
    pub id: i32,
    pub name: String,
    pub description: Option<String>,
    pub created_at: chrono::NaiveDateTime,
    pub image_url: String,
}

#[derive(Debug, Serialize, Deserialize, Queryable, Insertable, Clone)]
#[diesel(table_name = crate::schema::servers)]
pub struct NewServer {
    pub name: String,
    pub description: Option<String>,
    pub image_url: String,
}