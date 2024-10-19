use loco_rs::schema::table_auto_tz;
use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                table_auto_tz(Podcasts::Table)
                    .col(pk_auto(Podcasts::Id))
                    .col(string(Podcasts::Title))
                    .col(string(Podcasts::Url))
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Podcasts::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Podcasts {
    Table,
    Id,
    Title,
    Url,
    
}


