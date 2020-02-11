import { PostController, GetController, PutController, PatchController, DeleteController } from "../controllers";
import { getResourceObject, prepareClassName } from "../helpers";
import express from "express";
const router = express.Router();
import Resource from "../model/Resource";
import * as fs from "fs";
import * as jwt from "jsonwebtoken";

function isAuthenticated(req, res, next) {
    if (typeof req.headers.authorization !== "undefined") {
        // retrieve the authorization header and parse out the
        // JWT using the split function
        let token = req.headers.authorization.split(" ")[1];
        let privateKey = fs.readFileSync("./routes/private.pem", "utf8");
        // Here we validate that the JSON Web Token is valid and has been
        // created using the same private pass phrase
        jwt.verify(token, privateKey, { algorithm: "HS256" }, (err, user) => {
            // if there has been an error...
            if (err) {
                // shut them out!
                res.status(500).json({ error: "Not Authorized" });
                throw new Error("Not Authorized");
            }
            // if the JWT is valid, allow them to hit
            // the intended endpoint
            return next();
        });
    } else {
        // No authorization header exists on the incoming
        // request, return not authorized and throw a new error
        res.status(500).json({ error: "Not Authorized" });
        throw new Error("Not Authorized");
    }
}

router.get("/jwt", (req, res) => {
    let privateKey = fs.readFileSync("./routes/private.pem", "utf8");
    let token = jwt.sign({ body: "stuff" }, "MySuperSecretPassPhrase", { algorithm: "HS256" });
    res.send(token);
});

router.get("/secret", isAuthenticated, (req, res) => {
    res.json({ message: "THIS IS SUPER SECRET, DO NOT SHARE!" });
});

router.use("/:className", (req, res, next) => {
    const resource = getResourceObject(prepareClassName(req.params.className));
    if (!resource) {
        res.status(400).send(`Resource with class name ${req.params.className} is not supported`);
        return;
    }
    res.locals.resource = new Resource(resource);
    next();
});

router.use("/:className/:id", (req, res, next) => {
    res.locals.resource.setSubject(req.params.id);
    res.locals.resource
        .fetch()
        .then(data => {
            if (data.results.bindings.length == 0) {
                res.status(404).send(`Resource with ID ${req.params.id} and class name ${req.params.className} does not exist`);
                return;
            }
            res.locals.resource.fill(data);
            next();
        })
        .catch(error => {
            console.log(error);
            res.status(500).send(error);
        });
});

router.post("/:className", (req, res) => {
    PostController.storeResource(req, res);
});

router.get("/:className/:id?", (req, res) => {
    GetController.runQuery(req, res);
});

router.put("/:className/:id", (req, res) => {
    PutController.putResource(req, res);
});

router.patch("/:className/:id/:attributeName", (req, res) => {
    PatchController.patchResource(req, res);
});

router.delete("/:className/:id/:attributeName?", (req, res) => {
    DeleteController.deleteResource(req, res);
});

export default router;
