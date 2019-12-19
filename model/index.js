import Lab from "./Lab";
import { labURI } from "../constants";

export async function foo(req, res) {
    // var l = new Lab("http://www.courses.matfyz.sk/data/lab/nieco");
    // l.startDate = "24.12.2019";
    // l.endDate = "31.12.2019";
    // l.hasInstructor = "http://www.courses.matfyz.sk/user/12345";
    // l.room = "A";

    // l.store()
    //     .then(data => console.log(data))
    //     .catch(err => console.log(err));

    var l2 = new Lab("http://www.courses.matfyz.sk/data/lab/nieco");
    await l2.fetch();

    // l2.startDate = "25.12.2019";
    // l2.room = "B";
    // console.log("L2:", l2);
    // l2.update();
    l2.delete();

    res.status(200).send();
}
