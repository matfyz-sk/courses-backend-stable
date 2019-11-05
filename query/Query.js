import lib from "sparql-transformer";
import { ontologyURI, virtuosoEndpoint } from "../constants";

const defaultOptions = {
    context: "http://schema.org",
    endpoint: virtuosoEndpoint,
    debug: true
};

class Query {
    constructor(options = defaultOptions) {
        this.q = {};
        this.options = options;
        this.sparqlTransformer = lib.default;
        this.q["$prefixes"] = {
            courses: ontologyURI
        };
    }

    setProto(proto) {
        this.q["proto"] = proto;
    }

    setWhere(where) {
        this.q["$where"] = where;
    }

    appendWhere(where) {
        if (this.q.$where == null) this.q["$where"] = [];
        this.q.$where.push(where);
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

    setOrderBy(orderBy) {
        this.q["$orderBy"] = orderBy;
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
