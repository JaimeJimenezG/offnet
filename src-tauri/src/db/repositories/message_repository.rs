use std::sync::Arc;
use diesel::r2d2::{ConnectionManager, Pool};
use diesel::SqliteConnection;
use diesel::prelude::*;
use crate::models::message::{Message, NewMessage, MessageWithUserAndChannel};
use crate::models::user::User;
use crate::models::channel::Channel;
use crate::schema::{messages, users, channels};

pub struct MessageRepository {
    pool: Arc<Pool<ConnectionManager<SqliteConnection>>>
}

impl MessageRepository {
    pub fn new(pool: Arc<Pool<ConnectionManager<SqliteConnection>>>) -> Self {
        MessageRepository { pool }
    }
    pub fn get_messages_by_channel(&self, channel_id: i32) -> Result<Vec<MessageWithUserAndChannel>, diesel::result::Error> {
        let conn = &mut self.pool.get().expect("No se pudo obtener la conexión del pool");
        messages::table
            .filter(messages::channel_id.eq(channel_id))
            .inner_join(users::table)
            .inner_join(channels::table)
            .select((
                messages::all_columns,
                users::all_columns,
                channels::all_columns,
            ))
            .load::<(Message, User, Channel)>(conn)
            .map(|results| {
                results
                    .into_iter()
                    .map(|(message, user, channel)| MessageWithUserAndChannel {
                        id: message.id,
                        channel_id: message.channel_id,
                        user_id: message.user_id,
                        content: message.content,
                        created_at: message.created_at,
                        user,
                        channel,
                    })
                    .collect()
            })
    }

    pub fn get_messages_with_user_and_channel(&self) -> Result<Vec<MessageWithUserAndChannel>, diesel::result::Error> {
        let conn = &mut self.pool.get().expect("No se pudo obtener la conexión del pool");
        messages::table
            .inner_join(users::table)
            .inner_join(channels::table)
            .select((
                messages::all_columns,
                users::all_columns,
                channels::all_columns,
            ))
            .load::<(Message, User, Channel)>(conn)
            .map(|results| {
                results
                    .into_iter()
                    .map(|(message, user, channel)| MessageWithUserAndChannel {
                        id: message.id,
                        channel_id: message.channel_id,
                        user_id: message.user_id,
                        content: message.content,
                        created_at: message.created_at,
                        user,
                        channel,
                    })
                    .collect()
            })
    }

    pub fn create_message(&self, new_message: &NewMessage) -> Result<MessageWithUserAndChannel, diesel::result::Error> {
        let conn = &mut self.pool.get().expect("No se pudo obtener la conexión del pool");
        
        conn.transaction(|conn| {
            diesel::insert_into(messages::table)
                .values(new_message)
                .execute(conn)?;

            messages::table
                .order(messages::id.desc())
                .inner_join(users::table)
                .inner_join(channels::table)
                .select((
                    messages::all_columns,
                    users::all_columns,
                    channels::all_columns,
                ))
                .first::<(Message, User, Channel)>(conn)
                .map(|(message, user, channel)| MessageWithUserAndChannel {
                    id: message.id,
                    channel_id: message.channel_id,
                    user_id: message.user_id,
                    content: message.content,
                    created_at: message.created_at,
                    user,
                    channel,
                })
        })
    }
}