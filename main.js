"use strict";
exports.__esModule = true;
var common_1 = require("@nestjs/common");
// Decorator to filter the requested fields
// valid request must be in form if ?fields=fieldA,fieldB...
// of if the fields name that wnt to excluded must be prepend with -
// ?fields=-fieldA,-fieldB
exports.FieldsFilter = common_1.createParamDecorator(function (returnType, req) {
    var fields = req.query.fields;
    var requestedFields = returnType === "array" ? [] : {};
    if (fields !== undefined) {
        var arrayOfFields = fields.replace(/^[^a-z\-]+|\s+|[^a-z]+$/gi, "").split(",");
        // only use non empty fields
        arrayOfFields = arrayOfFields.filter(function (field) { return field !== ""; });
        if (Array.isArray(requestedFields)) {
            return arrayOfFields;
        }
        // only allow a-z commas and space in fields value
        arrayOfFields.forEach(function (field) {
            // if the field name is prepended with minus (-) sign
            // than it means this field is excluded in return data
            if (field.match(/-[a-z]+/gi)) {
                var stripedFieldname = field.replace(/-/, "");
                // in mongodb, to exclude the field(s) we use {<fieldname>:0}
                requestedFields[stripedFieldname] = 0;
            }
            else {
                // otherwise include it using {<fieldname>:1}
                requestedFields[field] = 1;
            }
        });
        return requestedFields;
    }
    return requestedFields;
});
// filter must be in form ?filter=<fieldname>:<fieldValue>,[<fieldname>:<fieldvalue>]
exports.ReqFilter = common_1.createParamDecorator(function (_, req) {
    var filter = req.query.filter;
    if (filter !== undefined) {
        // only allow a-z commas and space in filter value
        if (filter.match(/[a-z,\:\-\s+0-9]+/gi)) {
            var filters = filter.split(",");
            var filterObject_1 = {};
            filters.forEach(function (f) {
                var _a = f.split(":"), field = _a[0], value = _a[1];
                if (value !== undefined || value !== "") {
                    filterObject_1[field] = value;
                }
            });
            return filterObject_1;
        }
    }
    return {};
});
exports.SortBy = common_1.createParamDecorator(function (_, req) {
    var _a;
    var sort = req.query.sort;
    if (sort !== undefined) {
        if (sort.match(/[a-z0-9\-]+/gi)) {
            var _b = sort.split(":"), field = _b[0], value = _b[1];
            if (value.match(/-.[0-9]+/g)) {
                value = parseInt(value);
            }
            return _a = {}, _a[field] = value, _a;
        }
    }
    return { _id: -1 };
});
exports.UserInfo = common_1.createParamDecorator(function (_, req) {
    var user = req["user"];
    return user;
});
