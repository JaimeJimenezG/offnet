// @generated automatically by Diesel CLI.

diesel::table! {
    channels (id) {
        id -> Integer,
        server_id -> Integer,
        name -> Text,
        description -> Nullable<Text>,
        created_at -> Timestamp,
    }
}

diesel::table! {
    messages (id) {
        id -> Integer,
        channel_id -> Integer,
        user_id -> Integer,
        content -> Text,
        created_at -> Timestamp,
    }
}

diesel::table! {
    servers (id) {
        id -> Integer,
        name -> Text,
        description -> Nullable<Text>,
        created_at -> Timestamp,
    }
}

diesel::table! {
    users (id) {
        id -> Integer,
        name -> Text,
    }
}

diesel::joinable!(channels -> servers (server_id));
diesel::joinable!(messages -> channels (channel_id));
diesel::joinable!(messages -> users (user_id));

diesel::allow_tables_to_appear_in_same_query!(
    channels,
    messages,
    servers,
    users,
);
