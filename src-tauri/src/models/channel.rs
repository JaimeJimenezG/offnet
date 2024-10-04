use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use crate::schema::channels;

#[derive(Debug, Serialize, Deserialize)]
pub enum ChannelType {
    Text,
    Voice
}

#[derive(Queryable, Selectable)]
#[diesel(table_name = channels)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Channel {
    pub id: i32,
    pub server_id: i32,
    pub name: String,
    pub description: Option<String>,
    pub created_at: chrono::NaiveDateTime,
}