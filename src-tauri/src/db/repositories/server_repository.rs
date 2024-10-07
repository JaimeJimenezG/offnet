use std::sync::Arc;
use diesel::r2d2::{ConnectionManager, Pool};
use diesel::SqliteConnection;
use diesel::prelude::*;
use crate::models::server::{Server, NewServer};
use crate::schema::servers;

pub struct ServerRepository {
    pool: Arc<Pool<ConnectionManager<SqliteConnection>>>
}

impl ServerRepository {
    pub fn new(pool: Arc<Pool<ConnectionManager<SqliteConnection>>>) -> Self {
        ServerRepository { pool }
    }

    pub fn get_servers(&self) -> Result<Vec<Server>, diesel::result::Error> {
        let conn = &mut self.pool.get().expect("No se pudo obtener la conexión del pool");
        servers::table.load::<Server>(conn)
    }

    pub fn create_server(&self, new_server: &NewServer) -> Result<Server, diesel::result::Error> {
        let conn = &mut self.pool.get().expect("No se pudo obtener la conexión del pool");
        
        diesel::insert_into(servers::table)
            .values(new_server)
            .execute(conn)?;

        servers::table
            .order(servers::id.desc())
            .first(conn)
    }

    pub fn get_server_by_id(&self, server_id: i32) -> Result<Option<Server>, diesel::result::Error> {
        let conn = &mut self.pool.get().expect("No se pudo obtener la conexión del pool");
        servers::table
            .find(server_id)
            .first(conn)
            .optional()
    }
}