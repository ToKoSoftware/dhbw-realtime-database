import {Connection, r} from 'rethinkdb-ts';
import {schedule} from "node-cron";
import { v4 as uuidv4 } from 'uuid';
import {Vars} from "../vars";
import Loggy from "./loggy.func";
import startServer from "../server";

export async function bootstrap() {
    Vars.loggy = new Loggy(true)
    const config = {
        server: {
            host: 'localhost',
            port: 28015,
        }
    }
    await r.connectPool(config);
    const listOfDatabases =
        await r
            .dbList()
            .filter(db =>
                r.expr(['stocks']).contains(db)
            )
            .run();
    if (!listOfDatabases.includes("stocks")) {
        await r.dbCreate("stocks").run();
        console.log("Created Database stocks");
    }

    const listOfTables =
        await r
            .db("stocks")
            .tableList()
            .filter(table =>
                r.expr(["GME"]).contains(table)
            )
            .run();
    if (!listOfTables.includes("GME")) {
        const stockTable = await r.db("stocks").tableCreate("GME").run();
        console.log("Created Table GME");
    }

    Vars.r = r;
    let last: number = 1;
    schedule('* * * * * *', async () => {
        // get random stock price
        const v = getRandomNumberInRange(last <= 20 ? last : last - 20, last + 50);
        last = v;
        Vars.loggy.log(`🚀🚀🚀 $GME: ${v} 🚀🚀🚀`)
        let result = await r
            .db("stocks")
            .table("GME")
            .insert({
                id: uuidv4(),
                time: new Date().toISOString(),
                value: v
            })
            .run();
    });
    startServer();
}

function getRandomNumberInRange(min: number, max: number): number {
    return Number(((Math.random() * (max - min)) + min).toFixed(2));
}
