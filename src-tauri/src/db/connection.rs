use diesel::prelude::*;
use diesel::r2d2::{self, ConnectionManager};
use dotenv::dotenv;
use std::env;
use std::sync::Arc;

pub type DbPool = Arc<r2d2::Pool<ConnectionManager<SqliteConnection>>>;

pub fn establish_connection() -> DbPool {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL")
        .expect("La variable de entorno DATABASE_URL debe estar configurada");
    
    let manager = ConnectionManager::<SqliteConnection>::new(database_url);
    let pool = r2d2::Pool::builder()
        .build(manager)
        .expect("No se pudo crear el pool de conexiones");
    
    Arc::new(pool)
}