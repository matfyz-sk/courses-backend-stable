import lib from "sparql-transformer";

const defaultOptions = {
  context: "http://schema.org",
  endpoint: "http://matfyz.sk:8890/sparql",
  debug: true
};

class Query {
  constructor(options = defaultOptions) {
    this.q = {};
    this.options = options;
    this.sparqlTransformer = lib.default;
  }

  setProto(proto) {
    this.q["proto"] = proto;
  }

  setWhere(where) {
    this.q["$where"] = where;
  }

  setFilter(filter) {
    this.q["$filter"] = filter;
  }

  setPrefixes(prefixes) {
    this.q["$prefixes"] = prefixes;
  }

  setLimit(limit) {
    this.q["$limit"] = limit;
  }

  setOffset(offset) {
    this.q["$offset"] = offset;
  }

  async run() {
    console.log(this.q);
    var out = {};
    await this.sparqlTransformer(this.q, this.options)
      .then(res => (out = res))
      .catch(err => (out = {}));
    return out;
  }

  prepare() {
    this.q = {};
  }
}

export default Query;
