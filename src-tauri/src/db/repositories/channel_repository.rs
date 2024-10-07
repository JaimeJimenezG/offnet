use std::sync::Arc;
use diesel::r2d2::{ConnectionManager, Pool};
use diesel::SqliteConnection;
use diesel::prelude::*;
use crate::models::channel::{Channel, NewChannel};
use crate::schema::channels;

pub struct ChannelRepository {
    pool: Arc<Pool<ConnectionManager<SqliteConnection>>>
}

impl ChannelRepository {
    pub fn new(pool: Arc<Pool<ConnectionManager<SqliteConnection>>>) -> Self {
        ChannelRepository { pool }
    }

    pub fn get_channels(&self) -> Result<Vec<Channel>, diesel::result::Error> {
        let conn = &mut self.pool.get().expect("No se pudo obtener la conexión del pool");
        channels::table.load::<Channel>(conn)
    }

    pub fn create_channel(&self, new_channel: &NewChannel) -> Result<Channel, diesel::result::Error> {
        let conn = &mut self.pool.get().expect("No se pudo obtener la conexión del pool");
        
        diesel::insert_into(channels::table)
            .values(new_channel)
            .execute(conn)?;

        channels::table
            .order(channels::id.desc())
            .first(conn)
    }

    pub fn get_channel_by_id(&self, channel_id: i32) -> Result<Option<Channel>, diesel::result::Error> {
        let conn = &mut self.pool.get().expect("No se pudo obtener la conexión del pool");
        channels::table
            .find(channel_id)
            .first(conn)
            .optional()
    }

    pub fn get_channels_by_server(&self, server_id: i32) -> Result<Vec<Channel>, diesel::result::Error> {
        let conn = &mut self.pool.get().expect("No se pudo obtener la conexión del pool");
        channels::table
            .filter(channels::server_id.eq(server_id))
            .load::<Channel>(conn)
    }
}