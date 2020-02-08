import { getResourceObject } from "../helpers";

export function deleteResource(resourceName, req, res) {
    const resource = getResourceObject(resourceName, req.params.id);
    if (!resource) {
        res.status(400).send("not implemented");
        return;
    }
    res.status(400).send("not implemented");
}
