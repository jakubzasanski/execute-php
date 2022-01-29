/**
 * Execute PHP function within NodeJS application
 * @package execute-php
 * @version 0.0.10
 */

import fs from "fs";
import path from "path";
import execute from "./lib/cli.mjs";

/**
 * Create execute-php object that contain user php functions.
 * @param {string} file, Path to user php file.
 * @param {string} bin, Path to php bin file.
 * @param {function} callback, Callback function.
 *  @arg {mixed} error message.
 *  @arg {object} methods Collection of user php functions.
 *  @arg {string} printed string on requiring user php file.
 */
export default function executePhp(file, bin, callback){
    if(!callback){
        if(typeof bin === 'function'){
            callback = bin;
            bin = 'php';
        }else{
            callback = function(){};
        }
    }

    if(!bin){
        bin = 'php';
    }

    if(!fs.existsSync(file)){
        throw new Error('File `' + file + '` not found.');
    }

    let cache = {};
    execute(file, bin, '_exec_php_get_user_functions', [function(error, result, output, printed){
        if(error){
            return callback(error);
        }

        for (let func of result){
            cache[func] = (function(file, bin, func){
                return function(){
                    let args = Array.prototype.slice.call(arguments, 0);
                    execute(file, bin, func, args);
                };
            })(file, bin, func);
        }

        callback(false, cache, output);
    }]);
}
