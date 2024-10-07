use std::sync::Arc;
use diesel::r2d2::{ConnectionManager, Pool};
use diesel::SqliteConnection;
use crate::models::user::{NewUser, User};
use diesel::prelude::*;
use crate::schema::users;

pub struct UserRepository {
    pool: Arc<Pool<ConnectionManager<SqliteConnection>>>,
}

impl UserRepository {
    pub fn new(pool: Arc<Pool<ConnectionManager<SqliteConnection>>>) -> Self {
        UserRepository { pool }
    }

    pub fn get_users(&self) -> Result<Vec<User>, diesel::result::Error> {
        let conn = &mut self.pool.get().expect("No se pudo obtener la conexión del pool");
        users::table.load::<User>(conn)
    }

    pub fn create_user(&self, new_user: &NewUser) -> Result<User, diesel::result::Error> {
        let conn = &mut self.pool.get().expect("No se pudo obtener la conexión del pool");
        
        conn.transaction(|conn| {
            diesel::insert_into(users::table)
                .values(new_user)
                .execute(conn)?;

            users::table
                .order(users::id.desc())
                .first(conn)
        })
    }
}