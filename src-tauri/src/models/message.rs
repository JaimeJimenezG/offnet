use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use crate::schema::messages;
use crate::models::user::User;
use crate::models::channel::Channel;

#[derive(Debug, Serialize, Deserialize, Queryable, Associations, Identifiable)]
#[diesel(belongs_to(User))]
#[diesel(belongs_to(Channel))]
#[diesel(table_name = messages)]
pub struct Message {
    pub id: i32,
    pub channel_id: i32,
    pub user_id: i32,
    pub content: String,
    pub created_at: chrono::NaiveDateTime,
}

#[derive(Debug, Serialize, Deserialize, Queryable, Associations, Identifiable)]
#[diesel(belongs_to(User))]
#[diesel(belongs_to(Channel))]
#[diesel(table_name = messages)]
pub struct MessageWithUserAndChannel {
    pub id: i32,
    pub channel_id: i32,
    pub user_id: i32,
    pub content: String,
    pub created_at: chrono::NaiveDateTime,
    pub user: User,
    pub channel: Channel,
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = messages)]
pub struct NewMessage {
    pub channel_id: i32,
    pub user_id: i32,
    pub content: String,
}