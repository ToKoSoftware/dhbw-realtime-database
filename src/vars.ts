import {R} from 'rethinkdb-ts';
import Loggy from './functions/loggy.func';
import {Configuration} from './interfaces/configuration.interface';


export abstract class Vars {
    public static loggy: Loggy;
    public static config: Configuration;
    public static r: R;
}
