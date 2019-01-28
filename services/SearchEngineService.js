const algoliasearch = require('algoliasearch');
const config = require('../config');
const searchEngine = algoliasearch(config.searchEngine.appId, config.searchEngine.apiKey);
const INDEX_PREFIX = config.env.name;


const SearchEngineIndex = class SearchEngineIndex {
  constructor(index, settings) {
    this._index = index;
    this._index.setSettings(settings);
  }

  static _mapDataArray(data) {
    const output = data.map((singleItem) => {
      const item = { ...singleItem };
      item.objectID = item.id;
      return item;
    });

    return output;
  }

  _getIndex() {
    return this._index;
  }

  put(data) {
    if (!(data && Array.isArray(data) && data.length)) {
      throw new TypeError('valid array should be provided');
    }

    const insertData = SearchEngineIndex._mapDataArray(data);

    const self = this;
    return new Promise((resolve, reject) => {
      self._getIndex().addObjects(insertData, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  }

  find(query = '', filters = '', options = {}) {
    const self = this;
    return new Promise((resolve, reject) => {
      self._getIndex().search(Object.assign({}, { query, filters }, options), (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  }

  update(data) {
    if (!(data && Array.isArray(data) && data.length)) {
      throw new TypeError('valid array should be provided');
    }

    const insertData = SearchEngineIndex._mapDataArray(data);

    const self = this;
    return new Promise((resolve, reject) => {
      self._getIndex().saveObjects(insertData, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  }

  updatePartial(data) {
    if (!(data && Array.isArray(data) && data.length)) {
      throw new TypeError('valid array should be provided');
    }

    const insertData = SearchEngineIndex._mapDataArray(data);

    const self = this;
    return new Promise((resolve, reject) => {
      self._getIndex().partialUpdateObjects(insertData, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  }

  deleteOne(itemId) {
    if (!itemId) {
      throw new TypeError('valid item id should be provided');
    }
    const self = this;
    return new Promise((resolve, reject) => {
      self._getIndex().deleteObject(itemId, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  }

  deleteMany(itemIdList) {
    if (!(itemIdList && Array.isArray(itemIdList) && itemIdList.length)) {
      throw new TypeError('valid array should be provided');
    }

    const self = this;
    return new Promise((resolve, reject) => {
      self._getIndex().deleteObjects(itemIdList, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      });
    });
  }
};


module.exports = {
  initIndex(indexName, settings = {}) {
    if (!(indexName && indexName.length)) {
      throw new TypeError('valid index name should be provided');
    }
    return new SearchEngineIndex(searchEngine.initIndex(`${INDEX_PREFIX}_${indexName}`), settings);
  },
};