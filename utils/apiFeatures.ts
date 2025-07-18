import type { Query } from 'mongoose';
import type { IWorkLogsDocument } from '../models/workLogsModel.ts';

type QueryObject = {
  [key: string]: any;
};

class APIFeatures {
  query;
  queryString;

  constructor(query: Query<IWorkLogsDocument[], IWorkLogsDocument>, queryString: QueryObject) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj: QueryObject = { ...this.queryString };
    const excludedFields = ['page', 'limit', 'fields', 'sort'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(/\b(gte | gt | lt | lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryString));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.replaceAll(',', ' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.replaceAll(',', ' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  // populate() {
  //   if (this.queryString.populate) {
  //     this.query = this.query.populate('client');
  //   }

  //   return this;
  // }
}

export default APIFeatures;
