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
    const connection: Connection = await r.connect({
        server: {
            host: 'localhost',
            port: 28015,
        }
    });
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
    schedule('* * * * * *', async function() {
        const v = getRandomArbitrary(6000, 6969);
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

function getRandomArbitrary(min: number, max: number) {
    return ((Math.random() * (max - min)) + min).toFixed(2);
}
