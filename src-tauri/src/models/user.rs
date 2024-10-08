use diesel::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Queryable, Insertable, Clone)]
#[diesel(table_name = crate::schema::users)]
pub struct User {
    pub id: i32,
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize, Queryable, Insertable, Clone)]
#[diesel(table_name = crate::schema::users)]
pub struct NewUser {
    pub name: String,
}