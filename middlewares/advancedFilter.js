const advancedFilter = (model, populate) => async (req, res, next) => {
  // copy req.query
  const reqQuery = { ...req.query };

  // remove excluded query
  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach((field) => {
    delete reqQuery[field];
  });

  // create query string
  let queryStr = JSON.stringify(reqQuery);

  // create operators ($gt, $lt etc)
  queryStr = queryStr.replace(
    /\b(lt|gt|lte|gte|in)\b/g,
    (match) => `$${match}`
  );

  // get query object for chaining
  const query = model.find(JSON.parse(queryStr));

  // select
  if (req.query.select) {
    query.select(req.query.select.replaceAll(',', ' '));
  }

  // Sort
  if (req.query.sort) {
    query.sort(req.query.sort.replaceAll(',', ' '));
  } else {
    query.sort('-createdAt');
  }

  // calculate total without pagination query
  const total = await model.countDocuments({ ...query });

  // pagination
  const limit = parseInt(req.query.limit) || 20;
  const page = parseInt(req.query.page) || 1;
  const startIdx = (page - 1) * limit;
  const endIdx = page * limit;
  query.skip(startIdx).limit(limit);

  // populate
  if (populate) {
    query.populate(populate);
  }

  // execute query
  const results = await query;

  // set pagination result
  const pagination = {};
  if (endIdx < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIdx > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.advancedFilter = {
    success: true,
    count: total,
    pagination,
    data: results,
  };

  next();
};

module.exports = advancedFilter;
