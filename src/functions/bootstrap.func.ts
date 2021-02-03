import {r} from 'rethinkdb-ts';

export async function bootstrap() {
    const conn = await r.connect({
        server: {
            host: 'localhost',
            port: 28015,
        }
    }).then(success => console.log("Successfully connected to database"));

    r.connect({
            server: {
                host: 'localhost',
                port: 28015,
            }
        }
    ).then(d => {
            r.(conn).db('stocks').tableCreate('stocks').run().then(function (user) {
                console.log(user)
            });
        }
    )
}
