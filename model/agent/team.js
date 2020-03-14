import { agent } from "./agent";

export const team = {
   type: "team",
   subclassOf: agent,
   props: {
      courseInstance: {
         required: true,
         multiple: false,
         change: false,
         dataType: "node",
         objectClass: "courseInstance"
      }
   },
   createPolicy: [
      // musi byt studentom kurzu
      // nesmie byt uz clenom nejakeho timu v tomto kurze
      "courseInstance:^memberOf:{userURI}",
      "-({userURI}:memberOf:?teamURI)"
   ]
};
