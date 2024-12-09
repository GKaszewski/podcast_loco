use loco_rs::prelude::*;


use axum_extra::headers::Range;
use axum_extra::TypedHeader;

use crate::services;

pub async fn serve_podcast(
    range: Option<TypedHeader<Range>>,
    Path(file_name): Path<String>,
    State(ctx): State<AppContext>,
) -> impl IntoResponse {
    services::podcasts::serve_audio_file(range, &file_name, &ctx).await
}

pub fn routes() -> Routes {
    Routes::new().add("/audio/:file_name", get(serve_podcast))
}
