use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Peer {
    pub id: i64,
    pub name: String,
    pub ip: String,
    pub port: u16,
}