use diesel::table;

// src-tauri/src/schema.rs
table! {
    users (id) {
        id -> Integer,
        name -> Text,
    }
}