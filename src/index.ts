import startServer from './server';
import {Vars} from './vars';
import Loggy from './functions/loggy.func';

Vars.loggy = new Loggy();
startServer();
