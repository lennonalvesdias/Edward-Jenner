using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using EdwardJenner.Domain.Interfaces.Repositories;
using EdwardJenner.Models.Interfaces.Models;
using EdwardJenner.Models.Settings;
using MongoDB.Bson;
using MongoDB.Driver;

namespace EdwardJenner.Data.Repositories
{
    public class BaseRepository<TModel> : MongoDbBaseRepository, IBaseRepository<TModel> where TModel : IModelBase
    {
        public BaseRepository(MongoConnection mongoConnection) : base(mongoConnection)
        {
        }

        protected virtual string GetCollectionName() => typeof(TModel).Name;

        protected IMongoCollection<TModel> BaseCollection => Database.GetCollection<TModel>(GetCollectionName());

        public async Task<TModel> Update(TModel model)
        {
            model.UpdatedIn = DateTime.Now;
            return await BaseCollection.FindOneAndReplaceAsync(x => x.Id == model.Id, model);
        }

        public async Task<TModel> Save(TModel entity)
        {
            entity.Id = string.IsNullOrEmpty(entity.Id) ? ObjectId.GenerateNewId().ToString() : entity.Id;
            entity.UpdatedIn = DateTime.Now;
            await BaseCollection.ReplaceOneAsync(x => x.Id == entity.Id, entity, new ReplaceOptions { IsUpsert = true });
            return entity;
        }

        public async Task<TModel> FindBy(Expression<Func<TModel, bool>> filter)
        {
            return await BaseCollection.Find(filter).FirstOrDefaultAsync();
        }

        public async Task Insert(TModel model)
        {
            model.UpdatedIn = DateTime.Now;
            await BaseCollection.InsertOneAsync(model);
        }

        public async Task<IList<TModel>> ListBy(Expression<Func<TModel, bool>> filter)
        {
            return await BaseCollection.Find(filter).ToListAsync();
        }

        public async Task Delete(Expression<Func<TModel, bool>> filter)
        {
            await BaseCollection.DeleteManyAsync(filter);
        }
    }
}
