use sea_orm::entity::prelude::*;
use super::_entities::podcasts::{ActiveModel, Entity};
pub type Podcasts = Entity;

impl ActiveModelBehavior for ActiveModel {
    // extend activemodel below (keep comment for generators)
}
