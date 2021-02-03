import startServer from './server';
import {Vars} from './vars';
import Loggy from './functions/loggy.func';
import {bootstrap} from "./functions/bootstrap.func";

Vars.loggy = new Loggy();
bootstrap();
startServer();
