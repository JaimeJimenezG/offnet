use diesel::prelude::*;
use crate::schema::servers;

#[derive(Queryable, Selectable)]
#[diesel(table_name = servers)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Server {
    pub id: i32,
    pub name: String,
    pub description: Option<String>,
    pub created_at: chrono::NaiveDateTime,
}