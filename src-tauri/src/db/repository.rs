use std::sync::Arc;
use crate::db::connection::DbPool;
use super::repositories::{channel_repository::ChannelRepository, message_repository::MessageRepository, server_repository::ServerRepository, user_repository::UserRepository};

pub struct Repository {
    pub users: Arc<UserRepository>,
    pub messages: Arc<MessageRepository>,
    pub servers: Arc<ServerRepository>,
    pub channels: Arc<ChannelRepository>,
}

impl Repository {
    pub fn new(pool: DbPool) -> Self {
        Repository {
            users: Arc::new(UserRepository::new(Arc::clone(&pool))),
            messages: Arc::new(MessageRepository::new(Arc::clone(&pool))),
            servers: Arc::new(ServerRepository::new(Arc::clone(&pool))),
            channels: Arc::new(ChannelRepository::new(Arc::clone(&pool))),
        }
    }
}