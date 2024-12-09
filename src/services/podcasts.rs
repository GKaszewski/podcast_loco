use std::path::PathBuf;

use axum::extract::Multipart;
use axum::http::HeaderMap;
use axum_extra::headers::Range;
use axum_extra::TypedHeader;
use tokio::fs::File;

use axum_range::KnownSize;
use axum_range::Ranged;
use loco_rs::prelude::*;

use crate::models::_entities::podcasts;
use crate::models::{
    _entities::podcasts::{ActiveModel, Entity, Model},
    users::users,
};

async fn load_item(ctx: &AppContext, id: i32) -> Result<Model> {
    let item = Entity::find_by_id(id).one(&ctx.db).await?;
    item.ok_or_else(|| Error::NotFound)
}

pub async fn get_all_podcasts(ctx: &AppContext) -> Result<Vec<Model>> {
    let items = Entity::find().all(&ctx.db).await?;
    Ok(items)
}

pub async fn get_one(id: i32, ctx: &AppContext) -> Result<Model> {
    let item = load_item(&ctx, id).await?;
    Ok(item)
}

pub async fn get_audio_by_file_name(file_name: &str, ctx: &AppContext) -> ModelResult<Model> {
    let audio = Entity::find()
        .filter(podcasts::Column::FileName.eq(file_name))
        .one(&ctx.db)
        .await?;

    audio.ok_or_else(|| ModelError::EntityNotFound)
}

pub async fn remove(auth: auth::JWT, id: i32, ctx: &AppContext) -> Result<Response> {
    let _current_user = users::Model::find_by_pid(&ctx.db, &auth.claims.pid).await?;

    load_item(&ctx, id).await?.delete(&ctx.db).await?;
    format::empty()
}

pub async fn add(auth: &auth::JWT, ctx: &AppContext, mut payload: Multipart) -> Result<Response> {
    let _current_user = users::Model::find_by_pid(&ctx.db, &auth.claims.pid).await?;
    let mut title = None;
    let mut url = None;
    let mut file = None;
    let mut file_name = None;

    while let Some(field) = payload
        .next_field()
        .await
        .map_err(|_| Error::BadRequest("could not readd multipart".into()))?
    {
        let name = field.name().unwrap().to_string();

        match name.as_str() {
            "title" => {
                title = Some(field.text().await.unwrap());
            }
            "file" => {
                let content_type = match field.content_type() {
                    Some(content_type) => content_type.to_string(),
                    _ => return Err(Error::BadRequest("content type not found".into())),
                };

                let temp_file_name = match field.file_name() {
                    Some(file_name) => String::from(file_name),
                    _ => return Err(Error::BadRequest("file name not found".into())),
                };

                let content = field
                    .bytes()
                    .await
                    .map_err(|err| Error::BadRequest(format!("failed to read bytes: {}", err)))?;

                tracing::info!("Content type: {}", content_type);

                let audio_content_types = vec![
                    "audio/mpeg",
                    "audio/mp3",
                    "audio/ogg",
                    "audio/wav",
                    "audio/flac",
                    "audio/x-flac",
                ];

                if !audio_content_types.contains(&content_type.as_str()) {
                    return Err(Error::BadRequest("invalid content type".into()));
                }

                let temp_file_name = format!(
                    "{}.{}",
                    Uuid::new_v4(),
                    temp_file_name.split('.').last().unwrap_or("mp3")
                );

                let path = PathBuf::from("podcasts/").join(&temp_file_name);

                ctx.storage
                    .as_ref()
                    .upload(path.as_path(), &content)
                    .await?;

                url = Some(format!("/audio/{}", temp_file_name));

                file = Some(path);
                file_name = Some(temp_file_name);
            }
            _ => {}
        }
    }

    let title = title.ok_or_else(|| Error::BadRequest("title not found".into()))?;
    let url = url.ok_or_else(|| Error::BadRequest("url not found".into()))?;
    let file_name = file_name.ok_or_else(|| Error::BadRequest("file name not found".into()))?;
    let _file = file.ok_or_else(|| Error::BadRequest("file not found".into()))?;

    let mut item = ActiveModel {
        ..Default::default()
    };

    item.title = Set(title.clone());
    item.url = Set(url.clone());
    item.file_name = Set(file_name.clone());

    let item = item.insert(&ctx.db).await?;
    format::json(item)
}

pub async fn serve_audio_file(
    range: Option<TypedHeader<Range>>,
    file_name: &str,
    ctx: &AppContext,
) -> Result<(HeaderMap, Ranged<KnownSize<File>>)> {
    let audio = match get_audio_by_file_name(&file_name, &ctx).await {
        Ok(audio) => audio,
        Err(_) => return not_found(),
    };

    let path = PathBuf::from("audio/podcasts/").join(&audio.file_name);

    let content_type = match audio.file_name.split('.').last() {
        Some("mp3") => "audio/mpeg",
        Some("ogg") => "audio/ogg",
        Some("wav") => "audio/wav",
        Some("flac") => "audio/flac",
        _ => "application/octet-stream",
    };

    let mut headers = HeaderMap::new();
    headers.insert("Content-Type", content_type.parse().unwrap());

    match File::open(path.as_path()).await {
        Ok(file) => {
            let body = KnownSize::file(file).await?;
            let range = range.map(|TypedHeader(range)| range);
            Ok((headers, Ranged::new(range, body)))
        }
        Err(_) => not_found(),
    }
}