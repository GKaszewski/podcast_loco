use loco_rs::prelude::*;

use crate::services;

pub async fn index(v: impl ViewRenderer, ctx: &AppContext) -> Result<impl IntoResponse> {
    let podcasts = services::podcasts::get_all_podcasts(ctx).await?;

    format::render().view(&v, "podcasts/index.html", data!({ "podcasts": podcasts }))
}

pub async fn detail(v: impl ViewRenderer, id: i32, ctx: &AppContext) -> Result<impl IntoResponse> {
    let podcast = services::podcasts::get_one(id, ctx).await?;

    format::render().view(&v, "podcasts/detail.html", data!({ "podcast": podcast }))
}