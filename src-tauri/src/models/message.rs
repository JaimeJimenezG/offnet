use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Message {
    pub id: i64,
    pub content: String,
    pub user_id: i64,
    pub peer_id: i64,
    pub server_id: i64,
    pub created_at: i64,
    pub updated_at: i64,
}