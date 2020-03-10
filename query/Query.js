import lib from "sparql-transformer";
import { ontologyURI, virtuosoEndpoint, dcTermsURI } from "../constants";
import { getAllProps } from "../helpers";
import * as Resources from "../model";

const defaultOptions = {
    context: "http://www.courses.matfyz.sk/ontology#",
    endpoint: virtuosoEndpoint,
    debug: true
};

const defaultPrefixes = {
    courses: ontologyURI,
    dc: dcTermsURI
};

class Query {
    constructor(options = defaultOptions, resource) {
        this.q = {};
        this.options = options;
        this.sparqlTransformer = lib.default;
        this.setPrefixes(defaultPrefixes);
        this.resource = resource;
        this.props = getAllPropsrops(resource);
    }

    _build(val) {
        return val.prefix.name + ":" + val.value;
    }

    generateQuery(filters) {
        var resourceURI = "?resourceURI";
        if (filters.id) {
            resourceURI = `<${this.resource.type.uriPrefix + filters.id}>`;
        }
        this.q = {
            "@graph": {
                "@id": resourceURI
            },
            $where: [],
            $filter: []
        };

        if (this.resource.hasOwnProperty("subclasses")) {
            this.q["@graph"]["@type"] = "?type";
            this.q["$where"].push(`${resourceURI} rdf:type ?type`);
            this.q["$where"].push(`?type rdfs:subClassOf* ${this._build(this.resource.type)}`);
        } else {
            this.q["@graph"]["@type"] = this.resource.type.value;
            this.q["$where"].push(`${resourceURI} ${this._build(Predicates.type)} ${this._build(this.resource.type)}`);
        }

        if (filters.hasOwnProperty("_offset")) this.q["$offset"] = filters._offset;
        if (filters.hasOwnProperty("_limit")) this.q["$limit"] = filters._limit;

        Object.keys(this.props).forEach(predicateName => {
            if (predicateName === "type") {
                return;
            }
            if (this.props[predicateName].dataType === "node") {
                this.q["@graph"][predicateName] = { "@id": `?${predicateName}URI` };
                if (filters.hasOwnProperty(predicateName)) {
                    this.q["$where"].push(`${resourceURI} ${this._build(Predicates[predicateName])} ?${predicateName}URI`);
                    console.log(predicateName);
                    this.q["$filter"].push(
                        `?${predicateName}URI=<${this._buildURI(this.props[predicateName].resource, filters[predicateName])}>`
                    );
                } else {
                    this.q["$where"].push(`OPTIONAL {${resourceURI} ${this._build(Predicates[predicateName])} ?${predicateName}URI}`);
                }
                return;
            }
            this.q["@graph"][predicateName] = `?${predicateName}`;
            this.q["$where"].push(`OPTIONAL {${resourceURI} ${this._build(Predicates[predicateName])} ?${predicateName}}`);
            if (filters.hasOwnProperty(predicateName)) {
                this.q["$filter"].push(`?${predicateName}="${filters[predicateName]}"`);
            }
        });

        // predikaty ktore vstupuju do resource
        Object.keys(filters).forEach(predicateName => {
            if (
                predicateName === "id" ||
                predicateName === "_offset" ||
                predicateName === "_limit" ||
                predicateName === "_join" ||
                this.props.hasOwnProperty(predicateName)
            ) {
                return;
            }
            this.q["$where"].push(`<${filters[predicateName]}> ${this._build(Predicates[predicateName])} ${resourceURI}`);
        });

        // join
        if (filters.hasOwnProperty("_join")) {
            const parts = filters["_join"].split(",");
            for (var predicateName of parts) {
                predicateName = predicateName.trim();
                this.generatQueryPart(predicateName, this.q["@graph"][predicateName]);
            }
        }

        // const q = new Query();
        // q.setProto(this.q["@graph"]);
        // q.setWhere(this.q["$where"]);
        // if (this.q["$offset"]) q.setOffset(this.q["$offset"]);
        // if (this.q["$limit"]) q.setLimit(this.q["$limit"]);
        // q.setFilter(this.q["$filter"]);
        return q;
    }

    generatQueryPart(predicateName, queryPart) {
        const resource = Resources[this.props[predicateName].objectClass];
        const resourceProps = getAllProps(resource);
        Object.keys(resourceProps).forEach(p => {
            if (p === "type") {
                return;
            }
            if (resourceProps[p].dataType === "node") {
                queryPart[p] = { "@id": `?${p}2URI` };
                // if (filters.hasOwnProperty(p)) {
                //     this.q["$where"].push(`${resourceURI} ${this._build(Predicates[p])} ?${p}URI`);
                //     console.log(p);
                //     this.q["$filter"].push(
                //         `?${p}URI=<${this._buildURI(this.props[p].resource, filters[p])}>`
                //     );
                // } else {
                this.q["$where"].push(`OPTIONAL {${resourceURI} ${this._build(Predicates[p])} ?${p}URI}`);
                // }
                return;
            }
            queryPart[p] = `?${p}`;
            this.q["$where"].push(`OPTIONAL {${resourceURI} ${this._build(Predicates[p])} ?${p}}`);
            if (filters.hasOwnProperty(p)) {
                this.q["$filter"].push(`?${p}="${filters[p]}"`);
            }
        });
    }

    setProto(proto) {
        this.q["@graph"] = proto;
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

    run() {
        return this.sparqlTransformer(this.q, this.options);
    }

    prepare() {
        this.q = {};
    }

    setOptions(options) {
        this.options = options;
    }
}

export default Query;
