use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use crate::schema::channels;
use crate::models::user::User;

#[derive(Debug, Serialize, Deserialize)]
pub enum ChannelType {
    Text,
    Voice
}

#[derive(Debug, Serialize, Deserialize, Queryable, Insertable, Clone)]
#[diesel(table_name = channels)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Channel {
    pub id: i32,
    pub server_id: i32,
    pub name: String,
    pub description: Option<String>,
    pub created_at: chrono::NaiveDateTime,
}

#[derive(Debug, Serialize, Deserialize, Queryable, Insertable, Clone)]
#[diesel(table_name = channels)]
pub struct NewChannel {
    pub server_id: i32,
    pub name: String,
    pub description: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct ChannelWithUsers {
    #[serde(flatten)]
    pub channel: Channel,
    pub connectedUsers: Vec<User>
}

impl From<(Channel, Vec<User>)> for ChannelWithUsers {
    fn from((channel, users): (Channel, Vec<User>)) -> Self {
        ChannelWithUsers {
            channel,
            connectedUsers: users,
        }
    }
}