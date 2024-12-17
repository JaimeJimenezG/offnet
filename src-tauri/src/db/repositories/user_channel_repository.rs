use std::sync::Arc;
use diesel::r2d2::{ConnectionManager, Pool};
use diesel::SqliteConnection;
use diesel::prelude::*;
use crate::models::user_channel::{UserChannel, NewUserChannel};
use crate::models::user::User;
use crate::schema::{users_channels, users};

pub struct UserChannelRepository {
    pool: Arc<Pool<ConnectionManager<SqliteConnection>>>
}

impl UserChannelRepository {
    pub fn new(pool: Arc<Pool<ConnectionManager<SqliteConnection>>>) -> Self {
        UserChannelRepository { pool }
    }

    pub fn join_channel(&self, new_user_channel: &NewUserChannel) -> Result<UserChannel, diesel::result::Error> {
        let conn = &mut self.pool.get().expect("No se pudo obtener la conexión del pool");
        
        conn.transaction(|conn| {
            // Verificar si el usuario ya está en el canal
            let existing = users_channels::table
                .filter(users_channels::user_id.eq(new_user_channel.user_id))
                .filter(users_channels::channel_id.eq(new_user_channel.channel_id))
                .first::<UserChannel>(conn)
                .optional()?;

            match existing {
                Some(user_channel) => Ok(user_channel),
                None => {
                    diesel::insert_into(users_channels::table)
                        .values(new_user_channel)
                        .execute(conn)?;

                    users_channels::table
                        .filter(users_channels::user_id.eq(new_user_channel.user_id))
                        .filter(users_channels::channel_id.eq(new_user_channel.channel_id))
                        .first(conn)
                }
            }
        })
    }

    pub fn leave_channel(&self, user_id: i32, channel_id: i32) -> Result<bool, diesel::result::Error> {
        let conn = &mut self.pool.get().expect("No se pudo obtener la conexión del pool");
        
        conn.transaction(|conn| {
            let deleted = diesel::delete(
                users_channels::table
                    .filter(users_channels::user_id.eq(user_id))
                    .filter(users_channels::channel_id.eq(channel_id))
            ).execute(conn)?;

            Ok(deleted > 0)
        })
    }

    pub fn get_users_in_channel(&self, channel_id: i32) -> Result<Vec<(UserChannel, User)>, diesel::result::Error> {
        let conn = &mut self.pool.get().expect("No se pudo obtener la conexión del pool");
        
        users_channels::table
            .filter(users_channels::channel_id.eq(channel_id))
            .inner_join(users::table)
            .load::<(UserChannel, User)>(conn)
    }

    pub fn is_user_in_channel(&self, user_id: i32, channel_id: i32) -> Result<bool, diesel::result::Error> {
        let conn = &mut self.pool.get().expect("No se pudo obtener la conexión del pool");
        
        users_channels::table
            .filter(users_channels::user_id.eq(user_id))
            .filter(users_channels::channel_id.eq(channel_id))
            .first::<UserChannel>(conn)
            .optional()
            .map(|result| result.is_some())
    }
} 