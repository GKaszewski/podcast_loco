#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use axum::extract::Multipart;
use loco_rs::prelude::*;

use crate::services;

pub async fn list(State(ctx): State<AppContext>) -> Result<Response> {
    let items = services::podcasts::get_all_podcasts(&ctx).await?;
    format::json(items)
}

pub async fn get_one(Path(id): Path<i32>, State(ctx): State<AppContext>) -> Result<Response> {
    let item = services::podcasts::get_one(id, &ctx).await?;
    format::json(item)
}

pub async fn upload_podcast(
    auth: auth::JWT,
    State(ctx): State<AppContext>,
    payload: Multipart,
) -> Result<Response> {
    services::podcasts::add(&auth, &ctx, payload).await
}

pub async fn delete_podcast(
    auth: auth::JWT,
    Path(id): Path<i32>,
    State(ctx): State<AppContext>,
) -> Result<Response> {
    services::podcasts::remove(auth, id, &ctx).await
}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("/api/podcasts")
        .add("/", get(list))
        .add("/", post(upload_podcast))
        .add("/:id", get(get_one))
        .add("/:id", delete(delete_podcast))
}
