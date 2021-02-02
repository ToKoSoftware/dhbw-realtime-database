import express from 'express';
import cors from 'cors';
import {Vars} from './vars';
import {wrapResponse} from './functions/response-wrapper';
import bodyParser from 'body-parser';
import * as path from "path";



export default function startServer(): void {

    /**
     * Setup
     */
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());

    const PORT: string | number = process.env.PORT || 3000;
    const router = express.Router();

    app.use(router);
    app.use(express.static(path.join(__dirname, '../dist')));

    /**
     * Routes
     */
    app.get('/api/v1', (req, res) => res.send(wrapResponse(true)));


    // handle every other route with index.html, which loads Angular
    app.get('*', function(request, response) {
        response.sendFile(path.resolve(__dirname, '../dist/index.html'));
    });


    /**
     * Server
     */
    app.listen(PORT, () => Vars.loggy.log(`[Server] Starting on http://localhost:${PORT}`));
}
