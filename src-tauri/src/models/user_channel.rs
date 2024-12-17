use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use crate::schema::users_channels;

#[derive(Debug, Serialize, Deserialize, Queryable, Insertable)]
#[diesel(table_name = users_channels)]
pub struct UserChannel {
    pub user_id: i32,
    pub channel_id: i32,
    pub joined_at: chrono::NaiveDateTime,
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize, Insertable)]
#[diesel(table_name = users_channels)]
pub struct NewUserChannel {
    pub user_id: i32,
    pub channel_id: i32,
    pub name: String,
} 